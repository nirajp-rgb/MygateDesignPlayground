import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import {
  AlignRightIcon,
  Armchair,
  Baby,
  BabyCarriageIcon,
  BookmarkSimple,
  BuildingIcon,
  Car,
  CaretRight,
  ChalkboardTeacherIcon,
  ChatCircleDots,
  ClockCounterClockwiseIcon,
  CookingPotIcon,
  DeviceMobile,
  DotsThree,
  ForkKnife,
  IconProps,
  JarIcon,
  LampIcon,
  ListBullets,
  MagnifyingGlass,
  PaintBrushHousehold,
  PlantIcon,
  Plus,
  PlusIcon,
  PlusSquareIcon,
  Receipt,
  Users,
  WheelchairIcon,
  Wrench,
} from 'phosphor-react-native';
import { AppBottomNav } from '../components/AppBottomNav';
import { AppHeader } from '../components/AppHeader';
import { CategoryStatTile } from '../components/CategoryStatTile';
import { IconButton } from '../components/IconButton';
import { ListingCard } from '../components/ListingCard';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors, iconSize, radius, spacing, typography } from '../tokens';
import { mainNavItems } from './mainNav';
import type { PrototypeScreenKey } from './types';

const promoBanner = require('../assets/MarketplaceITems/IMG_7002.webp');
const carBlue = require('../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png');
const carBlack = require('../assets/MarketplaceITems/4E12EFC8-BBDE-481C-8A9D-756F68E647C8.png');
const carSilver = require('../assets/MarketplaceITems/612BD327-6CFE-4C7A-8C70-6357C2B93642.png');
const carRed = require('../assets/MarketplaceITems/66C752BA-178A-420D-92DD-3402751510DB.png');
const furnitureLiving = require('../assets/MarketplaceITems/6B64D0E5-2B41-45D6-8BB5-4B523E62CC3F.png');
const furnitureDining = require('../assets/MarketplaceITems/710E6CBE-05E3-4723-BBD3-45375C382EEE.png');
const furnitureCoffee = require('../assets/MarketplaceITems/A2175418-39BA-4A4A-830F-390723EF957B.png');
const furnitureRustic = require('../assets/MarketplaceITems/B4CCBC7A-B693-41F9-A2D2-1B6D70C58B70.png');
const searchPropertyTileImage = require('../assets/MarketplaceITems/SearchProperty.png');
const listPropertyTileImage = require('../assets/MarketplaceITems/ListPropertty.png');

const categories: Array<{ icon: React.ComponentType<IconProps>; label: string; stat: string }> = [
  { icon: Armchair, label: 'Furniture', stat: '82K+' },
  { icon: Car, label: 'Vehicles', stat: '82K+' },
  { icon: DeviceMobile, label: 'Electronics', stat: '82K+' },
  { icon: CookingPotIcon, label: 'Food', stat: '82K+' },
  { icon: LampIcon, label: 'Decor', stat: '82K+' },
  { icon: ChalkboardTeacherIcon, label: 'Services', stat: '82K+' },
  { icon: BabyCarriageIcon, label: 'Kids Items', stat: '82K+' },
  { icon: DotsThree, label: 'Others', stat: '82K+' },
];

const communityListings = [
  { imageSource: carBlue, title: 'Classic Maruti 800', distance: '1.2 km', location: 'Jayanagar', price: '₹ 12,000', originalPrice: '₹ 16,216', discountLabel: '-26%' },
  { imageSource: carBlack, title: 'Hyundai i10 Magna', distance: '2.1 km', location: 'Indira Nagar', price: '₹ 8,500', originalPrice: '₹ 9,444', discountLabel: '-10%' },
  { imageSource: carSilver, title: 'Mahindra Scorpio SUV', distance: '1.8 km', location: 'Koramangala', price: '₹ 9,000', originalPrice: '₹ 10,588', discountLabel: '-15%' },
  { imageSource: carRed, title: 'Tata Nano LX', distance: '2.5 km', location: 'Bellandur', price: '₹ 11,200', originalPrice: '₹ 14,000', discountLabel: '-20%' },
];

