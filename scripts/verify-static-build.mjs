import { createReadStream } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const distDir = path.join(workspaceRoot, "dist");
const assetsDir = path.join(distDir, "assets");
const distDirWithSeparator = `${distDir}${path.sep}`;
const expectedAudioAssetStems = [
  "bead-click",
  "reach-ten-celebration",
  "toy-shelf-ambience",
];

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".wav", "audio/wav"],
  [".webp", "image/webp"],
]);

function getContentType(filePath) {
  return contentTypes.get(path.extname(filePath)) ?? "application/octet-stream";
}

function createStaticServer() {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url ?? "/", "http://127.0.0.1");
    const relativePath = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
    const normalizedPath = path.resolve(distDir, relativePath || "index.html");

    if (
      normalizedPath !== distDir &&
      !normalizedPath.startsWith(distDirWithSeparator)
    ) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    try {
      const fileStats = await stat(normalizedPath);

      if (!fileStats.isFile()) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "content-length": fileStats.size,
        "content-type": getContentType(normalizedPath),
      });
      createReadStream(normalizedPath).pipe(response);
    } catch {
      response.writeHead(404);
      response.end("Not found");
    }
  });
}

function listen(server) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();

      if (!address || typeof address === "string") {
        reject(new Error("static server did not expose a TCP port"));
        return;
      }

      resolve(address.port);
    });
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

async function fetchOk(baseUrl, assetPath) {
  const response = await fetch(new URL(assetPath, baseUrl));

  if (!response.ok) {
    throw new Error(`${assetPath} failed to load: ${response.status}`);
  }

  const body = await response.arrayBuffer();

  if (body.byteLength === 0) {
    throw new Error(`${assetPath} loaded with an empty body`);
  }

  return response.headers.get("content-type") ?? "";
}

async function listAssetFiles() {
  const entries = await readdir(assetsDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

async function verify() {
  const server = createStaticServer();
  const port = await listen(server);
  const baseUrl = `http://127.0.0.1:${port}/`;

  try {
    const indexContentType = await fetchOk(baseUrl, "/");

    if (!indexContentType.includes("text/html")) {
      throw new Error(`index.html served with unexpected type: ${indexContentType}`);
    }

    const assetFiles = await listAssetFiles();
    const audioAssets = assetFiles.filter((asset) => asset.endsWith(".wav"));
    const imageAssets = assetFiles.filter((asset) =>
      [".png", ".svg", ".webp"].includes(path.extname(asset)),
    );

    for (const asset of assetFiles) {
      await fetchOk(baseUrl, `/assets/${asset}`);
    }

    for (const stem of expectedAudioAssetStems) {
      const audioAsset = audioAssets.find((asset) => asset.startsWith(stem));

      if (!audioAsset) {
        throw new Error(`missing expected audio asset for ${stem}`);
      }
    }

    console.log(`Verified static build at ${baseUrl}`);
    console.log(`Verified ${assetFiles.length} emitted assets.`);
    console.log(`Verified audio assets: ${audioAssets.join(", ")}`);
    console.log(
      imageAssets.length > 0
        ? `Verified image assets: ${imageAssets.join(", ")}`
        : "No image assets emitted by the current build.",
    );
  } finally {
    await close(server);
  }
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
