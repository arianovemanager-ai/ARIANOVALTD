import { groq } from "next-sanity";

export const WINE_QUERY = groq`*[_type == "wine"] | order(_createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  sku,
  price,
  vintage,
  "imageUrl": images[0].asset->url,
  physical_stock,
  committed_stock
}`;

export const SINGLE_WINE_QUERY = groq`*[_type == "wine" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  sku,
  price,
  vintage,
  tastingNotes,
  "imageUrl": images[0].asset->url,
  physical_stock,
  committed_stock
}`;
