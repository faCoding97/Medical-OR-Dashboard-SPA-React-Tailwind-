import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

const QRCodeDisplay = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Generate QR code data URL
    QRCode.toDataURL(
      "https://anreanvari.elixflare.com/",
      {
        width: 300, // Suitable for scanning, responsive
        margin: 2,
        color: {
          dark: "#1e3a8a", // Tailwind blue-900 for medical aesthetic
          light: "#f3f4f6", // Tailwind gray-100 for sterile background
        },
      },
      (error, url) => {
        if (error) console.error("QR Code generation failed:", error);
        else setQrCodeUrl(url);
      }
    );
  }, []);

  // Handle download button click
  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a");
      link.href = qrCodeUrl;
      link.download = "anre-anvari-resume-qr.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg shadow-lg flex flex-col items-center space-y-4">
      {qrCodeUrl && (
        <img
          src={qrCodeUrl}
          alt="QR Code for Digital Resume"
          className="mx-auto max-w-full h-auto"
          style={{ maxWidth: "300px" }} // Ensure responsiveness
        />
      )}
      <p className="text-center text-sm text-slate-300/80">
        Scan to visit my digital resume
      </p>
      <button
        onClick={handleDownload}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors duration-200 disabled:opacity-50"
        disabled={!qrCodeUrl}>
        <Download className="w-5 h-5" />
        <span>Download QR Code</span>
      </button>
    </div>
  );
};

export default QRCodeDisplay;
