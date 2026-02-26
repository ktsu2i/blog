import satori from "satori";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const GEIST_SANS_BOLD = fs.readFileSync(
  path.resolve("node_modules/@fontsource/geist-sans/files/geist-sans-latin-700-normal.woff")
);

const AVATAR_BASE64 = `data:image/png;base64,${fs.readFileSync(path.resolve("public/images/avatar.png")).toString("base64")}`;

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
                background: "radial-gradient(circle, rgba(59,130,246,0.25), transparent 70%)",
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
                background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
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
                                src: AVATAR_BASE64,
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
