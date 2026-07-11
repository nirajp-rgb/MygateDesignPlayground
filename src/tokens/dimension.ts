import darkTokens from './dark.tokens.json';
import lightTokens from './light.tokens.json';
import type { Mode } from './color';

type TokenLeaf = {
  $type: string;
  $value: unknown;
  $extensions?: Record<string, unknown>;
};

type UnknownRecord = Record<string, unknown>;

export type DimensionTokenMap = Record<string, number>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value: unknown): value is TokenLeaf {
  return isRecord(value) && '$type' in value && '$value' in value;
}

function flattenLeaves(node: unknown, path: string[] = [], out: Array<{ path: string[]; leaf: TokenLeaf }> = []) {
  if (isLeaf(node)) {
    out.push({ path, leaf: node });
    return out;
  }
  if (!isRecord(node)) return out;
  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$')) continue;
    flattenLeaves(value, [...path, key], out);
  }
  return out;
}

function buildDimensionMap(tokenTree: unknown): DimensionTokenMap {
  const out: DimensionTokenMap = {};
  const root = tokenTree as UnknownRecord;

  const sections = ['radius', 'spacing', 'icon'];
  for (const section of sections) {
    const leaves = flattenLeaves(root[section], [section]);
    for (const { path, leaf } of leaves) {
      if (leaf.$type !== 'number') continue;
      if (typeof leaf.$value !== 'number') continue;
      const semanticPath = `Dimension/${path.join('/')}`;
      out[semanticPath] = leaf.$value;

      // Preserve Figma primitive alias path as well (e.g. Dimension/space/4, Dimension/size/icon/md).
      const aliasData =
        typeof leaf.$extensions === 'object' && leaf.$extensions !== null
          ? (leaf.$extensions['com.figma.aliasData'] as Record<string, unknown> | undefined)
          : undefined;
      const targetVariableName = aliasData?.targetVariableName;
      if (typeof targetVariableName === 'string' && targetVariableName.startsWith('Dimension/')) {
        out[targetVariableName] = leaf.$value;
      }
    }
  }

  return out;
}

export const dimensionByMode: Record<Mode, DimensionTokenMap> = {
  light: buildDimensionMap(lightTokens),
  dark: buildDimensionMap(darkTokens)
};

export const dimensionTokens = dimensionByMode.light;
