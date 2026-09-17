import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  Bell,
  ShieldWarning,
  ShoppingBag,
  CreditCard,
  House,
  PlusCircle,
  ChatCircleDots,
  ShareNetwork,
  User,
  SignOut,
  CaretRight,
  QrCode,
  Devices,
  UsersThree,
  Car,
  PawPrint,
  UserList,
  Moon,
  Sun,
  CaretRightIcon,
} from 'phosphor-react-native';
import {
  AppHeader,
  Button,
  ListGroup,
  ListItem,
  IconButton,
  SectionHeader,
  SurfaceCard,
  Switch,
  Tag,
  TileGrid,
} from '../components';
import { appPagePaddingBottom, colors, iconSize, spacing, typography } from '../tokens';
import type { Mode } from '../tokens/color';
import type { IconWeight } from 'phosphor-react-native';
import type { ImageSourcePropType } from 'react-native';
import { ProfilePhotoButton } from '../patterns/settings';

type HouseholdTile = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;
  label: string;
  subtext: string;
};

const householdTiles: HouseholdTile[] = [
  { icon: House, label: 'Urban Company', subtext: 'Subtext' },
  { icon: UsersThree, label: 'Family', subtext: '2 members' },
  { icon: UserList, label: 'Daily Help', subtext: 'Manjunath +2' },
  { icon: Car, label: 'Vehicles', subtext: 'DL9C744g +1' },
  { icon: PawPrint, label: 'Pets', subtext: 'Subtext' },
  { icon: House, label: 'Early approvals', subtext: 'Subtext' },
];

type Flat = {
  label: string;
  status?: 'Active' | 'Pending approval';
};

const flats: Flat[] = [
  { label: 'B 201, Platinum City', status: 'Active' },
  { label: '8E, Habitat Crest' },
  { label: '8E, Habitat Crest', status: 'Pending approval' },
];

type SettingsScreenProps = {
  onBack?: () => void;
  themeMode: Mode;
  onToggleTheme: () => void;
  profilePhotoSource?: ImageSourcePropType;
  onOpenFaceCapture: () => void;
  onOpenFamily: () => void;
};

