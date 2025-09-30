// src/components/HeartbeatFrame.jsx
export default function HeartbeatFrame({ children, className = "" }) {
  return (
    <div
      className={["group relative rounded-2xl p-[2px]", className].join(" ")}>
      {/* نور دور کادر — فقط روی hover می‌تپد؛ خارج از hover با همون مدت زمان محو می‌شود */}
      <div
        aria-hidden
        className="
          absolute inset-0 rounded-2xl pointer-events-none
          group-hover:[animation:hbBorder_var(--hb-dur)_ease-in-out_infinite]
          will-change-[box-shadow,opacity]
          [transition:opacity_var(--hb-dur)_ease-in-out]
          opacity-0 group-hover:opacity-100
        "
      />

      {/* محفظه‌ی گلس داخلی با یک رینگ ثابت */}
      <div
        className="
          relative rounded-2xl bg-slate-900/70 backdrop-blur-md
          ring-1 ring-white/10 shadow-[0_8px_28px_rgba(0,0,0,.25)]
        "
        data-safe="header">
        {/* محتوا — روی hover پالس می‌گیرد؛ خارج از hover با همان مدت زمان به scale(1) برمی‌گردد */}
        <div
          className="
            group-hover:[animation:hbScale_var(--hb-dur)_ease-in-out_infinite]
            will-change-transform
          "
          style={{
            transform: "scale(1)",
            transition: "transform var(--hb-dur) ease-in-out",
          }}>
          {children}
        </div>
      </div>
    </div>
  );
}
