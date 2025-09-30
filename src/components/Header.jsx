// src/components/Header.jsx
import { Stethoscope, Mail, MapPin, Phone, Download } from "lucide-react";
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

              {/* Download PDF — auto from /src/assets/resume/* */}
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
            </div>
          </div>
        </div>
      </HeartbeatFrame>
    </header>
  );
}
