// src/components/BackToTop.jsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/**
 * BackToTop — shows after user scrolls down; smooth scroll to top
 */
export default function BackToTop({ threshold = 600 }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > threshold);
    onScroll(); // init
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      className={[
        "fixed right-4 bottom-4 z-40",
        "rounded-xl px-3 py-2",
        "bg-emerald-500/15 ring-1 ring-emerald-300/30",
        "text-emerald-200 hover:text-white hover:bg-emerald-500/25",
        "shadow-[0_8px_28px_rgba(0,0,0,.25)] backdrop-blur-md",
        "transition",
        show
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none",
      ].join(" ")}
      aria-label="Back to top">
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
