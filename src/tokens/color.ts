import baseTokens from './base.tokens.json';
import darkTokens from './dark.tokens.json';
import lightTokens from './light.tokens.json';

type TokenLeaf = {
  $type: string;
  $value: unknown;
  $extensions?: Record<string, unknown>;
};

type UnknownRecord = Record<string, unknown>;

export type Mode = 'light' | 'dark';
export type PrimitiveColorMap = Record<string, string>;
export type SemanticToPrimitiveMap<TPrimitive extends PrimitiveColorMap> = Record<string, keyof TPrimitive>;
export type ColorTokenMap = Record<string, string>;

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

function hexFromValue(value: unknown): string | null {
  if (typeof value === 'string' && value.startsWith('#')) return value;
  if (!isRecord(value)) return null;
  if (typeof value.hex === 'string') return value.hex;
  return null;
}

function getByPath(root: unknown, path: string[]): unknown {
  let current: unknown = root;
  for (const segment of path) {
    if (!isRecord(current) || !(segment in current)) return null;
    current = current[segment];
  }
  return current;
}

function extractAliasPrimitiveName(leaf: TokenLeaf): string | null {
  const aliasData = isRecord(leaf.$extensions) ? leaf.$extensions['com.figma.aliasData'] : null;
  if (!isRecord(aliasData)) return null;
  const targetVariableName = aliasData.targetVariableName;
  return typeof targetVariableName === 'string' ? targetVariableName : null;
}

function buildPrimitiveColors(): PrimitiveColorMap {
  const out: PrimitiveColorMap = {};
  const leaves = flattenLeaves((baseTokens as UnknownRecord).Color, ['Color']);
  for (const { path, leaf } of leaves) {
    if (leaf.$type !== 'color') continue;
    const key = path.join('/');
    const hex = hexFromValue(leaf.$value);
    if (hex) out[key] = hex;
  }
  return out;
}

function resolveSemanticPrimitive<TPrimitive extends PrimitiveColorMap>(
  modeColorTree: unknown,
  currentLeaf: TokenLeaf,
  primitives: TPrimitive,
  trail: string[] = []
): keyof TPrimitive {
  const fallbackPrimitive = (Object.keys(primitives)[0] ?? '') as keyof TPrimitive;

  const aliasPrimitive = extractAliasPrimitiveName(currentLeaf);
  if (aliasPrimitive && aliasPrimitive in primitives) {
    return aliasPrimitive as keyof TPrimitive;
  }

  if (typeof currentLeaf.$value === 'string') {
    const refMatch = currentLeaf.$value.match(/^\{(.+)\}$/);
    if (refMatch) {
      const ref = refMatch[1];
      if (trail.includes(ref)) return fallbackPrimitive;
      const refLeaf = getByPath(modeColorTree, ref.split('.'));
      if (isLeaf(refLeaf)) {
        return resolveSemanticPrimitive(modeColorTree, refLeaf, primitives, [...trail, ref]);
      }
    }
  }

  const directHex = hexFromValue(currentLeaf.$value);
  if (directHex) {
    const matched = Object.entries(primitives).find(([, hex]) => hex.toLowerCase() === directHex.toLowerCase());
    if (matched) return matched[0] as keyof TPrimitive;
  }

  return fallbackPrimitive;
}

function resolveModeHex(
  modeColorTree: unknown,
  currentLeaf: TokenLeaf,
  primitives: PrimitiveColorMap,
  trail: string[] = []
): string | null {
  const aliasPrimitive = extractAliasPrimitiveName(currentLeaf);
  if (aliasPrimitive && aliasPrimitive in primitives) {
    return primitives[aliasPrimitive];
  }

  if (typeof currentLeaf.$value === 'string') {
    const refMatch = currentLeaf.$value.match(/^\{(.+)\}$/);
    if (refMatch) {
      const ref = refMatch[1];
      if (trail.includes(ref)) return null;
      const refLeaf = getByPath(modeColorTree, ref.split('.'));
      if (isLeaf(refLeaf)) {
        return resolveModeHex(modeColorTree, refLeaf, primitives, [...trail, ref]);
      }
    }
  }

  return hexFromValue(currentLeaf.$value);
}

function buildSemanticMapForMode<TPrimitive extends PrimitiveColorMap>(
  modeTokenTree: unknown,
  primitives: TPrimitive
): SemanticToPrimitiveMap<TPrimitive> {
  const map: Record<string, keyof TPrimitive> = {};
  const leaves = flattenLeaves((modeTokenTree as UnknownRecord).color, ['color']);
  for (const { path, leaf } of leaves) {
    if (leaf.$type !== 'color') continue;
    const semanticKey = path.join('.');
    // Resolve references like "{color.sentiment.positive}" from the mode root.
    map[semanticKey] = resolveSemanticPrimitive(modeTokenTree, leaf, primitives);
  }
  return map as SemanticToPrimitiveMap<TPrimitive>;
}

function buildSemanticHexMapForMode(modeTokenTree: unknown, primitives: PrimitiveColorMap): ColorTokenMap {
  const map: ColorTokenMap = {};
  const leaves = flattenLeaves((modeTokenTree as UnknownRecord).color, ['color']);
  for (const { path, leaf } of leaves) {
    if (leaf.$type !== 'color') continue;
    const semanticKey = path.join('.');
    const resolvedHex = resolveModeHex(modeTokenTree, leaf, primitives);
    if (resolvedHex) {
      map[semanticKey] = resolvedHex;
    }
  }
  return map;
}

export function resolveSemanticHex<TPrimitive extends PrimitiveColorMap>(
  primitives: TPrimitive,
  semanticToPrimitive: SemanticToPrimitiveMap<TPrimitive>
) {
  return Object.fromEntries(
    Object.entries(semanticToPrimitive).map(([semantic, primitive]) => [semantic, primitives[primitive]])
  ) as Record<keyof typeof semanticToPrimitive, string>;
}

export function buildSemanticPrimitiveHex<TPrimitive extends PrimitiveColorMap>(
  primitives: TPrimitive,
  semanticToPrimitive: SemanticToPrimitiveMap<TPrimitive>
) {
  return Object.fromEntries(
    Object.entries(semanticToPrimitive).map(([semantic, primitive]) => [
      semantic,
      {
        primitive,
        hex: primitives[primitive]
      }
    ])
  ) as Record<keyof typeof semanticToPrimitive, { primitive: keyof TPrimitive; hex: string }>;
}

export const primitiveColors = buildPrimitiveColors();

export const semanticColorModes = {
  light: buildSemanticMapForMode(lightTokens, primitiveColors),
  dark: buildSemanticMapForMode(darkTokens, primitiveColors)
} as const;

export const semanticColorsByMode = {
  light: buildSemanticHexMapForMode(lightTokens, primitiveColors),
  dark: buildSemanticHexMapForMode(darkTokens, primitiveColors)
} as const;

export const semanticPrimitiveHexByMode = {
  light: buildSemanticPrimitiveHex(primitiveColors, semanticColorModes.light),
  dark: buildSemanticPrimitiveHex(primitiveColors, semanticColorModes.dark)
} as const;

export const semanticToPrimitiveByMode: Record<Mode, Record<string, string>> = {
  light: semanticColorModes.light as Record<string, string>,
  dark: semanticColorModes.dark as Record<string, string>
};

export const semanticColors: ColorTokenMap = semanticColorsByMode.light as ColorTokenMap;
