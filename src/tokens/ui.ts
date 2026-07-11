import type { TextStyle } from 'react-native';
import type { Mode } from './color';
import { semanticColorsByMode } from './color';
import { dimensionByMode } from './dimension';
import { buildTheme } from './theme';

function toCamelCase(segment: string): string {
  return segment
    .split('-')
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`))
    .join('');
}

function semanticColorKeyToAlias(tokenKey: string): string {
  const keyWithoutPrefix = tokenKey.replace(/^color\./, '');
  const segments = keyWithoutPrefix.split('.').map(toCamelCase);
  return segments
    .map((segment, index) => (index === 0 ? segment : `${segment[0]?.toUpperCase() ?? ''}${segment.slice(1)}`))
    .join('');
}

export function createUI(mode: Mode = 'light') {
  const colorTokens = semanticColorsByMode[mode];
  const dimension = dimensionByMode[mode];
  const theme = buildTheme(mode);

  const colors = Object.fromEntries(
    Object.entries(colorTokens).map(([tokenKey, hex]) => [semanticColorKeyToAlias(tokenKey), hex])
  ) as Record<string, string>;

  // Keep backwards-compatible aliases used by existing screens/components.
  colors.feedbackPositive = colors.contentPositive;
  colors.feedbackNegative = colors.contentNegative;
  colors.feedbackWarning = colors.contentWarning;
  colors.feedbackInfo = colors.contentInfo;

  const spacing = {
    xs: dimension['Dimension/spacing/100'],
    sm: dimension['Dimension/spacing/200'],
    md: dimension['Dimension/spacing/300'],
    lg: dimension['Dimension/spacing/400'],
    xl: dimension['Dimension/spacing/500'],
    xxl: dimension['Dimension/spacing/600'],
    '3xl': dimension['Dimension/space/32'],
    '4xl': dimension['Dimension/space/48']
  } as const;

  const radius = {
    sm: dimension['Dimension/radius/sm'],
    md: dimension['Dimension/radius/md'],
    lg: dimension['Dimension/radius/lg'],
    xl: dimension['Dimension/radius/xl'],
    xxl: dimension['Dimension/radius/24'],
    pill: dimension['Dimension/radius/full']
  } as const;

  const iconSize = {
    sm: dimension['Dimension/icon/sm'],
    md: dimension['Dimension/icon/md'],
    lg: dimension['Dimension/icon/lg'],
    xl: dimension['Dimension/icon/xl']
  } as const;

  type StyleName = keyof typeof theme.typography;
  type TypographyAliases = Record<StyleName, TextStyle> & {
    titleScreen: TextStyle;
    titleSection: TextStyle;
    titleSubsection: TextStyle;
    titleXs: TextStyle;
    'title-xs': TextStyle;
    bodyPrimary: TextStyle;
    bodySecondary: TextStyle;
    bodyDefault: TextStyle;
    bodyDefaultBold: TextStyle;
    bodyLarge: TextStyle;
    bodyLargeBold: TextStyle;
    bodySmall: TextStyle;
    bodySmallBold: TextStyle;
    caption: TextStyle;
    captionBold: TextStyle;
  };

  const typography: TypographyAliases = {
    ...(theme.typography as Record<StyleName, TextStyle>),
    titleScreen: theme.typography['display-md'],
    titleSection: theme.typography['display-sm'],
    titleSubsection: theme.typography['title-lg'],
    titleXs: theme.typography['body-md-bold'],
    'title-xs': theme.typography['body-md-bold'],
    bodyPrimary: theme.typography['body-md'],
    bodySecondary: theme.typography['body-sm'],
    bodyDefault: theme.typography['body-md'],
    bodyDefaultBold: theme.typography['body-md-bold'],
    bodyLarge: theme.typography['body-lg'],
    bodyLargeBold: theme.typography['body-lg-bold'],
    bodySmall: theme.typography['body-sm'],
    bodySmallBold: theme.typography['body-sm-bold'],
    caption: theme.typography['body-sm'],
    captionBold: theme.typography['body-sm-bold']
  } as TypographyAliases;

  return {
    mode,
    colorTokens,
    colors,
    spacing,
    radius,
    iconSize,
    typography
  };
}

function createLiveView<T extends Record<string, unknown>>(getSource: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      return getSource()[property as keyof T];
    },
    has(_target, property) {
      return property in getSource();
    },
    ownKeys() {
      return Reflect.ownKeys(getSource());
    },
    getOwnPropertyDescriptor(_target, property) {
      const descriptor = Object.getOwnPropertyDescriptor(getSource(), property);
      if (descriptor) {
        return {
          ...descriptor,
          configurable: true
        };
      }
      return {
        configurable: true,
        enumerable: true,
        value: getSource()[property as keyof T],
        writable: false
      };
    }
  });
}

export function getStatusBarStyle(mode: Mode): 'light' | 'dark' {
  return mode === 'dark' ? 'light' : 'dark';
}

let activeUI = createUI('light');

export const ui = createLiveView(() => activeUI);
export let currentMode: Mode = activeUI.mode;
export let statusBarStyle: 'light' | 'dark' = getStatusBarStyle(currentMode);
export const colorTokens = createLiveView(() => activeUI.colorTokens);
export const colors = createLiveView(() => activeUI.colors);
export const spacing = createLiveView(() => activeUI.spacing);
export const radius = createLiveView(() => activeUI.radius);
export const iconSize = createLiveView(() => activeUI.iconSize);
export const typography = createLiveView(() => activeUI.typography);

export function setUIMode(mode: Mode) {
  activeUI = createUI(mode);
  currentMode = activeUI.mode;
  statusBarStyle = getStatusBarStyle(currentMode);
}

export function toggleUIMode() {
  const nextMode: Mode = currentMode === 'dark' ? 'light' : 'dark';
  setUIMode(nextMode);
  return nextMode;
}

export const appPagePaddingTop = 56;
export const appPagePaddingBottom = spacing.xxl;
export const appHeaderHeight = 56;
