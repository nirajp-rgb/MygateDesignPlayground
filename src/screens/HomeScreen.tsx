import { Text, View } from 'react-native';
import { ScreenFrame, SectionHeader, SurfaceCard, TemplateButton } from '../components';
import { ArrowRight, Palette, RocketLaunch, Shapes } from '../icons';
import type { PrototypeScreenKey } from './types';
import { colors, iconSize, radius, spacing, typography } from '../tokens';

type HomeScreenProps = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
};

const starterAreas = [
  {
    title: 'src/screens',
    detail: 'Build full prototype views here.',
    icon: RocketLaunch
  },
  {
    title: 'src/components',
    detail: 'Extract shared pieces once a pattern repeats.',
    icon: Shapes
  },
  {
    title: 'src/tokens',
    detail: 'Keep spacing, type, and color decisions consistent.',
    icon: Palette
  }
];

export function HomeScreen({ activeScreen, onNavigate }: HomeScreenProps) {
  return (
    <ScreenFrame
      eyebrow="Prototype Starter"
      title="Build fast, keep structure"
      description="This template stays intentionally small: token-driven UI, reusable components, and a screen-first structure that is ready for new concepts."
      activeScreen={activeScreen}
      onNavigate={onNavigate}
    >
      <SurfaceCard accent>
        <SectionHeader
          title="How to use this starter"
          subtitle="Replace these sections with your concept, then keep new full-page ideas inside src/screens."
        />
        <Text style={[typography.bodyDefault, { color: colors.contentOnDark }]}>
          Start from HomeScreen, clone TemplateScreen when you need a second flow, and promote repeated layout patterns into shared components.
        </Text>
        <TemplateButton label="Open the template screen" onPress={() => onNavigate('template')} />
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeader title="Core folders" subtitle="A predictable structure makes prototype handoff and reuse much easier." />
        <View style={{ gap: spacing.sm }}>
          {starterAreas.map((area) => {
            const AreaIcon = area.icon;

            return (
            <View
              key={area.title}
              style={{
                gap: spacing.xs,
                borderRadius: radius.sm,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
                backgroundColor: colors.surfaceTertiary,
                padding: spacing.md
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <AreaIcon size={iconSize.md} color={colors.contentAction} weight="duotone" />
                <Text style={typography.bodyDefaultBold}>{area.title}</Text>
              </View>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{area.detail}</Text>
            </View>
            );
          })}
        </View>
      </SurfaceCard>

      <SurfaceCard>
        <SectionHeader title="Template defaults" subtitle="These are the conventions already wired into the repo." />
        <View style={{ gap: spacing.md }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={typography.captionBold}>Expo Go ready</Text>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                Run `npm run start:tunnel` when you need a reliable device connection.
              </Text>
            </View>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={typography.captionBold}>Storybook included</Text>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                Keep shared primitives documented as the prototype grows.
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <TemplateButton label="Stay on this starter" emphasis="secondary" />
            <ArrowRight size={iconSize.md} color={colors.contentAction} weight="bold" />
          </View>
        </View>
      </SurfaceCard>
    </ScreenFrame>
  );
}
