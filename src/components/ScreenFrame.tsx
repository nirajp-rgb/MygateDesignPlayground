import type { ReactNode } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../tokens';
import type { PrototypeScreenKey } from '../screens';

type ScreenFrameProps = {
  eyebrow: string;
  title: string;
  description: string;
  activeScreen: PrototypeScreenKey;
  children: ReactNode;
  onNavigate: (screen: PrototypeScreenKey) => void;
};

const screenOptions: Array<{ key: PrototypeScreenKey; label: string }> = [
  { key: 'home', label: 'Home' },
  { key: 'template', label: 'Template' },
  { key: 'settings', label: 'Settings' },
  { key: 'dailyHelpProfile', label: 'Help Profile' },
  { key: 'appHome', label: 'App Home' },
  { key: 'quickActions', label: 'Quick Actions' },
];

export function ScreenFrame({
  eyebrow,
  title,
  description,
  activeScreen,
  children,
  onNavigate
}: ScreenFrameProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surfaceTertiary }}>
      <ScrollView
        contentContainerStyle={{
          gap: spacing.lg,
          padding: spacing.lg,
          paddingBottom: spacing.xxl
        }}
      >
        <View
          style={{
            gap: spacing.md,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfacePrimary,
            padding: spacing.lg
          }}
        >
          <Text style={[typography.captionBold, { color: colors.contentAction }]}>{eyebrow}</Text>
          <Text style={typography.titleScreen}>{title}</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>{description}</Text>
        </View>
        {children}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          gap: spacing.sm,
          borderTopWidth: 1,
          borderTopColor: colors.borderSubtle,
          backgroundColor: colors.surfacePrimary,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.md
        }}
      >
        {screenOptions.map((option) => {
          const isActive = option.key === activeScreen;

          return (
            <Pressable
              key={option.key}
              accessibilityRole="button"
              onPress={() => onNavigate(option.key)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: isActive ? colors.surfaceActionSecondary : colors.borderDefault,
                backgroundColor: isActive ? colors.surfaceActionSecondary : colors.surfacePrimary,
                paddingVertical: spacing.sm
              }}
            >
              <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentOnDark : colors.contentAction }]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