const furnitureListings = [
  { imageSource: furnitureLiving, title: 'Mid-century Coffee Table', distance: '1.2 km', location: 'Jayanagar', price: '₹ 12,000', originalPrice: '₹ 16,216', discountLabel: '-26%' },
  { imageSource: furnitureDining, title: 'Acacia Dining Table', distance: '2.1 km', location: 'Indira Nagar', price: '₹ 8,500', originalPrice: '₹ 9,444', discountLabel: '-10%' },
  { imageSource: furnitureCoffee, title: 'Modern Coffee Table', distance: '1.8 km', location: 'Koramangala', price: '₹ 9,000', originalPrice: '₹ 10,588', discountLabel: '-15%' },
  { imageSource: furnitureRustic, title: 'Rustic Coffee Table', distance: '2.5 km', location: 'Bellandur', price: '₹ 11,200', originalPrice: '₹ 14,000', discountLabel: '-20%' },
];

const summerFindings = [
  {
    title: 'Beat the Heat',
    imageSource: furnitureDining,
    backgroundColor: '#2AA7FF',
  },
  {
    title: 'Mango Mania',
    imageSource: furnitureCoffee,
    backgroundColor: '#F4BE2C',
  },
  {
    title: 'Kids Classes',
    imageSource: furnitureRustic,
    backgroundColor: '#54B5EB',
  },
];

type Props = {
  onNavigate: (screen: PrototypeScreenKey) => void;
};

