import { useEffect, useState, useRef } from "react";
import { Stethoscope, Mail, MapPin, Phone, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";
import HeartbeatFrame from "./HeartbeatFrame";
import resume from "../data/resume";

/**
 * Resolve a single PDF from /src/assets/resume/*
 * - Keep only ONE file in that folder.
 * - We expose both the built URL and the original filename for the "download" attribute.
 */
const pdfMap = import.meta.glob("/src/assets/resume/*.pdf", {
  eager: true,
  as: "url",
});
const pdfEntries = Object.entries(pdfMap);
const pdfUrl = pdfEntries[0]?.[1] || "/resume.pdf"; // fallback if none found
const pdfName = pdfEntries[0]
  ? pdfEntries[0][0].split("/").pop() // original filename from path
  : "resume.pdf";

// Small helper to build a Google Maps search URL
const mapUrl = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q || ""
  )}`;

export default function Header() {
  const {
    name = "Dr. Your Name",
    title = "Emergency Medicine • Research • Patient Safety",
    email = "you@example.com",
    phoneIntl = "+27000000000",
    phonePretty = "+27 00 000 0000",
    location = "South Africa",
  } = resume?.contact || {};

  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Generate QR code data URL
    QRCode.toDataURL(
      "https://anreanvari.elixflare.com/",
      {
        width: 200, // Smaller for popup
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

  // Handle QR code download
  const handleQRDownload = () => {
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
    <header className="relative z-20 mx-auto max-w-5xl px-4 pt-8">
      <HeartbeatFrame>
        <div className="px-5 py-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            {/* Name + title */}
            <div>
              <h1 className="group/name text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight flex items-center gap-3">
                <span className="group/icon relative inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/30 shadow-[0_0_24px_rgba(16,185,129,.25)]">
                  <Stethoscope className="h-6 w-6 group-hover/icon:animate-[stethPulse_1s_ease-in-out]" />
                </span>
                <span className="relative inline-block group-hover/name:animate-[nameGlow_1.1s_ease-in-out]">
                  {name}
                </span>
              </h1>
              {title ? <p className="mt-2 text-slate-300">{title}</p> : null}
            </div>

            {/* Contacts */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              {/* Email */}
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(
                  "Contact via Resume"
                )}`}
                className="group/email relative inline-flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
                aria-label="Send email">
                <span className="relative inline-flex">
                  <Mail className="h-4 w-4" />
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-white/80 opacity-0 group-hover/email:opacity-100 group-hover/email:animate-[emailSpark_900ms_ease-out] transition-opacity"
                  />
                </span>
                <span className="relative">
                  {email}
                  <span
                    aria-hidden
                    className="absolute left-0 -bottom-0.5 h-[2px] w-full origin-left scale-x-0 bg-emerald-400 group-hover/email:scale-x-100 transition-transform [transition-duration:var(--hb-dur)]"
                  />
                </span>
              </a>

              {/* Phone */}
              <a
                href={`tel:${phoneIntl}`}
                className="group/phone relative inline-flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
                aria-label="Call phone number">
                <span className="relative inline-flex">
                  <Phone className="h-4 w-4 group-hover/phone:animate-[phoneTilt_900ms_ease-in-out]" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-full opacity-0 group-hover/phone:opacity-100 group-hover/phone:animate-[phoneRipple_1000ms_ease-out]"
                  />
                </span>
                {phonePretty}
              </a>

              {/* Location */}
              <a
                href={mapUrl(location)}
                target="_blank"
                rel="noreferrer"
                className="group/loc relative inline-flex items-center gap-2 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
                aria-label="Open location in Google Maps">
                <span className="relative inline-flex">
                  <MapPin className="h-4 w-4 group-hover/loc:animate-[pinBounce_900ms_ease-in-out]" />
                  <span
                    aria-hidden
                    className="absolute -inset-2 rounded-full opacity-0 group-hover/loc:opacity-100 group-hover/loc:animate-[pinHalo_1100ms_ease-out]"
                  />
                </span>
                {location}
              </a>

              {/* Download PDF */}
              <a
                href={pdfUrl}
                download={pdfName}
                className="group/dl inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-400/10 ring-1 ring-emerald-300/30 hover:bg-emerald-400/20 transition"
                aria-label="Download resume PDF">
                <Download className="h-4 w-4 group-hover/dl:animate-[dlBounce_1s_ease-in-out]" />
                <span className="group-hover/dl:animate-[dlFlash_1.1s_ease-in-out]">
                  Download PDF
                </span>
              </a>

              {/* Download QR Code with Popup */}
              <div
                className="relative"
                onMouseEnter={() => setIsPopupOpen(true)}
                onMouseLeave={() => setIsPopupOpen(false)}>
                <button
                  onClick={handleQRDownload}
                  className="group/qr inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-400/10 ring-1 ring-emerald-300/30 hover:bg-emerald-400/20 transition disabled:opacity-50"
                  aria-label="Download QR code for digital resume"
                  disabled={!qrCodeUrl}>
                  <Download className="h-4 w-4 group-hover/qr:animate-[dlBounce_1s_ease-in-out]" />
                  <span className="group-hover/qr:animate-[dlFlash_1.1s_ease-in-out]">
                    Download QR Code
                  </span>
                </button>
                <AnimatePresence>
                  {isPopupOpen && qrCodeUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-slate-800/90 rounded-lg shadow-lg p-4 z-50 border border-emerald-300/30">
                      <img
                        src={qrCodeUrl}
                        alt="QR Code for Digital Resume"
                        className="max-w-full h-auto"
                        style={{ maxWidth: "200px" }}
                      />
                      <p className="text-center text-sm text-slate-300/80 mt-2">
                        Scan to visit my digital resume
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </HeartbeatFrame>
    </header>
  );
}
