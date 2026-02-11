"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export default function ScannerPage() {
  const router = useRouter();
  const qrRef = useRef<Html5Qrcode | null>(null);
  let scanned = false;


  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qr-reader");
    qrRef.current = html5QrCode;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!devices.length) return;
  if (scanned) return;
  scanned = true;
        const cameraId = devices[0].id;

        html5QrCode.start(
          { deviceId: { exact: cameraId } },
          {
            fps: 15,
            disableFlip: true
            // ❌ brak qrbox → skanowanie całego obrazu
          },
          (decodedText) => {
            html5QrCode.stop().then(() => {
              router.push(`/form?id=${decodedText}`);
            });
          },
          () => {}
        );
      })
      .catch(() => {});

    return () => {
      qrRef.current?.stop().catch(() => {});
    };
  }, [router]);

  return (
    <div
      id="qr-reader"
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden"
      }}
    />
  );
}
