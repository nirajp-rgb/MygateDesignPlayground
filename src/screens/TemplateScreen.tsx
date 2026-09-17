import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  AppHeader,
  Avatar,
  Button,
  Checkbox,
  Chip,
  IconButton,
  IconPlaceholder,
  ListItem,
  Radio,
  ReviewCard,
  ScreenFrame,
  SectionHeader,
  SurfaceCard,
  Switch,
  Tag,
  Tile,
  TileGrid,
} from '../components';
import type { TileGridItem } from '../components';
import { ArrowRight, Palette, RocketLaunch } from '../icons';
import type { PrototypeScreenKey } from './types';
import { colors,iconSize, spacing, typography } from '../tokens';
import { Bell, House, PlusIcon, User, XIcon } from 'phosphor-react-native';

type TemplateScreenProps = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
};

export function TemplateScreen({ activeScreen, onNavigate }: TemplateScreenProps) {
  const [checkbox1, setCheckbox1] = useState(false);
  const [checkbox2, setCheckbox2] = useState(true);
  const [radio, setRadio] = useState<'a' | 'b' | 'c'>('a');
  const [switchVal, setSwitchVal] = useState<'off' | 'on'>('off');
  const [chipSelected, setChipSelected] = useState(false);

  return (
    <ScreenFrame
      eyebrow="Component Library"
      title="All components"
      description="Every component available in src/components, shown with their key variants."
      activeScreen={activeScreen}
      onNavigate={onNavigate}
    >

      {/* ── AppHeader ─────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="AppHeader"
          subtitle="Top navigation bar with title, back button, and action icons."
        />
        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.caption, { color: colors.contentSecondary }]}>default · center title</Text>
          <AppHeader title="Screen title" safeTop={false} onBack={() => {}} />

          <Text style={[typography.caption, { color: colors.contentSecondary }]}>default · with subtitle + actions</Text>
          <AppHeader
            title="Notifications"
            subtitle="3 unread"
            safeTop={false}
            onBack={() => {}}
            actions={[
              { key: 'palette', icon: Palette, accessibilityLabel: 'Palette', onPress: () => {} },
              { key: 'rocket', icon: RocketLaunch, accessibilityLabel: 'Launch', onPress: () => {}, badgeCount: 3 },
            ]}
          />

          <Text style={[typography.caption, { color: colors.contentSecondary }]}>subtle variant · left-aligned title</Text>
          <AppHeader title="Settings" variant="subtle" titleAlign="left" safeTop={false} showBottomBorder />
        </View>
      </SurfaceCard>

      {/* ── Button ────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Button"
          subtitle="Five kinds (Primary / Secondary / Tertiary / Inline / Link) × three sizes."
        />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Primary — yellow fill, dark text</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Primary" size="SM" label="Small" />
          <Button kind="Primary" size="MD" label="Medium" />
          <Button kind="Primary" size="LG" label="Large" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Secondary — grey fill, no border</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Secondary" size="SM" label="Small" showLeftIcon leftIcon={Bell}/>
          <Button kind="Secondary" size="MD" label="Medium" showRightIcon rightIcon={ArrowRight}/>
          <Button kind="Secondary" size="LG" label="Large" showLeftIcon leftIcon={Bell} showRightIcon rightIcon={ArrowRight}/>
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Tertiary — white fill, border</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Tertiary" size="SM" label="Small" />
          <Button kind="Tertiary" size="MD" label="Medium" />
          <Button kind="Tertiary" size="LG" label="Large" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>With icons · disabled</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Primary" label="Left icon" showLeftIcon leftIcon={Bell} />
          <Button kind="Secondary" label="Right icon" showRightIcon rightIcon={ArrowRight} />
          <Button kind="Primary" label="Disabled" state="Disabled" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Inline — underlined, transparent bg</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Inline" size="SM" label="Small" />
          <Button kind="Inline" size="MD" label="Medium" />
          <Button kind="Inline" size="LG" label="Large" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Link — action colour, transparent bg</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Button kind="Link" size="SM" label="Small" />
          <Button kind="Link" size="MD" label="Medium" />
          <Button kind="Link" size="LG" label="Large" />
          <Button kind="Link" size="MD" label="Disabled" state="Disabled" />
        </View>
      </SurfaceCard>

      {/* ── IconButton ────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="IconButton"
          subtitle="Circular icon-only button — Primary / Secondary / Tertiary / Positive × LG / MD."
        />
        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Primary — yellow fill</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <IconButton type="Primary" size="LG" icon={PlusIcon} />
          <IconButton type="Primary" size="MD" icon={PlusIcon} />
          <IconButton type="Primary" size="LG" state="Disabled" icon={PlusIcon} />
        </View>
        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Secondary — grey fill</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <IconButton type="Secondary" size="LG" icon={PlusIcon} />
          <IconButton type="Secondary" size="MD" icon={PlusIcon} />
          <IconButton type="Secondary" size="LG" state="Disabled" icon={PlusIcon} />
        </View>
        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Tertiary — outlined</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <IconButton type="Tertiary" size="LG" icon={PlusIcon} />
          <IconButton type="Tertiary" size="MD" icon={PlusIcon} />
          <IconButton type="Tertiary" size="LG" state="Disabled" icon={PlusIcon} />
        </View>
        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Positive — green fill, white icon</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <IconButton type="Positive" size="LG" icon={PlusIcon} />
          <IconButton type="Positive" size="MD" icon={PlusIcon} />
          <IconButton type="Positive" size="LG" state="Disabled" icon={PlusIcon} />
        </View>
      </SurfaceCard>

      {/* ── Chip ──────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Chip"
          subtitle="Assist, Filter, and Input types across semantic tones."
        />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Assist — tones</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Chip type="Assist" tone="Neutral" label="Neutral" showLeadingIcon={false} showTrailingIcon={false} />
          <Chip type="Assist" tone="Info" label="Info" showLeadingIcon={false} showTrailingIcon={false} />
          <Chip type="Assist" tone="Positive" label="Positive" showLeadingIcon={false} showTrailingIcon={false} />
          <Chip type="Assist" tone="Warning" label="Warning" showLeadingIcon={false} showTrailingIcon={false} />
          <Chip type="Assist" tone="Negative" label="Negative" showLeadingIcon={false} showTrailingIcon={false} />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Filter — selected / disabled</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Chip type="Filter" tone="Neutral" label="Default" showLeadingIcon={false} showTrailingIcon={false} />
          <Chip
            type="Filter"
            tone="Neutral"
            label="Selected"
            state={chipSelected ? 'Selected' : 'Default'}
            showLeadingIcon={false}
            showTrailingIcon={false}
            onPress={() => setChipSelected((v) => !v)}
            
          />
          <Chip type="Filter" tone="Neutral" label="Disabled" state="Disabled" showLeadingIcon={false} showTrailingIcon={false} />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>With icons</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Chip type="Assist" tone="Neutral" label="Both icons" showLeadingIcon={true} showTrailingIcon={true} leadingIcon={Bell} trailingIcon={XIcon} />
          <Chip type="Input" tone="Positive" label="Leading only" showTrailingIcon={false} showLeadingIcon={true} leadingIcon={Bell} trailingIcon={XIcon} />
          <Chip type="Input" tone="Negative" label="Trailing only" showLeadingIcon={false} showTrailingIcon={true} leadingIcon={Bell} trailingIcon={XIcon} />
        </View>
      </SurfaceCard>

      {/* ── Tag ───────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Tag"
          subtitle="Status badges in Solid, Light, and Outlined variants across six semantic kinds."
        />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Solid</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          {(['Neutral', 'Primary', 'Positive', 'Warning', 'Negative', 'Info'] as const).map((kind) => (
            <Tag key={kind} kind={kind} variant="Solid" label={kind} />
          ))}
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Light</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          {(['Neutral', 'Primary', 'Positive', 'Warning', 'Negative', 'Info'] as const).map((kind) => (
            <Tag key={kind} kind={kind} variant="Light" label={kind} />
          ))}
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Outlined</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          {(['Neutral', 'Primary', 'Positive', 'Warning', 'Negative', 'Info'] as const).map((kind) => (
            <Tag key={kind} kind={kind} variant="Outlined" label={kind} />
          ))}
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>With action icon · disabled</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap' }}>
          <Tag kind="Primary" variant="Light" label="Removable" showAction />
          <Tag kind="Neutral" variant="Solid" label="Disabled" state="Disabled" />
        </View>
      </SurfaceCard>

      {/* ── Checkbox ──────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Checkbox"
          subtitle="Checked, unchecked, indeterminate, invalid, and disabled states."
        />
        <Checkbox label="Unchecked" checked={checkbox1} onPress={() => setCheckbox1((v) => !v)} />
        <Checkbox label="Checked" description="With a supporting description" checked={checkbox2} onPress={() => setCheckbox2((v) => !v)} />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Invalid — unchecked" invalid />
        <Checkbox label="Invalid — checked" invalid checked />
        <Checkbox label="Disabled — unchecked" state="Disabled" />
        <Checkbox label="Disabled — checked" state="Disabled" checked />
      </SurfaceCard>

      {/* ── Radio ─────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Radio"
          subtitle="Single-select group, plus invalid and disabled states."
        />
        <Radio label="Option A" checked={radio === 'a'} onPress={() => setRadio('a')} />
        <Radio label="Option B" description="With a supporting description" checked={radio === 'b'} onPress={() => setRadio('b')} />
        <Radio label="Option C" checked={radio === 'c'} onPress={() => setRadio('c')} />
        <Radio label="Invalid" invalid checked />
        <Radio label="Disabled — unchecked" state="Disabled" />
        <Radio label="Disabled — checked" state="Disabled" checked />
      </SurfaceCard>

      {/* ── Switch ────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Switch"
          subtitle="Toggle on/off with optional description and disabled state."
        />
        <Switch
          label="Notifications"
          description="Receive push notifications"
          value={switchVal}
          onPress={() => setSwitchVal((v) => (v === 'off' ? 'on' : 'off'))}
        />
        <Switch label="Dark mode" value="on" />
        <Switch label="Disabled — off" state="Disabled" value="off" />
        <Switch label="Disabled — on" state="Disabled" value="on" />
      </SurfaceCard>

      {/* ── SectionHeader ─────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="SectionHeader" subtitle="Used to label groups of content within a card." />
        <View style={{ gap: spacing.md }}>
          <SectionHeader title="Title only" />
          <SectionHeader title="Title + subtitle" subtitle="Supporting text sits below the title in secondary colour." />
          <SectionHeader title="With action" subtitle="Right-aligned action label." actionLabel="See all" />
        </View>
      </SurfaceCard>

      {/* ── SurfaceCard ───────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="SurfaceCard" subtitle="Container card — default and accent variants." />
        <SurfaceCard>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
            Default card — white background with subtle border.
          </Text>
        </SurfaceCard>
        <SurfaceCard accent>
          <Text style={[typography.bodyDefault, { color: colors.contentOnDark }]}>
            Accent card — brand-coloured background for emphasis.
          </Text>
        </SurfaceCard>
      </SurfaceCard>

      {/* ── IconPlaceholder ───────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="IconPlaceholder"
          subtitle="Stands in for a real icon during prototyping — md and sm sizes."
        />
        <View style={{ flexDirection: 'row', gap: spacing.lg, alignItems: 'center' }}>
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <IconPlaceholder size="md" />
            <Text style={[typography.caption, { color: colors.contentSecondary }]}>md</Text>
          </View>
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <IconPlaceholder size="sm" />
            <Text style={[typography.caption, { color: colors.contentSecondary }]}>sm</Text>
          </View>
          <View style={{ alignItems: 'center', gap: spacing.xs }}>
            <IconPlaceholder size="md" color={colors.contentAction} />
            <Text style={[typography.caption, { color: colors.contentSecondary }]}>custom colour</Text>
          </View>
        </View>
      </SurfaceCard>

      {/* ── ListItem ──────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="ListItem" subtitle="Standard and Compact sizes × Simple and Label trailing layouts × optional artwork." />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Standard · Simple · No artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem label="Label" paragraph="Paragraph" divider />
          <ListItem label="Label" paragraph="Paragraph" thirdLine supportText="Support text" divider />
          <ListItem label="Label" paragraph="Paragraph" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Standard · Label trailing · No artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem layout="Label trailing" label="Label" trailingLabel="Label" paragraph="Paragraph" trailingParagraph="Paragraph" divider />
          <ListItem layout="Label trailing" label="Label" trailingLabel="Label" paragraph="Paragraph" trailingParagraph="Paragraph" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Standard · Simple · Small artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem artwork="Small" label="Label" paragraph="Paragraph" divider />
          <ListItem artwork="Small" label="Label" paragraph="Paragraph" thirdLine supportText="Support text" divider />
          <ListItem artwork="Small" label="Label" paragraph="Paragraph" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Standard · Label trailing · Small artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem artwork="Small" layout="Label trailing" label="Label" trailingLabel="Label" paragraph="Paragraph" trailingParagraph="Paragraph" divider />
          <ListItem artwork="Small" layout="Label trailing" label="Label" trailingLabel="Label" paragraph="Paragraph" trailingParagraph="Paragraph" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Compact · Simple · No artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem size="Compact" label="Label" divider />
          <ListItem size="Compact" label="Label" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Compact · Label trailing · No artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem size="Compact" layout="Label trailing" label="Label" trailingLabel="Label" divider />
          <ListItem size="Compact" layout="Label trailing" label="Label" trailingLabel="Label" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Compact · Simple · Small artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem size="Compact" artwork="Small" label="Label" divider />
          <ListItem size="Compact" artwork="Small" label="Label" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Compact · Label trailing · Small artwork</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem size="Compact" artwork="Small" layout="Label trailing" label="Label" trailingLabel="Label" divider />
          <ListItem size="Compact" artwork="Small" layout="Label trailing" label="Label" trailingLabel="Label" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Custom control · null control</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem label="With custom control" paragraph="Any ReactNode in the slot" controlElement={<Tag kind="Positive" variant="Light" label="New" />} divider />
          <ListItem label="No control" paragraph="Pass null to hide the caret" controlElement={null} />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Switch as control element</Text>
        <View style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle }}>
          <ListItem
            label="Notifications"
            paragraph="Receive push alerts"
            divider
            controlElement={
              <Switch
                value={switchVal}
                onPress={() => setSwitchVal((v) => (v === 'off' ? 'on' : 'off'))}
              />
            }
          />
          <ListItem
            label="Dark mode"
            paragraph="Use dark appearance"
            controlElement={<ArrowRight size={iconSize.md} color={colors.contentTertiary} />}
          />
        </View>
      </SurfaceCard>

      {/* ── Avatar ────────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="Avatar" subtitle="Image, Initials, and Fallback types across five sizes with optional status indicator." />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Fallback — all sizes</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <Avatar size="XS" />
          <Avatar size="SM" />
          <Avatar size="MD" />
          <Avatar size="LG" />
          <Avatar size="XL" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Initials — deterministic colour per name</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <Avatar size="XS" type="Initials" name="Niraj Patel" />
          <Avatar size="SM" type="Initials" name="Anna Smith" />
          <Avatar size="MD" type="Initials" name="Rohan Kumar" />
          <Avatar size="LG" type="Initials" name="Sara Lee" />
          <Avatar size="XL" type="Initials" name="David Chen" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Rounded shape</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <Avatar size="MD" shape="Rounded" />
          <Avatar size="MD" shape="Rounded" type="Initials" name="Niraj Patel" />
          <Avatar size="LG" shape="Rounded" type="Initials" name="Anna Smith" />
          <Avatar size="XL" shape="Rounded" type="Initials" name="Rohan Kumar" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>Status indicators</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <Avatar size="MD" type="Initials" name="Niraj Patel" status="Online" />
          <Avatar size="MD" type="Initials" name="Anna Smith" status="Offline" />
          <Avatar size="MD" type="Initials" name="Rohan Kumar" status="Busy" />
          <Avatar size="LG" type="Initials" name="Sara Lee" status="Online" />
          <Avatar size="XL" status="Busy" />
        </View>
      </SurfaceCard>

      {/* ── Tile & TileGrid ───────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader
          title="Tile"
          subtitle="Icon, image, or empty artwork box with a label. Use TileGrid to arrange multiples."
        />

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>artworkType · icon / none · sizes MD & SM</Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Tile label="Pre-approve" artworkType="icon" icon={House} size="MD" />
          <Tile label="Find Daily Help" artworkType="icon" icon={User} size="MD" />
          <Tile label="Empty" artworkType="none" size="MD" />
          <Tile label="Small" artworkType="icon" icon={House} size="SM" />
        </View>

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>TileGrid · 4 columns (default)</Text>
        {(() => {
          const items: TileGridItem[] = [
            { label: 'Pre-approve', artworkType: 'icon', icon: House },
            { label: 'Find Daily Help', artworkType: 'icon', icon: User },
            { label: 'Amenities', artworkType: 'none' },
            { label: 'Visitors', artworkType: 'none' },
            { label: 'Vehicles', artworkType: 'icon', icon: House },
            { label: 'Pets', artworkType: 'icon', icon: User },
          ];
          return <TileGrid items={items} columns={4} />;
        })()}

        <Text style={[typography.caption, { color: colors.contentSecondary }]}>TileGrid · 3 columns</Text>
        {(() => {
          const items: TileGridItem[] = [
            { label: 'Pre-approve', artworkType: 'icon', icon: House },
            { label: 'Find Daily Help', artworkType: 'icon', icon: User },
            { label: 'Amenities', artworkType: 'none' },
            { label: 'Visitors', artworkType: 'none' },
          ];
          return <TileGrid items={items} columns={3} />;
        })()}
      </SurfaceCard>

      {/* ── SectionHeader (extended) ──────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="SectionHeader" subtitle="Now supports rightSlot and onPress." />
        <View style={{ gap: spacing.md }}>
          <Text style={[typography.caption, { color: colors.contentSecondary }]}>With actionLabel</Text>
          <SectionHeader title="Household" actionLabel="Manage" />

          <Text style={[typography.caption, { color: colors.contentSecondary }]}>Pressable title + caret</Text>
          <SectionHeader title="Attendance" onPress={() => {}} rightSlot={
            <Text style={typography.bodyLargeBold}>16/30</Text>
          } />

          <Text style={[typography.caption, { color: colors.contentSecondary }]}>rightSlot — icon button</Text>
          <SectionHeader title="Free time slots" rightSlot={<IconButton type="Tertiary" size="MD" icon={Bell} />} />

          <Text style={[typography.caption, { color: colors.contentSecondary }]}>With subtitle</Text>
          <SectionHeader title="Ratings and reviews" onPress={() => {}} subtitle="20 Ratings, 4 reviews" />
        </View>
      </SurfaceCard>

      {/* ── ReviewCard ────────────────────────────────────────── */}
      <SurfaceCard>
        <SectionHeader title="ReviewCard" subtitle="Star rating, review body, date, and optional badge slot." />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: spacing.lg, gap: spacing.sm }}>
            <ReviewCard rating={4.0} reviewText="Have never seen anybody so punctual. She comes right on time every day" date="2 Feb 2024" width={220} />
            <ReviewCard rating={5.0} reviewText="Excellent work and very reliable. Highly recommended." date="15 Jan 2024" width={220} />
            <ReviewCard rating={3.5} reviewText="Generally good but sometimes a bit late." date="10 Jan 2024" width={220} />
          </View>
        </ScrollView>
      </SurfaceCard>

    </ScreenFrame>
  );
}
