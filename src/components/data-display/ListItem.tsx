import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { TextStyle } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { colors, iconSize, spacing, typography, radius } from '../../tokens';
import { IconTile, type IconTileIcon, type IconTileSize, type IconTileTone } from './IconTile';

export type ListItemSize = 'Large' | 'Standard' | 'Compact';
export type ListItemArtwork = 'None' | 'Small';
export type ListItemLayout = 'Simple' | 'Label trailing';
export type ListItemSurface = 'primary' | 'transparent';
export type ListItemTitleWeight = 'regular' | 'bold';

export type ListItemProps = {
  size?: ListItemSize;
  artwork?: ListItemArtwork;
  layout?: ListItemLayout;
  surface?: ListItemSurface;
  label?: string;
  titleWeight?: ListItemTitleWeight;
  paragraph?: string;
  trailingLabel?: string;
  trailingParagraph?: string;
  supportText?: string;
  thirdLine?: boolean;
  divider?: boolean;
  leadingArtwork?: ReactNode;
  artworkIcon?: IconTileIcon;
  artworkTone?: IconTileTone;
  artworkSize?: IconTileSize;
  /** Replaces the prescribed artwork and text anatomy with fully composed content. */
  leftSlot?: ReactNode;
  /** Replaces the default caret/control area with fully composed content. */
  rightSlot?: ReactNode;
  controlElement?: ReactNode | null;
  titleContent?: ReactNode;
  subtitleContent?: ReactNode;
  metadataContent?: ReactNode;
  trailingContent?: ReactNode;
  labelColor?: string;
  labelStyle?: TextStyle;
  iconBacking?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
};

const ARTWORK_WIDTH = 56;

export function ListItem({
  size = 'Standard',
  artwork = 'None',
  layout = 'Simple',
  surface = 'primary',
  label = 'Label',
  titleWeight = 'regular',
  paragraph,
  trailingLabel = 'Label',
  trailingParagraph = 'Paragraph',
  supportText = 'Support text',
  thirdLine = false,
  divider = false,
  leadingArtwork,
  artworkIcon,
  artworkTone = 'Neutral',
  artworkSize = 'MD',
  leftSlot,
  rightSlot,
  controlElement,
  titleContent,
  subtitleContent,
  metadataContent,
  trailingContent,
  labelColor,
  labelStyle,
  iconBacking = false,
  onPress,
  accessibilityLabel,
}: ListItemProps) {
  const supportsDetails = size !== 'Compact';
  const hasArtwork = artwork === 'Small';
  const isLabelTrailing = layout === 'Label trailing';

  const verticalPadding: Record<ListItemSize, number> = {
    Large: spacing.xl,
    Standard: spacing.lg,
    Compact: spacing.sm,
  };
  const textGap = supportsDetails ? spacing.xs : 0;

  const defaultControl = (
    <CaretRight size={iconSize.md} color={colors.contentTertiary} weight="regular" />
  );

  return (
    <View style={{ backgroundColor: surface === 'transparent' ? 'transparent' : colors.surfacePrimary }}>
      {/* Main row — height comes from content + padding, not a fixed value */}
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel ?? label}
        disabled={!onPress}
        onPress={onPress}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'stretch', opacity: pressed ? 0.85 : 1 })}
      >

        {/* Leading artwork slot — stretches to match row height */}
        {leftSlot === undefined && hasArtwork && (
          <View style={{ width: ARTWORK_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
            {artworkIcon ? (
              <IconTile icon={artworkIcon} tone={artworkTone} size={artworkSize} cornerRadius={radius.pill}/>
            ) : iconBacking ? (
              <IconTile tone={artworkTone} size={artworkSize} cornerRadius={radius.pill}>{leadingArtwork ?? null}</IconTile>
            ) : leadingArtwork ?? null}
          </View>
        )}

        {/* Text block — drives the row height via padding + line heights */}
        {leftSlot !== undefined ? (
          <View
            style={{
              flex: 1,
              paddingLeft: spacing.lg,
              paddingVertical: verticalPadding[size],
              justifyContent: 'center',
            }}
          >
            {leftSlot}
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              paddingLeft: hasArtwork ? 0 : spacing.lg,
              paddingVertical: verticalPadding[size],
              gap: textGap,
              justifyContent: 'center',
            }}
          >
            {/* Top row: label + optional trailing label */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {titleContent ?? <Text
                numberOfLines={1}
                style={[
                  titleWeight === 'bold' ? typography.bodyDefaultBold : typography.bodyDefault,
                  { flex: 1, color: labelColor ?? colors.contentPrimary },
                  labelStyle ?? {},
                ]}
              >{label}</Text>}
              {isLabelTrailing && (
                <Text
                  numberOfLines={1}
                  style={[typography.bodyDefault, { color: colors.contentSecondary, marginLeft: spacing.sm }]}
                >
                  {trailingLabel}
                </Text>
              )}
            </View>

            {/* Paragraph row (non-compact sizes only, when paragraph is provided) */}
            {subtitleContent ?? (supportsDetails && !!paragraph ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  numberOfLines={3}
                  style={[typography.bodyDefault, { flex: 1, color: colors.contentTertiary }]}
                >
                  {paragraph}
                </Text>
                {isLabelTrailing && (
                  <Text
                    numberOfLines={1}
                    style={[typography.caption, { color: colors.contentSecondary, marginLeft: spacing.sm }]}
                  >
                    {trailingParagraph}
                  </Text>
                )}
              </View>
            ) : null)}

            {/* Support text / third line (non-compact sizes only) */}
            {metadataContent ?? (supportsDetails && thirdLine ? (
              <Text
                numberOfLines={1}
                style={[typography.caption, { color: colors.contentSecondary }]}
              >
                {supportText}
              </Text>
            ) : null)}
          </View>
        )}

        {/* Control slot — stretches to match row, centred internally */}
        <View style={{ paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          {rightSlot !== undefined
            ? rightSlot
            : trailingContent ?? (controlElement !== undefined ? controlElement : defaultControl)}
        </View>
      </Pressable>

      {/* Divider — indented to align with the text start */}
      {divider && (
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.borderSubtle,
            marginLeft: leftSlot !== undefined ? spacing.lg : hasArtwork ? ARTWORK_WIDTH : spacing.lg,
          }}
        />
      )}
    </View>
  );
}
