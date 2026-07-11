import fs from 'node:fs/promises';
import path from 'node:path';

const rootDir = process.cwd();
const tokenDir = path.join(rootDir, 'src', 'tokens');
const outputDir = path.join(tokenDir, 'figma-import');

const BASE_FILE = 'base.tokens.json';
const THEME_FILES = ['light.tokens.json', 'dark.tokens.json'];
const aliasPathOverrides = {
  'color1/brand/300': 'Color.focus.300',
  'color1/brand/600': 'Color.focus.600'
};

function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value) {
  return isRecord(value) && '$type' in value && '$value' in value;
}

function toReferencePath(variableName) {
  return (aliasPathOverrides[variableName] ?? variableName).replaceAll('/', '.');
}

function getByPath(root, dotPath) {
  return dotPath.split('.').reduce((current, segment) => {
    if (!isRecord(current) || !(segment in current)) return null;
    return current[segment];
  }, root);
}

function setByPath(root, dotPath, value) {
  const segments = dotPath.split('.');
  let current = root;
  for (const segment of segments.slice(0, -1)) {
    if (!isRecord(current[segment])) {
      current[segment] = {};
    }
    current = current[segment];
  }
  current[segments.at(-1)] = value;
}

function resolveThemeValue(root, leaf, trail = new Set()) {
  const aliasData = isRecord(leaf.$extensions) ? leaf.$extensions['com.figma.aliasData'] : null;
  const targetVariableName = isRecord(aliasData) ? aliasData.targetVariableName : null;

  if (typeof targetVariableName === 'string' && targetVariableName.length > 0) {
    return `{${toReferencePath(targetVariableName)}}`;
  }

  if (typeof leaf.$value === 'string') {
    const refMatch = leaf.$value.match(/^\{(.+)\}$/);
    if (refMatch) {
      const refPath = refMatch[1];
      if (trail.has(refPath)) return leaf.$value;
      const targetLeaf = getByPath(root, refPath);
      if (isLeaf(targetLeaf)) {
        trail.add(refPath);
        return resolveThemeValue(root, targetLeaf, trail);
      }
    }
  }

  if (leaf.$type === 'color' && isRecord(leaf.$value) && typeof leaf.$value.hex === 'string') {
    return leaf.$value.hex;
  }

  return leaf.$value;
}

function simplifyBaseLeaf(leaf) {
  const next = { $type: leaf.$type };

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

function simplifyThemeLeaf(root, leaf) {
  const next = { $type: leaf.$type };

  if (leaf.$description) {
    next.$description = leaf.$description;
  }
  next.$value = resolveThemeValue(root, leaf);
  return next;
}

function sanitizeNode(node, transformLeaf, root = node) {
  if (isLeaf(node)) {
    return transformLeaf(root, node);
  }

  if (Array.isArray(node)) {
    return node.map((item) => sanitizeNode(item, transformLeaf, root));
  }

  if (!isRecord(node)) {
    return node;
  }

  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    out[key] = sanitizeNode(value, transformLeaf, root);
  }
  return out;
}

async function exportBase() {
  const raw = await fs.readFile(path.join(tokenDir, BASE_FILE), 'utf8');
  const parsed = JSON.parse(raw);
  const sanitized = sanitizeNode(parsed, (_, leaf) => simplifyBaseLeaf(leaf));
  setByPath(sanitized, 'Color.focus.300', {
    $type: 'color',
    $value: '#A5B4FC'
  });
  setByPath(sanitized, 'Color.focus.600', {
    $type: 'color',
    $value: '#4F46E5'
  });
  const outputPath = path.join(outputDir, BASE_FILE);
  await fs.writeFile(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
}

async function exportTheme(fileName) {
  const raw = await fs.readFile(path.join(tokenDir, fileName), 'utf8');
  const parsed = JSON.parse(raw);
  const sanitized = sanitizeNode(parsed, simplifyThemeLeaf);
  const modeName = fileName.replace('.tokens.json', '.theme.tokens.json');
  const outputPath = path.join(outputDir, modeName);
  await fs.writeFile(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${path.relative(rootDir, outputPath)}`);
}

await fs.mkdir(outputDir, { recursive: true });
await exportBase();
for (const fileName of THEME_FILES) {
  await exportTheme(fileName);
}
