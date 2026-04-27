import { NextResponse } from "next/server";
import { prismaActivation } from "@/lib/prisma-activation";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import crypto from "crypto";
import { formatInTimeZone } from 'date-fns-tz';
import { logApiError } from "@/lib/logger";

function formatFairDate(startStr: string, endStr: string): string {
  if (!startStr || !endStr) return "[trade_fair_date]";
  const start = new Date(startStr);
  const end = new Date(endStr);
  const sDay = String(start.getDate()).padStart(2, '0');
  const sMonth = String(start.getMonth() + 1).padStart(2, '0');
  const sYear = start.getFullYear();
  const eDay = String(end.getDate()).padStart(2, '0');
  const eMonth = String(end.getMonth() + 1).padStart(2, '0');
  const eYear = end.getFullYear();

  if (startStr.split('T')[0] === endStr.split('T')[0]) {
    return `${sDay}.${sMonth}.${sYear}`;
  }
  if (sMonth === eMonth && sYear === eYear) {
    return `${sDay}-${eDay}.${sMonth}.${sYear}`;
  }
  if (sYear === eYear) {
    return `${sDay}.${sMonth}-${eDay}.${eMonth}.${sYear}`;
  }
  return `${sDay}.${sMonth}.${sYear}-${eDay}.${eMonth}.${eYear}`;
}

