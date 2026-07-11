import type { ViewStyle } from 'react-native';

/**
 * Elevation tokens — cross-platform shadow scale.
 *
 * Each level returns a plain style object that can be spread directly
 * into a component's style prop:
 *
 *   <View style={[styles.card, elevation.sm]} />
 *
 * Levels:
 *   none  — no shadow (explicit reset)
 *   xs    — subtle lift, e.g. chips, tags
 *   sm    — card resting state
 *   md    — cards on hover / focused cards, modals
 *   lg    — bottom sheets, popovers
 *   xl    — dialogs, toasts
 */

type ElevationStyle = Pick<
  ViewStyle,
  | 'shadowColor'
  | 'shadowOffset'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'elevation'
>;

const SHADOW_COLOR = '#000000';

export const elevation: Record<'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl', ElevationStyle> = {
  none: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  xl: {
    shadowColor: SHADOW_COLOR,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 16,
  },
};
