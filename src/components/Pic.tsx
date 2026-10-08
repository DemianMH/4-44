import Image from "next/image";
import type { Img } from "@/lib/types";

type PicProps = {
  img: Img;
  sizes: string;
  className?: string;
  priority?: boolean;
  quality?: 75 | 90;
  /** `fill` llena al contenedor; sin él se usan las medidas propias de la imagen. */
  fill?: boolean;
  alt?: string;
};

/** Imagen del contenido: carga progresiva con miniatura borrosa y optimización automática. */
export function Pic({ img, sizes, className, priority, quality, fill = true, alt }: PicProps) {
  if (!img.src) return null;
  const common = {
    src: img.src,
    alt: alt ?? img.alt,
    sizes,
    className,
    priority,
    quality,
    placeholder: img.blur ? ("blur" as const) : ("empty" as const),
    blurDataURL: img.blur,
    // Las imágenes subidas desde el panel ya vienen optimizadas (WebP ≤ 2560 px)
    unoptimized: img.src.startsWith("/media/"),
  };
  return fill ? <Image {...common} alt={common.alt} fill /> : <Image {...common} alt={common.alt} width={img.w} height={img.h} />;
}
