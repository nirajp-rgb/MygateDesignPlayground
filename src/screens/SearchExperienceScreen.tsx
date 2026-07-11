import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowClockwise,
  ArrowLeft,
  Buildings,
  CaretRight,
  Car,
  ChatsCircle,
  ClockCounterClockwise,
  House,
  MagnifyingGlass,
  Package,
  ShieldCheck,
  Sparkle,
  Storefront,
  User,
  Users,
  Wrench,
  X
} from 'phosphor-react-native';
import { appHeaderHeight, colors, iconSize, radius, spacing, typography } from '../tokens';
import type { DailyHelpProfileVisitor, PrototypeScreenKey } from './types';

type Props = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
  onBack: () => void;
  onOpenDailyHelpProfile: (visitor: DailyHelpProfileVisitor) => void;
};

type SearchScope = 'all' | 'residents' | 'visitors' | 'dailyHelp' | 'listings' | 'services' | 'posts';
type SearchKind = Exclude<SearchScope, 'all'>;

type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  meta: string;
  keywords: string[];
  sectionLabel: string;
  accent: string;
  verified?: boolean;
  inSociety?: boolean;
  recent?: boolean;
  owners?: boolean;
  approved?: boolean;
  deliveries?: boolean;
  checkedIn?: boolean;
  availableNow?: boolean;
  under10k?: boolean;
  topRated?: boolean;
  homeVisit?: boolean;
  notices?: boolean;
  trending?: boolean;
  actionVisitor?: DailyHelpProfileVisitor;
  priceLabel?: string;
};

type ScopeMeta = {
  key: SearchScope;
  label: string;
};

const scopeOrder: ScopeMeta[] = [
  { key: 'all', label: 'All' },
  { key: 'residents', label: 'Residents' },
  { key: 'visitors', label: 'Visitors' },
  { key: 'dailyHelp', label: 'Daily Help' },
  { key: 'listings', label: 'Listings' },
  { key: 'services', label: 'Services' },
  { key: 'posts', label: 'Posts' }
];

const recentSearches = ['Gateimma', 'plumber', 'B 102', 'sofa', 'delivery'];
const quickIdeas = [
  { label: 'Find a resident', scope: 'residents' as SearchScope, query: 'Sharma' },
  { label: 'Track visitors', scope: 'visitors' as SearchScope, query: 'delivery' },
  { label: 'Search daily help', scope: 'dailyHelp' as SearchScope, query: 'Gateimma' },
  { label: 'Browse listings', scope: 'listings' as SearchScope, query: 'sofa' }
];

