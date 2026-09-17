import type { Meta } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Bell, CaretRight, House, MagnifyingGlass, User, X } from 'phosphor-react-native';
import {
  ActionFooter, AppBottomNav, AppHeader, Avatar, Banner, Button, CategoryStatTile, Checkbox, Chip, ChipGroup,
  IconButton, IconTile, ListGroup, ListItem, ListingCard, ModalSheet, NumberBadge, ProgressSteps, Radio,
  ReviewCard, SearchField, SectionHeader, SurfaceCard, Switch, Tag, TextField, Tile, TileGrid, TileGroup,
} from './index';
import { colors, spacing, typography } from '../tokens';
import listingImage from '../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png';

const meta = {
  title: 'Components/Component stories',
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: 'Every public production component has an editable example here. Use Controls to explore supported props and the theme toolbar to verify both modes.' } },
  },
} satisfies Meta;

export default meta;
// Story args intentionally span the props of every public component in this single reference page.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Args = Record<string, any>;
type Story = {
  name?: string;
  args?: Args;
  argTypes?: Args;
  render?: (args: Args) => React.ReactNode;
};
const select = (options: readonly string[]) => ({ control: 'select' as const, options });
const action = { action: 'pressed' };

export const ButtonStory: Story = {
  name: 'Button',
  args: { label: 'Continue', kind: 'Primary', size: 'MD', state: 'Default', showLeftIcon: false, showRightIcon: true, fullWidth: false },
  argTypes: { kind: select(['Primary', 'Secondary', 'Tertiary', 'Inline', 'Link', 'Positive']), size: select(['SM', 'MD', 'LG']), state: select(['Default', 'Pressed', 'Disabled']), onPress: action },
  render: (args) => <Button {...args} rightIcon={CaretRight} />,
};

export const IconButtonStory: Story = {
  name: 'IconButton', args: { type: 'Primary', size: 'LG', state: 'Default', accessibilityLabel: 'Notifications', badgeCount: 3 },
  argTypes: { type: select(['Primary', 'Secondary', 'Tertiary', 'Positive', 'Ghost']), size: select(['SM', 'MD', 'LG']), state: select(['Default', 'Disabled']), onPress: action },
  render: (args) => <IconButton {...args} icon={Bell} />,
};

export const TextFieldStory: Story = {
  name: 'TextField', args: { label: 'Resident name', value: '', placeholder: 'Enter a name', required: true, state: 'default', helperText: 'Use the registered name.' },
  argTypes: { state: select(['default', 'error', 'success', 'disabled']) },
  render: (args) => { const [value, setValue] = useState(String(args.value ?? '')); return <TextField {...args} value={value} onChangeText={setValue} />; },
};

export const SearchFieldStory: Story = {
  name: 'SearchField', args: { mode: 'input', placeholder: 'Search all features', value: '' },
  argTypes: { mode: select(['input', 'trigger']), onPress: action },
  render: (args) => { const [value, setValue] = useState(String(args.value ?? '')); return <SearchField {...args} value={value} onChangeText={setValue} onClear={() => setValue('')} />; },
};

export const CheckboxStory: Story = {
  name: 'Checkbox', args: { label: 'Allow visitor notifications', description: 'Receive an alert when a visitor arrives.', checked: false, indeterminate: false, invalid: false, state: 'Default' },
  argTypes: { state: select(['Default', 'Pressed', 'Focused', 'Disabled']) },
  render: (args) => { const [checked, setChecked] = useState(Boolean(args.checked)); return <Checkbox {...args} checked={checked} onPress={() => setChecked(!checked)} />; },
};

export const RadioStory: Story = {
  name: 'Radio', args: { label: 'Primary residence', description: 'Use this as the default home.', checked: true, invalid: false, state: 'Default' },
  argTypes: { state: select(['Default', 'Pressed', 'Focused', 'Disabled']) },
  render: (args) => { const [checked, setChecked] = useState(Boolean(args.checked)); return <Radio {...args} checked={checked} onPress={() => setChecked(!checked)} />; },
};

