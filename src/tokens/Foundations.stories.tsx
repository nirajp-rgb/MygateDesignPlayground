import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View, type TextStyle } from 'react-native';
import {
  colors,
  elevation,
  iconSize,
  radius,
  semanticColorsByMode,
  spacing,
  typography,
  typographyByMode,
} from './index';

const meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The production design tokens used by every component. Use semantic aliases from src/tokens; do not copy raw values into product UI.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function Page({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <View style={{ minHeight: '100%', backgroundColor: colors.surfacePage, padding: spacing.xl }}>
      <View style={{ width: '100%', maxWidth: 1180, alignSelf: 'center', gap: spacing.xl }}>
        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.titleScreen, { color: colors.contentPrimary }]}>{title}</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary, maxWidth: 760 }]}>{intro}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

function Section({ title, usage, children }: { title: string; usage: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.titleSection, { color: colors.contentPrimary }]}>{title}</Text>
        <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{usage}</Text>
      </View>
      {children}
    </View>
  );
}

function TokenLabel({ name, value }: { name: string; value: string }) {
  return (
    <View style={{ gap: 2, flexShrink: 1 }}>
      <Text selectable style={[typography.bodySmallBold, { color: colors.contentPrimary }]}>{name}</Text>
      <Text selectable style={[typography.caption, { color: colors.contentTertiary }]}>{value}</Text>
    </View>
  );
}

export const Colors: Story = {
  render: () => (
    <Page title="Color" intro="Semantic color names describe intent and automatically follow the light or dark theme selected in the Storybook toolbar.">
      <Section title="Semantic colors" usage="Use content tokens for text/icons, surface tokens for fills, and border tokens for outlines and dividers.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {Object.entries(colors).map(([name, value]) => (
            <View key={name} style={{ width: 180, minWidth: 150, flexGrow: 1, maxWidth: 230, overflow: 'hidden', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.borderSubtle, backgroundColor: colors.surfacePrimary }}>
              <View style={{ height: 72, backgroundColor: value, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle }} />
              <View style={{ padding: spacing.md }}><TokenLabel name={`colors.${name}`} value={value} /></View>
            </View>
          ))}
        </View>
      </Section>
      <Section title="Mode source" usage="The toolbar changes the active mode. These are the canonical semantic values available to the runtime.">
        <Text selectable style={[typography.bodySmall, { color: colors.contentSecondary }]}>
          {Object.keys(semanticColorsByMode.light).length} light tokens · {Object.keys(semanticColorsByMode.dark).length} dark tokens
        </Text>
      </Section>
    </Page>
  ),
};

export const Typography: Story = {
  render: () => (
    <Page title="Typography" intro="Archivo is the product typeface. Choose the semantic style that matches the information hierarchy instead of setting font metrics directly.">
      <Section title="Type scale" usage="Display styles lead pages and sections; body styles carry content; bold variants add emphasis within the same level.">
        <View style={{ gap: spacing.sm }}>
          {Object.entries(typographyByMode.light).map(([name, style]) => (
            <View key={name} style={{ paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, gap: spacing.xs }}>
              <Text style={[style as TextStyle, { color: colors.contentPrimary }]}>The quick brown fox jumps over the lazy dog</Text>
              <TokenLabel name={`typography.${name}`} value={`${style.fontSize}px / ${style.lineHeight}px · ${style.fontWeight}`} />
            </View>
          ))}
        </View>
      </Section>
    </Page>
  ),
};

export const SpacingAndRadius: Story = {
  name: 'Spacing & radius',
  render: () => (
    <Page title="Spacing and radius" intro="Spacing creates a consistent rhythm; radius communicates the shape hierarchy of controls, cards, and pills.">
      <Section title="Spacing" usage="Use smaller values inside components and larger values between content groups and page sections.">
        <View style={{ gap: spacing.md }}>
          {Object.entries(spacing).map(([name, value]) => (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <View style={{ width: Math.max(value, 2), height: 20, backgroundColor: colors.surfaceActionSecondary, borderRadius: radius.sm }} />
              <TokenLabel name={`spacing.${name}`} value={`${value}px`} />
            </View>
          ))}
        </View>
      </Section>
      <Section title="Radius" usage="Use pill for circular or capsule controls; use the stepped scale for increasingly prominent surfaces.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
          {Object.entries(radius).map(([name, value]) => (
            <View key={name} style={{ width: 150, height: 96, padding: spacing.md, justifyContent: 'flex-end', borderRadius: value, backgroundColor: colors.surfaceSecondary, borderWidth: 1, borderColor: colors.borderDefault }}>
              <TokenLabel name={`radius.${name}`} value={`${value}px`} />
            </View>
          ))}
        </View>
      </Section>
    </Page>
  ),
};

export const IconsAndElevation: Story = {
  name: 'Icons & elevation',
  render: () => (
    <Page title="Icons and elevation" intro="Icon sizes align symbols with typography. Elevation is reserved for temporary layers and surfaces that need spatial separation.">
      <Section title="Icon sizes" usage="Use the smallest size that remains clear at the component's intended touch and reading scale.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', gap: spacing.xl }}>
          {Object.entries(iconSize).map(([name, value]) => (
            <View key={name} style={{ gap: spacing.sm, alignItems: 'center' }}>
              <View style={{ width: value, height: value, borderRadius: radius.sm, backgroundColor: colors.surfaceActionSecondary }} />
              <TokenLabel name={`iconSize.${name}`} value={`${value}px`} />
            </View>
          ))}
        </View>
      </Section>
      <Section title="Elevation" usage="Prefer borders for resting surfaces. Use elevation for floating, focused, modal, and overlay states.">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xl }}>
          {Object.entries(elevation).map(([name, value]) => (
            <View key={name} style={[{ width: 150, height: 96, padding: spacing.md, justifyContent: 'flex-end', borderRadius: radius.lg, backgroundColor: colors.surfacePrimary }, value]}>
              <TokenLabel name={`elevation.${name}`} value={`level ${name}`} />
            </View>
          ))}
        </View>
      </Section>
    </Page>
  ),
};
