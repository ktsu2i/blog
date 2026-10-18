import type { APIRoute, GetStaticPaths } from "astro";
import { getOgImagePaths, ogImageResponse } from "../../lib/og-route";

export const getStaticPaths: GetStaticPaths = () => getOgImagePaths("postsJa");

export const GET: APIRoute = ({ props }) => ogImageResponse(props.title);
