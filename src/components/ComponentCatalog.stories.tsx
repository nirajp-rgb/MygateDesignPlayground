import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Bell, House, User } from 'phosphor-react-native';
import {
  ActionFooter, AppBottomNav, AppHeader, Avatar, Banner, Button, Checkbox, Chip, ChipGroup,
  CategoryStatTile, IconButton, IconTile, ListGroup, ListItem, ListingCard, ModalSheet, NumberBadge, ProgressSteps, Radio, ReviewCard,
  SearchField, SectionHeader, SurfaceCard, Switch, Tag, TextField, Tile, TileGrid, TileGroup,
} from './index';
import { colors, spacing } from '../tokens';
import listingImage from '../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png';

const meta = { title: 'Components/Production catalog', tags: ['autodocs'] } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = { render: () => <View style={{ gap: spacing.md }}><Button label="Primary action" /><Button kind="Secondary" label="Secondary action" /><IconButton icon={Bell} /></View> };
export const FormInputs: Story = { render: () => { const [value, setValue] = useState(''); const [checked, setChecked] = useState(false); return <View style={{ gap: spacing.md }}><TextField label="Name" required value={value} onChangeText={setValue} placeholder="Enter a name" /><SearchField value={value} onChangeText={setValue} onClear={() => setValue('')} /><Checkbox label="Checkbox" checked={checked} onPress={() => setChecked(!checked)} /><Radio label="Radio" checked /><Switch label="Switch" value="on" /></View>; } };
export const Chips: Story = { render: () => { const [value, setValue] = useState<string | string[] | null>('all'); return <View style={{ gap: spacing.md }}><Chip label="Standalone" selected /><ChipGroup value={value} onChange={setValue} options={[{ key: 'all', label: 'All' }, { key: 'updates', label: 'Updates' }]} /></View>; } };
export const Navigation: Story = { render: () => <View><AppHeader safeTop={false} title="Screen title" onBack={() => {}} /><AppBottomNav activeKey="home" onPressItem={() => {}} items={[{ key: 'home', label: 'Home', icon: House }, { key: 'profile', label: 'Profile', icon: User }]} /></View> };
export const DataDisplay: Story = { render: () => <View style={{ gap: spacing.md }}><Avatar name="Niraj Pangarkar" type="Initials" /><Tag label="Active" kind="Positive" /><NumberBadge count={7} /><IconTile icon={Bell} iconColor={colors.contentAction} iconSize={24} /><ListItem label="List item" paragraph="Supporting information" artwork="Small" leadingArtwork={<House size={24} />} /></View> };
export const Tiles: Story = { render: () => { const [value, setValue] = useState<string | string[] | null>('home'); return <View style={{ gap: spacing.md }}><Tile label="Home" artworkType="icon" icon={House} /><TileGrid columns={2} items={[{ key: 'one', label: 'One', artworkType: 'icon', icon: House }, { key: 'two', label: 'Two', artworkType: 'icon', icon: User }]} /><TileGroup value={value} onChange={setValue} items={[{ key: 'home', label: 'Home', artworkType: 'icon', icon: House }, { key: 'profile', label: 'Profile', artworkType: 'icon', icon: User }]} /></View>; } };
export const LayoutAndFeedback: Story = { render: () => <View style={{ gap: spacing.md }}><SurfaceCard><SectionHeader title="Section" actionLabel="View all" /><Text>Surface content</Text></SurfaceCard><ListGroup><ListItem label="First" /><ListItem label="Second" /></ListGroup><Banner icon={Bell} title="Update available" description="Install the latest version." actionLabel="Update" /><ProgressSteps currentIndex={1} total={4} /></View> };
export const OverlaysAndFooter: Story = { render: () => { const [visible, setVisible] = useState(false); return <View style={{ gap: spacing.md }}><Button label="Open sheet" onPress={() => setVisible(true)} /><ModalSheet visible={visible} onDismiss={() => setVisible(false)} title="Example sheet"><View style={{ padding: spacing.lg }}><Text>Sheet content</Text></View></ModalSheet><ActionFooter safeArea={false} primary={{ label: 'Continue', onPress: () => {} }} /></View>; } };
export const SearchTrigger: Story = { render: () => <SearchField mode="trigger" placeholder="Search all features" onPress={() => {}} accessibilityLabel="Open search" /> };
export const ProductPatterns: Story = { render: () => <View style={{ gap: spacing.md }}><CategoryStatTile icon={House} label="Homes" stat="82K+" /><ListingCard imageSource={listingImage} title="Community listing" distance="1.2 km" location="Jayanagar" price="₹ 12,000" originalPrice="₹ 16,000" discountLabel="-25%" /><ReviewCard rating={4.5} reviewText="Reliable and punctual." date="2 Feb 2026" /></View> };