function SectionRow({
  icon: IconComponent,
  title,
  subtitle,
  actionLabel = 'See all',
}: {
  icon: React.ComponentType<IconProps>;
  title: string;
  subtitle?: string;
  actionLabel?: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1 }}>
        <View style={{ marginTop: 2 }}>
          <IconComponent size={iconSize.xl} color={colors.contentPrimary} weight="light" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={typography.bodyLargeBold}>{title}</Text>
          {subtitle ? (
            <Text style={[typography.caption, { color: colors.contentSecondary }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>
      <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
  <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>{actionLabel}</Text>
  <CaretRight size={iconSize.sm} color={colors.contentAction} weight="bold" />
</Pressable>
    </View>
  );
}

export function MarketplaceScreen({ onNavigate }: Props) {
  const [heroHeight, setHeroHeight] = useState(0);
  const [showHeaderChrome, setShowHeaderChrome] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <AppHeader
        variant="appHome"
        backgroundColor={showHeaderChrome ? colors.surfacePage : colors.surfaceActionSecondarySubtle}
        showShadow={showHeaderChrome}
        leftSlot={<Text style={typography.titleSubsection}>Buy & Sell</Text>}
        rightSlot={
          <>
            <Receipt size={iconSize.lg} color={colors.contentPrimary} weight="regular" />
            <BookmarkSimple size={iconSize.lg} color={colors.contentPrimary} weight="regular" />
            <ChatCircleDots size={iconSize.lg} color={colors.contentPrimary} weight="regular" />
          </>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl * 2 }}
        onScroll={(event) => {
          const currentY = event.nativeEvent.contentOffset.y;
          setShowHeaderChrome(heroHeight > 0 && currentY >= heroHeight - appHeaderTriggerOffset);
        }}
        scrollEventThrottle={16}
      >
        <View
          onLayout={(event) => {
            setHeroHeight(event.nativeEvent.layout.height);
          }}
          style={{
            paddingTop: spacing.md,
            paddingBottom: spacing.lg,
            backgroundColor: colors.surfaceActionSecondarySubtle,
          }}
        >
          <View style={{ paddingHorizontal: spacing.md, gap: spacing.md }}>
                <Pressable
                  onPress={() => onNavigate('searchExperience')}
                  style={{
                    borderRadius: radius.xl,
                    borderWidth: 1,
                    borderColor: colors.borderDefault,
                    backgroundColor: colors.surfacePrimary,
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: spacing.sm,
                    shadowColor: '#000000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                >
                  <MagnifyingGlass size={iconSize.md} color={colors.contentTertiary} weight="regular" />
                  <Text style={[typography.bodyDefault, { color: colors.contentTertiary }]}>What are you looking for?</Text>
                </Pressable>

            <View style={{ gap: spacing.sm }}>
              {[0, 1].map((row) => (
                <View  key={row} style={{ flexDirection: 'row', gap: spacing.sm }}>
                  {categories.slice(row * 4, row * 4 + 4).map((category) => (
                    <CategoryStatTile  key={category.label} icon={category.icon} label={category.label} stat={category.stat} />
                  ))}
                </View>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              <SurfaceCard  borderWidth={0} style={{ flex: 1, gap: spacing.xs,paddingTop:spacing.md,paddingBottom:48,paddingHorizontal:spacing.md, overflow: 'hidden' }}>
                <Text style={typography.bodyDefaultBold}>Search property</Text>
                <Text style={[typography.caption, { color: colors.contentSecondary }]}>Buy or rent effortlessly</Text>
                <View
                  style={{
                    position: 'absolute',
                    right: -spacing.sm,
                    bottom: -spacing.sm,
                  }}
                >
                  <Image
                    source={searchPropertyTileImage}
                    resizeMode="contain"
                    style={{ width: 80, height: 70 }}
                  />
                </View>
              </SurfaceCard>
              <Pressable style={{ flex: 1 }} onPress={() => onNavigate('listingWizard')}>
                <SurfaceCard borderWidth={0} style={{ gap: spacing.xs, paddingTop: spacing.md, paddingBottom: 48, paddingHorizontal: spacing.md, overflow: 'hidden' }}>
                  <View
                    style={{
                      position: 'absolute',
                      right: -spacing.sm,
                      bottom: -spacing.sm,
                    }}
                  >
                    <Image
                      source={listPropertyTileImage}
                      resizeMode="contain"
                      style={{ width: 80, height: 80 }}
                    />
                  </View>
                  <Text style={typography.bodyDefaultBold}>List Property</Text>
                  <Text style={[typography.caption, { color: colors.contentSecondary }]}>Verified buyers & 5 tenants</Text>
                </SurfaceCard>
              </Pressable>
            </View>

            <Image
              source={promoBanner}
              resizeMode="cover"
              style={{ width: '100%', height: 172, borderRadius: radius.xl, backgroundColor: colors.surfacePrimary }}
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.xl, gap: spacing.xl }}>
          <View style={{ gap: spacing.md }}>
            <SectionRow icon={BuildingIcon} title="Listings from your community" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -spacing.md }}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.md, paddingRight: spacing.xl }}
            >
              {communityListings.map((listing) => (
                <ListingCard key={`${listing.title}-${listing.location}`} {...listing} />
              ))}
            </ScrollView>
          </View>

          <View
            style={{
              gap: spacing.md,
              marginHorizontal: -spacing.md,
              paddingVertical: spacing.lg,
              backgroundColor: colors.surfaceActionSecondarySubtle,
            }}
          >
            <View style={{ alignItems: 'center', paddingHorizontal: spacing.md }}>
              <Text style={typography.bodyLargeBold}>Summer time findings</Text>
              <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>Explore nearby listings</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: spacing.md, paddingRight: spacing.xl }}
            >
              {summerFindings.map((card) => (
                <View
                  key={card.title}
                  style={{
                    width: `42%`,
                    height: 148,
                    flexShrink: 0,
                    borderRadius: radius.xl,
                    backgroundColor: card.backgroundColor,
                    padding: spacing.md,
                    overflow: 'hidden',
                  }}
                >
                  <Text style={[typography.bodyDefaultBold, { color: colors.contentOnDark, width: 64 }]}>{card.title}</Text>
                  <Image
                    source={card.imageSource}
                    resizeMode="cover"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 88,
                      opacity: 0.1,
                    }}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: spacing.md }}>
            <SectionRow icon={Armchair} title="Furniture" subtitle="Explore from 12k+ listings" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -spacing.md }}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.md, paddingRight: spacing.xl }}
            >
              {furnitureListings.map((listing) => (
                <ListingCard key={`${listing.title}-${listing.location}`} {...listing} />
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: spacing.md }}>
            <SectionRow icon={Car} title="Vehicles" subtitle="Explore from 400+ listings" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -spacing.md }}
              contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.md, paddingRight: spacing.xl }}
            >
              {communityListings.map((listing) => (
                <ListingCard key={`vehicle-${listing.title}-${listing.location}`} {...listing} />
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', right: spacing.md, bottom: 132 }}>
        <IconButton type="Primary" size="LG" icon={Plus} />
      </View>

      <AppBottomNav
        items={mainNavItems}
        activeKey="marketplace"
        onPressItem={(key) => {
          if (key === 'social') onNavigate('appHome');
        }}
      />
    </View>
  );
}

const appHeaderTriggerOffset = 12;
