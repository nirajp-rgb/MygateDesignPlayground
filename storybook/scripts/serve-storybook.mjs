import { createReadStream, existsSync } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..', 'storybook-static');
const host = '127.0.0.1';
const port = 6100;

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2'
};

function resolvePath(urlPath) {
  const safePath = decodeURIComponent(urlPath.split('?')[0]);
  const normalizedPath = safePath === '/' ? '/index.html' : safePath;
  const resolvedPath = path.resolve(rootDir, `.${normalizedPath}`);

  if (!resolvedPath.startsWith(rootDir)) {
    return null;
  }

  return resolvedPath;
}

const server = createServer(async (request, response) => {
  const resolvedPath = resolvePath(request.url || '/');

  if (!resolvedPath) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  const fallbackPath = path.join(rootDir, 'index.html');
  const targetPath = existsSync(resolvedPath) ? resolvedPath : fallbackPath;

  try {
    const fileStat = await stat(targetPath);
    const streamPath = fileStat.isDirectory() ? path.join(targetPath, 'index.html') : targetPath;
    const extension = path.extname(streamPath);

    response.writeHead(200, {
      'Content-Type': mimeTypes[extension] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });

    createReadStream(streamPath).pipe(response);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(port, host, () => {
  console.log(`Storybook docs available at http://${host}:${port}`);
});
