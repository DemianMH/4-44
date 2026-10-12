/**
 * Entornos 3D construidos a partir de las plantas amuebladas.
 * Todas las coordenadas son fracciones (0–1) de la imagen de la planta: x → derecha, y → abajo.
 */
export type Wall = [x1: number, y1: number, x2: number, y2: number];

export type Item = {
  id: string;
  label: string;
  desc: string;
  /** Centro y tamaño en fracciones de la imagen. */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Altura real en metros. */
  z: number;
  color: string;
  round?: boolean;
  /** Si bloquea el paso en el modo recorrido. */
  block?: boolean;
  /** Si es parte de otro mueble (no se lista aparte). */
  part?: boolean;
};

export type Room = { name: string; x: number; y: number };

export type Layout = {
  id: string;
  label: string;
  /** Ancho real aproximado de la planta, en metros. */
  widthM: number;
  walls: Wall[];
  /** Barandales y parapetos (más bajos). */
  low?: Wall[];
  items: Item[];
  rooms: Room[];
  start: [number, number];
};

const WOOD = "#7a5638";
const MARBLE = "#e6e1d8";
const WHITE = "#f1eee8";
const DARK = "#2e2e2e";
const WICKER = "#cfc6b6";

type Opts = Partial<Pick<Item, "round" | "block" | "part">>;
const it = (id: string, label: string, desc: string, x: number, y: number, w: number, h: number, z: number, color: string, o: Opts = {}): Item => ({ id, label, desc, x, y, w, h, z, color, ...o });
const chair = (id: string, x: number, y: number, s = 0.06): Item => it(id, "Silla", "Silla del comedor.", x, y, s, s, 0.45, WICKER, { part: true });

const m46: Layout = {
  id: "m46",
  label: "Modelo 46 m²",
  widthM: 5.4,
  walls: [
    [0.02, 0.012, 0.98, 0.012], [0.02, 0.955, 0.98, 0.955], [0.02, 0.012, 0.02, 0.955], [0.98, 0.012, 0.98, 0.955],
    [0.24, 0.012, 0.24, 0.4], [0.02, 0.175, 0.24, 0.175], [0.02, 0.47, 0.37, 0.47], [0.52, 0.455, 0.52, 0.94],
  ],
  items: [
    it("lavadora", "Lavadora", "Zona de lavado integrada, junto al baño.", 0.075, 0.07, 0.1, 0.11, 0.9, "#e8e8e6", { block: true }),
    it("lavadero", "Lavadero", "Lavadero para ropa y artículos de limpieza.", 0.1, 0.145, 0.14, 0.06, 0.9, "#cfcfcf", { block: true }),
    it("regadera", "Regadera", "Regadera con piso de mosaico.", 0.12, 0.265, 0.16, 0.14, 0.04, "#bfae94"),
    it("inodoro", "Inodoro", "Baño completo con acabados claros.", 0.085, 0.35, 0.07, 0.08, 0.4, "#f4f4f2", { block: true }),
    it("lavabo", "Lavabo", "Lavabo sobre cubierta de mármol.", 0.075, 0.43, 0.075, 0.09, 0.85, WHITE, { block: true }),
    it("comedor", "Comedor", "Mesa para seis personas junto al ventanal.", 0.545, 0.23, 0.12, 0.22, 0.75, WOOD, { block: true }),
    chair("silla1", 0.545, 0.115), chair("silla2", 0.455, 0.19), chair("silla3", 0.455, 0.29),
    chair("silla4", 0.635, 0.19), chair("silla5", 0.635, 0.29), chair("silla6", 0.545, 0.335),
    it("cocina", "Cocina integral", "Cubierta de mármol con parrilla y tarja.", 0.935, 0.335, 0.085, 0.45, 0.9, MARBLE, { block: true }),
    it("parrilla", "Parrilla", "Parrilla de gas de cuatro quemadores.", 0.93, 0.255, 0.05, 0.09, 0.92, DARK, { part: true }),
    it("tarja", "Tarja", "Tarja doble de acero inoxidable.", 0.925, 0.435, 0.07, 0.12, 0.92, "#9a9a9a", { part: true }),
    it("alacena", "Alacena", "Mueble alto de guardado.", 0.935, 0.08, 0.09, 0.1, 1.9, MARBLE, { block: true }),
    it("cama", "Cama matrimonial", "Cama con tapete y burós a ambos lados.", 0.205, 0.75, 0.31, 0.2, 0.5, "#b8a994", { block: true }),
    it("buro1", "Buró", "Buró con lámpara.", 0.07, 0.62, 0.06, 0.06, 0.5, "#6e5035", { block: true }),
    it("buro2", "Buró", "Buró con lámpara.", 0.07, 0.905, 0.06, 0.06, 0.5, "#6e5035", { block: true }),
    it("closet", "Clóset", "Clóset empotrado de piso a techo.", 0.2, 0.5, 0.34, 0.075, 2.3, "#9c958a", { block: true }),
    it("sofa1", "Sofá en L", "Sofá seccional para toda la familia.", 0.6, 0.66, 0.13, 0.34, 0.8, "#9b8e7c", { block: true }),
    it("sofa2", "Sofá en L", "Sofá seccional para toda la familia.", 0.69, 0.84, 0.3, 0.12, 0.8, "#9b8e7c", { block: true, part: true }),
    it("mesa", "Mesa de centro", "Mesa redonda de centro con planta.", 0.8, 0.735, 0.12, 0.12, 0.4, "#6d6558", { round: true, block: true }),
    it("auxiliar", "Mesa auxiliar", "Mesa auxiliar junto al sofá.", 0.61, 0.485, 0.07, 0.07, 0.5, "#2f2f2f", { round: true }),
    it("tv", "Mueble de TV", "Mueble para televisión en la sala.", 0.955, 0.83, 0.045, 0.24, 0.55, "#5a4636", { block: true }),
  ],
  rooms: [
    { name: "Comedor", x: 0.5, y: 0.42 }, { name: "Cocina", x: 0.82, y: 0.33 }, { name: "Sala", x: 0.72, y: 0.6 },
    { name: "Recámara", x: 0.3, y: 0.6 }, { name: "Baño", x: 0.15, y: 0.33 }, { name: "Lavandería", x: 0.15, y: 0.1 },
  ],
  start: [0.5, 0.42],
};

