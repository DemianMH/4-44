import Image from "next/image";

type LogoProps = { variant?: "oscuro" | "claro"; height?: number; className?: string };

/** Logo oficial de Constructora 4:44 (proporción 304:66). */
export function Logo({ variant = "oscuro", height = 32, className }: LogoProps) {
  const width = Math.round((height * 304) / 66);
  return (
    <Image
      src={variant === "claro" ? "/logo-claro.svg" : "/logo.svg"}
      alt="Constructora 4:44"
      width={width}
      height={height}
      unoptimized
      priority
      className={className}
    />
  );
}
