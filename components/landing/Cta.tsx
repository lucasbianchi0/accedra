import type { ComponentProps } from "react";
import { ArrowRight } from "lucide-react";

/* Pastilla con la flecha en un círculo. Al pasar el mouse la flecha sale por la
 * derecha y entra otra por la izquierda. */
export function FlechaCirculo() {
  return (
    <span className="lp-cta-ico" aria-hidden>
      <span className="lp-cta-flechas">
        <ArrowRight size={16} />
        <ArrowRight size={16} />
      </span>
    </span>
  );
}

export function Cta({
  tono = "claro",
  children,
  className = "",
  ...props
}: { tono?: "claro" | "azul" } & ComponentProps<"a">) {
  return (
    <a data-tono={tono} className={`lp-cta ${className}`} {...props}>
      {children}
      <FlechaCirculo />
    </a>
  );
}
