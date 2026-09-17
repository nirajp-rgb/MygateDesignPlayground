import { Image, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { User } from 'phosphor-react-native';
import { colors, radius, typography } from '../../tokens';

export type AvatarSize = 'XS' | 'SM' | 'MD' | 'LG' | 'XL' | 'XXL';
export type AvatarType = 'Image' | 'Initials' | 'Fallback';
export type AvatarShape = 'Circle' | 'Rounded';
export type AvatarStatus = 'Online' | 'Offline' | 'Busy' | 'none';

export type AvatarProps = {
  size?: AvatarSize;
  type?: AvatarType;
  shape?: AvatarShape;
  source?: ImageSourcePropType;
  name?: string;
  status?: AvatarStatus;
};

// ── Size scale ────────────────────────────────────────────────────────────────

function getSizeScale(): Record<AvatarSize, {
  diameter: number;
  textStyle: object;
  iconSize: number;
  dotSize: number;
}> {
  return {
    XS: { diameter: 24, textStyle: typography.captionBold, iconSize: 12, dotSize: 6 },
    SM: { diameter: 32, textStyle: typography.captionBold, iconSize: 16, dotSize: 8 },
    MD: { diameter: 40, textStyle: typography.bodyDefaultBold, iconSize: 20, dotSize: 10 },
    LG: { diameter: 48, textStyle: typography.bodyDefaultBold, iconSize: 24, dotSize: 12 },
    XL: { diameter: 56, textStyle: typography.bodyLargeBold, iconSize: 32, dotSize: 14 },
    XXL: { diameter: 88, textStyle: typography.bodyLargeBold, iconSize: 40, dotSize: 16 },
  };
}

// ── Initials background palette ───────────────────────────────────────────────
// Deterministic: same name always gets the same colour.

function getInitialsBackgrounds() {
  return [
    colors.surfaceTertiary,
    colors.surfaceTertiary,
    colors.surfaceTertiary,
    colors.surfaceTertiary,
    colors.surfaceTertiary,
    colors.surfaceTertiary,
  ];
}

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return hash;
}

function getInitialsBg(name: string): string {
  const initialsBackgrounds = getInitialsBackgrounds();
  return initialsBackgrounds[hashName(name) % initialsBackgrounds.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// ── Status dot colours ────────────────────────────────────────────────────────

function getStatusColors(): Record<Exclude<AvatarStatus, 'none'>, string> {
  return {
    Online: colors.contentPositive,
    Offline: colors.contentTertiary,
    Busy: colors.contentNegative,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Avatar({
  size = 'MD',
  type = 'Fallback',
  shape = 'Circle',
  source,
  name = '',
  status = 'none',
}: AvatarProps) {
  const scale = getSizeScale()[size];
  const statusColors = getStatusColors();
  const borderRadius = shape === 'Circle' ? radius.pill : radius.lg;
  const initials = name ? getInitials(name) : '';
  const initialsBg = name ? getInitialsBg(name) : colors.surfaceSecondary;

  // Background colour for non-image types
  const bgColor =
    type === 'Image'    ? 'transparent'
    : type === 'Initials' ? initialsBg
    : colors.surfaceTertiary;

  return (
    <View style={{ width: scale.diameter, height: scale.diameter }}>
      {/* Avatar body */}
      <View
        style={{
          width: scale.diameter,
          height: scale.diameter,
          borderRadius,
          borderWidth:1,
          borderColor:colors.borderDefault,
          backgroundColor: bgColor,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {type === 'Image' && source ? (
          <Image
            source={source}
            style={{ width: scale.diameter, height: scale.diameter }}
            resizeMode="cover"
          />
        ) : type === 'Initials' && initials ? (
          <Text style={[scale.textStyle, { color: colors.contentSecondary }]}>
            {initials}
          </Text>
        ) : (
          <User
            size={scale.iconSize}
            color={colors.contentSecondary}
            weight="regular"
          />
        )}
      </View>

      {/* Status dot */}
      {status !== 'none' && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: scale.dotSize,
            height: scale.dotSize,
            borderRadius: radius.pill,
            backgroundColor: statusColors[status],
            borderWidth: 2,
            borderColor: colors.surfacePrimary,
          }}
        />
      )}
    </View>
  );
}