const searchItems: SearchItem[] = [
  {
    id: 'resident-ravi',
    kind: 'residents',
    title: 'Ravi Sharma',
    subtitle: 'B 204 · Tower B',
    meta: 'Resident directory',
    keywords: ['ravi', 'sharma', 'b 204', 'tower b', 'resident'],
    sectionLabel: 'Residents',
    accent: '#0F9D8A',
    verified: true,
    inSociety: true,
    owners: true,
    recent: true
  },
  {
    id: 'resident-meera',
    kind: 'residents',
    title: 'Meera Venkat',
    subtitle: 'D 401 · Tower D',
    meta: 'Resident directory',
    keywords: ['meera', 'venkat', 'd 401', 'tower d', 'resident'],
    sectionLabel: 'Residents',
    accent: '#0F9D8A',
    verified: true,
    inSociety: true,
    owners: false
  },
  {
    id: 'visitor-amazon',
    kind: 'visitors',
    title: 'Amazon delivery',
    subtitle: 'Gate 2 · Arrived 12:10 PM',
    meta: 'Visitor log',
    keywords: ['amazon', 'delivery', 'gate 2', 'package', 'visitor'],
    sectionLabel: 'Visitors',
    accent: '#E39A16',
    approved: true,
    deliveries: true,
    recent: true
  },
  {
    id: 'visitor-ola',
    kind: 'visitors',
    title: 'Ola cab',
    subtitle: 'Tower pickup · 9:05 AM',
    meta: 'Visitor log',
    keywords: ['ola', 'cab', 'pickup', 'visitor'],
    sectionLabel: 'Visitors',
    accent: '#E39A16',
    approved: true,
    recent: true
  },
  {
    id: 'help-gateimma',
    kind: 'dailyHelp',
    title: 'Gateimma',
    subtitle: 'Cook · B 102',
    meta: 'Checked in at 8:30 AM',
    keywords: ['gateimma', 'cook', 'b 102', 'daily help'],
    sectionLabel: 'Daily Help',
    accent: '#2D7FF9',
    verified: true,
    checkedIn: true,
    availableNow: true,
    recent: true,
    actionVisitor: {
      name: 'Gateimma',
      phone: '9876563578',
      status: 'Online'
    }
  },
  {
    id: 'help-rupa',
    kind: 'dailyHelp',
    title: 'Rupa',
    subtitle: 'Housekeeping · A 804',
    meta: 'Available after 2 PM',
    keywords: ['rupa', 'housekeeping', 'a 804', 'daily help'],
    sectionLabel: 'Daily Help',
    accent: '#2D7FF9',
    verified: true,
    availableNow: false,
    checkedIn: false
  },
  {
    id: 'listing-sofa',
    kind: 'listings',
    title: '3-seater fabric sofa',
    subtitle: 'Tower B · In society',
    meta: 'Used listing',
    keywords: ['sofa', '3 seater', 'tower b', 'listing', 'furniture'],
    sectionLabel: 'Listings',
    accent: '#D15593',
    inSociety: true,
    verified: true,
    under10k: false,
    priceLabel: '₹ 12,500'
  },
  {
    id: 'listing-cycle',
    kind: 'listings',
    title: 'Kids cycle',
    subtitle: 'Tower C · In society',
    meta: 'Used listing',
    keywords: ['cycle', 'kids cycle', 'listing', 'tower c'],
    sectionLabel: 'Listings',
    accent: '#D15593',
    inSociety: true,
    verified: true,
    under10k: true,
    priceLabel: '₹ 3,800'
  },
  {
    id: 'service-plumber',
    kind: 'services',
    title: 'Ramesh Plumbing Works',
    subtitle: '4.8 rating · 12 homes served',
    meta: 'Home services',
    keywords: ['plumber', 'plumbing', 'ramesh', 'leak', 'service'],
    sectionLabel: 'Services',
    accent: '#6C55F5',
    topRated: true,
    availableNow: true,
    homeVisit: true
  },
  {
    id: 'service-tutor',
    kind: 'services',
    title: 'After-school Math Tutor',
    subtitle: 'CBSE classes · Tower A',
    meta: 'Community services',
    keywords: ['tutor', 'math', 'cbse', 'classes', 'service'],
    sectionLabel: 'Services',
    accent: '#6C55F5',
    topRated: false,
    availableNow: true,
    homeVisit: false
  },
  {
    id: 'post-parking',
    kind: 'posts',
    title: 'Parking etiquette discussion',
    subtitle: 'Meera Venkat · Discussions',
    meta: '14 replies · trending',
    keywords: ['parking', 'visitor slots', 'discussion', 'post'],
    sectionLabel: 'Posts',
    accent: '#475467',
    trending: true,
    recent: true
  },
  {
    id: 'post-lift',
    kind: 'posts',
    title: 'Lift safety audit tomorrow',
    subtitle: 'Notice · Society',
    meta: 'Notice board',
    keywords: ['lift', 'audit', 'notice', 'society post'],
    sectionLabel: 'Posts',
    accent: '#475467',
    notices: true,
    recent: true
  }
];

function getIconForKind(kind: SearchKind) {
  switch (kind) {
    case 'residents':
      return Buildings;
    case 'visitors':
      return Car;
    case 'dailyHelp':
      return User;
    case 'listings':
      return House;
    case 'services':
      return Wrench;
    case 'posts':
      return ChatsCircle;
  }
}

function getScopeDescription(scope: SearchScope) {
  if (scope === 'all') return 'Results from across MyGate';
  return `Showing matches from ${scopeOrder.find((item) => item.key === scope)?.label ?? 'this scope'}`;
}

function scoreItem(item: SearchItem, normalizedQuery: string) {
  const haystack = [item.title, item.subtitle, item.meta, ...item.keywords].join(' ').toLowerCase();
  const title = item.title.toLowerCase();

  if (title === normalizedQuery) return 300;
  if (title.startsWith(normalizedQuery)) return 220;
  if (item.keywords.some((keyword) => keyword.toLowerCase() === normalizedQuery)) return 190;
  if (item.keywords.some((keyword) => keyword.toLowerCase().startsWith(normalizedQuery))) return 150;
  if (haystack.includes(normalizedQuery)) return 100;
  return 0;
}

