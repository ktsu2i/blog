import type { APIRoute } from "astro";
import { defaultLocale, useTranslations } from "../../i18n/config";
import { ogImageResponse } from "../../lib/og-route";

export const GET: APIRoute = () =>
  ogImageResponse(useTranslations(defaultLocale)["common.siteName"]);