export const SwitchStory: Story = {
  name: 'Switch', args: { label: 'Enable alerts', description: 'Receive important community updates.', value: 'on', state: 'Default' },
  argTypes: { value: select(['off', 'on']), state: select(['Default', 'Pressed', 'Focused', 'Disabled']) },
  render: (args) => { const [value, setValue] = useState<'off' | 'on'>(args.value === 'off' ? 'off' : 'on'); return <Switch {...args} value={value} onPress={() => setValue(value === 'on' ? 'off' : 'on')} />; },
};

export const ChipStory: Story = {
  name: 'Chip', args: { label: 'Announcements', type: 'Filter', tone: 'Neutral', state: 'Default', selected: false, disabled: false, showLeadingIcon: true, showTrailingIcon: true },
  argTypes: { type: select(['Assist', 'Filter', 'Input']), tone: select(['Neutral', 'Info', 'Positive', 'Warning', 'Negative']), state: select(['Default', 'Selected', 'Pressed', 'Disabled']) },
  render: (args) => <Chip {...args} leadingIcon={Bell} trailingIcon={X} />,
};

export const ChipGroupStory: Story = {
  name: 'ChipGroup', args: { selectionMode: 'single', layout: 'wrap' },
  argTypes: { selectionMode: select(['single', 'multiple']), layout: select(['wrap', 'horizontal']) },
  render: (args) => { const [value, setValue] = useState<string | string[] | null>('all'); return <ChipGroup {...args} value={value} onChange={setValue} options={[{ key: 'all', label: 'All' }, { key: 'updates', label: 'Updates' }, { key: 'alerts', label: 'Alerts' }]} />; },
};

export const AppHeaderStory: Story = {
  name: 'AppHeader', args: { title: 'Community', subtitle: 'Brigade Gateway', variant: 'solid', titleAlign: 'left', safeTop: false },
  argTypes: { variant: select(['solid', 'transparent']), titleAlign: select(['left', 'center']), onBack: action },
  render: (args) => <View style={{ width: '100%', minWidth: 320 }}><AppHeader {...args} actions={[{ key: 'notifications', icon: Bell, accessibilityLabel: 'Notifications', onPress: () => {} }]} /></View>,
};

export const AppBottomNavStory: Story = {
  name: 'AppBottomNav', args: { activeKey: 'home' }, argTypes: { activeKey: select(['home', 'search', 'profile']) },
  render: (args) => { const [activeKey, setActiveKey] = useState(String(args.activeKey)); return <View style={{ width: '100%', minWidth: 320 }}><AppBottomNav activeKey={activeKey} onPressItem={setActiveKey} items={[{ key: 'home', label: 'Home', icon: House }, { key: 'search', label: 'Search', icon: MagnifyingGlass }, { key: 'profile', label: 'Profile', icon: User }]} /></View>; },
};

export const AvatarStory: Story = {
  name: 'Avatar', args: { name: 'Niraj Pangarkar', type: 'Initials', size: 'MD', shape: 'Circle', status: 'Online' },
  argTypes: { type: select(['Initials', 'Fallback', 'Image']), size: select(['XS', 'SM', 'MD', 'LG', 'XL']), shape: select(['Circle', 'Rounded']), status: select(['None', 'Online', 'Offline']) },
  render: (args) => <Avatar {...args} />,
};

export const TagStory: Story = {
  name: 'Tag', args: { label: 'Active', kind: 'Positive', variant: 'Light', size: 'MD' },
  argTypes: { kind: select(['Neutral', 'Info', 'Positive', 'Warning', 'Negative']), variant: select(['Solid', 'Light', 'Outlined', 'Text']), size: select(['SM', 'MD']) },
  render: (args) => <Tag {...args} />,
};

