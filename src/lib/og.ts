import satori, { type Font, type SatoriOptions } from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "./types";

const GEIST_SANS_BOLD = fs.readFileSync(
  path.resolve(
    "node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff",
  ),
);

const NOTO_SANS_JP_DIR = path.resolve(
  "node_modules/@fontsource/noto-sans-jp/files",
);
// The "japanese" file only bundles common kanji; the numbered subsets cover the full font
const NOTO_SANS_JP_BOLD = fs
  .readdirSync(NOTO_SANS_JP_DIR)
  .filter((file) =>
    /^noto-sans-jp-(\d+|latin|latin-ext|cyrillic|vietnamese)-700-normal\.woff$/.test(
      file,
    ),
  )
  .sort()
  .map((file) => fs.readFileSync(path.join(NOTO_SANS_JP_DIR, file)));

// Satori keeps one font per name and weight, so each subset needs its own name
// to act as a fallback. It also caches parsed fonts per array, so share one.
const FONTS: SatoriOptions["fonts"] = [
  {
    name: "Geist Sans",
    data: GEIST_SANS_BOLD,
    weight: 700,
    style: "normal",
  },
  ...NOTO_SANS_JP_BOLD.map((data, i): Font => ({
    name: `Noto Sans JP ${i}`,
    data,
    weight: 700,
    style: "normal",
  })),
];

// Rendered at 72px; 2x is enough and keeps every OG image's embedded data small
const AVATAR_DATA_URL = `data:image/jpeg;base64,${(
  await sharp(path.resolve("src/assets/avatar.jpg")).resize(144).toBuffer()
).toString("base64")}`;

export async function generateOgImage(title: string): Promise<Buffer> {
  const lines = title.split("\n");
  const fontSize = title.replace(/\n/g, "").length > 30 ? 44 : 52;

  const svg = await satori(
    // @ts-expect-error -- satori virtual DOM
    {
      type: "div",
      props: {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        },
        children: [
          // Background glow (top-right)
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: "-120px",
                right: "-120px",
                width: "500px",
                height: "500px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)",
              },
            },
          },
          // Background glow (bottom-left)
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                bottom: "-200px",
                left: "-100px",
                width: "400px",
                height: "400px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
              },
            },
          },
          // Content
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
                padding: "60px 72px",
              },
              children: [
                // Title
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      flexGrow: 1,
                    },
                    children: {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          flexDirection: "column",
                          fontSize,
                          fontWeight: 700,
                          color: "#f0f0f0",
                          lineHeight: 1.5,
                          wordBreak: "break-word",
                          letterSpacing: "-0.025em",
                        },
                        children:
                          lines.length > 1
                            ? lines.map((line) => ({
                                type: "div",
                                props: { children: line },
                              }))
                            : title,
                      },
                    },
                  },
                },
                // Bottom bar
                {
                  type: "div",
                  props: {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 24,
                    },
                    children: [
                      // Author
                      {
                        type: "div",
                        props: {
                          style: {
                            display: "flex",
                            alignItems: "center",
                          },
                          children: [
                            {
                              type: "img",
                              props: {
                                src: AVATAR_DATA_URL,
                                width: 72,
                                height: 72,
                                style: {
                                  borderRadius: "50%",
                                },
                              },
                            },
                            {
                              type: "div",
                              props: {
                                style: {
                                  fontSize: 34,
                                  fontWeight: 700,
                                  color: "#e5e5e5",
                                  marginLeft: 18,
                                },
                                children: "Kaito Tsutsui",
                              },
                            },
                          ],
                        },
                      },
                      // Domain
                      {
                        type: "div",
                        props: {
                          style: {
                            fontSize: 32,
                            color: "#e5e5e5",
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
        ],
      },
    },
    {
      width: OG_IMAGE_WIDTH,
      height: OG_IMAGE_HEIGHT,
      fonts: FONTS,
    },
  );

  return await sharp(Buffer.from(svg)).png().toBuffer();
}
