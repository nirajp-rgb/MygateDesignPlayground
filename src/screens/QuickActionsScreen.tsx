import { ScrollView, View } from 'react-native';
import {
  X, Phone, EnvelopeOpen, Lock, Users, MapPin, BookOpen,
  User, FileText, Car, Briefcase, Lightbulb,
  Bell, House, Tag, Question,
  CalendarStarIcon,
} from 'phosphor-react-native';
import { AppHeader, Button, IconButton, SearchField, SectionHeader, TileGrid } from '../components';
import type { TileGridItem } from '../components';
import { appPagePaddingBottom, colors, spacing } from '../tokens';
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

export function QuickActionsScreen({ onNavigate, onClose }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage, paddingBottom: appPagePaddingBottom }}>
      {/* Header */}
      <AppHeader
        title="Quick Actions"
        variant="transparent"
        titleAlign="left"
        rightSlot={
          <IconButton type="Ghost" size="MD" icon={X} accessibilityLabel="Close quick actions" onPress={onClose} />
        }
      />

      {/* Search Bar */}
      <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md }}>
        <SearchField
          mode="trigger"
          placeholder="Search all features"
          onPress={() => onNavigate('searchExperience')}
        />
      </View>

      {/* Sections */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: spacing.md }}>
        {sections.map((section, idx) => (
          <View key={idx} style={{ marginBottom: spacing.lg , gap: spacing.md}}>
            {/* Section Header */}
            <SectionHeader
              title={section.title}
              rightSlot={
                section.actionLabel ? <Button kind={section.actionLabel === 'Raise Alert' ? 'Tertiary' : 'Link'} size={section.actionLabel === 'Raise Alert' ? 'SM' : 'MD'} label={section.actionLabel} /> : null}
            />

            {/* Tiles Grid */}
            <TileGrid items={section.items} columns={4} gap={spacing.sm} />
          </View>
        ))}

        {/* Bottom padding */}
        <View style={{ height: spacing.lg }} />
      </ScrollView>
    </View>
  );
}