function generateQrCode({
  badge,
  entryId,
  formId = "999",
}: {
  badge: string;
  entryId: string;
  formId?: string;
}) {
  const upperBadge = badge.toUpperCase();
  const random6 = Math.floor(100000 + Math.random() * 900000);
  return `${upperBadge}${formId}${entryId}rnd${random6}${entryId}`;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function POST(req: Request) {
  const body = await req.json();
  const {
    entryId,
    partitionSlug,
    form,
    stepsAnswers,
    qrInfo,
    name,
    startDate,
    endDate,
    lang,
    qrPrefixes
  } = body;

  const tableName = `ActivationEntry_${partitionSlug.replace(/-/g, "_")}`;

  try {
    // --- 1. LOGIKA WYBORU PREFIXU (BADGE) ---
    let badgeForQr = "EXPO"; // Fallback domyślny

    if (qrPrefixes && Array.isArray(qrPrefixes) && qrPrefixes.length > 0) {
      // Szukamy prefixu który ma dokładnie 4 znaki
      const fourCharPrefix = qrPrefixes.find(p => p.length === 4);
      badgeForQr = (fourCharPrefix || qrPrefixes[0]).toUpperCase();
    } else {
      // Fallback do starej metody jeśli brak qrPrefixes w locie
      const slugParts = partitionSlug.split('_');
      badgeForQr = slugParts.length > 1 ? slugParts.slice(0, -1).join('_').toUpperCase() : partitionSlug.toUpperCase();
    }

    // --- 2. SPRAWDZENIE CZY BILET JUŻ AKTYWOWANY ---
    if (qrInfo) {
      try {
        const existing: any = await prismaActivation.$queryRawUnsafe(
          `SELECT "isActivated" FROM "${tableName}" WHERE "entryId" = $1 LIMIT 1`,
          String(entryId)
        );

        if (existing && existing.length > 0 && existing[0].isActivated === true) {
          return NextResponse.json(
            { error: "Ten bilet został już wcześniej aktywowany." },
            { status: 400 }
          );
        }
      } catch (e: any) {
        await logApiError({
          endpoint: "/api/activate",
          method: "DB_SELECT_CHECK",
          message: `Check activation status failed: ${e.message}`,
          payload: { entryId, tableName }
        });
      }
    }

    const isNewRegistration = !qrInfo;
    const formattedDate = formatFairDate(startDate, endDate);
    const fairYear = startDate ? new Date(startDate).getFullYear().toString() : new Date().getFullYear().toString();

    let domain = null;
    try {
      const metadata: any = await prismaActivation.$queryRawUnsafe(
        `SELECT "domain" FROM "${tableName}" WHERE "domain" IS NOT NULL AND "domain" != '' LIMIT 1`
      );
      domain = metadata[0]?.domain || null;
    } catch { domain = null; }

    const finalEntryId = isNewRegistration ? `A${Math.floor(100000 + Math.random() * 900000)}` : `${entryId}`;
    const dbId = isNewRegistration ? `AK${finalEntryId}${Date.now().toString().slice(-4)}` : finalEntryId;
    const qrCode = qrInfo?.qrCodeString || generateQrCode({ badge: badgeForQr, entryId: finalEntryId });

    const surveyOnly = { survey: stepsAnswers.survey || [] };

    // --- 3. ZAPIS/AKTUALIZACJA W BAZIE DANYCH ---
    try {
      await prismaActivation.$executeRawUnsafe(
        `INSERT INTO "${tableName}" (
          "id", "slug", "entryId", "qrCode", "domain", "badge",
          "isActivated", "activatedAt", "dataCenter",
          "actFirstName", "actLastName", "actEmail", "actPhone",
          "actStreet", "actHouseNumber", "actCity", "actPostalCode",
          "answers", "fullName", "fairDate", "fairYear", "createdAt",
          "email", "phone", "streetAddress", "houseNumber", "postalCode", "city", "country"
        ) VALUES (
          $1, $2, $3, $4, $5, $19,
          true, NOW(), 'send',
          $6, $7, $8, $9, $10, $11, $12, $13,
          $14::jsonb, $15, $16, $17, NOW(),
          $8, $9, $10, $11, $13, $12, $18
        )
        ON CONFLICT ("slug", "entryId") DO UPDATE SET
          "isActivated" = true,
          "activatedAt" = NOW(),
          "dataCenter" = 'send',
          "actFirstName" = EXCLUDED."actFirstName",
          "actLastName" = EXCLUDED."actLastName",
          "actEmail" = EXCLUDED."actEmail",
          "actPhone" = EXCLUDED."actPhone",
          "answers" = EXCLUDED."answers",
          "fullName" = EXCLUDED."fullName",
          "fairDate" = EXCLUDED."fairDate",
          "fairYear" = EXCLUDED."fairYear"`,
        dbId, partitionSlug, finalEntryId, qrCode, domain,
        form.firstName, form.lastName, form.email, form.phone, form.street,
        form.buildingNumber, form.city, form.postalCode,
        JSON.stringify(surveyOnly), `${form.firstName} ${form.lastName}`,
        formattedDate, fairYear, form.country || "Polska", badgeForQr
      );
    } catch (dbErr: any) {
      await logApiError({
        endpoint: "/api/activate",
        method: "DB_INSERT",
        message: `Local DB Write Error: ${dbErr.message}`,
        payload: { dbId, finalEntryId, tableName },
        status: 500
      });
      throw dbErr;
    }

    // --- 4. WYSYŁKA DO ZEWNĘTRZNEGO API (PWE-CDB) ---
    const secretKey = process.env.PWE_API_KEY_2 || "TEST_KEY";
    const timeString = formatInTimeZone(new Date(), 'Europe/Warsaw', 'dd-MM-yyyy-HH');
    const token = crypto.createHmac('sha256', secretKey).update(timeString).digest('hex');

    const pwePayload = {
      activation: [{
        user: {
          entryId: finalEntryId,
          qrCode: qrCode,
          activatedAt: new Date().toISOString(),
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          street: form.street,
          buildingNumber: form.buildingNumber,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country || "Polska",
          partitionSlug: partitionSlug
        },
        surveyAnswers: stepsAnswers.survey || [],
        event: {
          domain: domain,
          badge: badgeForQr,
          fairDate: startDate,
          fairYear: fairYear
        }
      }]
    };

    try {
      const response = await fetch("https://pwe-cdb.warsawexpo.eu/api/zaaktywuj", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": token },
        body: JSON.stringify(pwePayload),
      });

      if (!response.ok) {
        const responseData = await response.text();
        await logApiError({
          endpoint: "/api/activate",
          method: "CDB_API_POST",
          message: `External API rejected: ${response.statusText}`,
          status: response.status,
          payload: pwePayload,
          response: responseData
        });
      }
    } catch (err: any) {
      await logApiError({
        endpoint: "/api/activate",
        method: "CDB_API_FETCH",
        message: `Network Failure: ${err.message}`,
        payload: pwePayload
      });
    }

    // --- 5. GENEROWANIE QR I WYSYŁKA MAILA ---
    if (isNewRegistration && form.email && qrCode) {
      try {
        const qrImage = await QRCode.toBuffer(qrCode);
        const infoUrl = domain ? `https://${domain}` : `https://warsawexpo.eu`;

        if (lang === "en") {
          await transporter.sendMail({
            from: `"Activation Ptak Warsaw Expo" <${process.env.SMTP_USER}>`,
            to: form.email,
            subject: `Thank you for registering for ${name}`,
            html: `
              <!DOCTYPE html>
              <html lang="en">

              <head>
                <title>Confirmation of registration</title>
              </head>
              <body style="
                    text-align: justify;
                    max-width: 600px;
                    margin: 0 auto;
                    font-family: 'Open Sans', 'Montserrat', sans-serif;
                  ">
                <div>
                  <img style="width: 100%" src="${infoUrl}/doc/header_en.jpg" alt="$name" />
                </div>
                <div style="padding: 0 5px">
                  <h3 style="font-size: 18px; margin: 20px 0 10px; text-align: left;">
                    Hello,
                  </h3>
                  <p style="font-size: 14px; margin: 25px 0 10px; text-align: center;">
                    Thank you for registering for ${name} at Ptak Warsaw Expo. The latest technologies, inspiring lectures and unique business networking opportunities await you at the fair.
                  </p>
                  <p style="font-size: 14px; margin: 25px 0 10px; text-align: center;">
                    <b>All details of the event can be found on our website.</b>
                  </p>
                  <div style="width: 130px; margin: 25px auto; ">
                  <a style="text-align: center; padding: 7px 5px 5px;  text-decoration: none; color: white; background-color: black; border-radius: 8px;  "
                    target="_blank" href="${infoUrl}">FIND OUT MORE</a>
                  </div>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr align="center">
                      <td align="left"
                        style="display: inline-block;  width:100%;  max-width: 275px; font-size:15px; margin-left:15px; margin-bottom:25px; line-height: 25px;">
                          <b>The free ticket entitles you to:</b><br />
                          • Trade show entries<br />
                          • Participation in a conference or congress<br />
                          • Use of the networking area<br />
                          • Access to exhibitor booths<br />

                    </td>
                    <td class="no-mobile-width" valign="center" align="center"
                      style="display: inline-block; width:100%; max-width: 275px;">
                      <div
                        style="border:3px solid black; width: 80%; margin: 12px auto; padding: 0px 3px 10px 3px;  border-radius:20px;">
                        <p style="color:black; font-size: 13px; font-weight: 700; letter-spacing: 1px;">YOUR FREE TICKET
                        </p>
                        <img src="cid:qrcode" width="150" height="150" alt="qr-code"/>
                      </div>
                      <p style="font-size:11px; line-height: 18px;">If you don't see the QR code, disable the option to block the
                        images
                        for this email.</p>
                    </td>
                    </tr>
                  </table>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <p style="text-align: center; margin: 0 30px;"><b>Trade fair ${name} will be held on ${formattedDate}. Save this date in your calendar so you don't forget it.</b></p>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <table style="min-width:100%; background:url(${infoUrl}/wp-content/plugins/PWElements/media/belka.jpg)" cellpadding="0" cellspacing="0" border="0"
                    width="100%">
                  </table>
                  <p style="margin-top: 10px; padding: 0 5px; font-size: 12px" class="footer__rodo">
                The administrator of your personal data is PTAK WARSAW EXPO sp.z o.o. with
                  its registered office in Nadarzyn (postal code: 05-830), at Al. Katowicka
                  62, entered into the Register of Entrepreneurs of the National Court
                  Register under the number KRS 0000671001, NIP 532544579. Personal data
                  will be processed in accordance with Regulation (EU) 2016/679 of the
                  European Parliament and of the Council of 27 April 2016 on the protection
                  of natural persons in connection with processing of personal data and on
                  the free movement of such data and repealing Directive 95/46 / EC (GDPR),
                  pursuant to art. 6 clause 1 lit. a or b above Regulations for the purposes
                  indicated in the content of the above approvals. The data will be
                  processed until the consent is withdrawn and will be subject to periodic
                  review every two years. Your personal data may be transferred to third
                  parties who process personal data on behalf of PTAK WARSAW EXPO sp.z o.o.
                  based on entrustment agreements, i.e. IT services, entities providing
                  marketing services, entities processing data for the purpose of pursuing
                  claims and recovery or other. You have the option of accessing your data,
                  to rectify and delete them, transfer data and request to limit their
                  processing due to your special situation, raise an objection and withdraw
                  your consent at any time, however, withdrawing your consent will not
                  affect on the legality of processing before its withdrawal, as well as
                  lodging a complaint to the supervisory body - the President of the Office
                  for Personal Data Protection. The data will not be transferred to third
                  countries and are not subject to profiling, i.e. automatic decision
                  making. Contact with the administrator is possible at the following e-mail
                  address: rodo@warsawexpo.eu.
                  </p>
              </body>

                </html>`,
            attachments: [{ filename: "qrcode.png", content: qrImage, cid: "qrcode", contentDisposition: 'attachment' }],
          });
        } else {
          await transporter.sendMail({
            from: `"Aktywacja Ptak Warsaw Expo" <${process.env.SMTP_USER}>`,
            to: form.email,
            subject: `Dziękujemy za rejestrację na ${name}`,
            html: `            <!DOCTYPE html>
              <html lang="pl">

              <head>
                <title>Potwierdzenie rejestracji</title>
              </head>
              <body style="
                    text-align: justify;
                    max-width: 600px;
                    margin: 0 auto;
                    font-family: 'Open Sans', 'Montserrat', sans-serif;
                  ">
                <div>
                  <img style="width: 100%" src="${infoUrl}/doc/header.jpg" alt="${name}" />
                </div>
                <div style="padding: 0 5px">
                  <h3 style="font-size: 18px; margin: 20px 0 10px; text-align: left;">
                    Witaj,
                  </h3>
                  <p style="font-size: 14px; margin: 25px 0 10px; text-align: center;">
                    Dziękujemy za rejestrację na ${name} w Ptak Warsaw Expo. Na targach czekają na Państwa najnowsze technologie, inspirujące prelekcje i wyjątkowe okazje do nawiązania kontaktów biznesowych.
                  </p>
                  <p style="font-size: 14px; margin: 25px 0 10px; text-align: center;">
                    <b>Wszystkie szczegóły dotyczące wydarzenia znajdą Państwo na naszej stronie internetowej.</b>
                  </p>
                  <div style="width: 185px; margin: 25px auto; ">
                  <a style="text-align: center; padding: 7px 4px 5px;  text-decoration: none; color: white; background-color: black; border-radius: 8px;  "
                    target="_blank" href="${infoUrl}/?utm_source=rejpl&utm_medium=mail&utm_campaign=qrmail">DOWIEDZ SIĘ WIĘCEJ</a>
                  </div>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr align="center">
                      <td align="left"
                        style="display: inline-block;  width:100%;  max-width: 275px; font-size:15px; margin-left:15px; margin-bottom:25px; line-height: 25px;">
                          <b>Darmowy bilet upoważnia do:</b><br />
                          • Wejścia na targi<br />
                          • Udziału w konferencji lub kongresie<br />
                          • Korzystania ze strefy networkingowej<br />
                          • Dostępu do stoisk wystawców<br />

                    </td>
                    <td class="no-mobile-width" valign="center" align="center"
                      style="display: inline-block; width:100%; max-width: 275px;">
                      <div
                        style="border:3px solid black; width: 80%; margin: 12px auto; padding: 0px 3px 10px 3px;  border-radius:20px;">
                        <p style="color:black; font-size: 13px; font-weight: 700; letter-spacing: 1px;">TWÓJ DARMOWY BILET
                        </p>
                        <img src="cid:qrcode" width="150" height="150" alt="qr-code"/>
                      </div>
                      <p style="font-size:11px; line-height: 18px;">Jeżeli nie widzisz kodu QR, wyłącz opcję blokowania
                        obrazków
                        dla tego maila.</p>
                    </td>
                    </tr>
                  </table>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <p style="text-align: center; margin: 0 30px;"><b>Targi ${name} odbędą się w terminie ${formattedDate}. Zapisz tę datę w kalendarzu, aby o niej nie zapomnieć.</b></p>
                  <div style="width: 95%; border-bottom:1px solid rgba(188,188,188, .4); margin:15px auto;"></div>
                  <table style="min-width:100%; background:url(${infoUrl}/wp-content/plugins/PWElements/media/belka.jpg)" cellpadding="0" cellspacing="0" border="0"
                    width="100%">
                  </table>
                  <p style="margin-top: 10px; padding: 0 5px; font-size: 12px" class="footer__rodo">
                    Administratorem Pani/Pana danych osobowych jest spółka PTAK WARSAW EXPO
                    sp. z o.o. z siedzibą w Nadarzynie (kod pocztowy: 05-830), przy Al.
                    Katowickiej 62, wpisaną do rejestru przedsiębiorców Krajowego Rejestru
                    Sądowego pod numerem KRS 0000671001, NIP 532544579. Dane osobowe będą
                    przetwarzane zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady
                    (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych
                    w związku z przetwarzaniem danych osobowych i w sprawie swobodnego
                    przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO), na
                    podstawie art. 6 ust. 1 lit. a lub b ww. Rozporządzenia w celach
                    wskazanych w treści ww. zgód. Dane będą przetwarzane do czasu wycofania
                    zgody i będą podlegały okresowemu przeglądowi co 2 lata. Pani/a dane
                    osobowe mogą być przekazane osobom trzecim, które przetwarzają dane
                    osobowe w imieniu PTAK WARSAW EXPO sp. z o.o. na podstawie umów
                    powierzenia tj. usługi IT, podmioty świadczące usługi marketingowe,
                    podmioty przetwarzające dane w celu dochodzenia roszczeń i windykacji lub
                    innych. Ma Pan/i możliwość dostępu do swoich danych, w celu ich
                    sprostowania i usunięcia, przeniesienia danych oraz żądania ograniczenia
                    ich przetwarzania ze względu na swoją szczególną sytuację, wniesienia
                    sprzeciwu oraz wycofania udzielonej zgody w każdym momencie, przy czym,
                    cofnięcie uprzednio wyrażonej zgody nie wpłynie na legalność przetwarzania
                    przed jej wycofaniem, a także wniesienia skargi do organu nadzorczego -
                    Prezesa Urzędu Ochrony Danych Osobowych. Dane nie będą przekazywane do
                    państw trzecich oraz nie podlegają profilowaniu tj. automatycznemu
                    podejmowaniu decyzji. Kontakt z administratorem możliwy jest pod adresem
                    e-mail: rodo@warsawexpo.eu.
                  </p>
              </body>

            </html>`,
            attachments: [{ filename: "qrcode.png", content: qrImage, cid: "qrcode", contentDisposition: 'attachment' }],
          });
        }
      } catch (mailErr: any) {
        await logApiError({
          endpoint: "/api/activate",
          method: "MAIL_SEND",
          message: mailErr.message,
          payload: { email: form.email },
          status: 500
        });
      }
    }

    return NextResponse.json({ success: true, entryId: finalEntryId });

  } catch (error: any) {
    await logApiError({
      endpoint: "/api/activate",
      method: "GLOBAL_CATCH",
      message: `Critical Error: ${error.message}`,
      payload: { body }
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}