export const SITE = {
  name: "Constructora 4:44",
  url: "https://constructora444.com",
  tagline: "Desarrollo y construcción de proyectos e inmuebles",
  description:
    "Constructora 4:44 desarrolla y construye casas, edificios y proyectos de inversión en Guadalajara y su zona metropolitana. Renta de maquinaria, supervisión de obra y crowdfunding inmobiliario.",
  city: "Guadalajara, Jalisco, México",
} as const;

export const SERVICES = [
  {
    id: "01",
    title: "Casas residenciales",
    body: "Viviendas de diseño innovador y estándares de calidad, pensadas para el confort, la seguridad y el valor de inversión.",
  },
  {
    id: "02",
    title: "Supervisión de proyectos",
    body: "Seguimiento del avance de obra y verificación de calidad, de la cimentación a la entrega.",
  },
  {
    id: "03",
    title: "4:44 Maquinaria",
    body: "Renta por hora, día, semana o mes de equipo para obra y servicios de movimiento de tierra.",
  },
  {
    id: "04",
    title: "Crowdfunding inmobiliario",
    body: "Proyectos abiertos a inversión colectiva, como Valle de Olmos y Valle del Volga.",
  },
] as const;

export const MACHINERY = [
  { name: "Retroexcavadoras", use: "Excavación, zanjeo y carga" },
  { name: "Plataformas de tijera", use: "Trabajo en altura vertical" },
  { name: "Plataformas articuladas", use: "Alcance en altura con acceso complejo" },
  { name: "Movimiento de tierra", use: "Nivelación, corte y relleno" },
] as const;

export const RENTAL_TERMS = ["Hora", "Día", "Semana", "Mes"] as const;

export type Project = { name: string; type: string; tag: string };

export const PROJECTS: readonly Project[] = [
  { name: "Valle de Olmos", type: "Crowdfunding", tag: "Inversión colectiva" },
  { name: "Valle del Volga", type: "Crowdfunding", tag: "Inversión colectiva" },
  { name: "Casa San Isidro", type: "Residencial", tag: "Casa" },
  { name: "Casa Zalamea", type: "Residencial", tag: "Casa" },
  { name: "Real de Valdepeñas II", type: "Desarrollo", tag: "Fraccionamiento" },
  { name: "Proyecto Alcazar", type: "Desarrollo", tag: "Proyecto" },
  { name: "Edificio San Paulo", type: "Edificación", tag: "Edificio" },
  { name: "Restaurantes Wingman", type: "Comercial", tag: "Restaurantes" },
];

export const PROCESS = [
  { id: "01", title: "Planeación y cimentación", body: "Definimos alcance, presupuesto y programa de obra, y empezamos por una base sólida." },
  { id: "02", title: "Estructura", body: "Levantamos la estructura con supervisión continua y control de calidad en cada nivel." },
  { id: "03", title: "Muros e instalaciones", body: "Cerramos espacios y resolvemos instalaciones pensando en confort y seguridad." },
  { id: "04", title: "Acabados y entrega", body: "Revisión final, detalles y entrega del inmueble listo para habitarse o invertirse." },
] as const;

export const FAQ = [
  {
    q: "¿En qué zonas trabaja Constructora 4:44?",
    a: "Desarrollamos y construimos proyectos en Guadalajara y su zona metropolitana, en Jalisco, México.",
  },
  {
    q: "¿Qué servicios ofrece Constructora 4:44?",
    a: "Casas residenciales, supervisión de proyectos, renta de maquinaria con 4:44 Maquinaria y proyectos de crowdfunding inmobiliario.",
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
