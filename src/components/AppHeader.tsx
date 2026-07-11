import type { ComponentType, ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'phosphor-react-native';
import { appHeaderHeight, colors, iconSize, spacing, typography } from '../tokens';

type HeaderIconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
type HeaderIconComponent = ComponentType<{ size?: number; color?: string; weight?: HeaderIconWeight }>;

export type AppHeaderVariant = 'default' | 'subtle' | 'solid' | 'transparent' | 'appHome';
export type AppHeaderAlign = 'left' | 'center';

export type AppHeaderAction = {
  key: string;
  icon: HeaderIconComponent;
  onPress?: () => void;
  accessibilityLabel: string;
  disabled?: boolean;
  badgeCount?: number;
};

export type AppHeaderProps = {
  title?: string;
  subtitle?: string;
  variant?: AppHeaderVariant;
  titleAlign?: AppHeaderAlign;
  showBottomBorder?: boolean;
  safeTop?: boolean;
  onBack?: () => void;
  backIcon?: HeaderIconComponent;
  backLabel?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  actions?: AppHeaderAction[];
  sticky?: boolean;
  showShadow?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  titleContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

const SIDE_MIN_WIDTH = 40;
const TOUCH_TARGET = 40;

export function AppHeader({
  title,
  subtitle,
  variant = 'default',
  titleAlign = 'center',
  showBottomBorder,
  safeTop = true,
  onBack,
  backIcon: BackIcon = ArrowLeft,
  backLabel = 'Go back',
  leftSlot,
  rightSlot,
  actions = [],
  sticky = false,
  showShadow = false,
  backgroundColor,
  borderColor,
  titleColor,
  subtitleColor,
  iconColor,
  style,
  contentStyle,
  titleContainerStyle,
  testID
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();
  const effectiveBottomBorder = showBottomBorder ?? variant === 'solid';

  const paletteByVariant: Record<AppHeaderVariant, { backgroundColor: string; titleColor: string; subtitleColor: string; iconColor: string }> = {
    default: {
      backgroundColor: colors.surfacePrimary,
      titleColor: colors.contentPrimary,
      subtitleColor: colors.contentSecondary,
      iconColor: colors.contentSecondary
    },
    subtle: {
      backgroundColor: colors.surfaceSecondary,
      titleColor: colors.contentPrimary,
      subtitleColor: colors.contentSecondary,
      iconColor: colors.contentSecondary
    },
    solid: {
      backgroundColor: colors.surfacePrimary,
      titleColor: colors.contentPrimary,
      subtitleColor: colors.contentSecondary,
      iconColor: colors.contentSecondary
    },
    transparent: {
      backgroundColor: 'transparent',
      titleColor: colors.contentPrimary,
      subtitleColor: colors.contentSecondary,
      iconColor: colors.contentSecondary
    },
    appHome: {
      backgroundColor: colors.surfacePage,
      titleColor: colors.contentPrimary,
      subtitleColor: colors.contentSecondary,
      iconColor: colors.contentSecondary
    }
  };

  const palette = paletteByVariant[variant];
  const resolvedBackgroundColor = backgroundColor ?? palette.backgroundColor;
  const resolvedBorderColor = borderColor ?? (variant === 'solid' ? colors.borderDefault : colors.borderSubtle);
  const resolvedTitleColor = titleColor ?? palette.titleColor;
  const resolvedSubtitleColor = subtitleColor ?? palette.subtitleColor;
  const resolvedIconColor = iconColor ?? palette.iconColor;

  function renderIconButton({
    Icon,
    onPress,
    accessibilityLabel,
    disabled = false,
    badgeCount
  }: {
    Icon: HeaderIconComponent;
    onPress?: () => void;
    accessibilityLabel: string;
    disabled?: boolean;
    badgeCount?: number;
  }) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        disabled={disabled || !onPress}
        onPress={onPress}
        style={({ pressed }) => ({
          width: TOUCH_TARGET,
          height: TOUCH_TARGET,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1
        })}
      >
        <View>
          <Icon size={iconSize.md} color={disabled ? colors.contentTertiary : resolvedIconColor} weight="regular" />
          {badgeCount && badgeCount > 0 ? (
            <View
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                minWidth: 16,
                height: 16,
                paddingHorizontal: 4,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 999,
                backgroundColor: colors.contentNegative,
                borderWidth: 1.5,
                borderColor: resolvedBackgroundColor
              }}
            >
              <Text style={[typography.captionBold, { color: colors.contentOnDark }]}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }

  const hasTitleBlock = Boolean(title || subtitle);
  const renderedActions =
    rightSlot ??
    actions.slice(0, 2).map((action) =>
      renderIconButton({
        Icon: action.icon,
        onPress: action.onPress,
        accessibilityLabel: action.accessibilityLabel,
        disabled: action.disabled,
        badgeCount: action.badgeCount
      })
    );

  return (
    <View
      testID={testID}
      style={[
        {
          paddingTop: safeTop ? insets.top : 0,
          backgroundColor: resolvedBackgroundColor,
          borderBottomWidth: effectiveBottomBorder ? 1 : 0,
          borderBottomColor: resolvedBorderColor
        },
        sticky || showShadow
          ? {
              shadowColor: colors.effectShadowColor,
              shadowOpacity: 0.04,
              shadowRadius: 2,
              shadowOffset: { width: 0, height: 2 },
              elevation: 2
            }
          : null,
        style
      ]}
    >
      <View
        style={[
          {
            minHeight: appHeaderHeight,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm
          },
          contentStyle
        ]}
      >
        {variant === 'appHome' ? (
          <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
              {leftSlot}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: spacing.lg
              }}
            >
              {renderedActions}
            </View>
          </>
        ) : (
          <>
            <View style={{ minWidth: SIDE_MIN_WIDTH, justifyContent: 'center', alignItems: 'flex-start' }}>
              {leftSlot ??
                (onBack
                  ? renderIconButton({
                      Icon: BackIcon,
                      onPress: onBack,
                      accessibilityLabel: backLabel
                    })
                  : null)}
            </View>

            <View
              style={[
                {
                  flex: 1,
                  marginHorizontal: spacing.sm,
                  alignItems: titleAlign === 'center' ? 'center' : 'flex-start',
                  justifyContent: 'center',
                  gap: subtitle ? spacing.xs : 0
                },
                titleContainerStyle
              ]}
            >
              {hasTitleBlock ? (
                <>
                  {title ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        subtitle ? typography.bodySmall : typography.titleSubsection,
                        {
                          color: resolvedTitleColor,
                          textAlign: titleAlign
                        }
                      ]}
                    >
                      {title}
                    </Text>
                  ) : null}
                  {subtitle ? (
                    <Text
                      numberOfLines={1}
                      style={[
                        typography.bodySmall,
                        {
                          color: resolvedSubtitleColor,
                          textAlign: titleAlign
                        }
                      ]}
                    >
                      {subtitle}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </View>

            <View
              style={{
                minWidth: SIDE_MIN_WIDTH,
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: spacing.sm
              }}
            >
              {renderedActions}
            </View>
          </>
        )}
      </View>
    </View>
  );
}
