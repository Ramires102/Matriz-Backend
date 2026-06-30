import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Usuarios ──
  const hash = await bcrypt.hash("123456", 10);

  const admin = await prisma.user.upsert({
    where: { user: "admin" },
    update: {},
    create: {
      user: "admin",
      name: "Admin Meeter",
      email: "admin@meeter.com",
      password: hash,
      role: "ADMIN",
      verified: true,
    },
  });

  const organizador = await prisma.user.upsert({
    where: { user: "organizador" },
    update: {},
    create: {
      user: "organizador",
      name: "Nico Fernández",
      email: "nico@meeter.com",
      password: hash,
      role: "ORGANIZATOR",
      verified: true,
    },
  });

  const consumidor = await prisma.user.upsert({
    where: { user: "consumidor" },
    update: {},
    create: {
      user: "consumidor",
      name: "Estefanía Paz",
      email: "estefania@meeter.com",
      password: hash,
      role: "CONSUMER",
      verified: true,
    },
  });

  // ── Categorías de Eventos ──
  const catData = [
    "Techno", "Jazz", "Arte", "Pop", "Electrónica", "Indie", "Ambient", "Rock", "House", "Festival",
  ];
  const categories = await Promise.all(
    catData.map(name =>
      prisma.eventCategories.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]));

  // ── Eventos ──
  const eventsData = [
    { name: "Eclipse Underground", desc: "Un viaje sonoro por los subsuelos de la ciudad.", date: "2026-06-21T23:00:00.000Z", loc: "Córdoba", price: 3500, cat: "Techno", open: true },
    { name: "Blue Note Mendoza", desc: "Noche de jazz en vivo con músicos locales.", date: "2026-06-22T21:00:00.000Z", loc: "Mendoza", price: 0, cat: "Jazz", open: true },
    { name: "Galería Nocturna", desc: "Exposición inmersiva de arte digital.", date: "2026-06-23T22:00:00.000Z", loc: "Rosario", price: 1200, cat: "Arte", open: true },
    { name: "Deep Horizon", desc: "Deep house y minimal techno en un espacio exclusivo.", date: "2026-06-27T23:30:00.000Z", loc: "Buenos Aires", price: 5000, cat: "House", open: true },
    { name: "Verano Eterno", desc: "Festival al aire libre frente al mar.", date: "2026-06-28T20:00:00.000Z", loc: "Mar del Plata", price: 0, cat: "Pop", open: true },
    { name: "Amber Sessions", desc: "Sesiones íntimas de música electrónica.", date: "2026-06-29T22:00:00.000Z", loc: "Tucumán", price: 2800, cat: "Electrónica", open: true },
    { name: "Sonido Libre", desc: "Bandas emergentes en formato acústico.", date: "2026-06-26T19:00:00.000Z", loc: "Salta", price: 0, cat: "Indie", open: true },
    { name: "Pulse 2025", desc: "El festival de electrónica más esperado del año.", date: "2026-06-20T22:00:00.000Z", loc: "Buenos Aires", price: 8000, cat: "Electrónica", open: true },
    { name: "Marea Profunda", desc: "Atmósferas sonoras relajantes frente al lago.", date: "2026-06-24T18:00:00.000Z", loc: "Bariloche", price: 0, cat: "Ambient", open: true },
  ];

  for (const ev of eventsData) {
    const catId = catMap[ev.cat];
    if (catId === undefined) throw new Error(`Category ${ev.cat} not found`);
    await prisma.events.create({
      data: {
        userFK: organizador.id,
        name: ev.name,
        description: ev.desc,
        initDate: new Date(ev.date),
        location: ev.loc,
        categoryFK: catId,
        ticketPrice: ev.price,
        open: ev.open,
        image: "https://undefined.com",
      },
    });
  }
}

main()
  .then(() => { console.log("Seed OK"); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
