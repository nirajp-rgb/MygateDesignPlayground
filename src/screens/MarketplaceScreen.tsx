import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import {
  Armchair,
  BabyCarriageIcon,
  BookmarkSimple,
  BuildingIcon,
  Car,
  ChalkboardTeacherIcon,
  ChatCircleDots,
  CookingPotIcon,
  DeviceMobile,
  DotsThree,
  IconProps,
  LampIcon,
  Plus,
  Receipt,
} from 'phosphor-react-native';
import {
  AppBottomNav,
  AppHeader,
  CategoryStatTile,
  IconButton,
  ListingCard,
  SearchField,
  SectionHeader,
} from '../components';
import { colors, iconSize, primitiveColors, radius, spacing, typography } from '../tokens';
import { mainNavItems } from './mainNav';
import type { PrototypeScreenKey } from './types';
import promoBanner from '../assets/MarketplaceITems/IMG_7002.webp';
import carBlue from '../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png';
import carBlack from '../assets/MarketplaceITems/4E12EFC8-BBDE-481C-8A9D-756F68E647C8.png';
import carSilver from '../assets/MarketplaceITems/612BD327-6CFE-4C7A-8C70-6357C2B93642.png';
import carRed from '../assets/MarketplaceITems/66C752BA-178A-420D-92DD-3402751510DB.png';
import furnitureLiving from '../assets/MarketplaceITems/6B64D0E5-2B41-45D6-8BB5-4B523E62CC3F.png';
import furnitureDining from '../assets/MarketplaceITems/710E6CBE-05E3-4723-BBD3-45375C382EEE.png';
import furnitureCoffee from '../assets/MarketplaceITems/A2175418-39BA-4A4A-830F-390723EF957B.png';
import furnitureRustic from '../assets/MarketplaceITems/B4CCBC7A-B693-41F9-A2D2-1B6D70C58B70.png';
import searchPropertyTileImage from '../assets/MarketplaceITems/SearchProperty.png';
import listPropertyTileImage from '../assets/MarketplaceITems/ListPropertty.png';
import { MarketplacePromoCard, PropertyActionCard } from '../patterns/marketplace';

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
    backgroundColor: primitiveColors['Color/brand/core/clear-blue/400'],
    textColor: colors.contentOnDark
  },
  {
    title: 'Mango Mania',
    imageSource: furnitureCoffee,
    backgroundColor: colors.surfaceActionPrimary,
    textColor: colors.contentPrimary
  },
  {
    title: 'Kids Classes',
    imageSource: furnitureRustic,
    backgroundColor: primitiveColors['Color/support/purple/400'],
    textColor: colors.contentOnDark
  }
];

type Props = {
  onNavigate: (screen: PrototypeScreenKey) => void;
};

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
                <SearchField mode="trigger" placeholder="What are you looking for?" onPress={() => onNavigate('searchExperience')} />

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
              <PropertyActionCard title="Search property" description="Buy or rent effortlessly" imageSource={searchPropertyTileImage} />
              <PropertyActionCard title="List Property" description="Verified buyers & 5 tenants" imageSource={listPropertyTileImage} onPress={() => onNavigate('listingWizard')} />
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
            <SectionHeader leadingIcon={BuildingIcon} title="Listings from your community" actionLabel="See all" />
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
                <MarketplacePromoCard
                  key={card.title}
                  {...card}
                />
              ))}
            </ScrollView>
          </View>

          <View style={{ gap: spacing.md }}>
            <SectionHeader
              leadingIcon={Armchair}
              title="Furniture"
              subtitle="Explore from 12k+ listings"
              actionLabel="See all"
            />
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
            <SectionHeader
              leadingIcon={Car}
              title="Vehicles"
              subtitle="Explore from 400+ listings"
              actionLabel="See all"
            />
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
