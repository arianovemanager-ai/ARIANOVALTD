import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-03-21',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false
})

const testEvents = [
  {
    title: "Exclusive Vineyard Tour & Tasting",
    slug: "exclusive-vineyard-tour-and-tasting",
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
    location: "The Main Cellar Door",
    price: 15000, // $150.00
    stock: 12,
    images: [],
    notes: "Join us for an intimate walk through the vines followed by a guided vertical tasting of our most prized vintages. A deep dive into the terroir that defines Arianova."
  },
  {
    title: "Michelin Chef Collaboration Dinner",
    slug: "michelin-chef-collaboration-dinner",
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    location: "The Estate Dining Room",
    price: 35000, // $350.00
    stock: 20,
    images: [],
    notes: "A breathtaking six-course pairing menu crafted by Chef Marco Rossi, designed specifically to highlight the nuanced flavor profiles of our upcoming library releases."
  },
  {
    title: "En Primeur Barrel Tasting",
    slug: "en-primeur-barrel-tasting",
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    location: "The Inner Sanctum",
    price: 0, // Complimentary
    stock: 8,
    images: [],
    notes: "An exclusive, complimentary preview for our most valued collectors. Taste the future of Arianova straight from the barrel before the wine is bottled."
  }
]

async function seed() {
  console.log("🎫 Initiating Arianova Events Seeding...");

  for (const event of testEvents) {
    const doc = {
      _type: 'event',
      title: event.title,
      slug: {
        _type: 'slug',
        current: event.slug
      },
      date: event.date,
      location: event.location,
      price: event.price,
      description: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: event.notes,
              marks: []
            }
          ],
          markDefs: [],
          style: 'normal'
        }
      ],
      physical_stock: event.stock,
      committed_stock: 0,
    }
    
    await client.create(doc)
    console.log(`✅ Secured Event: ${event.title} (Capacity: ${event.stock}, Price: $${event.price / 100})`);
  }

  console.log("\n=====================\n");
  console.log("🍷 SEEDING COMPLETE. View them at:")
  console.log("- http://localhost:3000/events")
  console.log("\n=====================\n");
}

seed().catch(console.error)
