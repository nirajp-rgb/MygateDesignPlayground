import type { ComponentType } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { IconWeight } from 'phosphor-react-native';
import { colors, iconSize, spacing, typography } from '../../tokens';
import { Button } from '../actions/Button';
import { IconTile } from '../data-display/IconTile';
import { SurfaceCard } from '../layout/SurfaceCard';

type BannerIcon = ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;
export type BannerTone = 'neutral' | 'info' | 'positive' | 'warning' | 'negative';
export type BannerProps = {
  icon?: BannerIcon;
  iconColor?: string;
  title: string;
  description?: string;
  tone?: BannerTone;
  actionLabel?: string;
  onActionPress?: () => void;
  onPress?: () => void;
  elevated?: boolean;
};

const toneColor: Record<BannerTone, string> = {
  neutral: colors.contentSecondary,
  info: colors.contentInfo,
  positive: colors.contentPositive,
  warning: colors.contentWarning,
  negative: colors.contentNegative,
};

export function Banner({ icon: Icon, iconColor, title, description, tone = 'neutral', actionLabel, onActionPress, onPress, elevated = false }: BannerProps) {
  const content = (
    <>
      {Icon ? <IconTile icon={Icon} iconColor={iconColor ?? toneColor[tone]} backgroundColor={colors.surfaceSecondary} iconSize={iconSize.lg} tileSize={40} /> : null}
      <View style={{ flex: 1, gap: spacing.xs }}>
        <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{title}</Text>
        {description ? <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>{description}</Text> : null}
      </View>
      {actionLabel ? <Button kind="Tertiary" size="SM" label={actionLabel} onPress={onActionPress} /> : null}
    </>
  );
  return (
    <SurfaceCard elevated={elevated}>
      {onPress ? <Pressable accessibilityRole="button" onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>{content}</Pressable> : <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>{content}</View>}
    </SurfaceCard>
  );
}
