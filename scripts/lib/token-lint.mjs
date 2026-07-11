import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');
const scanDirs = ['src'];
const allowedExt = new Set(['.ts', '.tsx']);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp, files);
    else if (allowedExt.has(path.extname(entry.name))) files.push(fp);
  }
  return files;
}

export function collectLintViolations() {
  const files = scanDirs.flatMap((d) => walk(path.join(root, d)));
  files.push(path.join(root, 'App.tsx'));
  const violations = [];

  for (const file of files) {
    const rel = path.relative(root, file);
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split('\n');

    lines.forEach((line, idx) => {
      if (/#(?:[A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})\b/.test(line)) {
        violations.push({ file: rel, line: idx + 1, kind: 'hardcoded-color', detail: line.trim() });
      }
      if (/\b(fontSize|lineHeight)\s*:\s*\d+\b/.test(line)) {
        violations.push({ file: rel, line: idx + 1, kind: 'hardcoded-typography', detail: line.trim() });
      }
    });
  }

  return violations;
}
