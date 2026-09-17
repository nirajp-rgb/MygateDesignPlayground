import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function readJson(relativePath) {
  const absolutePath = path.join(repoRoot, relativePath);
  return JSON.parse(readFileSync(absolutePath, 'utf8'));
}

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value) {
  return isRecord(value) && '$type' in value && '$value' in value;
}

function hexFromValue(value) {
  if (typeof value === 'string' && value.startsWith('#')) return value;
  if (!isRecord(value)) return '';
  return typeof value.hex === 'string' ? value.hex : '';
}

function getByPath(root, pathParts) {
  let current = root;

  for (const pathPart of pathParts) {
    if (!isRecord(current) || !(pathPart in current)) return null;
    current = current[pathPart];
  }

  return current;
}

function resolveHex(root, leaf, trail = []) {
  if (!isLeaf(leaf)) return '';

  const directHex = hexFromValue(leaf.$value);
  if (directHex) return directHex;

  if (typeof leaf.$value === 'string') {
    const refMatch = leaf.$value.match(/^\{(.+)\}$/);
    if (!refMatch) return '';

    const ref = refMatch[1];
    if (trail.includes(ref)) return '';

    const nextNode = getByPath(root, ref.split('.'));
    return resolveHex(root, nextNode, [...trail, ref]);
  }

  return '';
}

function flattenColorLeaves(root, node, pathParts = [], out = new Map()) {
  if (isLeaf(node)) {
    const tokenPath = pathParts.join('.');
    out.set(tokenPath, {
      hex: resolveHex(root, node),
      description: typeof node.$description === 'string' ? node.$description : ''
    });
    return out;
  }

  if (!isRecord(node)) return out;

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    flattenColorLeaves(root, value, [...pathParts, key], out);
  }

  return out;
}

const lightTokens = readJson('src/tokens/light.tokens.json');
const darkTokens = readJson('src/tokens/dark.tokens.json');

const lightMap = flattenColorLeaves(lightTokens, lightTokens.color, ['color']);
const darkMap = flattenColorLeaves(darkTokens, darkTokens.color, ['color']);
const tokenKeys = [...new Set([...lightMap.keys(), ...darkMap.keys()])].sort((a, b) => a.localeCompare(b));

const lines = [
  '# Color Tokens',
  '',
  'Actual semantic color tokens from `src/tokens/light.tokens.json` and `src/tokens/dark.tokens.json`.',
  '',
  '| Token | Light | Dark | Description |',
  '| --- | --- | --- | --- |'
];

for (const tokenKey of tokenKeys) {
  const light = lightMap.get(tokenKey);
  const dark = darkMap.get(tokenKey);
  const description = light?.description || dark?.description || '';
  lines.push(
    `| \`${tokenKey}\` | \`${light?.hex || '-'}\` | \`${dark?.hex || '-'}\` | ${description.replace(/\|/g, '\\|')} |`
  );
}

process.stdout.write(`${lines.join('\n')}\n`);