export const NumberBadgeStory: Story = { name: 'NumberBadge', args: { count: 7 }, render: (args) => <NumberBadge {...args} count={Number(args.count)} /> };
export const IconTileStory: Story = { name: 'IconTile', args: { iconSize: 24, tileSize: 48 }, render: (args) => <IconTile {...args} icon={Bell} iconSize={Number(args.iconSize)} iconColor={colors.contentAction} /> };

export const ListItemStory: Story = {
  name: 'ListItem',
  args: {
    size: 'Standard',
    artwork: 'Small',
    layout: 'Simple',
    label: 'Visitor pre-approved',
    paragraph: 'Expected today at 6:30 PM',
    trailingLabel: 'Today',
    trailingParagraph: '6:30 PM',
    supportText: 'Gate 1',
    thirdLine: false,
    divider: false,
    iconBacking: false,
  },
  argTypes: {
    size: select(['Standard', 'Compact']),
    artwork: select(['None', 'Small']),
    layout: select(['Simple', 'Label trailing']),
    onPress: action,
  },
  render: (args) => (
    <View style={{ width: '100%', minWidth: 320 }}>
      <ListItem
        {...args}
        leadingArtwork={<House size={24} color={colors.contentAction} />}
      />
    </View>
  ),
};

export const TileStory: Story = {
  name: 'Tile', args: { label: 'Home services', sublabel: '12 services', artworkType: 'icon', size: 'MD', variant: 'standard', contentAlign: 'center', selected: false, disabled: false },
  argTypes: { artworkType: select(['icon', 'image', 'none']), size: select(['SM', 'MD']), variant: select(['standard', 'card']), contentAlign: select(['center', 'left']), onPress: action }, render: (args) => <View style={{ width: 180 }}><Tile {...args} label={String(args.label)} icon={House} /></View>,
};

export const TileGroupStory: Story = {
  name: 'TileGroup', args: { selectionMode: 'single', columns: 2 }, argTypes: { selectionMode: select(['single', 'multiple']), columns: { control: { type: 'number', min: 1, max: 4 } } },
  render: (args) => { const [value, setValue] = useState<string | string[] | null>('home'); return <View style={{ width: '100%', minWidth: 320 }}><TileGroup {...args} value={value} onChange={setValue} items={[{ key: 'home', label: 'Home', artworkType: 'icon', icon: House }, { key: 'profile', label: 'Profile', artworkType: 'icon', icon: User }, { key: 'search', label: 'Search', artworkType: 'icon', icon: MagnifyingGlass }, { key: 'alerts', label: 'Alerts', artworkType: 'icon', icon: Bell }, { key: 'more', label: 'More', artworkType: 'none' }]} /></View>; },
};

export const SurfaceCardStory: Story = { name: 'SurfaceCard', args: { accent: false, elevated: false, borderWidth: 0.5 }, render: (args) => <SurfaceCard {...args}><Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>Card content</Text></SurfaceCard> };
export const SectionHeaderStory: Story = { name: 'SectionHeader', args: { title: 'Recent activity', subtitle: 'The latest updates', actionLabel: 'View all' }, argTypes: { onActionPress: action }, render: (args) => <View style={{ minWidth: 320 }}><SectionHeader {...args} title={String(args.title)} leadingIcon={Bell} /></View> };
export const ListGroupStory: Story = { name: 'ListGroup', render: () => <View style={{ minWidth: 320 }}><ListGroup><ListItem label="First item" paragraph="Grouped row content" /><ListItem label="Second item" paragraph="Shared list container" /></ListGroup></View> };
export const TileGridStory: Story = { name: 'TileGrid', args: { columns: 2, gap: spacing.sm }, render: (args) => <View style={{ minWidth: 320 }}><TileGrid {...args} items={[{ key: 'home', label: 'Home', artworkType: 'icon', icon: House }, { key: 'people', label: 'Residents', artworkType: 'icon', icon: User }]} /></View> };
export const ActionFooterStory: Story = {
  name: 'ActionFooter',
  args: {
    safeArea: false,
    primaryLabel: 'Continue',
    primaryKind: 'Primary',
    primaryDisabled: false,
    showSecondary: true,
    secondaryLabel: 'Cancel',
    secondaryKind: 'Tertiary',
    secondaryDisabled: false,
  },
  argTypes: {
    primaryKind: select(['Primary', 'Secondary', 'Tertiary', 'Inline', 'Link', 'Positive']),
    secondaryKind: select(['Primary', 'Secondary', 'Tertiary', 'Inline', 'Link', 'Positive']),
  },
  render: (args) => (
    <View style={{ width: '100%', minWidth: 360 }}>
      <ActionFooter
        safeArea={Boolean(args.safeArea)}
        primary={{
          label: String(args.primaryLabel),
          kind: args.primaryKind,
          disabled: Boolean(args.primaryDisabled),
          onPress: () => {},
        }}
        secondary={args.showSecondary ? {
          label: String(args.secondaryLabel),
          kind: args.secondaryKind,
          disabled: Boolean(args.secondaryDisabled),
          onPress: () => {},
        } : undefined}
      />
    </View>
  ),
};

