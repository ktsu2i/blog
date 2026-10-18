import type { APIRoute } from "astro";
import { defaultLocale, useTranslations } from "../../i18n/config";
import { generateOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await generateOgImage(
    useTranslations(defaultLocale)["common.siteName"],
  );
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
