import { type PostCollection, listPublishedEntries } from "./posts";
import { generateOgImage } from "./og";

/** One OG image path per published post, preferring ogTitle */
export async function getOgImagePaths(collection: PostCollection) {
  const posts = await listPublishedEntries(collection);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.ogTitle ?? post.data.title },
  }));
}

export async function ogImageResponse(title: string): Promise<Response> {
  const png = await generateOgImage(title);
  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
}
