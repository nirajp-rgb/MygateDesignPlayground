import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import type { TextStyle } from 'react-native';
import { CaretRight } from 'phosphor-react-native';
import { colors, iconSize, radius, spacing, typography } from '../tokens';

export type ListItemSize = 'Standard' | 'Compact';
export type ListItemArtwork = 'None' | 'Small';
export type ListItemLayout = 'Simple' | 'Label trailing';

export type ListItemProps = {
  size?: ListItemSize;
  artwork?: ListItemArtwork;
  layout?: ListItemLayout;
  label?: string;
  paragraph?: string;
  trailingLabel?: string;
  trailingParagraph?: string;
  supportText?: string;
  thirdLine?: boolean;
  divider?: boolean;
  leadingArtwork?: ReactNode;
  controlElement?: ReactNode | null;
  labelColor?: string;
  labelStyle?: TextStyle;
  iconBacking?: boolean;
};

const ARTWORK_WIDTH = 56;

export function ListItem({
  size = 'Standard',
  artwork = 'None',
  layout = 'Simple',
  label = 'Label',
  paragraph,
  trailingLabel = 'Label',
  trailingParagraph = 'Paragraph',
  supportText = 'Support text',
  thirdLine = false,
  divider = false,
  leadingArtwork,
  controlElement,
  labelColor,
  labelStyle,
  iconBacking = false,
}: ListItemProps) {
  const isStandard = size === 'Standard';
  const hasArtwork = artwork === 'Small';
  const isLabelTrailing = layout === 'Label trailing';

  const verticalPadding = isStandard ? spacing.lg : spacing.md;
  const textGap = isStandard ? spacing.xs : 0;

  const defaultControl = (
    <CaretRight size={iconSize.md} color={colors.contentTertiary} weight="regular" />
  );

  return (
    <View style={{ backgroundColor: colors.surfacePrimary }}>
      {/* Main row — height comes from content + padding, not a fixed value */}
      <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>

        {/* Leading artwork slot — stretches to match row height */}
        {hasArtwork && (
          <View style={{ width: ARTWORK_WIDTH, alignItems: 'center', justifyContent: 'center' }}>
            {iconBacking ? (
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surfaceSecondary,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {leadingArtwork ?? null}
              </View>
            ) : (
              leadingArtwork ?? null
            )}
          </View>
        )}

        {/* Text block — drives the row height via padding + line heights */}
        <View
          style={{
            flex: 1,
            paddingLeft: hasArtwork ? 0 : spacing.lg,
            paddingVertical: verticalPadding,
            gap: textGap,
            justifyContent: 'center',
          }}
        >
          {/* Top row: label + optional trailing label */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              numberOfLines={1}
              style={[typography.bodyLarge, { flex: 1, color: labelColor ?? colors.contentPrimary }, labelStyle ?? {}]}
            >
              {label}
            </Text>
            {isLabelTrailing && (
              <Text
                numberOfLines={1}
                style={[typography.bodyDefault, { color: colors.contentSecondary, marginLeft: spacing.sm }]}
              >
                {trailingLabel}
              </Text>
            )}
          </View>

          {/* Paragraph row (Standard only, when paragraph is provided) */}
          {isStandard && !!paragraph && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                numberOfLines={1}
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
          )}

          {/* Support text / third line (Standard only) */}
          {isStandard && thirdLine && (
            <Text
              numberOfLines={1}
              style={[typography.caption, { color: colors.contentSecondary }]}
            >
              {supportText}
            </Text>
          )}
        </View>

        {/* Control slot — stretches to match row, centred internally */}
        <View style={{ paddingHorizontal: spacing.lg, alignItems: 'center', justifyContent: 'center' }}>
          {controlElement !== undefined ? controlElement : defaultControl}
        </View>
      </View>

      {/* Divider — indented to align with the text start */}
      {divider && (
        <View
          style={{
            height: 0.5,
            backgroundColor: colors.borderSubtle,
            marginLeft: hasArtwork ? ARTWORK_WIDTH : spacing.lg,
          }}
        />
      )}
    </View>
  );
}
