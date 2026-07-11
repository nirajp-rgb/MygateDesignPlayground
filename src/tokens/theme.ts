import { TextStyle } from 'react-native';
import { Mode, semanticColorsByMode } from './color';
import { dimensionByMode } from './dimension';
import { figmaCurrentStyleToTokenKey, typographyByMode } from './typography';

export type Theme = {
  mode: Mode;
  colors: Record<string, string>;
  dimension: Record<string, number>;
  typography: Record<string, TextStyle>;
};

function resolveFontFamily(fontFamily: string, fontWeight: number): string {
  if (fontFamily.toLowerCase() === 'archivo') {
    if (fontWeight >= 600) return 'Archivo_600SemiBold';
    return 'Archivo_400Regular';
  }
  return fontFamily;
}

export function buildTheme(mode: Mode = 'light'): Theme {
  const semanticColors = semanticColorsByMode[mode];
  const typographyByFigmaStyleName = typographyByMode[mode];
  const dimension = dimensionByMode[mode];
  const typographyStyles: Record<string, TextStyle> = {};

  for (const [name, token] of Object.entries(typographyByFigmaStyleName)) {
    typographyStyles[name] = {
      fontFamily: resolveFontFamily(token.fontFamily, token.fontWeight),
      fontSize: token.fontSize,
      lineHeight: token.lineHeight,
      letterSpacing: token.letterSpacing,
      color: semanticColors['color.content.primary']
    };
  }

  // Expose exact Figma style names as aliases so UI can consume them directly.
  for (const [figmaStyleName, tokenKey] of Object.entries(figmaCurrentStyleToTokenKey)) {
    const baseStyle = typographyStyles[tokenKey];
    if (baseStyle) typographyStyles[figmaStyleName] = baseStyle;
  }

  return {
    mode,
    colors: semanticColors,
    dimension,
    typography: typographyStyles
  };
}
