import type { APIRoute } from "astro";
import { generateOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await generateOgImage("ktsu2i.dev");
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
