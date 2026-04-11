import "server-only";
import { client } from "./client";
import { type QueryParams } from "next-sanity";

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    next: {
      revalidate: 0, // Bypass static caching to ensure storefront is always 100% sync'd with database
      tags,
    },
  });
}
