import { prismaCore } from "@/lib/prisma-core";
import { prismaActivation } from "@/lib/prisma-activation";
import { NextResponse } from "next/server";
import { logApiError } from "@/lib/logger";
import crypto from "crypto";
import { formatInTimeZone } from 'date-fns-tz';

interface AccessEvent {
  type: "IN" | "OUT";
  time: string;
  gate: string;
}

export async function POST(req: Request) {
  let bodyData = { qrCode: "", gate: "", mode: "" };

  try {
    const body = await req.json();
    bodyData = body;
    const { qrCode, gate, mode } = body;

    const activeEvents = await prismaCore.event.findMany({
      where: {
        entrances: { has: gate },
        isActive: true,
      },
      include: {
        partitions: true
      }
    });

    if (activeEvents.length === 0) {
      return NextResponse.json({
        status: "ERROR",
        message: `Bramka ${gate} nie jest przypisana do żadnego aktywnego wydarzenia.`
      }, { status: 400 });
    }

    const event = activeEvents[0];
    const allowedSlugs = event.partitions.map(p => p.partitionSlug);
    const ticketRules = event.ticketRules as any;

    const guest = await prismaActivation.activationEntry.findFirst({
      where: {
        qrCode: qrCode,
        slug: { in: allowedSlugs }
      }
    });

    if (!guest) {
      return NextResponse.json({
        status: "NOT_FOUND",
        message: "Kod QR nie został znaleziony dla tego wejścia."
      }, { status: 404 });
    }

    const guestDisplayName = guest.fullName ||
      (guest.actFirstName && guest.actLastName ? `${guest.actFirstName} ${guest.actLastName}` : "GOŚĆ");

    const role = (guest.ticketType || "GUEST").toLowerCase();
    const rule = ticketRules && ticketRules[role] ? ticketRules[role] : null;

    if (!rule) {
      return NextResponse.json({
        status: "ERROR",
        message: `Brak zdefiniowanych reguł dla typu biletu: ${role.toUpperCase()}`,
        guestName: guestDisplayName
      }, { status: 403 });
    }

    const skipActivationCheck = ["vip", "exhibitor"].includes(role);
    if (!skipActivationCheck && !guest.isActivated) {
      return NextResponse.json({
        status: "INACTIVE",
        message: "Bilet nie został jeszcze aktywowany.",
        guestName: guestDisplayName,
      });
    }

    const now = new Date();

    const parseAsLocal = (dateStr: string) => {
      if (!dateStr) return null;
      return new Date(dateStr);
    };

    const entryStart = rule.start ? parseAsLocal(rule.start) : null;
    const entryEnd = rule.end ? parseAsLocal(rule.end) : null;

    console.log("Teraz (UTC/System):", now.toISOString());
    console.log("Start (Obiekt Date):", entryStart?.toString());

    if (entryStart && now < entryStart) {
      const raw = rule.start;

      const [datePart, timePart] = raw.split('T');
      const [year, month, day] = datePart.split('-');
      const cleanTime = timePart.substring(0, 5);

      const formattedStart = `${day}.${month} ${cleanTime}`;

      console.log("Ładny format startu: " + formattedStart);

      return NextResponse.json({
        status: "TOO_EARLY",
        message: `Wejście możliwe od: ${formattedStart}`,
        guestName: guestDisplayName
      });
    }

    const currentLog = (guest.accessLog as unknown as AccessEvent[]) || [];
    const lastEventInDb = currentLog.length > 0 ? currentLog[currentLog.length - 1] : null;
    const nowISO = now.toISOString();

    if (mode === "IN") {
      if (lastEventInDb && lastEventInDb.type === "IN") {
        const entryTime = new Date(lastEventInDb.time).toLocaleTimeString('pl-PL', {
          hour: '2-digit', minute: '2-digit'
        });
        return NextResponse.json({
          status: "ERROR",
          message: `BILET JUŻ W ŚRODKU (Wejście: ${entryTime})`,
          guestName: guestDisplayName,
        });
      }
    } else if (mode === "OUT") {
      if (!lastEventInDb || lastEventInDb.type === "OUT") {
        return NextResponse.json({
          status: "ERROR",
          message: "BILET JEST JUŻ NA ZEWNĄTRZ",
          guestName: guestDisplayName,
        });
      }
    }

    const newEntry: AccessEvent = { type: mode as "IN" | "OUT", time: nowISO, gate: gate };
    const updatedLog = [...currentLog, newEntry];
    const tableName = `ActivationEntry_${guest.slug.replace(/-/g, "_")}`;

    try {
      await prismaActivation.$executeRawUnsafe(
        `UPDATE "${tableName}" SET "accessLog" = $1::jsonb WHERE "id" = $2 AND "slug" = $3`,
        JSON.stringify(updatedLog), guest.id, guest.slug
      );
    } catch (dbErr: any) {
      await prismaActivation.activationEntry.update({
        where: { id_slug: { id: guest.id, slug: guest.slug } },
        data: { accessLog: updatedLog as any }
      });
    }

    const secretKey = process.env.PWE_API_KEY_2 || "TEST_KEY";
    const timeString = formatInTimeZone(new Date(), 'Europe/Warsaw', 'dd-MM-yyyy-HH');
    const token = crypto.createHmac('sha256', secretKey).update(timeString).digest('hex');

    const pwePayload = {
      entries: [{
        entryId: guest.entryId,
        domain: guest.domain,
        fairYear: guest.fairYear,
        access_log: updatedLog
      }]
    };

    try {
      const cdbResponse = await fetch("https://pwe-cdb.warsawexpo.eu/api/wejsciowki", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
        },
        body: JSON.stringify(pwePayload),
      });

      if (!cdbResponse.ok) {
        const responseData = await cdbResponse.text();
        await logApiError({
          endpoint: "/api/access/verify",
          method: "CDB_SYNC_ERROR",
          message: `External CDB rejected access log: ${cdbResponse.statusText}`,
          status: cdbResponse.status,
          payload: pwePayload,
          response: responseData
        });
      }
    } catch (err: any) {
      await logApiError({
        endpoint: "/api/access/verify",
        method: "CDB_SYNC_FETCH_FAILED",
        message: `Network error during CDB access sync: ${err.message}`,
        payload: pwePayload
      });
    }

    return NextResponse.json({
      status: "SUCCESS",
      message: mode === "IN" ? "Zapraszamy!" : "Do widzenia!",
      guestName: guestDisplayName,
      lastTime: nowISO
    });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/access/verify",
      method: "POST_CRITICAL",
      message: `Access verification critical error: ${error.message}`,
      payload: { ...bodyData },
      status: 500
    });

    return NextResponse.json({
      status: "ERROR",
      message: "Błąd serwera podczas weryfikacji."
    }, { status: 500 });
  }
}