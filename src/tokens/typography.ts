import darkTokens from './dark.tokens.json';
import lightTokens from './light.tokens.json';
import type { Mode } from './color';

type TokenLeaf = {
  $type: string;
  $value: unknown;
};

type UnknownRecord = Record<string, unknown>;

export type TypographyToken = {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
};

export type TypographyTokenMap = Record<string, TypographyToken>;
export type FigmaCurrentStyleName =
  | 'Current Styles/Title Screen'
  | 'Current Styles/Title Section'
  | 'Current Styles/Title subsection'
  | 'Current Styles/Body Large'
  | 'Current Styles/Body Large Bold'
  | 'Current Styles/Body Default'
  | 'Current Styles/Body Default Bold'
  | 'Current Styles/Body Small'
  | 'Current Styles/Body Small Bold';

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value: unknown): value is TokenLeaf {
  return isRecord(value) && '$type' in value && '$value' in value;
}

function getLeafValue<T>(root: unknown, key: string, fallback: T): T {
  if (!isRecord(root)) return fallback;
  const node = root[key];
  if (!isLeaf(node)) return fallback;
  return (node.$value as T) ?? fallback;
}

function buildTypographyMap(tokenTree: unknown): TypographyTokenMap {
  const out: TypographyTokenMap = {};
  const root = tokenTree as UnknownRecord;
  const typographyRoot = root.typography;
  if (!isRecord(typographyRoot)) return out;

  for (const [styleName, styleNode] of Object.entries(typographyRoot)) {
    out[styleName] = {
      fontFamily: getLeafValue(styleNode, 'font-family', 'Archivo'),
      fontWeight: getLeafValue(styleNode, 'font-weight', 400),
      fontSize: getLeafValue(styleNode, 'font-size', 14),
      lineHeight: getLeafValue(styleNode, 'line-height', 20),
      letterSpacing: getLeafValue(styleNode, 'letter-spacing', 0)
    };
  }

  return out;
}

export const figmaCurrentStyleToTokenKey: Record<FigmaCurrentStyleName, string> = {
  'Current Styles/Title Screen': 'display-md',
  'Current Styles/Title Section': 'display-sm',
  'Current Styles/Title subsection': 'title-lg',
  'Current Styles/Body Large': 'body-lg',
  'Current Styles/Body Large Bold': 'body-lg-bold',
  'Current Styles/Body Default': 'body-md',
  'Current Styles/Body Default Bold': 'body-md-bold',
  'Current Styles/Body Small': 'body-sm',
  'Current Styles/Body Small Bold': 'body-sm-bold'
};

function buildFigmaCurrentStylesMap(tokenMap: TypographyTokenMap): Record<FigmaCurrentStyleName, TypographyToken> {
  const out = {} as Record<FigmaCurrentStyleName, TypographyToken>;
  for (const [figmaStyleName, tokenKey] of Object.entries(figmaCurrentStyleToTokenKey) as Array<
    [FigmaCurrentStyleName, string]
  >) {
    const token = tokenMap[tokenKey];
    if (!token) {
      throw new Error(`Missing typography token "${tokenKey}" for "${figmaStyleName}"`);
    }
    out[figmaStyleName] = token;
  }
  return out;
}

export const typographyByMode: Record<Mode, TypographyTokenMap> = {
  light: buildTypographyMap(lightTokens),
  dark: buildTypographyMap(darkTokens)
};

export const defaultTypographyMode: Mode = 'dark';
export const typographyByFigmaCurrentStyleNameByMode: Record<Mode, Record<FigmaCurrentStyleName, TypographyToken>> = {
  light: buildFigmaCurrentStylesMap(typographyByMode.light),
  dark: buildFigmaCurrentStylesMap(typographyByMode.dark)
};
export const typographyByFigmaStyleName = typographyByFigmaCurrentStyleNameByMode[defaultTypographyMode];
export const typographyStyleKeys = Object.keys(typographyByMode[defaultTypographyMode]);