function SearchInput({
  value,
  onChangeText,
  onClear,
  inputRef
}: {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
  inputRef: React.RefObject<TextInput | null>;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        borderRadius: radius.xl,
        borderWidth: 1,
        borderColor: colors.borderSubtle,
        backgroundColor: colors.surfaceSecondary,
        paddingHorizontal: spacing.md,
        minHeight: 56
      }}
    >
      <MagnifyingGlass size={iconSize.md} color={colors.contentSecondary} weight="regular" />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        autoFocus
        placeholder="Search residents, help, visitors, listings..."
        placeholderTextColor={colors.contentTertiary}
        style={[typography.bodyDefault, { flex: 1, color: colors.contentPrimary }]}
      />
      {value ? (
        <Pressable onPress={onClear} hitSlop={10}>
          <X size={iconSize.md} color={colors.contentSecondary} weight="regular" />
        </Pressable>
      ) : null}
    </View>
  );
}

function ScopeTabs({ activeScope, onSelect }: { activeScope: SearchScope; onSelect: (scope: SearchScope) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
      {scopeOrder.map((scope) => {
        const isActive = scope.key === activeScope;
        return (
          <Pressable
            key={scope.key}
            onPress={() => onSelect(scope.key)}
            style={{
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.pill,
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? colors.contentAction : colors.borderSubtle,
              backgroundColor: isActive ? colors.surfacePrimary : colors.surfaceSecondary
            }}
          >
            <Text style={[typography.bodySmallBold, { color: isActive ? colors.contentAction : colors.contentPrimary }]}>
              {scope.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function ResultRow({
  item,
  onPress
}: {
  item: SearchItem;
  onPress?: () => void;
}) {
  const Icon = getIconForKind(item.kind);
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        paddingVertical: spacing.md
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: radius.lg,
          backgroundColor: `${item.accent}18`,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon size={iconSize.md} color={item.accent} weight="regular" />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
          <Text style={typography.bodyDefaultBold}>{item.title}</Text>
          {item.verified ? <ShieldCheck size={iconSize.sm} color={colors.contentAction} weight="fill" /> : null}
        </View>
        <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{item.subtitle}</Text>
        <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{item.meta}</Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 4 }}>
        {item.priceLabel ? <Text style={typography.bodyDefaultBold}>{item.priceLabel}</Text> : null}
        <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="bold" />
      </View>
    </Pressable>
  );
}

function HairlineSection({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        gap: spacing.md,
        paddingVertical: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.borderSubtle
      }}
    >
      {children}
    </View>
  );
}

export function SearchExperienceScreen({ onBack, onOpenDailyHelpProfile }: Props) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [activeScope, setActiveScope] = useState<SearchScope>('all');

  useEffect(() => {
    const timeoutId = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(timeoutId);
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const queryPresent = normalizedQuery.length > 0;

  const suggestions = useMemo(() => {
    if (!queryPresent) return [];
    const matches = searchItems
      .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
      .filter((entry) => entry.score >= 150)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.item);
    return matches;
  }, [normalizedQuery, queryPresent]);

  const matchedItems = useMemo(() => {
    if (!queryPresent) return [];
    return searchItems
      .map((item) => ({ item, score: scoreItem(item, normalizedQuery) }))
      .filter((entry) => entry.score > 0)
      .filter((entry) => activeScope === 'all' || entry.item.kind === activeScope)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.item);
  }, [activeScope, normalizedQuery, queryPresent]);

  const noResults = queryPresent && matchedItems.length === 0;

  const handleSelectSuggestion = (nextQuery: string, nextScope?: SearchScope) => {
    setQuery(nextQuery);
    if (nextScope) {
      setActiveScope(nextScope);
    }
  };

  const handleResultPress = (item: SearchItem) => {
    if (item.actionVisitor) {
      onOpenDailyHelpProfile(item.actionVisitor);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: spacing['4xl'] }}
      >
        <View
          style={{
            backgroundColor: colors.surfacePage,
            paddingHorizontal: spacing.md,
            paddingTop: insets.top + spacing.sm,
            paddingBottom: spacing.md,
            gap: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderSubtle
          }}
        >
          <View style={{ minHeight: appHeaderHeight, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
            <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Go back" hitSlop={10}>
              <ArrowLeft size={iconSize.md} color={colors.contentSecondary} weight="regular" />
            </Pressable>
            <View style={{ flex: 1 }}>
              <SearchInput value={query} onChangeText={setQuery} onClear={() => setQuery('')} inputRef={inputRef} />
            </View>
          </View>
          <ScopeTabs
            activeScope={activeScope}
            onSelect={(scope) => {
              setActiveScope(scope);
            }}
          />
        </View>

        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}>
          {!queryPresent ? (
            <>
              <HairlineSection>
                <View style={{ gap: spacing.sm }}>
                  {recentSearches.map((item) => (
                    <Pressable
                      key={item}
                      onPress={() => handleSelectSuggestion(item)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: spacing.sm
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <ClockCounterClockwise size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                        <Text style={typography.bodyDefault}>{item}</Text>
                      </View>
                      <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="bold" />
                    </Pressable>
                  ))}
                </View>
              </HairlineSection>

              <View
                style={{
                  gap: spacing.md,
                  marginTop: spacing.xs,
                  paddingVertical: spacing.md,
                  borderRadius: radius.xxl,
                  backgroundColor: colors.surfacePage
                }}
              >
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
                  {quickIdeas.map((idea) => (
                    <Pressable
                      key={idea.label}
                      onPress={() => handleSelectSuggestion(idea.query, idea.scope)}
                      style={{
                        paddingHorizontal: spacing.md,
                        paddingVertical: spacing.sm,
                        borderRadius: radius.pill,
                        borderWidth: 1,
                        borderColor: colors.borderSubtle,
                        backgroundColor: colors.surfacePrimary
                      }}
                    >
                      <Text style={typography.bodySmallBold}>{idea.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <HairlineSection>
                {scopeOrder
                  .filter((scope) => scope.key !== 'all')
                  .map((scope) => {
                    const Icon =
                      scope.key === 'residents'
                        ? Buildings
                        : scope.key === 'visitors'
                          ? Package
                          : scope.key === 'dailyHelp'
                            ? Users
                            : scope.key === 'listings'
                              ? House
                              : scope.key === 'services'
                                ? Storefront
                                : ChatsCircle;
                    return (
                      <Pressable
                        key={scope.key}
                        onPress={() => setActiveScope(scope.key)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: spacing.md,
                          paddingVertical: spacing.md
                        }}
                      >
                        <View
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: radius.lg,
                            backgroundColor: colors.surfaceSecondary,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={iconSize.md} color={colors.contentPrimary} weight="regular" />
                        </View>
                        <View style={{ flex: 1, gap: 2 }}>
                          <Text style={typography.bodyDefaultBold}>{scope.label}</Text>
                          <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                            {getScopeDescription(scope.key)}
                          </Text>
                        </View>
                        <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="bold" />
                      </Pressable>
                    );
                  })}
              </HairlineSection>
            </>
          ) : (
            <>
              {suggestions.length > 0 ? (
                <HairlineSection>
                  <View style={{ gap: spacing.sm }}>
                    {suggestions.map((item) => (
                      <Pressable
                        key={item.id}
                        onPress={() => handleSelectSuggestion(item.title, item.kind)}
                      style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingVertical: spacing.sm
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                          <Sparkle size={iconSize.sm} color={colors.contentAction} weight="fill" />
                          <Text style={typography.bodyDefault}>{item.title}</Text>
                        </View>
                        <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>{item.sectionLabel}</Text>
                      </Pressable>
                    ))}
                  </View>
                </HairlineSection>
              ) : null}

              {noResults ? (
                <View
                  style={{
                    marginTop: spacing.lg,
                    gap: spacing.lg,
                    padding: spacing.xl,
                    borderRadius: radius.xxl,
                    backgroundColor: colors.surfaceActionSecondarySubtle
                  }}
                >
                  <Text style={typography.titleSubsection}>No results found</Text>
                  <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                    {`Nothing matched "${query}" in ${scopeOrder.find((item) => item.key === activeScope)?.label}.`}
                  </Text>
                  <View style={{ gap: spacing.sm }}>
                    <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
                      Try a broader scope, a shorter query, or one of these common searches.
                    </Text>
                    {['Gateimma', 'Ravi Sharma', 'plumber', 'delivery', 'sofa'].map((item) => (
                      <Pressable
                        key={item}
                        onPress={() => handleSelectSuggestion(item, 'all')}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}
                      >
                        <ArrowClockwise size={iconSize.sm} color={colors.contentAction} weight="regular" />
                        <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={{ gap: spacing.md, paddingTop: spacing.lg }}>
                  {matchedItems.map((item, index) => (
                    <View
                      key={item.id}
                      style={{
                        paddingTop: index === 0 ? 0 : spacing.sm,
                        borderTopWidth: index === 0 ? 0 : 1,
                        borderTopColor: colors.borderSubtle
                      }}
                    >
                      <ResultRow item={item} onPress={() => handleResultPress(item)} />
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