export function SettingsScreen({ onBack, themeMode, onToggleTheme, profilePhotoSource, onOpenFaceCapture, onOpenFamily }: SettingsScreenProps) {
  const [flashApprovalsEnabled, setFlashApprovalsEnabled] = useState(false);
  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingBottom: appPagePaddingBottom }}>
      <AppHeader
        title="Settings"
        variant="transparent"
        titleAlign="left"
        onBack={onBack}
        rightSlot={
          <IconButton type="Ghost" size="MD" icon={themeMode === 'dark' ? Sun : Moon} accessibilityLabel={`Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode`} onPress={onToggleTheme} />
        }
      />

      <ScrollView
        contentContainerStyle={{ gap: spacing.xl, padding: spacing.md, paddingBottom: spacing.xxl }}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile card ───────────────────────────────────── */}
        <SurfaceCard borderWidth={0} elevated>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xl ,paddingVertical:spacing.lg,paddingHorizontal:spacing.lg}}>
            <View>
              <ProfilePhotoButton source={profilePhotoSource} name="Niraj Pangarkar" onPress={onOpenFaceCapture} />
              <View style={{ marginTop: -spacing.xl, alignSelf: 'center' }}><IconButton type="Tertiary" size="SM" icon={QrCode} accessibilityLabel="Show QR code" /></View>
            </View>

            <View style={{ flex: 1, gap: spacing.sm }}>
              <Text style={typography.titleSubsection}>Niraj Pangarkar</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <House size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
                <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>B 102</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <User size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
                <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>Residing Owner</Text>
              </View>
              <Button kind="Link" size="MD" showRightIcon rightIcon = {CaretRightIcon} label="View activity"  />
            </View>
          </View>
        </SurfaceCard>

        {/* ── App update banner ──────────────────────────────── */}
        <SurfaceCard borderWidth={0}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <Devices size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={typography.bodyDefaultBold}>App update available</Text>
            <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>v7.13.0</Text>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <Button kind="Primary"  size="SM" label="Update" />
          </View>
          </View>
        </SurfaceCard>

        {/* ── Household ──────────────────────────────────────── */}
        <View style={{ gap: spacing.sm }}>
          <SectionHeader title="Household" actionLabel="Manage" />
          <TileGrid columns={3} gap={spacing.sm} items={householdTiles.map((tile) => ({ key: tile.label, label: tile.label, sublabel: tile.subtext, artworkType: 'icon', icon: tile.icon, variant: 'card', contentAlign: 'left', onPress: tile.label === 'Family' ? onOpenFamily : undefined }))} />
        </View>

        {/* ── Security & Notifications ───────────────────────── */}
        <View style={{ gap: spacing.sm }}>
          <SectionHeader title="Security & Notifications" />
          <View style={{ gap: spacing.sm }}>
          <ListGroup>
            <ListItem
              label="Notification Settings"
              size="Standard"
              artwork="Small"
              leadingArtwork={<Bell size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
              divider
            />
            <ListItem
              label="Security Alert List"
              size="Standard"
              artwork="Small"
              leadingArtwork={<ShieldWarning size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            />
          </ListGroup>

          {/* Flash Approvals */}
          <SurfaceCard borderWidth={0}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={typography.bodyDefaultBold}>Flash Approvals</Text>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                Never miss approvals again.{' '}
                <Text style={[typography.bodySmallBold, { color: colors.contentPrimary, textDecorationLine: 'underline' }]}>
                  Learn more
                </Text>
              </Text>
            </View>
            <Switch value={flashApprovalsEnabled ? 'on' : 'off'} onPress={() => setFlashApprovalsEnabled((enabled) => !enabled)} />
            </View>
          </SurfaceCard>

          {/* Not Getting Notifications */}
          <SurfaceCard accent borderWidth={1}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>
                Not Getting Notifications?
              </Text>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                Try sending a test notification
              </Text>
            </View>
            <Button kind="Tertiary" size="SM" label="Test now" />
            </View>
          </SurfaceCard>
          </View>
        </View>

        {/* ── Manage Flats ───────────────────────────────────── */}
        <View style={{ gap: spacing.sm }}>
          <SectionHeader title="Manage Flats" />
          <ListGroup>
          {flats.map((flat, i) => (
            <ListItem
              key={i}
              label={flat.label}
              size="Standard"
              artwork="Small"
              leadingArtwork={<House size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
              controlElement={
                flat.status ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                    <Tag
                      kind={flat.status === 'Active' ? 'Positive' : 'Warning'}
                      variant="Outlined"
                      label={flat.status}
                    />
                    <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
                  </View>
                ) : undefined
              }
              divider={i < flats.length - 1}
            />
          ))}
          <ListItem
            label="Add Flat/Villa"
            size="Standard"
            artwork="Small"
            leadingArtwork={<PlusCircle size={iconSize.md} color={colors.contentAction} weight="regular" />}
            labelStyle={{ ...typography.bodyDefaultBold, color: colors.contentAction }}
            controlElement={null}
          />
        </ListGroup>
        </View>

        {/* ── Purchases ──────────────────────────────────────── */}
        <View style={{ gap: spacing.sm }}>
          <SectionHeader title="Purchases" />
          <ListGroup>
          <ListItem
            label="My Orders"
            size="Standard"
            artwork="Small"
            leadingArtwork={<ShoppingBag size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            divider
          />
          <ListItem
            label="My Plans"
            size="Standard"
            artwork="Small"
            leadingArtwork={<CreditCard size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
          />
        </ListGroup>
        </View>

        {/* ── General Settings ───────────────────────────────── */}
        <View style={{ gap: spacing.sm }}>
          <SectionHeader title="General settings" />
          <ListGroup>
          <ListItem
            label="Support & Feedback"
            size="Standard"
            artwork="Small"
            leadingArtwork={<ChatCircleDots size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            divider
          />
          <ListItem
            label="Tell a friend about mygate"
            size="Standard"
            artwork="Small"
            leadingArtwork={<ShareNetwork size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            divider
          />
          <ListItem
            label="Account Information"
            size="Standard"
            artwork="Small"
            leadingArtwork={<User size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            divider
          />
          <ListItem
            label="Logout"
            size="Standard"
            artwork="Small"
            leadingArtwork={<SignOut size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
          />
        </ListGroup>
        </View>

        {/* ── Footer ─────────────────────────────────────────── */}
        <View style={{ alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm }}>
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>mygate</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Text style={[typography.caption, { color: colors.contentAction, textDecorationLine: 'underline' }]}>
              Terms & Conditions
            </Text>
            <Text style={[typography.caption, { color: colors.contentTertiary }]}>|</Text>
            <Text style={[typography.caption, { color: colors.contentAction, textDecorationLine: 'underline' }]}>
              Privacy Policy
            </Text>
          </View>
          <Text style={[typography.caption, { color: colors.contentTertiary }]}>Version 3.0.0</Text>
        </View>

      </ScrollView>
    </View>
  );
}