export const BannerStory: Story = {
  name: 'Banner', args: { title: 'Update available', description: 'Install the latest version for new access controls.', tone: 'info', actionLabel: 'Update', elevated: false },
  argTypes: { tone: select(['neutral', 'info', 'positive', 'warning', 'negative']), onActionPress: action }, render: (args) => <View style={{ minWidth: 320 }}><Banner {...args} title={String(args.title)} icon={Bell} /></View>,
};
export const ProgressStepsStory: Story = { name: 'ProgressSteps', args: { currentIndex: 1, total: 4, accessibilityLabel: 'Listing progress' }, argTypes: { currentIndex: { control: { type: 'range', min: 0, max: 3, step: 1 } } }, render: (args) => <View style={{ minWidth: 320 }}><ProgressSteps {...args} currentIndex={Number(args.currentIndex)} total={Number(args.total)} labels={['Type', 'Details', 'Photos', 'Review']} /></View> };

export const ModalSheetStory: Story = {
  name: 'ModalSheet', args: { title: 'Example sheet', presentation: 'bottom' }, argTypes: { presentation: select(['page', 'full', 'top', 'bottom']) },
  render: (args) => { const [visible, setVisible] = useState(false); return <><Button label="Open sheet" onPress={() => setVisible(true)} /><ModalSheet {...args} visible={visible} onDismiss={() => setVisible(false)}><View style={{ padding: spacing.lg, gap: spacing.md }}><Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>Sheet content</Text><Button label="Dismiss" kind="Secondary" onPress={() => setVisible(false)} /></View></ModalSheet></>; },
};

export const CategoryStatTileStory: Story = { name: 'CategoryStatTile', args: { label: 'Homes', stat: '82K+' }, argTypes: { onPress: action }, render: (args) => <View style={{ width: 180 }}><CategoryStatTile {...args} label={String(args.label)} stat={String(args.stat)} icon={House} /></View> };
export const ListingCardStory: Story = { name: 'ListingCard', args: { title: 'Community listing', distance: '1.2 km', location: 'Jayanagar', price: '₹12,000', originalPrice: '₹16,000', discountLabel: '-25%', width: 220 }, render: (args) => <ListingCard {...args} title={String(args.title)} distance={String(args.distance)} location={String(args.location)} price={String(args.price)} originalPrice={String(args.originalPrice)} imageSource={listingImage} /> };
export const ReviewCardStory: Story = { name: 'ReviewCard', args: { rating: 4.5, reviewText: 'Reliable, punctual, and easy to coordinate with.', date: '2 Feb 2026', width: 280 }, argTypes: { rating: { control: { type: 'range', min: 0, max: 5, step: 0.1 } } }, render: (args) => <ReviewCard {...args} rating={Number(args.rating)} reviewText={String(args.reviewText)} date={String(args.date)} /> };
