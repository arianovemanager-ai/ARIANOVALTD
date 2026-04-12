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

export const EVENTS_QUERY = groq`*[_type == "event" && date >= now()] | order(date asc) {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
  price,
  description,
  "imageUrl": images[0].asset->url,
  physical_stock,
  committed_stock
}`;

export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings" && _id == "siteSettings"][0] {
  homeHeadline,
  homeSubheadline,
  "homeVideoUrl": homeVideo.asset->url,
  "homePosterUrl": homePoster.asset->url,
  vineyardHeadline,
  "vineyardVideoUrl": vineyardVideo.asset->url,
  "vineyardPosterUrl": vineyardPoster.asset->url
}`;
