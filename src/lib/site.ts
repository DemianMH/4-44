import type { StaticImageData } from "next/image";
import { P } from "@/assets/images";

export const SITE = {
  name: "Constructora 4:44",
  url: "https://constructora444.com",
  tagline: "Desarrollo y construcción de proyectos e inmuebles",
  description:
    "Constructora e inmobiliaria 4:44: casas y departamentos en venta, desarrollo y construcción de proyectos, renta de maquinaria y crowdfunding inmobiliario en Guadalajara y su zona metropolitana.",
  city: "Guadalajara, Jalisco, México",
} as const;

export const SERVICES = [
  { id: "01", title: "Casas y departamentos", short: "Inmuebles de diseño contemporáneo en venta." },
  { id: "02", title: "Supervisión de obra", short: "Avance y calidad verificados, de cimientos a entrega." },
  { id: "03", title: "4:44 Maquinaria", short: "Renta de equipo por hora, día, semana o mes." },
  { id: "04", title: "Crowdfunding inmobiliario", short: "Inversión colectiva en proyectos como Valle de Olmos." },
] as const;

export const MACHINERY = ["Retroexcavadoras", "Plataformas de tijera", "Plataformas articuladas", "Movimiento de tierra"] as const;

export const RENTAL_TERMS = ["Hora", "Día", "Semana", "Mes"] as const;

export type Project = { name: string; type: string; tag: string; img: StaticImageData };

export const PROJECTS: readonly Project[] = [
  { name: "Valle de Olmos", type: "Crowdfunding", tag: "Inversión colectiva", img: P.valleDeOlmos },
  { name: "Valle del Volga", type: "Crowdfunding", tag: "Inversión colectiva", img: P.valleDelVolga },
  { name: "Casa San Isidro", type: "Casa", tag: "Casa en Zapopan", img: P.casaSanIsidro },
  { name: "Casa Zalamea", type: "Casa", tag: "Casa en Zapopan", img: P.casaZalamea },
  { name: "Real de Valdepeñas II", type: "Desarrollo", tag: "Desarrollo residencial", img: P.realDeValdepenas },
  { name: "Proyecto Alcazar", type: "Obra", tag: "Proyecto en construcción", img: P.proyectoAlcazar },
  { name: "Edificio San Paulo", type: "Edificio", tag: "Edificación", img: P.edificioSanPaulo },
  { name: "Restaurantes Wingman", type: "Comercial", tag: "Restaurantes", img: P.restaurantesWingman },
];

export const FAQ = [
  {
    q: "¿Constructora 4:44 también vende inmuebles?",
    a: "Sí. Además de desarrollar y construir proyectos, comercializamos casas y departamentos en la zona metropolitana de Guadalajara.",
  },
  {
    q: "¿En qué zonas trabaja Constructora 4:44?",
    a: "Desarrollamos y construimos proyectos en Guadalajara y su zona metropolitana, en Jalisco, México.",
  },
  {
    q: "¿Cómo funciona la renta de maquinaria?",
    a: "Rentamos retroexcavadoras, plataformas de tijera y articuladas, además de servicios de movimiento de tierra, por hora, día, semana o mes.",
  },
  {
    q: "¿Qué es el crowdfunding inmobiliario de 4:44?",
    a: "Es un modelo en el que varias personas invierten en un mismo desarrollo. Proyectos como Valle de Olmos y Valle del Volga se han abierto bajo este esquema.",
  },
  {
    q: "¿Pueden supervisar una obra que ya está en marcha?",
    a: "Sí. Nuestro servicio de supervisión da seguimiento al avance y verifica el cumplimiento de calidad del proyecto.",
  },
] as const;