const m5063: Layout = {
  id: "m5063",
  label: "Modelo 50.63 m² + terraza",
  widthM: 7.2,
  walls: [
    [0.04, 0.012, 0.96, 0.012], [0.04, 0.97, 0.96, 0.97], [0.04, 0.012, 0.04, 0.97], [0.96, 0.012, 0.96, 0.97],
    [0.04, 0.3, 0.38, 0.3], [0.56, 0.3, 0.96, 0.3], [0.04, 0.612, 0.44, 0.612], [0.205, 0.625, 0.205, 0.89],
  ],
  items: [
    it("mesa-t", "Mesa de terraza", "Comedor al aire libre para cuatro personas.", 0.775, 0.15, 0.17, 0.12, 0.75, WOOD, { round: true, block: true }),
    chair("silla-t1", 0.685, 0.07, 0.07), chair("silla-t2", 0.87, 0.07, 0.07), chair("silla-t3", 0.685, 0.21, 0.07), chair("silla-t4", 0.87, 0.21, 0.07),
    it("planta", "Planta", "Vegetación en la terraza.", 0.92, 0.235, 0.08, 0.06, 0.8, "#4d6b3c", { round: true }),
    it("cama", "Cama matrimonial", "Recámara con tapete, burós y luz natural.", 0.18, 0.455, 0.28, 0.2, 0.5, "#b8a994", { block: true }),
    it("buro1", "Buró", "Buró con lámpara.", 0.07, 0.345, 0.06, 0.07, 0.5, "#6e5035", { block: true }),
    it("buro2", "Buró", "Buró con lámpara.", 0.07, 0.565, 0.06, 0.07, 0.5, "#6e5035", { block: true }),
    it("muro-tv", "Muro de TV y vestidor", "Muro que separa la recámara y aloja la televisión.", 0.485, 0.435, 0.06, 0.27, 2.4, "#b9b2a6", { block: true }),
    it("comedor", "Comedor", "Mesa para seis personas.", 0.77, 0.49, 0.11, 0.24, 0.75, WOOD, { block: true }),
    chair("silla1", 0.69, 0.45, 0.05), chair("silla2", 0.69, 0.54, 0.05), chair("silla3", 0.85, 0.45, 0.05),
    chair("silla4", 0.85, 0.54, 0.05), chair("silla5", 0.77, 0.36, 0.05), chair("silla6", 0.77, 0.625, 0.05),
    it("cocina", "Cocina", "Barra de trabajo con alacenas y tarja.", 0.25, 0.775, 0.085, 0.27, 0.9, MARBLE, { block: true }),
    it("tarja", "Tarja", "Tarja de acero inoxidable.", 0.245, 0.86, 0.06, 0.07, 0.92, "#9a9a9a", { part: true }),
    it("isla", "Isla con parrilla", "Isla de mármol con parrilla y barra para desayunar.", 0.48, 0.8, 0.13, 0.3, 0.9, "#efe9df", { block: true }),
    it("parrilla", "Parrilla", "Parrilla integrada a la isla.", 0.47, 0.93, 0.08, 0.05, 0.92, "#222", { part: true }),
    it("taburete1", "Banquillo", "Banquillo para la barra.", 0.545, 0.775, 0.04, 0.04, 0.65, WOOD, { round: true, part: true }),
    it("taburete2", "Banquillo", "Banquillo para la barra.", 0.545, 0.825, 0.04, 0.04, 0.65, WOOD, { round: true, part: true }),
    it("inodoro", "Inodoro", "Baño completo.", 0.065, 0.725, 0.05, 0.05, 0.4, "#f4f4f2", { block: true }),
    it("lavabo", "Lavabo", "Lavabo con cubierta.", 0.06, 0.665, 0.06, 0.05, 0.85, WHITE, { block: true }),
    it("regadera", "Regadera", "Regadera con piso de mosaico.", 0.1, 0.8, 0.13, 0.12, 0.04, "#bfae94"),
    it("sofa1", "Sofá", "Sofá seccional con vista a la sala.", 0.89, 0.8, 0.1, 0.29, 0.8, "#9b8e7c", { block: true }),
    it("sofa2", "Sofá", "Sofá seccional con vista a la sala.", 0.78, 0.935, 0.18, 0.075, 0.8, "#9b8e7c", { block: true, part: true }),
    it("mesa", "Mesa de centro", "Mesa baja con libros decorativos.", 0.735, 0.8, 0.09, 0.11, 0.4, "#8a7a64", { block: true }),
  ],
  rooms: [
    { name: "Terraza", x: 0.45, y: 0.15 }, { name: "Recámara", x: 0.36, y: 0.45 }, { name: "Comedor", x: 0.6, y: 0.43 },
    { name: "Cocina", x: 0.36, y: 0.8 }, { name: "Sala", x: 0.63, y: 0.7 }, { name: "Baño", x: 0.12, y: 0.7 },
  ],
  start: [0.6, 0.66],
};

