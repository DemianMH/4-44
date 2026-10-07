import Image from "next/image";

type LogoProps = { variant?: "oscuro" | "claro"; height?: number; className?: string; priority?: boolean };

/** Logo oficial de Constructora 4:44 (proporción 304:66). `height` en px de diseño; se escala con rem. */
export function Logo({ variant = "oscuro", height = 32, className, priority = false }: LogoProps) {
  const width = Math.round((height * 304) / 66);
  return (
    <Image
      src={variant === "claro" ? "/logo-claro.svg" : "/logo.svg"}
      alt="Constructora 4:44"
      width={width}
      height={height}
      unoptimized
      priority={priority}
      className={className}
      style={{ height: `${height / 16}rem`, width: "auto" }}
    />
  );
}
