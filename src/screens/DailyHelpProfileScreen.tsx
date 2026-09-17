import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  Phone,
  ShareNetwork,
  Ticket,
  PencilSimple,
  Sun,
  Moon,
  SunHorizon,
  CaretDown,
  CaretUp,
  House,
  Star,
  SignIn,
  SignOut as SignOutIcon,
  Clock,
} from 'phosphor-react-native';
import type { IconWeight } from 'phosphor-react-native';
import {
  AppHeader,
  Avatar,
  Button,
  IconButton,
  ListItem,
  ReviewCard,
  SectionHeader,
  SurfaceCard,
  Switch,
  Tag,
  Tile,
} from '../components';
import { appPagePaddingBottom, colors, iconSize, spacing, typography } from '../tokens';
import type { DailyHelpProfileVisitor, PrototypeScreenKey } from './types';

type Props = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
  onBack?: () => void;
  visitor?: DailyHelpProfileVisitor;
};

type TimeGroup = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;
  slots: string[];
};

const timeGroups: TimeGroup[] = [
  { icon: SunHorizon, slots: ['5 am - 6 pm', '6 am - 7 pm'] },
  { icon: Sun,        slots: ['12 pm - 1 pm'] },
  { icon: Moon,       slots: ['7 pm - 8 pm', '8 pm - 9 pm'] },
];

const ratingTiles = [
  { sublabel: '5', label: 'Very Punctual' },
  { sublabel: '5', label: 'Quite Regular' },
  { sublabel: '5', label: 'Exceptional Service' },
  { sublabel: '5', label: 'Great Attitude' },
];

const reviews = [
  { rating: 4.0, reviewText: 'Have never seen anybody so punctual. She comes right on time every day', date: '2 Feb 2024' },
  { rating: 4.0, reviewText: 'She comes right on time and does the work diligently.', date: '2 Feb 2024' },
];

const workplaces = [
  { flat: 'S3 703', since: 'Since 2 Years' },
  { flat: 'S3 703', since: 'Since 2 Years' },
  { flat: 'S3 703', since: 'Since 2 Years' },
];

const defaultVisitor: DailyHelpProfileVisitor = {
  name: 'Rupa chandrasekar',
  phone: '9876563578',
  status: 'Online',
};

