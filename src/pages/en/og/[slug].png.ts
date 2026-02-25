import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { generateOgImage } from "../../../lib/og";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("postsEn");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.ogTitle ?? post.data.title },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgImage(props.title);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
