import type { Meta, StoryObj } from '@storybook/react';
import React, { useState, type ReactNode } from 'react';
import { Image, Text, View } from 'react-native';
import { Bell, CaretRight, Check, House, MagnifyingGlass, User } from 'phosphor-react-native';
import {
  ActionFooter,
  AppBottomNav,
  AppHeader,
  Avatar,
  Banner,
  Button,
  CategoryStatTile,
  Checkbox,
  Chip,
  ChipGroup,
  IconButton,
  IconTile,
  ListGroup,
  ListItem,
  ListingCard,
  ModalSheet,
  NumberBadge,
  ProgressSteps,
  Radio,
  ReviewCard,
  SearchField,
  SectionHeader,
  SurfaceCard,
  Switch,
  Tag,
  TextField,
  Tile,
  TileGrid,
  TileGroup,
} from './index';
import { colors, radius, spacing, typography } from '../tokens';
import listingImage from '../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png';

const meta = {
  title: 'Components/Production catalog',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A living catalog of public production components exported from src/components.',
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ComponentEntry = {
  name: string;
  purpose: string;
};

const componentGroups: Array<{ title: string; description: string; components: ComponentEntry[] }> = [
  {
    title: 'Actions',
    description: 'Task triggers and icon-only controls.',
    components: [
      { name: 'Button', purpose: 'Primary, secondary, tertiary, inline, link, and positive actions.' },
      { name: 'IconButton', purpose: 'Compact icon-only actions with typed sizes and treatments.' },
    ],
  },
  {
    title: 'Forms',
    description: 'Controlled inputs and selection controls.',
    components: [
      { name: 'TextField', purpose: 'Text entry with labels, helper copy, error state, affixes, and multiline support.' },
      { name: 'SearchField', purpose: 'Search input and trigger surface for search entry points.' },
      { name: 'Checkbox', purpose: 'Boolean selection with accessible checked and disabled states.' },
      { name: 'Radio', purpose: 'Single-choice selection primitive.' },
      { name: 'Switch', purpose: 'On/off setting with optional supporting copy.' },
      { name: 'Chip', purpose: 'Assist, filter, and input chips across neutral and semantic tones.' },
      { name: 'ChipGroup', purpose: 'Controlled chip collections for single or multiple selection.' },
    ],
  },
  {
    title: 'Navigation',
    description: 'App chrome for moving through screens.',
    components: [
      { name: 'AppHeader', purpose: 'Screen title bar with back navigation, subtitles, actions, and variants.' },
      { name: 'AppBottomNav', purpose: 'Bottom tab navigation with active state and icon labels.' },
    ],
  },
  {
    title: 'Data display',
    description: 'Small content, status, list, and tile primitives.',
    components: [
      { name: 'Avatar', purpose: 'Person identity through initials, fallback, image shape, size, and status.' },
      { name: 'Tag', purpose: 'Semantic labels in solid, light, outlined, and text variants.' },
      { name: 'NumberBadge', purpose: 'Compact count indicator.' },
      { name: 'IconTile', purpose: 'Tokenized icon container.' },
      { name: 'ListItem', purpose: 'Reusable list row with artwork, paragraph, and trailing label layouts.' },
      { name: 'Tile', purpose: 'Selectable visual tile with icon, image, or no artwork.' },
      { name: 'TileGroup', purpose: 'Controlled selection group built from tiles.' },
    ],
  },
  {
    title: 'Layout',
    description: 'Surfaces and containers that arrange other components.',
    components: [
      { name: 'SurfaceCard', purpose: 'Tokenized card surface for grouped content.' },
      { name: 'SectionHeader', purpose: 'Section title row with optional actions and icons.' },
      { name: 'ListGroup', purpose: 'Grouped list container for ListItem rows.' },
      { name: 'TileGrid', purpose: 'Responsive grid arrangement for tile items.' },
      { name: 'ActionFooter', purpose: 'Pinned primary and secondary action area.' },
    ],
  },
  {
    title: 'Feedback',
    description: 'Status and progress communication.',
    components: [
      { name: 'Banner', purpose: 'Inline status message with tone, icon, description, and optional action.' },
      { name: 'ProgressSteps', purpose: 'Step indicator for short multi-step flows.' },
    ],
  },
  {
    title: 'Overlays',
    description: 'Temporary presentation layers.',
    components: [
      { name: 'ModalSheet', purpose: 'Controlled modal sheet with page, full, top, and bottom presentations.' },
    ],
  },
  {
    title: 'Product patterns',
    description: 'Product-specific reusable compositions.',
    components: [
      { name: 'CategoryStatTile', purpose: 'Marketplace category summary tile.' },
      { name: 'ListingCard', purpose: 'Marketplace listing preview with image, location, price, and discount.' },
      { name: 'ReviewCard', purpose: 'Review summary with rating, text, and date.' },
    ],
  },
];

function CatalogPage({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <View style={{ width: '100%', backgroundColor: colors.surfaceSecondary, paddingHorizontal: spacing.xl, paddingVertical: spacing.xl }}>
      <View style={{ width: '100%', maxWidth: 1180, alignSelf: 'center', gap: spacing.xl }}>
        <HeaderBlock title={title} description={description} />
        <View style={{ gap: spacing.lg }}>{children}</View>
      </View>
    </View>
  );
}

function HeaderBlock({ title, description }: { title: string; description: string }) {
  return (
    <View style={{ gap: spacing.sm }}>
      <Text style={[typography.titleScreen, { color: colors.contentPrimary }]}>{title}</Text>
      <Text style={[typography.bodyDefault, { color: colors.contentSecondary, maxWidth: 760 }]}>
        {description}
      </Text>
    </View>
  );
}

function CatalogSection({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <SurfaceCard elevated style={{ gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <Text style={[typography.titleSubsection, { color: colors.contentPrimary }]}>{title}</Text>
        <Text style={[typography.bodySecondary, { color: colors.contentSecondary }]}>{description}</Text>
      </View>
      {children}
    </SurfaceCard>
  );
}

function ExampleGrid({ children }: { children: ReactNode }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {children}
    </View>
  );
}

function ExampleCard({ title, children, wide = false }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <View
      style={{
        flexBasis: wide ? 520 : 248,
        flexGrow: 1,
        minWidth: wide ? 320 : 220,
        gap: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        backgroundColor: colors.surfacePrimary,
        padding: spacing.lg,
      }}
    >
      <Text style={[typography.captionBold, { color: colors.contentSecondary }]}>{title}</Text>
      <View style={{ gap: spacing.md }}>{children}</View>
    </View>
  );
}

function ComponentIndex() {
  return (
    <CatalogPage
      title="Production components"
      description="A simple reference for the public production component API. New production components should be exported from src/components and represented here with a Storybook example."
    >
      {componentGroups.map((group) => (
        <CatalogSection key={group.title} title={group.title} description={group.description}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {group.components.map((component) => (
              <View
                key={component.name}
                style={{
                  flexBasis: 260,
                  flexGrow: 1,
                  minWidth: 220,
                  gap: spacing.xs,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                  backgroundColor: colors.surfacePrimary,
                  padding: spacing.md,
                }}
              >
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{component.name}</Text>
                <Text style={[typography.bodySecondary, { color: colors.contentSecondary }]}>{component.purpose}</Text>
              </View>
            ))}
          </View>
        </CatalogSection>
      ))}
    </CatalogPage>
  );
}

function ActionsExamples() {
  return (
    <CatalogPage
      title="Actions"
      description="Buttons and icon buttons used for primary tasks, secondary choices, inline actions, and compact icon-only controls."
    >
      <CatalogSection title="Buttons" description="Use these variants before creating a new action treatment.">
        <ExampleGrid>
          <ExampleCard title="Priority">
            <Button label="Primary action" showRightIcon rightIcon={CaretRight} />
            <Button kind="Secondary" label="Secondary action" />
            <Button kind="Tertiary" label="Tertiary action" />
          </ExampleCard>
          <ExampleCard title="Text actions">
            <Button kind="Inline" label="Inline action" />
            <Button kind="Link" label="Link action" />
            <Button kind="Positive" label="Positive action" showLeftIcon leftIcon={Check} />
          </ExampleCard>
          <ExampleCard title="Icon buttons">
            <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
              <IconButton icon={Bell} />
              <IconButton icon={MagnifyingGlass} type="Secondary" />
              <IconButton icon={Check} type="Positive" />
            </View>
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

function FormExamples() {
  const [text, setText] = useState('');
  const [search, setSearch] = useState('');
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState(true);
  const [switchValue, setSwitchValue] = useState<'off' | 'on'>('on');
  const [chipValue, setChipValue] = useState<string | string[] | null>('all');

  return (
    <CatalogPage
      title="Forms"
      description="Controlled inputs and selections for value entry, filtering, and binary choices."
    >
      <CatalogSection title="Inputs" description="Text input, search input, and trigger-mode search surface.">
        <ExampleGrid>
          <ExampleCard title="Text field" wide>
            <TextField label="Resident name" required value={text} onChangeText={setText} placeholder="Enter a name" />
            <TextField label="Error state" state="error" value="Niraj" onChangeText={() => {}} errorMessage="Use the full registered name." />
          </ExampleCard>
          <ExampleCard title="Search" wide>
            <SearchField value={search} onChangeText={setSearch} onClear={() => setSearch('')} placeholder="Search all features" />
            <SearchField mode="trigger" placeholder="Open search" onPress={() => {}} accessibilityLabel="Open search" />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>

      <CatalogSection title="Selections" description="Single, multiple, and binary choices with documented states.">
        <ExampleGrid>
          <ExampleCard title="Checks and switches">
            <Checkbox label="Allow visitor notifications" checked={checked} onPress={() => setChecked(!checked)} />
            <Radio label="Default home" checked={radio} onPress={() => setRadio(!radio)} />
            <Switch
              label="Enable alerts"
              description="Shows the selected state and supporting copy."
              value={switchValue}
              onPress={() => setSwitchValue((value) => (value === 'on' ? 'off' : 'on'))}
            />
          </ExampleCard>
          <ExampleCard title="Chips">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <Chip label="Assist" type="Assist" />
              <Chip label="Selected" type="Filter" selected />
              <Chip label="Positive" tone="Positive" selected />
            </View>
            <ChipGroup
              value={chipValue}
              onChange={setChipValue}
              options={[
                { key: 'all', label: 'All' },
                { key: 'updates', label: 'Updates' },
                { key: 'alerts', label: 'Alerts' },
              ]}
            />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

function NavigationExamples() {
  return (
    <CatalogPage title="Navigation" description="Top and bottom navigation surfaces used by app screens.">
      <CatalogSection title="App chrome" description="Frame-level components for screen titles, actions, and bottom tabs.">
        <ExampleGrid>
          <ExampleCard title="Header" wide>
            <AppHeader
              safeTop={false}
              title="Community"
              subtitle="Brigade Gateway"
              onBack={() => {}}
              actions={[{ key: 'notifications', icon: Bell, accessibilityLabel: 'Notifications', onPress: () => {} }]}
            />
          </ExampleCard>
          <ExampleCard title="Bottom navigation" wide>
            <AppBottomNav
              activeKey="home"
              onPressItem={() => {}}
              items={[
                { key: 'home', label: 'Home', icon: House },
                { key: 'search', label: 'Search', icon: MagnifyingGlass },
                { key: 'profile', label: 'Profile', icon: User },
              ]}
            />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

function DataDisplayExamples() {
  return (
    <CatalogPage title="Data display" description="Compact visual components for people, statuses, counts, icons, list rows, and tiles.">
      <CatalogSection title="Status and identity" description="Use these for small pieces of supporting content.">
        <ExampleGrid>
          <ExampleCard title="Avatar and labels">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
              <Avatar name="Niraj Pangarkar" type="Initials" status="Online" />
              <Avatar name="Niraj Pangarkar" type="Fallback" shape="Rounded" />
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              <Tag label="Active" kind="Positive" />
              <Tag label="Warning" kind="Warning" variant="Light" />
              <NumberBadge count={7} />
            </View>
          </ExampleCard>
          <ExampleCard title="Icon tile">
            <IconTile icon={Bell} iconColor={colors.contentAction} iconSize={24} />
          </ExampleCard>
          <ExampleCard title="List item" wide>
            <ListItem label="Visitor pre-approved" paragraph="Expected today at 6:30 PM" artwork="Small" leadingArtwork={<House size={24} color={colors.contentAction} />} />
            <ListItem label="Payment due" paragraph="Maintenance invoice generated" layout="Label trailing" trailingLabel="₹2,400" />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>

      <CatalogSection title="Tiles" description="Tile primitives and grouped selection layouts.">
        <TileExamples />
      </CatalogSection>
    </CatalogPage>
  );
}

function TileExamples() {
  const [value, setValue] = useState<string | string[] | null>('home');

  return (
    <ExampleGrid>
      <ExampleCard title="Single tile">
        <Tile label="Home" artworkType="icon" icon={House} selected />
      </ExampleCard>
      <ExampleCard title="Tile grid" wide>
        <TileGrid
          columns={2}
          items={[
            { key: 'one', label: 'Home services', artworkType: 'icon', icon: House },
            { key: 'two', label: 'Residents', artworkType: 'icon', icon: User },
          ]}
        />
      </ExampleCard>
      <ExampleCard title="Tile group" wide>
        <TileGroup
          value={value}
          onChange={setValue}
          items={[
            { key: 'home', label: 'Home', artworkType: 'icon', icon: House },
            { key: 'profile', label: 'Profile', artworkType: 'icon', icon: User },
          ]}
        />
      </ExampleCard>
    </ExampleGrid>
  );
}

function LayoutAndFeedbackExamples() {
  return (
    <CatalogPage title="Layout and feedback" description="Reusable surfaces for arranging content and communicating system status.">
      <CatalogSection title="Layout" description="Cards, section headers, grouped rows, and fixed action footers.">
        <ExampleGrid>
          <ExampleCard title="Surface card" wide>
            <SurfaceCard accent>
              <SectionHeader title="Recent activity" actionLabel="View all" />
              <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Surface content stays inside the tokenized card treatment.</Text>
            </SurfaceCard>
          </ExampleCard>
          <ExampleCard title="List group" wide>
            <ListGroup>
              <ListItem label="First item" paragraph="Grouped row content" />
              <ListItem label="Second item" paragraph="Shared list container" />
            </ListGroup>
          </ExampleCard>
          <ExampleCard title="Action footer" wide>
            <ActionFooter
              safeArea={false}
              primary={{ label: 'Continue', onPress: () => {} }}
              secondary={{ label: 'Cancel', onPress: () => {}, kind: 'Tertiary' }}
            />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>

      <CatalogSection title="Feedback" description="Banners and progress indicators for status-heavy screens.">
        <ExampleGrid>
          <ExampleCard title="Banner" wide>
            <Banner icon={Bell} title="Update available" description="Install the latest version for the newest access controls." actionLabel="Update" />
          </ExampleCard>
          <ExampleCard title="Progress">
            <ProgressSteps currentIndex={1} total={4} labels={['Type', 'Details', 'Photos', 'Review']} />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

function OverlayExamples() {
  const [visible, setVisible] = useState(false);

  return (
    <CatalogPage title="Overlays" description="Modal presentation and dismissal behavior for temporary tasks.">
      <CatalogSection title="Modal sheet" description="The sheet is controlled by visible and onDismiss props.">
        <ExampleGrid>
          <ExampleCard title="Interactive example" wide>
            <Button label="Open sheet" onPress={() => setVisible(true)} />
            <ModalSheet visible={visible} onDismiss={() => setVisible(false)} title="Example sheet">
              <View style={{ padding: spacing.lg, gap: spacing.md }}>
                <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>Sheet content</Text>
                <Button label="Dismiss" kind="Secondary" onPress={() => setVisible(false)} />
              </View>
            </ModalSheet>
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

function ProductPatternExamples() {
  return (
    <CatalogPage title="Product patterns" description="Reusable product compositions built from the core component system.">
      <CatalogSection title="Marketplace and reviews" description="Feature-level patterns that carry product language.">
        <ExampleGrid>
          <ExampleCard title="Category stat tile">
            <CategoryStatTile icon={House} label="Homes" stat="82K+" />
          </ExampleCard>
          <ExampleCard title="Listing card" wide>
            <ListingCard
              imageSource={listingImage}
              title="Community listing"
              distance="1.2 km"
              location="Jayanagar"
              price="₹ 12,000"
              originalPrice="₹ 16,000"
              discountLabel="-25%"
            />
          </ExampleCard>
          <ExampleCard title="Review card" wide>
            <ReviewCard rating={4.5} reviewText="Reliable and punctual." date="2 Feb 2026" />
          </ExampleCard>
          <ExampleCard title="Asset preview">
            <Image source={listingImage} style={{ width: '100%', height: 160, borderRadius: radius.md }} resizeMode="cover" />
          </ExampleCard>
        </ExampleGrid>
      </CatalogSection>
    </CatalogPage>
  );
}

export const AllProductionComponents: Story = { render: () => <ComponentIndex /> };
export const Actions: Story = { render: () => <ActionsExamples /> };
export const FormInputs: Story = { render: () => <FormExamples /> };
export const Navigation: Story = { render: () => <NavigationExamples /> };
export const DataDisplay: Story = { render: () => <DataDisplayExamples /> };
export const LayoutAndFeedback: Story = { render: () => <LayoutAndFeedbackExamples /> };
export const Overlays: Story = { render: () => <OverlayExamples /> };
export const ProductPatterns: Story = { render: () => <ProductPatternExamples /> };
