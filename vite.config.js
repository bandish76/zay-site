import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";

// After the build, write per-page copies of index.html so that:
//  - /brands has its own title/description for link previews (WhatsApp, LinkedIn, X)
//  - unknown URLs get a real 404 status (Vercel serves 404.html for missing paths)
// The React app still renders the right page in each case.
const PAGES = {
  "brands.html": {
    title: "zay for brands / what gen z actually thinks",
    description:
      "zay turns gen z gut reactions into structured signal. test a product, an ad, a name, a campaign before you ship it.",
    url: "https://www.zay.xyz/brands",
  },
  "404.html": {
    title: "page not found / zay",
    description: "this page doesn't exist.",
    url: null,
  },
};

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function perPageHtml() {
  return {
    name: "zay-per-page-html",
    apply: "build",
    closeBundle() {
      const dist = path.resolve("dist");
      const base = fs.readFileSync(path.join(dist, "index.html"), "utf8");
      for (const [file, m] of Object.entries(PAGES)) {
        let html = base
          .replace(/<title>[^<]*<\/title>/, `<title>${m.title}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escapeAttr(m.description)}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${escapeAttr(m.title)}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${escapeAttr(m.title)}$2`)
          .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escapeAttr(m.description)}$2`)
          .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escapeAttr(m.description)}$2`);
        if (m.url) {
          html = html
            .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${m.url}$2`)
            .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${m.url}$2`);
        } else {
          html = html
            .replace(/\s*<link rel="canonical"[^>]*>/, "")
            .replace("</head>", '    <meta name="robots" content="noindex" />\n  </head>');
        }
        fs.writeFileSync(path.join(dist, file), html);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), perPageHtml()],
});
