import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X, MagnifyingGlass, Phone, EnvelopeOpen, Lock, Users, MapPin, BookOpen,
  User, FileText, Car, Briefcase, Key, Lightbulb, Heart, Gear,
  Bell, House, Tag, Question,
  CalendarStarIcon,
} from 'phosphor-react-native';
import { TileGrid } from '../components/TileGrid';
import type { TileGridItem } from '../components/TileGrid';
import { appHeaderHeight, appPagePaddingBottom, colors, iconSize, radius, spacing, typography } from '../tokens';
import type { PrototypeScreenKey } from './types';

type Props = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
  onClose: () => void;
};

const sections = [
  {
    title: 'Visitors & Security',
    actionLabel: 'Raise Alert',
    actionColor: colors.contentNegative,
    items: [
      { label: 'Invite Guest', artworkType: 'icon' as const, icon: Users },
      { label: 'Cab/Auto', artworkType: 'icon' as const, icon: Car },
      { label: 'Allow Delivery', artworkType: 'icon' as const, icon: Users },
      { label: 'Visiting Help', artworkType: 'icon' as const, icon: Phone },
      { label: 'Call Security', artworkType: 'icon' as const, icon: Phone },
      { label: 'Message Guard', artworkType: 'icon' as const, icon: EnvelopeOpen },
      { label: 'My Passes', artworkType: 'icon' as const, icon: Lock },
      { label: 'Allow Kid Exit', artworkType: 'icon' as const, icon: Users },
    ] as TileGridItem[],
  },
  {
    title: 'Community',
    actionLabel: 'View all',
    actionColor: colors.contentAction,
    items: [
      { label: 'Resident Directory', artworkType: 'icon' as const, icon: Users },
      { label: 'Local Directory', artworkType: 'icon' as const, icon: MapPin },
      { label: 'Search Vehicle', artworkType: 'icon' as const, icon: Car },
      { label: 'Classes', artworkType: 'icon' as const, icon: Briefcase },
    ] as TileGridItem[],
  },
  {
    title: 'Feed',
    actionLabel: 'View all posts',
    actionColor: colors.contentAction,
    items: [
      { label: 'Create Post', artworkType: 'icon' as const, icon: FileText },
      { label: 'Create Poll', artworkType: 'icon' as const, icon: BookOpen },
      { label: 'Host an Event', artworkType: 'icon' as const, icon: CalendarStarIcon },
      { label: 'My Posts', artworkType: 'icon' as const, icon: FileText },
    ] as TileGridItem[],
  },
  {
    title: 'Smart Devices',
    actionLabel: undefined,
    items: [
      { label: 'Manage Locks', artworkType: 'icon' as const, icon: Lock },
      { label: 'Smart Access', artworkType: 'icon' as const, icon: Lightbulb },
      { label: 'Book a demo', artworkType: 'icon' as const, icon: Users },
      { label: 'Mygate Locks', artworkType: 'icon' as const, icon: Lock },
    ] as TileGridItem[],
  },
  {
    title: 'Marketplace',
    actionLabel: 'Explore',
    actionColor: colors.contentAction,
    items: [
      { label: 'Create a listing', artworkType: 'icon' as const, icon: Tag },
      { label: 'Find Homes', artworkType: 'icon' as const, icon: House },
      { label: 'Used Vehicles', artworkType: 'icon' as const, icon: Car },
      { label: 'My Listings', artworkType: 'icon' as const, icon: BookOpen },
    ] as TileGridItem[],
  },
  {
    title: 'Household',
    actionLabel: 'Manage',
    actionColor: colors.contentAction,
    items: [
      { label: 'My Family', artworkType: 'icon' as const, icon: Users },
      { label: 'Daily Help', artworkType: 'icon' as const, icon: User },
      { label: 'Home Planner', artworkType: 'icon' as const, icon: House },
      { label: 'My Vehicles', artworkType: 'icon' as const, icon: Car },
    ] as TileGridItem[],
  },
  {
    title: 'Settings',
    actionLabel: 'View all',
    actionColor: colors.contentAction,
    items: [
      { label: 'Test Notification', artworkType: 'icon' as const, icon: Bell },
      { label: 'My Flat', artworkType: 'icon' as const, icon: House },
      { label: 'My Plans', artworkType: 'icon' as const, icon: Tag },
      { label: 'Help & Feedback', artworkType: 'icon' as const, icon: Question },
    ] as TileGridItem[],
  },
];

// Simple Calendar icon since phosphor might not have it
function Calendar(props: any) {
  return (
    <View
      style={{
        width: props.size || 24,
        height: props.size || 24,
        borderWidth: 2,
        borderColor: props.color || colors.contentSecondary,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View style={{ width: '80%', height: 2, backgroundColor: props.color || colors.contentSecondary }} />
    </View>
  );
}

export function QuickActionsScreen({ onNavigate, onClose }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage, paddingBottom: appPagePaddingBottom }}>
      {/* Header */}
      <View style={{ paddingTop: insets.top, backgroundColor: colors.surfacePage }}>
        <View style={{ minHeight: appHeaderHeight, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={typography.titleSubsection}>Quick Actions</Text>
          <Pressable onPress={onClose}>
            <X size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
          </Pressable>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
        <Pressable
          onPress={() => onNavigate('searchExperience')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceSecondary,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.md
          }}
        >
          <MagnifyingGlass size={iconSize.md} color={colors.contentTertiary} weight="regular" />
          <Text style={[typography.bodyDefault, { flex: 1, marginLeft: spacing.xs, color: colors.contentTertiary }]}>Search all features</Text>
        </Pressable>
      </View>

      {/* Sections */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: spacing.md }}>
        {sections.map((section, idx) => (
          <View key={idx} style={{ marginBottom: spacing.lg }}>
            {/* Section Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md , marginHorizontal:spacing.md}}>
              <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{section.title}</Text>
              {section.actionLabel && section.actionLabel === 'Raise Alert' ? (
                <Pressable
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.xs,
                    borderRadius: radius.pill,
                    borderWidth: 1,
                    borderColor: colors.contentNegative,
                  }}
                >
                  <Text style={[typography.bodySmallBold, { color: colors.contentNegative }]}>
                    {section.actionLabel}
                  </Text>
                </Pressable>
              ) : section.actionLabel ? (
                <Pressable>
                  <Text style={[typography.bodySmallBold, { color: section.actionColor }]}>
                    {section.actionLabel}
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {/* Tiles Grid */}
            <TileGrid items={section.items} columns={4} gap={spacing.xs} />
          </View>
        ))}

        {/* Bottom padding */}
        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </View>
  );
}
