// Beams verticales de luz, sutiles, para fondo de secciones oscuras.
const BEAMS = [
  { left: "12%", h: "42%", delay: "0s", dur: "6.5s" },
  { left: "34%", h: "58%", delay: "1.6s", dur: "7.5s" },
  { left: "58%", h: "48%", delay: "0.8s", dur: "6.8s" },
  { left: "80%", h: "36%", delay: "2.4s", dur: "8s" },
];

export default function Beams({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {BEAMS.map((b, i) => (
        <span key={i} className="absolute top-0 w-px beam"
          style={{
            left: b.left,
            height: b.h,
            animationDelay: b.delay,
            animationDuration: b.dur,
            background: "linear-gradient(to bottom, transparent, rgba(90,162,245,0.5), transparent)",
          }} />
      ))}
    </div>
  );
}
