// Usage: node scripts/serve.mjs [port=5335] [dir=site]
// Local preview that behaves like Cloudflare Pages: "/x" → 301 "/x/" when x/ is a folder, "/x/" → x/index.html,
// anything missing → 404.html with status 404, _headers / _redirects never served, byte ranges for media.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const port = Number(process.argv[2] || 5335);
const ROOT = path.resolve(import.meta.dirname, "..", process.argv[3] || "site");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "application/javascript", ".mjs": "application/javascript",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".svg": "image/svg+xml", ".png": "image/png",
  ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif",
  ".ico": "image/x-icon", ".mp4": "video/mp4", ".webm": "video/webm", ".woff2": "font/woff2", ".woff": "font/woff",
  ".ttf": "font/ttf", ".txt": "text/plain", ".xml": "application/xml", ".pdf": "application/pdf", ".vtt": "text/vtt",
};

function send(req, res, file, status = 200) {
  const stat = fs.statSync(file);
  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  const range = req.headers.range && /bytes=(\d*)-(\d*)/.exec(req.headers.range);
  if (range && status === 200) {
    const start = range[1] ? Number(range[1]) : stat.size - Number(range[2]);
    const end = range[1] && range[2] ? Math.min(Number(range[2]), stat.size - 1) : stat.size - 1;
    res.writeHead(206, { "content-type": type, "accept-ranges": "bytes", "content-length": end - start + 1, "content-range": `bytes ${start}-${end}/${stat.size}` });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(status, { "content-type": type, "content-length": stat.size, "accept-ranges": "bytes", "cache-control": "no-cache" });
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}

http.createServer((req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url, "http://x").pathname); } catch { p = "/"; }
  const f = /^\/_(headers|redirects|routes\.json)$/.test(p) ? path.join(ROOT, "__hidden__") : path.join(ROOT, p); // Cloudflare Pages never serves its config files
  if (!f.startsWith(ROOT)) { res.writeHead(400); return res.end(); }
  try {
    const st = fs.statSync(f);
    if (st.isDirectory()) {
      if (!p.endsWith("/")) { res.writeHead(301, { location: p + "/" + (new URL(req.url, "http://x").search) }); return res.end(); }
      const idx = path.join(f, "index.html");
      if (fs.existsSync(idx)) return send(req, res, idx);
    } else return send(req, res, f);
  } catch {}
  if (process.env.LOG404) console.log("404", req.url);
  send(req, res, path.join(ROOT, "404.html"), 404);
}).listen(port, () => console.log(`Tarn → http://localhost:${port}`));
