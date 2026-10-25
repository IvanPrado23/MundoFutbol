import type { Banner, Category, StoreSettings, Team } from "./types";

export const ADMIN_EMAILS = ["pradoblancop@gmail.com", "adrianapradob@hotmail.com"];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "retro", slug: "retro", name: "Camisetas Retro", image: "/seed/products/retro-real-madrid-02.webp", description: "Las camisetas que hicieron historia.", order: 0 },
  { id: "mundialistas", slug: "mundialistas", name: "Mundialistas", image: "/seed/products/mundialistas-general-01.webp", description: "Viste los colores de tu selección.", order: 1 },
  { id: "internacionales", slug: "internacionales", name: "Internacionales 1:1", image: "/seed/products/internacionales-general-05.webp", description: "Tipo jugador, calidad 1:1.", order: 2 },
  { id: "liga-colombiana", slug: "liga-colombiana", name: "Liga Colombiana", image: "/seed/products/liga-colombiana-general-01.webp", description: "La pasión del fútbol colombiano.", order: 3 },
  { id: "conjuntos-polo", slug: "conjuntos-polo", name: "Conjuntos tipo Polo", image: "/seed/products/conjuntos-polo-general-01.webp", description: "Elegancia con tu equipo.", order: 4 },
  { id: "sudaderas-ninos", slug: "sudaderas-ninos", name: "Sudaderas Niños", image: "/seed/products/sudaderas-ninos-general-01.webp", description: "Para los futuros cracks.", order: 5 },
  { id: "uniformes-futbol", slug: "uniformes-futbol", name: "Uniformes de Fútbol", image: "/seed/products/uniformes-futbol-general-01.webp", description: "Uniformes completos para tu equipo.", order: 6 },
  { id: "uniformes-ninos", slug: "uniformes-ninos", name: "Uniformes Niños", image: "/seed/products/uniformes-ninos-general-01.webp", description: "Camiseta y pantaloneta para niños.", order: 7 },
];

const teamNames = [
  "Real Madrid", "Barcelona", "AC Milan", "Liverpool", "Manchester United", "Manchester City",
  "Arsenal", "Chelsea", "Bayern Múnich", "PSG", "Juventus", "Inter de Milán", "Inter Miami",
  "Al-Nassr", "Tottenham Hotspur", "Boca Juniors", "River Plate", "Selección Colombia",
  "Argentina", "Brasil", "España", "Alemania", "Francia", "Italia",
  "Millonarios", "Santa Fe", "Atlético Nacional", "América de Cali", "Junior",
  "Independiente Medellín", "Deportivo Cali",
];

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const DEFAULT_TEAMS: Team[] = teamNames.map((name, i) => ({
  id: slugify(name),
  slug: slugify(name),
  name,
  order: i,
}));

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: "banner-1",
    image: "/banners/banner-retro-ronaldinho.png",
    title: "Leyendas que hicieron historia",
    subtitle: "Camisetas retro de los clubes y figuras más grandes del fútbol mundial.",
    link: "/categoria/retro",
    buttonText: "Ver Colección Retro",
    active: true,
    order: 0,
  },
  {
    id: "banner-2",
    image: "/banners/banner-inter-messi-miami.png",
    title: "Calidad 1:1 tipo jugador",
    subtitle: "La misma tecnología y acabados premium que visten las estrellas.",
    link: "/categoria/internacionales",
    buttonText: "Explorar Internacionales",
    active: true,
    order: 1,
  },
  {
    id: "banner-3",
    image: "/banners/banner-colombia-millonarios-azul.png",
    title: "Pasión del fútbol colombiano",
    subtitle: "Viste los colores de tu equipo de la Liga Colombiana, también para mujer.",
    link: "/categoria/liga-colombiana",
    buttonText: "Ver Liga Colombiana",
    active: true,
    order: 2,
  },
  {
    id: "banner-4",
    image: "/banners/banner-inter-barca-mamba.png",
    title: "Ediciones especiales exclusivas",
    subtitle: "Diseños de colección y colaboraciones únicas con estampado oficial.",
    link: "/catalogo",
    buttonText: "Ver Todo el Catálogo",
    active: true,
    order: 3,
  },
];

export const DEFAULT_SETTINGS: StoreSettings = {
  whatsapp: "573213831679",
  socials: {
    instagram: "https://www.instagram.com/mundo_futbol6893",
    tiktok: "https://www.tiktok.com/@mundo.ftbol822",
    facebook: "",
  },
  about:
    "En J&A Mundo Fútbol vivimos el fútbol tanto como tú. Somos una tienda colombiana dedicada a traerte las mejores camisetas de clubes y selecciones: retro, mundialistas, tipo jugador 1:1, liga colombiana y mucho más.\n\nNuestro objetivo es que lleves tu pasión puesta, con prendas de excelente calidad y una atención cercana y personalizada por WhatsApp.",
  shipping:
    "Realizamos envíos a todo Colombia a través de transportadoras aliadas.\n\n• Tiempo de entrega estimado: 2 a 5 días hábiles según la ciudad.\n• El costo del envío se confirma por WhatsApp según tu ubicación.\n• Recibirás la guía de seguimiento una vez despachado tu pedido.",
  payments:
    "• Transferencia bancaria / Nequi / Daviplata.\n• Pago contraentrega (sujeto a cobertura).\n• Los datos de pago se envían por WhatsApp al confirmar el pedido.",
  faq: [
    { q: "¿Cómo hago un pedido?", a: "Agrega los productos que te gusten al carrito, completa tus datos y presiona “Enviar pedido por WhatsApp”. Te responderemos para confirmar disponibilidad, envío y pago." },
    { q: "¿Qué significa calidad 1:1 / tipo jugador?", a: "Son camisetas con la misma tecnología, materiales y detalles que usan los jugadores profesionales en la cancha." },
    { q: "¿Puedo personalizar mi camiseta?", a: "Sí. En los productos que lo permiten puedes agregar nombre y número por un valor adicional." },
    { q: "¿Hacen envíos a todo el país?", a: "Sí, enviamos a toda Colombia. El costo depende de la ciudad de destino." },
    { q: "¿Puedo cambiar la talla?", a: "Sí, aceptamos cambios por talla dentro de los 5 días siguientes a la entrega, siempre que la prenda esté sin uso y con etiquetas." },
  ],
  sizeGuide:
    "Talla | Ancho (cm) | Largo (cm)\nS | 48 | 69\nM | 51 | 71\nL | 54 | 73\nXL | 57 | 75\nXXL | 60 | 77",
  customizationDefault: 25000,
};
