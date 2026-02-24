import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const GEIST_SANS_BOLD = fs.readFileSync(
  path.resolve("node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff")
);

let notoSansJPBold: ArrayBuffer | null = null;

async function loadNotoSansJP(): Promise<ArrayBuffer> {
  if (notoSansJPBold) return notoSansJPBold;

  const res = await fetch(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap"
  );
  const css = await res.text();
  const fontUrl = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Failed to parse Noto Sans JP font URL");

  const fontRes = await fetch(fontUrl);
  notoSansJPBold = await fontRes.arrayBuffer();
  return notoSansJPBold;
}

export async function generateOgImage(title: string): Promise<Buffer> {
  const notoFont = await loadNotoSansJP();
  const lines = title.split("\n");

  const svg = await satori(
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          backgroundColor: "#0a0a0a",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                flexGrow: 1,
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      fontSize: title.replace(/\n/g, "").length > 30 ? 48 : 56,
                      fontWeight: 700,
                      color: "#ffffff",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    },
                    children: lines.length > 1
                      ? lines.map((line) => ({
                          type: "div",
                          props: { children: line },
                        }))
                      : title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              },
              children: [
                {
                  type: "div",
                  props: {
                    style: {
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#a1a1aa",
                    },
                    children: "ktsu2i.dev",
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Geist Sans",
          data: GEIST_SANS_BOLD,
          weight: 700,
          style: "normal",
        },
        {
          name: "Noto Sans JP",
          data: notoFont,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