const m60: Layout = {
  id: "m60",
  label: "Modelo 60 m²",
  widthM: 6.3,
  walls: [
    [0.02, 0.01, 0.98, 0.01], [0.02, 0.99, 0.98, 0.99], [0.02, 0.01, 0.02, 0.99], [0.98, 0.01, 0.98, 0.99],
    [0.235, 0.01, 0.235, 0.16], [0.44, 0.01, 0.44, 0.16], [0.235, 0.16, 0.28, 0.16], [0.4, 0.16, 0.44, 0.16],
    [0.02, 0.52, 0.4, 0.52], [0.4, 0.52, 0.4, 0.6], [0.02, 0.665, 0.4, 0.665], [0.64, 0.665, 0.98, 0.665], [0.5, 0.665, 0.5, 0.99],
  ],
  items: [
    it("lavadora", "Lavadora", "Zona de lavado junto a la entrada.", 0.08, 0.05, 0.12, 0.09, 0.9, "#e8e8e6", { block: true }),
    it("inodoro-s", "Medio baño", "Medio baño para visitas.", 0.3, 0.045, 0.07, 0.06, 0.4, "#f4f4f2", { block: true }),
    it("lavabo-s", "Lavabo", "Lavabo del medio baño.", 0.285, 0.12, 0.08, 0.06, 0.85, WHITE, { block: true }),
    it("cocina", "Cocina integral", "Cubierta de mármol, tarja doble y alacenas de madera.", 0.045, 0.335, 0.075, 0.36, 0.9, MARBLE, { block: true }),
    it("isla", "Isla de cocina", "Isla de mármol con tarja y desayunador.", 0.35, 0.38, 0.15, 0.255, 0.9, "#efe9df", { block: true }),
    it("banquillo1", "Banquillo", "Banquillo del desayunador.", 0.435, 0.31, 0.04, 0.04, 0.65, DARK, { round: true, part: true }),
    it("banquillo2", "Banquillo", "Banquillo del desayunador.", 0.435, 0.385, 0.04, 0.04, 0.65, DARK, { round: true, part: true }),
    it("comedor", "Comedor", "Mesa para seis personas con tapete.", 0.69, 0.23, 0.15, 0.22, 0.75, WOOD, { block: true }),
    chair("silla1", 0.69, 0.1, 0.06), chair("silla2", 0.585, 0.19, 0.06), chair("silla3", 0.585, 0.285, 0.06),
    chair("silla4", 0.795, 0.19, 0.06), chair("silla5", 0.795, 0.285, 0.06), chair("silla6", 0.69, 0.36, 0.06),
    it("tv", "Mueble de TV", "Mueble para televisión.", 0.945, 0.23, 0.04, 0.16, 0.5, "#4a3a2c", { block: true }),
    it("sofa", "Sofá", "Sofá de tres plazas con cojines.", 0.915, 0.5, 0.11, 0.28, 0.8, "#9b8e7c", { block: true }),
    it("mesa", "Mesa de centro", "Mesa baja de centro.", 0.7, 0.52, 0.1, 0.16, 0.35, "#6f6f6f", { block: true }),
    it("inodoro", "Inodoro", "Baño completo.", 0.2, 0.6, 0.06, 0.07, 0.4, "#f4f4f2", { block: true }),
    it("lavabo", "Lavabo", "Lavabo sobre cubierta de mármol.", 0.31, 0.62, 0.12, 0.07, 0.85, WHITE, { block: true }),
    it("regadera", "Regadera", "Regadera con piso de mosaico.", 0.08, 0.59, 0.12, 0.12, 0.04, "#bfae94"),
    it("cama1", "Cama (recámara 1)", "Cama matrimonial con tapete y burós.", 0.195, 0.8, 0.33, 0.16, 0.5, "#b8a994", { block: true }),
    it("cama2", "Cama (recámara 2)", "Cama matrimonial con tapete y burós.", 0.775, 0.8, 0.33, 0.16, 0.5, "#b8a994", { block: true }),
    it("buro1", "Buró", "Buró con lámpara.", 0.065, 0.725, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro2", "Buró", "Buró con lámpara.", 0.065, 0.93, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro3", "Buró", "Buró con lámpara.", 0.935, 0.725, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro4", "Buró", "Buró con lámpara.", 0.935, 0.93, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("puf", "Puf", "Puf decorativo.", 0.42, 0.95, 0.09, 0.07, 0.4, "#b9ada0", { round: true }),
  ],
  rooms: [
    { name: "Cocina", x: 0.2, y: 0.4 }, { name: "Comedor", x: 0.55, y: 0.33 }, { name: "Sala", x: 0.76, y: 0.58 },
    { name: "Baño", x: 0.22, y: 0.56 }, { name: "Recámara 1", x: 0.43, y: 0.8 }, { name: "Recámara 2", x: 0.57, y: 0.8 },
  ],
  start: [0.55, 0.5],
};

const m6286: Layout = {
  id: "m6286",
  label: "Modelo 62.86 m²",
  widthM: 6.5,
  walls: [
    [0.025, 0.012, 0.955, 0.012], [0.025, 0.012, 0.025, 0.925], [0.955, 0.012, 0.955, 0.925],
    [0.025, 0.925, 0.14, 0.925], [0.43, 0.925, 0.52, 0.925], [0.8, 0.925, 0.955, 0.925],
    [0.025, 0.215, 0.09, 0.215], [0.36, 0.215, 0.8, 0.215], [0.6, 0.012, 0.6, 0.215], [0.8, 0.012, 0.8, 0.215],
    [0.025, 0.5, 0.36, 0.5], [0.36, 0.5, 0.36, 0.6], [0.025, 0.605, 0.36, 0.605], [0.6, 0.605, 0.955, 0.605], [0.485, 0.605, 0.485, 0.925],
  ],
  low: [
    [0.14, 0.985, 0.43, 0.985], [0.14, 0.925, 0.14, 0.985], [0.43, 0.925, 0.43, 0.985],
    [0.52, 0.985, 0.8, 0.985], [0.52, 0.925, 0.52, 0.985], [0.8, 0.925, 0.8, 0.985],
  ],
  items: [
    it("auto", "Cochera", "Cochera cubierta para un automóvil.", 0.22, 0.16, 0.24, 0.2, 1.4, "#c9c9c9", { block: true }),
    it("cocina", "Cocina integral", "Barra de mármol con tarja y alacenas de madera.", 0.065, 0.32, 0.08, 0.22, 0.9, MARBLE, { block: true }),
    it("isla", "Isla con parrilla", "Isla de mármol con parrilla y desayunador.", 0.27, 0.31, 0.13, 0.22, 0.9, "#efe9df", { block: true }),
    it("banquillo1", "Banquillo", "Banquillo del desayunador.", 0.345, 0.25, 0.035, 0.035, 0.65, DARK, { round: true, part: true }),
    it("banquillo2", "Banquillo", "Banquillo del desayunador.", 0.345, 0.31, 0.035, 0.035, 0.65, DARK, { round: true, part: true }),
    it("banquillo3", "Banquillo", "Banquillo del desayunador.", 0.345, 0.37, 0.035, 0.035, 0.65, DARK, { round: true, part: true }),
    it("refri", "Refrigerador", "Refrigerador de acero.", 0.07, 0.455, 0.09, 0.07, 1.8, "#bdbdbd", { block: true }),
    it("comedor", "Comedor", "Mesa de cristal para seis personas.", 0.56, 0.33, 0.22, 0.1, 0.75, "#b9c4c6", { block: true }),
    chair("silla1", 0.5, 0.275, 0.06), chair("silla2", 0.6, 0.275, 0.06), chair("silla3", 0.415, 0.33, 0.06),
    chair("silla4", 0.71, 0.33, 0.06), chair("silla5", 0.5, 0.39, 0.06), chair("silla6", 0.6, 0.39, 0.06),
    it("sofa", "Sofá", "Sofá de tres plazas con cojines.", 0.78, 0.555, 0.34, 0.09, 0.8, "#9b8e7c", { block: true }),
    it("mesa", "Mesa de centro", "Mesa redonda de centro.", 0.73, 0.45, 0.09, 0.07, 0.4, "#555", { round: true }),
    it("inodoro", "Inodoro", "Baño completo.", 0.2, 0.55, 0.05, 0.06, 0.4, "#f4f4f2", { block: true }),
    it("lavabo", "Lavabo", "Lavabo sobre cubierta.", 0.285, 0.555, 0.1, 0.05, 0.85, WHITE, { block: true }),
    it("regadera", "Regadera", "Regadera con piso de mosaico.", 0.075, 0.555, 0.12, 0.09, 0.04, "#bfae94"),
    it("inodoro-s", "Baño de servicio", "Baño completo con regadera junto a la cochera.", 0.665, 0.14, 0.06, 0.05, 0.4, "#f4f4f2", { block: true }),
    it("cama1", "Cama (recámara 1)", "Cama matrimonial con tapete y burós.", 0.18, 0.775, 0.26, 0.15, 0.5, "#b8a994", { block: true }),
    it("cama2", "Cama (recámara 2)", "Cama matrimonial con tapete y burós.", 0.78, 0.775, 0.26, 0.15, 0.5, "#b8a994", { block: true }),
    it("buro1", "Buró", "Buró con lámpara.", 0.065, 0.69, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro2", "Buró", "Buró con lámpara.", 0.065, 0.885, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro3", "Buró", "Buró con lámpara.", 0.915, 0.69, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("buro4", "Buró", "Buró con lámpara.", 0.915, 0.885, 0.055, 0.05, 0.5, "#6e5035", { block: true }),
    it("puf", "Puf", "Puf decorativo.", 0.41, 0.875, 0.09, 0.07, 0.4, "#b9ada0", { round: true }),
  ],
  rooms: [
    { name: "Cochera", x: 0.5, y: 0.1 }, { name: "Cocina", x: 0.17, y: 0.46 }, { name: "Comedor", x: 0.5, y: 0.47 },
    { name: "Sala", x: 0.68, y: 0.5 }, { name: "Baño", x: 0.2, y: 0.57 }, { name: "Recámara 1", x: 0.4, y: 0.76 },
    { name: "Recámara 2", x: 0.58, y: 0.76 },
  ],
  start: [0.55, 0.47],
};

const terraza: Layout = {
  id: "terraza",
  label: "Terraza en azotea",
  widthM: 12,
  walls: [[0.57, 0.012, 0.57, 0.245], [0.88, 0.012, 0.88, 0.245], [0.57, 0.245, 0.62, 0.245], [0.8, 0.245, 0.88, 0.245]],
  low: [[0.02, 0.012, 0.98, 0.012], [0.02, 0.985, 0.98, 0.985], [0.02, 0.012, 0.02, 0.985], [0.98, 0.012, 0.98, 0.985]],
  items: [
    it("sofa-l", "Sofá lounge", "Área de descanso con sofá y sillones.", 0.2, 0.085, 0.19, 0.075, 0.8, "#8a8a8a", { block: true }),
    it("sillon1", "Sillón", "Sillón individual.", 0.12, 0.23, 0.07, 0.09, 0.75, "#8a8a8a", { block: true }),
    it("sillon2", "Sillón", "Sillón individual.", 0.33, 0.23, 0.07, 0.09, 0.75, "#8a8a8a", { block: true }),
    it("mesa-l", "Mesa lounge", "Mesa baja de centro.", 0.22, 0.2, 0.06, 0.06, 0.4, WOOD, { round: true }),
    it("mesa1", "Mesa comedor exterior", "Mesa redonda para cuatro personas.", 0.255, 0.465, 0.11, 0.11, 0.75, WOOD, { round: true, block: true }),
    chair("c1a", 0.2, 0.41, 0.05), chair("c1b", 0.31, 0.41, 0.05), chair("c1c", 0.2, 0.52, 0.05), chair("c1d", 0.31, 0.52, 0.05),
    it("mesa2", "Mesa comedor exterior", "Mesa redonda para cuatro personas.", 0.255, 0.8, 0.11, 0.11, 0.75, WOOD, { round: true, block: true }),
    chair("c2a", 0.2, 0.745, 0.05), chair("c2b", 0.31, 0.745, 0.05), chair("c2c", 0.2, 0.855, 0.05), chair("c2d", 0.31, 0.855, 0.05),
    it("asador", "Asador y tarja", "Barra con tarja y asador de carbón para reuniones.", 0.06, 0.57, 0.075, 0.29, 0.9, "#c9c9c9", { block: true }),
    it("sanit1", "Baños", "Baños con cubículos y lavabos para la terraza.", 0.735, 0.06, 0.045, 0.05, 0.4, "#f4f4f2", { block: true }),
    it("sanit2", "Baños", "Baños con cubículos y lavabos para la terraza.", 0.815, 0.06, 0.045, 0.05, 0.4, "#f4f4f2", { block: true, part: true }),
    it("lavabos", "Lavabos", "Lavabos de los baños de la terraza.", 0.75, 0.185, 0.2, 0.045, 0.9, MARBLE, { block: true, part: true }),
    it("sofa2", "Sala exterior", "Sofá y sillón con tapete frente a una mesa baja.", 0.82, 0.885, 0.22, 0.065, 0.8, "#8a8a8a", { block: true }),
    it("sillon3", "Sala exterior", "Sofá y sillón con tapete frente a una mesa baja.", 0.68, 0.835, 0.055, 0.075, 0.75, "#8a8a8a", { block: true, part: true }),
    it("mesa3", "Mesa baja", "Mesa baja de la sala exterior.", 0.8, 0.8, 0.07, 0.07, 0.4, WOOD, { round: true }),
    it("tina", "Tina", "Tina de baño al aire libre.", 0.955, 0.64, 0.07, 0.17, 0.6, "#d8d8d8", { block: true }),
  ],
  rooms: [
    { name: "Sala lounge", x: 0.22, y: 0.31 }, { name: "Comedor exterior", x: 0.4, y: 0.55 }, { name: "Asador", x: 0.16, y: 0.57 },
    { name: "Baños", x: 0.72, y: 0.33 }, { name: "Sala exterior", x: 0.72, y: 0.7 },
  ],
  start: [0.5, 0.5],
};

export const LAYOUTS: Record<string, Layout> = { m46, m5063, m60, m6286, terraza };

export const LAYOUT_OPTIONS: { id: string; label: string }[] = [
  { id: "", label: "Sin entorno 3D" },
  ...Object.values(LAYOUTS).map((l) => ({ id: l.id, label: l.label })),
];