export function DailyHelpProfileScreen({ onNavigate, onBack, visitor }: Props) {
  const [openToWork, setOpenToWork] = useState<'off' | 'on'>('off');
  const [worksExpanded, setWorksExpanded] = useState(true);
  const [notifExpanded, setNotifExpanded] = useState(true);
  const profile = visitor ?? defaultVisitor;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingBottom: appPagePaddingBottom }}>
      <AppHeader
        onBack={onBack ?? (() => onNavigate('home'))}
        variant="subtle"
        
        actions={[{ key: 'share', icon: ShareNetwork, accessibilityLabel: 'Share profile', onPress: () => {} }]}
      />

      <ScrollView
        contentContainerStyle={{ gap: spacing.md, padding: spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile card ───────────────────────────────────── */}
        <SurfaceCard elevated>
          {/* Avatar + name row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
            <Avatar
              size="XXL"
              type={profile.source ? 'Image' : 'Initials'}
              source={profile.source}
              name={profile.name}
              status={profile.status ?? 'none'}
            />
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={typography.titleSubsection}>{profile.name}</Text>
              <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>{profile.phone}</Text>
            </View>
          </View>

          {/* Action row: Call + Gatepass */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button kind="Positive" size="MD" label="Call" showLeftIcon leftIcon={() => <Phone size={iconSize.sm} color={colors.contentOnDark} weight="fill" />} fullWidth />
            </View>
            <View style={{ flex: 1 }}>
              <Button kind="Tertiary" size="MD" label="Gatepass" showLeftIcon leftIcon={Ticket} fullWidth />
            </View>
          </View>
        </SurfaceCard>

        {/* ── Mark as open to work ───────────────────────────── */}
        <SurfaceCard >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.sm }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Text style={typography.bodyLargeBold}>Mark as open to work</Text>
                <Tag kind="Info" variant="Solid" label="NEW" />
              </View>
              <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
                Increase Eam's chances of finding work by sharing their profile with others.
              </Text>
            </View>
            <Switch value={openToWork} onPress={() => setOpenToWork(v => v === 'off' ? 'on' : 'off')} />
          </View>
        </SurfaceCard>

        {/* ── Attendance ─────────────────────────────────────── */}
        <SurfaceCard >
          <SectionHeader
            title="Attendance"
            onPress={() => {}}
            rightSlot={
              <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>16/30</Text>
            }
          />
        </SurfaceCard>

        {/* ── Notification posture ───────────────────────────── */}
        <SurfaceCard >
          <SectionHeader
            title="Notification posture"
            rightSlot={
              <IconButton type="Ghost" size="SM" icon={notifExpanded ? CaretUp : CaretDown} accessibilityLabel={`${notifExpanded ? 'Collapse' : 'Expand'} notification posture`} onPress={() => setNotifExpanded(v => !v)} />
            }
          />
          {notifExpanded && (
            <View style={{ marginHorizontal: -spacing.lg }}>
              <ListItem
                label="Notify on Entry"
                size="Standard"
                artwork="Small"
                leadingArtwork={<SignIn size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
                controlElement={<Switch value="on" />}
                divider
              />
              <ListItem
                label="Notify on Exit"
                size="Standard"
                artwork="Small"
                leadingArtwork={<SignOutIcon size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
                controlElement={<Switch value="off" />}
                divider
              />
              <ListItem
                label="Notify during Time"
                size="Standard"
                artwork="Small"
                leadingArtwork={<Clock size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
                controlElement={<Switch value="off" />}
              />
            </View>
          )}
        </SurfaceCard>

        {/* ── Free time slots ────────────────────────────────── */}
        <SurfaceCard >
          <SectionHeader
            title="Free time slots"
            rightSlot={<PencilSimple size={iconSize.md} color={colors.contentTertiary} weight="regular" />}
          />

          <View style={{ gap: spacing.md }}>
            {timeGroups.map((group, gi) => {
              const GroupIcon = group.icon;
              return (
                <View key={gi} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <GroupIcon size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                  <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>
                    {group.slots.join('  •  ')}
                  </Text>
                </View>
              );
            })}
          </View>
        </SurfaceCard>

        {/* ── Ratings and reviews ────────────────────────────── */}
        <SurfaceCard >
          <SectionHeader
            title="Ratings and reviews"
            onPress={() => {}}
            subtitle="20 Ratings, 4 reviews"
            rightSlot={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 99, borderWidth: 1, borderColor: colors.borderDefault, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                <Star size={14} color={colors.contentWarning} weight="fill" />
                <Text style={typography.bodyDefaultBold}>4.0</Text>
              </View>
            }
          />

          {/* Rating tiles — static 4-column row */}
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            {ratingTiles.map((tile, i) => (
              <Tile key={i} artworkType="none" sublabel={tile.sublabel} label={tile.label} size="MD" />
            ))}
          </View>

          {/* Review cards — horizontal scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm }}>
              {reviews.map((review, i) => (
                <ReviewCard key={i} rating={review.rating} reviewText={review.reviewText} date={review.date} width={220} />
              ))}
            </View>
          </ScrollView>

          {/* Rate now — full width */}
          <Button kind="Secondary" size="LG" label="Rate now" fullWidth />
        </SurfaceCard>

        {/* ── Works in N houses ──────────────────────────────── */}
        <SurfaceCard >
          <SectionHeader
            title={`Works in ${workplaces.length} houses`}
            subtitle="Working in your society for 5 Years"
            rightSlot={
              <IconButton type="Ghost" size="SM" icon={worksExpanded ? CaretUp : CaretDown} accessibilityLabel={`${worksExpanded ? 'Collapse' : 'Expand'} workplaces`} onPress={() => setWorksExpanded(v => !v)} />
            }
          />

          {worksExpanded && (
            <View style={{ marginHorizontal: -spacing.lg }}>
              {workplaces.map((wp, i) => (
                <ListItem
                  key={i}
                  label={wp.flat}
                  paragraph={wp.since}
                  size="Standard"
                  artwork="Small"
                  leadingArtwork={<House size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
                  controlElement={<IconButton type="Positive" size="MD" icon={Phone} />}
                  divider={i < workplaces.length - 1}
                />
              ))}
            </View>
          )}
        </SurfaceCard>

      </ScrollView>
    </View>
  );
}
