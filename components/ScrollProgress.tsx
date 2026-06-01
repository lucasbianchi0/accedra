"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollable = el.scrollHeight - el.clientHeight;
      setPct(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: "linear-gradient(to right, #4f8ef7, #2B6FD4)",
          boxShadow: "0 0 10px rgba(79,142,247,0.7)",
          transition: "width 80ms linear",
        }}
      />
    </div>
  );
}
