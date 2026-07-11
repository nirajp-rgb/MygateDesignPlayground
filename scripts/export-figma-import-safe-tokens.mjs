import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const tokenDir = path.join(rootDir, 'src', 'tokens');
const outputDir = path.join(tokenDir, 'import-safe');

const sources = [
  'base.tokens.json',
  'light.tokens.json',
  'dark.tokens.json'
];

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value) {
  return isRecord(value) && '$type' in value && '$value' in value;
}

function simplifyLeaf(leaf) {
  const next = {
    $type: leaf.$type
  };

  if (leaf.$description) {
    next.$description = leaf.$description;
  }

  if (leaf.$type === 'color' && isRecord(leaf.$value) && typeof leaf.$value.hex === 'string') {
    next.$value = leaf.$value.hex;
    return next;
  }

  next.$value = leaf.$value;
  return next;
}

function sanitizeNode(node) {
  if (isLeaf(node)) {
    return simplifyLeaf(node);
  }

  if (Array.isArray(node)) {
    return node.map(sanitizeNode);
  }

  if (!isRecord(node)) {
    return node;
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    out[key] = sanitizeNode(value);
  }
  return out;
}

await fs.mkdir(outputDir, { recursive: true });

for (const source of sources) {
  const sourcePath = path.join(tokenDir, source);
  const raw = await fs.readFile(sourcePath, 'utf8');
  const parsed = JSON.parse(raw);
  const sanitized = sanitizeNode(parsed);
  const outputPath = path.join(outputDir, source);
  await fs.writeFile(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
}
