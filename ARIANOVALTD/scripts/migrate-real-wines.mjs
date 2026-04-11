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

const realWines = [
  { title: "Sant’Anselmo Rosato 2025 IGT Terre Siciliane", slug: "sant-anselmo-rosato-2025", sku: "SIC-ROS-2025", stock: 978, price: 45000 },
  { title: "Sant’Anselmo Grillo 2025 DOC Sicilia", slug: "sant-anselmo-grillo-2025", sku: "SIC-GRI-2025", stock: 504, price: 45000 },
  { title: "L’Aromatico (Zibibbo / Sauvignon Blanc) 2025 IGT Terre Siciliane", slug: "laromatico-2025", sku: "SIC-ARO-2025", stock: 504, price: 45000 },
  { title: "Al Mio Amico Inzolia – Chardonnay 2024 IGT Terre Siciliane", slug: "al-mio-amico-2024", sku: "SIC-MIO-2024", stock: 504, price: 45000 },
  { title: "Silvia – Spumante Extra Brut", slug: "silvia-spumante", sku: "VEN-SIL-SPU", stock: 300, price: 45000 },
  { title: "Sole Blu – Frizzante Veneto IGT", slug: "sole-blu-frizzante", sku: "VEN-SOL-FRI", stock: 150, price: 45000 },
  { title: "Vespaiolo DOC 2024", slug: "vespaiolo-doc-2024", sku: "VEN-VES-2024", stock: 198, price: 45000 },
  { title: "Luna Santa – Vespaiolo / Chardonnay IGT Veneto 2022", slug: "luna-santa-2022", sku: "VEN-LUN-2022", stock: 102, price: 45000 },
  { title: "Manzoni Bianco Veneto IGT 2024", slug: "manzoni-bianco-2024", sku: "VEN-MAN-2024", stock: 204, price: 45000 },
  { title: "Giulia – Rosso Veneto IGT 2020", slug: "giulia-rosso-2020", sku: "VEN-GIU-2020", stock: 300, price: 45000 },
  { title: "Maria – Rosso Breganze DOC 2020", slug: "maria-rosso-2020", sku: "VEN-MAR-2020", stock: 300, price: 45000 },
]

const genericTastingNote = "A brilliant expression of the terroir, meticulously crafted to showcase the finest characteristics of the grape. Balanced, vibrant, and elegant on the palate."

async function runMigration() {
  console.log("📸 Phase 1: Harvesting legacy images...")
  const legacyWines = await client.fetch('*[_type == "wine"]{_id, images}')
  const imageCollections = legacyWines.map(w => w.images).filter(i => i !== null && i !== undefined)
  console.log(`[OK] Harvested ${imageCollections.length} image arrays.`)

  console.log("\n🗑️ Phase 2: Purging mock data AND associated transactions...")
  const tx = client.transaction()
  
  // Wipe transactions to clear references
  const oldRecords = await client.fetch('*[_type in ["order", "orderItem", "sessionRecord", "wine"]]{_id}')
  for (const record of oldRecords) {
    tx.delete(record._id)
  }
  
  await tx.commit()
  console.log(`[OK] Safely deleted ${oldRecords.length} old documents (Wines, Orders, Sessions).`)

  console.log("\n🌱 Phase 3: Seeding real data with recycled imagery...")
  for (let i = 0; i < realWines.length; i++) {
    const wine = realWines[i]
    // Cyclically assign images if we have fewer images than real wines
    const imagesToAssign = imageCollections.length > 0 ? imageCollections[i % imageCollections.length] : []

    const doc = {
      _type: 'wine',
      title: wine.title,
      slug: {
        _type: 'slug',
        current: wine.slug
      },
      sku: wine.sku,
      price: wine.price,
      images: imagesToAssign,
      tastingNotes: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: genericTastingNote, marks: [] }],
          markDefs: [],
          style: 'normal'
        }
      ],
      physical_stock: wine.stock,
      committed_stock: 0,
      low_stock_alert: 12
    }

    await client.create(doc)
    console.log(`✅ Seeded: ${wine.title} (Stock: ${wine.stock})`)
  }

  console.log("\n✅ ALL WINES MIGRATED SUCCESSFULLY!")
}

runMigration().catch(console.error)
