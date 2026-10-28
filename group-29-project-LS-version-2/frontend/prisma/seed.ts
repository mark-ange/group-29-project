// This seed resets development data and must never run in production.
import "dotenv/config";

import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import bcrypt from "bcryptjs";

import { db } from "../src/lib/db";
import { UserRoleSchema } from "../src/lib/constants";

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed: prisma/seed.ts must never run in production.");
}

function requireSeedPassword(value: string | undefined, variableName: string): string {
  if (!value) {
    throw new Error(`Missing ${variableName}. Set it before running npm run seed.`);
  }
  return value;
}

const adminPassword = requireSeedPassword(process.env.SEED_ADMIN_PASSWORD, "SEED_ADMIN_PASSWORD");
const guestPassword = requireSeedPassword(process.env.SEED_GUEST_PASSWORD, "SEED_GUEST_PASSWORD");

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const propertiesRoot = path.join(projectRoot, "public", "properties");
const imageExtensions = new Set([".avif", ".gif", ".ico", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);

type PropertySeed = {
  slug: string;
  title: string;
  description: string;
  city: string;
  country: string;
  pricePerNight: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  published: boolean;
};

const properties: PropertySeed[] = [
  { slug: "alfama-sunroom", title: "Alfama Sunroom House", description: "A tiled townhouse above Alfama's quiet lanes pairs soft linen interiors with a rooftop breakfast table. Late-afternoon light fills the reading room while the Tagus shimmers beyond the chimneys.", city: "Lisbon", country: "Portugal", pricePerNight: 185, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ["Rooftop terrace", "Air conditioning", "Washer", "Fast Wi-Fi"], published: true },
  { slug: "graca-atlas-flat", title: "Graça Atlas Flat", description: "This calm hilltop apartment is framed by hand-painted plaster, deep window seats, and a compact cook's kitchen. A private balcony looks across Lisbon's layered rooftops toward the castle.", city: "Lisbon", country: "Portugal", pricePerNight: 142, maxGuests: 3, bedrooms: 1, bathrooms: 1, amenities: ["Balcony", "Espresso maker", "Elevator", "Fast Wi-Fi", "Heating"], published: true },
  { slug: "belem-river-studio", title: "Belém River Studio", description: "A bright studio near the river has custom oak storage and a generous marble shower. Its leafy street makes an easy base for museum mornings and long walks by the water.", city: "Lisbon", country: "Portugal", pricePerNight: 118, maxGuests: 2, bedrooms: 1, bathrooms: 1, amenities: ["Rain shower", "Kitchenette", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "estrela-courtyard-home", title: "Estrela Courtyard Home", description: "Set behind a blue-painted gate, this family home opens onto a citrus courtyard with an outdoor dining table. Portuguese stone, playful art, and a relaxed library set the tone for slow evenings.", city: "Lisbon", country: "Portugal", pricePerNight: 255, maxGuests: 6, bedrooms: 3, bathrooms: 2, amenities: ["Private courtyard", "Dishwasher", "Crib", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "campo-de-ourique-loft", title: "Campo de Ourique Loft", description: "This airy top-floor loft sits a few peaceful blocks from the neighborhood market. Skylights, pale wood, and an oversized soaking tub give it a simple, restorative feel.", city: "Lisbon", country: "Portugal", pricePerNight: 165, maxGuests: 4, bedrooms: 2, bathrooms: 1, amenities: ["Soaking tub", "Skylights", "Washer", "Fast Wi-Fi", "Air conditioning"], published: true },
  { slug: "sayan-ridge-villa", title: "Sayan Ridge Villa", description: "A secluded villa on a green ridge makes room for open-air meals and views of the jungle canopy. Its long pool and shaded daybeds are designed for unhurried afternoons.", city: "Bali", country: "Indonesia", pricePerNight: 320, maxGuests: 6, bedrooms: 3, bathrooms: 3, amenities: ["Private pool", "Daily housekeeping", "Outdoor dining", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "canggu-tide-house", title: "Canggu Tide House", description: "Concrete, teak, and broad sliding doors shape this easygoing coastal home. The saltwater pool catches the morning sun, and a quiet work nook stays cool between beach plans.", city: "Bali", country: "Indonesia", pricePerNight: 275, maxGuests: 5, bedrooms: 2, bathrooms: 2, amenities: ["Saltwater pool", "Work desk", "Scooter parking", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "ubud-canopy-retreat", title: "Ubud Canopy Retreat", description: "This elevated retreat overlooks a small ravine of palms and bamboo. A stone soaking pool, linen canopy beds, and an open kitchen keep the mood grounded and quiet.", city: "Bali", country: "Indonesia", pricePerNight: 230, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ["Plunge pool", "Yoga deck", "Filtered water", "Ceiling fans", "Fast Wi-Fi"], published: true },
  { slug: "sanur-garden-pavilion", title: "Sanur Garden Pavilion", description: "A short cycle from the shore, this pavilion is wrapped by frangipani and a small private garden. Its covered veranda is equally suited to tropical breakfasts or an afternoon massage.", city: "Bali", country: "Indonesia", pricePerNight: 195, maxGuests: 3, bedrooms: 1, bathrooms: 1, amenities: ["Garden", "Bicycles", "Massage table", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "pererenan-clay-house", title: "Pererenan Clay House", description: "Rounded clay walls and woven details give this new home a warm, handmade character. Floor-to-ceiling doors lead to a compact pool and a garden that feels private after sunset.", city: "Bali", country: "Indonesia", pricePerNight: 340, maxGuests: 8, bedrooms: 4, bathrooms: 4, amenities: ["Private pool", "Chef kitchen", "Outdoor shower", "Air conditioning", "Fast Wi-Fi", "Parking"], published: true },
  { slug: "gion-paper-lantern-house", title: "Gion Paper Lantern House", description: "A restored machiya balances cedar joinery, soft paper screens, and modern floor heating. The intimate garden catches the sound of rain, while Gion's narrow lanes begin just outside.", city: "Kyoto", country: "Japan", pricePerNight: 410, maxGuests: 5, bedrooms: 2, bathrooms: 2, amenities: ["Private garden", "Floor heating", "Tea set", "Washer", "Fast Wi-Fi"], published: true },
  { slug: "arashiyama-moon-cottage", title: "Arashiyama Moon Cottage", description: "This cedar cottage sits near a quiet bamboo-lined path on Kyoto's western edge. A deep hinoki bath and low window bench invite guests to slow down after a day of walking.", city: "Kyoto", country: "Japan", pricePerNight: 365, maxGuests: 4, bedrooms: 2, bathrooms: 1, amenities: ["Hinoki bath", "Garden view", "Kitchen", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "okazaki-gallery-flat", title: "Okazaki Gallery Flat", description: "An artful apartment with polished concrete floors overlooks a calm canal-side neighborhood. Thoughtful lighting and a record player make the open living room especially inviting at night.", city: "Kyoto", country: "Japan", pricePerNight: 210, maxGuests: 3, bedrooms: 1, bathrooms: 1, amenities: ["Record player", "Canal view", "Elevator", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "fushimi-sake-district-home", title: "Fushimi Sake District Home", description: "Behind its traditional façade, this spacious house has a sunlit dining room and a private courtyard. Local cedar, handmade ceramics, and a generous kitchen give groups plenty of room to settle in.", city: "Kyoto", country: "Japan", pricePerNight: 290, maxGuests: 7, bedrooms: 3, bathrooms: 2, amenities: ["Courtyard", "Full kitchen", "Dining for eight", "Washer", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "kurama-cedar-lodge", title: "Kurama Cedar Lodge", description: "A contemporary mountain lodge brings clean lines to a stand of old cedars north of the city. The wood-fired stove and soaking bath make it a lovely place for a private Kyoto escape.", city: "Kyoto", country: "Japan", pricePerNight: 445, maxGuests: 6, bedrooms: 3, bathrooms: 2, amenities: ["Wood stove", "Soaking bath", "Mountain deck", "Parking", "Fast Wi-Fi"], published: false },
  { slug: "bo-kaap-color-house", title: "Bo-Kaap Color House", description: "A cheerful heritage home pairs a bright facade with carefully restored woodwork inside. From the upper terrace, Table Mountain and the city lights feel close enough to touch.", city: "Cape Town", country: "South Africa", pricePerNight: 175, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ["Roof terrace", "Table Mountain view", "Washer", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "clifton-tide-apartment", title: "Clifton Tide Apartment", description: "This restrained beach apartment opens straight toward the Atlantic with walls of glass and salty air. A shaded terrace gives couples a private perch for long lunches after the sand.", city: "Cape Town", country: "South Africa", pricePerNight: 390, maxGuests: 4, bedrooms: 2, bathrooms: 2, amenities: ["Ocean terrace", "Beach gear", "Secure parking", "Air conditioning", "Fast Wi-Fi"], published: true },
  { slug: "tamboerskloof-stone-cottage", title: "Tamboerskloof Stone Cottage", description: "Tucked beneath Lion's Head, this stone cottage has a sunny plunge pool and a garden edged with indigenous plants. The fireplace and ample kitchen make it equally comfortable in cooler months.", city: "Cape Town", country: "South Africa", pricePerNight: 225, maxGuests: 5, bedrooms: 2, bathrooms: 2, amenities: ["Plunge pool", "Fireplace", "Garden", "Full kitchen", "Fast Wi-Fi"], published: true },
  { slug: "muizenberg-surf-house", title: "Muizenberg Surf House", description: "A relaxed, light-filled house is a quick walk from the colorful surf huts and gentle waves. Boards, a rinse-off courtyard, and a deep sectional make it made for easy group weekends.", city: "Cape Town", country: "South Africa", pricePerNight: 205, maxGuests: 6, bedrooms: 3, bathrooms: 2, amenities: ["Surfboard storage", "Outdoor shower", "BBQ", "Washer", "Fast Wi-Fi"], published: true },
  { slug: "constantia-vineyard-cottage", title: "Constantia Vineyard Cottage", description: "A peaceful cottage beside old vines combines contemporary comfort with wide valley views. It has a long farmhouse table, a small pool, and quiet corners for reading between tastings.", city: "Cape Town", country: "South Africa", pricePerNight: 310, maxGuests: 6, bedrooms: 3, bathrooms: 3, amenities: ["Small pool", "Vineyard view", "Fireplace", "Outdoor dining", "Fast Wi-Fi"], published: false },
];

async function createImages(propertyId: string, slug: string, title: string) {
  const directory = path.join(propertiesRoot, slug);
  await mkdir(directory, { recursive: true });
  const entries = await readdir(directory, { withFileTypes: true });
  const imageNames = entries.filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase())).map((entry) => entry.name).sort((left, right) => left.localeCompare(right));
  if (imageNames.length) {
    await db.propertyImage.createMany({ data: imageNames.map((fileName, sortOrder) => ({ propertyId, url: `/properties/${slug}/${fileName}`, alt: `${title} — ${path.parse(fileName).name}`, kind: fileName.toLowerCase().startsWith("3d-") ? "RENDER_3D" : "PHOTO", sortOrder })) });
  }
  return entries.some((entry) => entry.isFile() && entry.name.toLowerCase() === "model.glb") ? `/properties/${slug}/model.glb` : null;
}

async function main() {
  const [adminHash, guestHash] = await Promise.all([bcrypt.hash(adminPassword, 12), bcrypt.hash(guestPassword, 12)]);
  await db.$transaction([db.propertyImage.deleteMany(), db.review.deleteMany(), db.booking.deleteMany(), db.property.deleteMany(), db.user.deleteMany()]);
  const admin = await db.user.create({ data: { email: "admin@example.com", name: "Example Admin", passwordHash: adminHash, role: UserRoleSchema.parse("ADMIN") } });
  const guest = await db.user.create({ data: { email: "guest@example.com", name: "Example Guest", passwordHash: guestHash, role: UserRoleSchema.parse("GUEST") } });
  const propertyIds = new Map<string, string>();
  for (const property of properties) {
    const created = await db.property.create({ data: { ...property, amenities: property.amenities.join(", "), ownerId: admin.id } });
    const model3dUrl = await createImages(created.id, property.slug, property.title);
    if (model3dUrl) await db.property.update({ where: { id: created.id }, data: { model3dUrl } });
    propertyIds.set(property.slug, created.id);
  }
  const reviews = [
    ["alfama-sunroom", 5, "The rooftop light made every breakfast feel special."], ["alfama-sunroom", 5, "A wonderfully calm base for exploring the old city."], ["graca-atlas-flat", 4, "Beautiful view and an easy walk to cafés."],
    ["sayan-ridge-villa", 5, "The pool and jungle sounds made this a memorable stay."], ["sayan-ridge-villa", 5, "Everything felt private, considered, and peaceful."], ["ubud-canopy-retreat", 5, "We loved the quiet setting and the deep soaking pool."],
    ["gion-paper-lantern-house", 5, "A lovely balance of traditional character and comfort."], ["okazaki-gallery-flat", 4, "The canal setting was serene and the apartment was spotless."], ["fushimi-sake-district-home", 5, "Our group had plenty of room to cook and unwind."],
    ["bo-kaap-color-house", 5, "The terrace view at dusk was even better than expected."], ["clifton-tide-apartment", 5, "An exceptional beach escape with a very comfortable terrace."], ["tamboerskloof-stone-cottage", 4, "Warm, quiet, and perfectly placed for mountain walks."],
    ["muizenberg-surf-house", 5, "A relaxed home with everything we needed after surfing."], ["muizenberg-surf-house", 5, "The courtyard and board storage were incredibly handy."],
  ] as const;
  await db.review.createMany({ data: reviews.map(([slug, rating, comment]) => ({ propertyId: propertyIds.get(slug)!, userId: guest.id, rating, comment })) });
  const published = await db.property.count({ where: { published: true } });
  console.log(`Seeded ${properties.length} properties (${published} published) and ${reviews.length} reviews.`);
}

main().catch((error: unknown) => { console.error(error); process.exitCode = 1; }).finally(() => db.$disconnect());
