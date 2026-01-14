export interface PoliceStationResult {
  name: string
  address?: string
  lat: number
  lon: number
}

// 1️⃣ Address → Lat/Lng (Nominatim)
export async function geocodeAddressOSM(address: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
    {
      headers: {
        "User-Agent": "FIR-Chatbot/1.0 (contact@example.com)",
      },
    }
  )

  const data = await res.json()
  if (!data?.length) return null

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  }
}

// 2️⃣ Find nearest police station (Overpass)
export async function findNearestPoliceStationOSM(lat: number, lon: number): Promise<PoliceStationResult | null> {
  const query = `
    [out:json];
    (
      node["amenity"="police"](around:5000,${lat},${lon});
      way["amenity"="police"](around:5000,${lat},${lon});
      relation["amenity"="police"](around:5000,${lat},${lon});
    );
    out center tags 1;
  `

  const res = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query,
    headers: {
      "Content-Type": "text/plain",
    },
  })

  const data = await res.json()
  if (!data.elements?.length) return null

  const el = data.elements[0]

  return {
    name: el.tags?.name || "Nearest Police Station",
    address: el.tags?.["addr:full"],
    lat: el.lat || el.center?.lat,
    lon: el.lon || el.center?.lon,
  }
}
