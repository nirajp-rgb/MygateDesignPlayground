/**
 * AppHomeScreen — main community feed home screen.
 */

import { useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { Animated, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent, ScrollView as ScrollViewType } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MagnifyingGlass, Bell, CaretDown, CaretRight,
  ThumbsUp, ChatCircle, ShareNetwork, DotsThreeVertical,
  Users, Wrench, Storefront,
  Tag as TagIcon, MapPin, Buildings,
  UserCheckIcon,
  CurrencyInrIcon,
  SwimmingPoolIcon,
  TennisBallIcon,
  ClipboardIcon,
  ClipboardTextIcon,
  CirclesThreePlusIcon,
  House,
  PlusCircle,
  NewspaperIcon,
  PencilIcon,
  CalendarBlank,
  Eye,
  type IconWeight,
  ImageIcon,
  GraphIcon,
  ChartBarIcon,
  NotePencilIcon
} from 'phosphor-react-native';
import { AppBottomNav } from '../components/AppBottomNav';
import { AppHeader } from '../components/AppHeader';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ListItem } from '../components/ListItem';
import { SectionHeader } from '../components/SectionHeader';
import { SurfaceCard } from '../components/SurfaceCard';
import { Tag } from '../components/Tag';
import { TileGrid } from '../components/TileGrid';
import type { TileGridItem } from '../components/TileGrid';
import { UpdateCard } from '../components/UpdateCard';
import { QuickActionsScreen } from './QuickActionsScreen';
import { colors, iconSize, radius, spacing, typography } from '../tokens';
import { mainNavItems } from './mainNav';
import type { DailyHelpProfileVisitor, PrototypeScreenKey } from './types';


const quickActionsBase: TileGridItem[] = [
  { label: 'Pre-Approve', artworkType: 'icon', icon: UserCheckIcon },
  { label: 'Pay Dues', artworkType: 'icon', icon: CurrencyInrIcon, topTag: { label: 'New Bill', kind: 'Info', variant: 'Solid' } },
  { label: 'Help Desk', artworkType: 'icon', icon: Wrench },
  { label: 'Amenities', artworkType: 'icon', icon: TennisBallIcon },
  { label: 'Notices', artworkType: 'icon', icon: ClipboardTextIcon, badgeCount: 4 },
  { label: 'Groceries', artworkType: 'icon', icon: Storefront },
  { label: 'Buy & Sell', artworkType: 'icon', icon: TagIcon },
  { label: 'View More', artworkType: 'icon', icon: CirclesThreePlusIcon },
];

const visitorImages = [
  require('../assets/VisitorProfilePhotos/rupa.png'),
  require('../assets/VisitorProfilePhotos/bhavna.png'),
  require('../assets/VisitorProfilePhotos/richa.png'),
  require('../assets/VisitorProfilePhotos/ruchika.png'),
  require('../assets/VisitorProfilePhotos/swapnaja.png'),
  require('../assets/VisitorProfilePhotos/yamini.png'),
];

const visitors = [
  { name: 'Raju', source: visitorImages[0] },
  { name: 'Ola', source: visitorImages[1] },
  { name: 'Gateimma', source: visitorImages[2], helpProfile: { name: 'Gateimma', phone: '9876563578', source: visitorImages[2], status: 'Online' as const } },
  { name: 'Blinkit', source: visitorImages[3] },
  { name: 'Swiggy', source: visitorImages[4] },
  { name: 'Zepto', source: visitorImages[5] },
];

const marketplaceFeedImages = [
  require('../assets/MarketplaceITems/4E12EFC8-BBDE-481C-8A9D-756F68E647C8.png'),
  require('../assets/MarketplaceITems/6B64D0E5-2B41-45D6-8BB5-4B523E62CC3F.png'),
  require('../assets/MarketplaceITems/D532470A-D6BC-4023-BA67-2E4A7F5ED952.png'),
];

const flatOptions = [
  { id: 'b102', flatLabel: 'B 102', societyLabel: 'Salarpuria Greenage', badgeCount: 4, isActive: true },
  { id: 'b201', flatLabel: 'B 201', societyLabel: 'Platinum City', badgeCount: 2, isActive: false },
  { id: '8e', flatLabel: '8E', societyLabel: 'Habitat Crest', badgeCount: 1, isActive: false },
] as const;

type FeedTabKey = 'discussions' | 'notices' | 'localBuzz' | 'polls' | 'marketplace' | 'events';
type FeedCategory = 'notice' | 'community' | 'marketplace' | 'localBuzz';
type FeedPriority = 'low' | 'normal' | 'high';
type NoticeType = 'society' | 'promoted';
type FeedAuthorRole = 'admin' | 'resident' | 'system';

const feedTabs: Array<{ key: FeedTabKey; label: string }> = [
  { key: 'notices', label: 'Notices' },
  { key: 'discussions', label: 'Discussions' },
  { key: 'localBuzz', label: 'Local Buzz' },
  { key: 'polls', label: 'Polls' },
  { key: 'marketplace', label: 'Buy & Sell' },
  { key: 'events', label: 'Events' },
];

type FeedPostBase = {
  id: string;
  category: FeedCategory;
  priority: FeedPriority;
  hoursAgo: number;
  authorName: string;
  authorSub: string;
  authorRole: FeedAuthorRole;
  title?: string;
  body: string;
  replyCount: number;
  likeCount: number;
  isSponsored?: boolean;
  trendingInCommunity?: boolean;
  noticeType?: NoticeType;
};

type FeedTextPost = FeedPostBase & {
  kind: 'text';
};

type FeedImagePost = FeedPostBase & {
  kind: 'image';
  images: ImageSourcePropType[];
};

type FeedListingPost = FeedPostBase & {
  kind: 'listing';
  listing: {
    imageSource: ImageSourcePropType;
    title: string;
    distance: string;
    location: string;
    price: string;
    originalPrice: string;
    discountLabel?: string;
  };
};

type FeedPollPost = FeedPostBase & {
  kind: 'poll';
  totalVotes: number;
  options: Array<{
    label: string;
    votes: number;
  }>;
};

type FeedEventPost = FeedPostBase & {
  kind: 'event';
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  attendeeCount: number;
  images?: ImageSourcePropType[];
};

type FeedPost = FeedTextPost | FeedImagePost | FeedListingPost | FeedPollPost | FeedEventPost;

const feedPosts = [
  {
    id: 'notice-maintenance',
    kind: 'text',
    category: 'notice',
    priority: 'high',
    hoursAgo: 1,
    authorName: 'Notice',
    authorSub: 'Society',
    authorRole: 'system',
    title: 'Gym restroom and shower area closure',
    body: 'The gym restroom and shower area will remain closed from 3 PM to 6 PM today for plumbing work.',
    replyCount: 2,
    likeCount: 4,
    noticeType: 'society',
  },
  {
    id: 'borrow-magsafe',
    kind: 'text',
    category: 'community',
    priority: 'normal',
    hoursAgo: 3,
    authorName: 'Sunil Bhadouriya',
    authorSub: 'B 102',
    authorRole: 'resident',
    body: 'Anyone has a MagSafe charger that I can borrow for one day? Mine stopped working right before my trip.',
    replyCount: 17,
    likeCount: 99,
    trendingInCommunity: true,
  },
  {
    id: 'notice-bazaar',
    kind: 'image',
    category: 'notice',
    priority: 'normal',
    hoursAgo: 5,
    authorName: 'Notice',
    authorSub: 'Society',
    authorRole: 'system',
    title: 'Summer bazaar this Saturday',
    body: 'Local stalls, live music, and a kids activity corner will be set up near the amphitheatre.',
    replyCount: 6,
    likeCount: 21,
    images: [visitorImages[0]],
    noticeType: 'society',
  },
  {
    id: 'marketplace-cycle',
    kind: 'listing',
    category: 'marketplace',
    priority: 'normal',
    hoursAgo: 4,
    authorName: 'Aparna Menon',
    authorSub: 'C 305',
    authorRole: 'resident',
    body: 'Selling our kids cycle. Lightly used, recently serviced, and comes with training wheels.',
    replyCount: 4,
    likeCount: 11,
    listing: {
      imageSource: marketplaceFeedImages[0],
      title: 'Firefox kids cycle',
      distance: 'In society',
      location: 'Tower C, Basement 1',
      price: '₹ 3,800',
      originalPrice: '₹ 5,200',
      discountLabel: '27% off',
    },
  },
  {
    id: 'cleanup-drive',
    kind: 'image',
    category: 'localBuzz',
    priority: 'normal',
    hoursAgo: 2,
    authorName: 'Local Buzz',
    authorSub: 'Civic Alerts',
    authorRole: 'system',
    body: 'A few moments from the monsoon clean-up drive and community breakfast this morning.',
    replyCount: 11,
    likeCount: 34,
    images: [visitorImages[1], visitorImages[2], visitorImages[3]],
  },
  {
    id: 'pet-zone-poll',
    kind: 'poll',
    category: 'community',
    priority: 'normal',
    hoursAgo: 8,
    authorName: 'Rhea Iyer',
    authorSub: 'A 904',
    authorRole: 'resident',
    body: 'Which time slot should we reserve for the dog play zone on Sundays?',
    replyCount: 9,
    likeCount: 12,
    totalVotes: 64,
    options: [
      { label: '7 AM - 8 AM', votes: 30 },
      { label: '8 AM - 9 AM', votes: 22 },
      { label: '5 PM - 6 PM', votes: 12 },
    ],
  },
  {
    id: 'admin-festival-poll',
    kind: 'poll',
    category: 'community',
    priority: 'high',
    hoursAgo: 2,
    authorName: 'Aditi Sharma',
    authorSub: 'B 504 · 2 hr ago',
    authorRole: 'admin',
    body: 'Which timing works best for the Independence Day flag hoisting and resident breakfast?',
    replyCount: 21,
    likeCount: 46,
    totalVotes: 132,
    options: [
      { label: '7:30 AM', votes: 58 },
      { label: '8:00 AM', votes: 49 },
      { label: '8:30 AM', votes: 25 },
    ],
  },
  {
    id: 'marketplace-sofa',
    kind: 'listing',
    category: 'marketplace',
    priority: 'low',
    hoursAgo: 11,
    authorName: 'Nandan Raikar',
    authorSub: 'B 102',
    authorRole: 'resident',
    body: 'Moving out next week and selling our 3-seater sofa. Pickup from Tower B only.',
    replyCount: 7,
    likeCount: 15,
    listing: {
      imageSource: marketplaceFeedImages[1],
      title: '3-seater fabric sofa',
      distance: 'In society',
      location: 'Tower B, 3rd floor',
      price: '₹ 12,500',
      originalPrice: '₹ 19,000',
      discountLabel: '34% off',
    },
  },
  {
    id: 'buzz-cafe-reco',
    kind: 'text',
    category: 'localBuzz',
    priority: 'normal',
    hoursAgo: 6,
    authorName: 'Local Buzz',
    authorSub: 'Civic Alerts',
    authorRole: 'system',
    body: 'Tried the new filter coffee place near Gate 2. Great dosas, fast service, and decent parking too.',
    replyCount: 17,
    likeCount: 27,
    trendingInCommunity: true,
  },
  {
    id: 'discussion-parking-etiquette',
    kind: 'text',
    category: 'community',
    priority: 'normal',
    hoursAgo: 2,
    authorName: 'Meera Venkat',
    authorSub: 'D 401',
    authorRole: 'resident',
    body: 'Has anyone else noticed visitors parking in resident slots near Tower D? This has been going on for a few weeks. Can we get a proper enforcement system in place?',
    replyCount: 14,
    likeCount: 38,
  },
  {
    id: 'discussion-pool-timing',
    kind: 'text',
    category: 'community',
    priority: 'normal',
    hoursAgo: 9,
    authorName: 'Arjun Sharma',
    authorSub: 'A 507',
    authorRole: 'resident',
    body: 'The pool closes at 8 PM but a lot of us get back from work only around 7. Would it be feasible to extend it by just 30 minutes on weekdays?',
    replyCount: 22,
    likeCount: 61,
    trendingInCommunity: true,
  },
  {
    id: 'notice-lift-audit',
    kind: 'text',
    category: 'notice',
    priority: 'high',
    hoursAgo: 12,
    authorName: 'Notice',
    authorSub: 'Society',
    authorRole: 'system',
    title: 'Lift safety audit tomorrow',
    body: 'The audit is scheduled between 11 AM and 1 PM. Expect brief service pauses across Tower D.',
    replyCount: 3,
    likeCount: 5,
    noticeType: 'society',
  },
  {
    id: 'marketplace-scooter',
    kind: 'image',
    category: 'notice',
    priority: 'low',
    hoursAgo: 14,
    authorName: 'Notice',
    authorSub: 'Promoted',
    authorRole: 'system',
    title: 'Certified resale scooter now available',
    body: 'Fresh insurance and doorstep RC transfer support included for a hassle-free purchase.',
    replyCount: 1,
    likeCount: 3,
    isSponsored: true,
    noticeType: 'promoted',
    images: [marketplaceFeedImages[2]],
  },
  {
    id: 'event-football-tournament',
    kind: 'event',
    category: 'community',
    priority: 'high',
    hoursAgo: 1,
    authorName: 'Lokesh D',
    authorSub: 'B 102',
    authorRole: 'resident',
    body: '',
    replyCount: 3,
    likeCount: 17,
    eventDate: '20 May',
    eventTime: '9:00 AM',
    eventLocation: 'Clubhouse, Prestige Shantiniketan',
    attendeeCount: 67,
    images: [marketplaceFeedImages[0]],
  },
  {
    id: 'event-liga-screening',
    kind: 'event',
    category: 'community',
    priority: 'normal',
    hoursAgo: 3,
    authorName: 'Priya Nair',
    authorSub: 'A 204',
    authorRole: 'resident',
    body: 'Today we are doing a La Liga Final Screening in the clubhouse at 9PM. Snacks and beverages will be given. Get your Game on! ⚽️',
    replyCount: 7,
    likeCount: 24,
    eventDate: '18 Jun',
    eventTime: '9:00 PM',
    eventLocation: 'Clubhouse, Tower A Lounge',
    attendeeCount: 41,
    images: [marketplaceFeedImages[1]],
  },
] satisfies FeedPost[];

function getFeedPriorityScore(priority: FeedPriority) {
  if (priority === 'high') return 28;
  if (priority === 'normal') return 12;
  return 0;
}


function getEffectiveScore(post: FeedPost) {
  return getFeedPriorityScore(post.priority) - (post.kind === 'event' ? 16 : 0);
}

function sortFeedPosts(posts: FeedPost[], tabKey: FeedTabKey | null) {
  const rankedPosts = [...posts];

  return rankedPosts.sort((a, b) => {
    const priorityDelta = getEffectiveScore(b) - getEffectiveScore(a);
    if (priorityDelta !== 0) return priorityDelta;

    const recencyDelta = a.hoursAgo - b.hoursAgo;
    if (recencyDelta !== 0) return recencyDelta;

    return b.likeCount + b.replyCount - (a.likeCount + a.replyCount);
  });
}

function getFeedPostsForTab(posts: FeedPost[], tabKey: FeedTabKey | null) {
  if (tabKey === null) return sortFeedPosts(posts, null);
  if (tabKey === 'discussions') return sortFeedPosts(posts.filter(post => post.category === 'community' && post.kind !== 'poll' && post.kind !== 'event'), tabKey);
  if (tabKey === 'notices') return sortFeedPosts(posts.filter(post => post.category === 'notice'), tabKey);
  if (tabKey === 'localBuzz') return sortFeedPosts(posts.filter(post => post.category === 'localBuzz' && post.authorName === 'Local Buzz'), tabKey);
  if (tabKey === 'polls') return sortFeedPosts(posts.filter(post => post.kind === 'poll'), tabKey);
  if (tabKey === 'events') return sortFeedPosts(posts.filter(post => post.kind === 'event'), tabKey);
  return sortFeedPosts(posts.filter(post => post.category === 'marketplace'), tabKey);
}

type TabIcon = ComponentType<{ size?: number; color?: string; weight?: IconWeight }>;

type FeedTabMeta = {
  icon: TabIcon;
  createTitle: string;
  createDescription: string;
  createCTA: string;
  showCreateCard: boolean;
  seeAllLabel: string;
};

const feedTabMeta: Record<FeedTabKey, FeedTabMeta> = {
  discussions: {
    icon: ChatCircle,
    createTitle: 'Start a discussion',
    createDescription: 'Ask a question, flag a concern, or share something worth talking about with your neighbours.',
    createCTA: 'Write a post',
    showCreateCard: true,
    seeAllLabel: 'See all discussions',
  },
  notices: {
    icon: ClipboardTextIcon,
    createTitle: 'Post a notice',
    createDescription: 'Share maintenance updates, rule reminders, or other information the community should know about.',
    createCTA: 'Post a notice',
    showCreateCard: true,
    seeAllLabel: 'See all notices',
  },
  localBuzz: {
    icon: NewspaperIcon,
    createTitle: '',
    createDescription: '',
    createCTA: '',
    showCreateCard: false,
    seeAllLabel: 'See all local buzz',
  },
  polls: {
    icon: ChartBarIcon,
    createTitle: 'Create a poll',
    createDescription: 'Gather opinions on timings, facilities, or community decisions — let everyone have a say.',
    createCTA: 'Start a poll',
    showCreateCard: true,
    seeAllLabel: 'See all polls',
  },
  marketplace: {
    icon: TagIcon,
    createTitle: 'List something for sale',
    createDescription: 'Sell furniture, gadgets, kids\' items, or anything else you no longer need — your neighbours are the first to know.',
    createCTA: 'List an item',
    showCreateCard: true,
    seeAllLabel: 'See all listings',
  },
  events: {
    icon: CalendarBlank,
    createTitle: 'Host a community event',
    createDescription: 'Plan a sports match, cultural evening, or neighbourhood get-together and let residents RSVP.',
    createCTA: 'Create an event',
    showCreateCard: true,
    seeAllLabel: 'See all events',
  },
};

function formatFeedTimestamp(hoursAgo: number) {
  if (hoursAgo <= 0) return 'Just now';
  if (hoursAgo === 1) return '1 hr ago';
  if (hoursAgo < 24) return `${hoursAgo} hr ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
}

function getAuthorSubline(post: FeedPost) {
  return `${post.authorSub} · ${formatFeedTimestamp(post.hoursAgo)}`;
}

type Props = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
  onOpenDailyHelpProfile: (visitor: DailyHelpProfileVisitor) => void;
  onOpenVisitorCalendar: () => void;
};

export function AppHomeScreen({ onNavigate, onOpenDailyHelpProfile, onOpenVisitorCalendar }: Props) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FeedTabKey | null>(null);
  const filterScrollRef = useRef<ScrollViewType>(null);
  const filterPillOffsets = useRef<Record<string, number>>({});
  const [activeNav, setActiveNav] = useState('social');
  const [firstFoldHeight, setFirstFoldHeight] = useState(0);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showFlatSwitcher, setShowFlatSwitcher] = useState(false);
  const [isInSecondFold, setIsInSecondFold] = useState(false);
  const [preFeedSectionHeight, setPreFeedSectionHeight] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatSheetTranslateY = useRef(new Animated.Value(-320)).current;
  const flatSheetOpacity = useRef(new Animated.Value(0)).current;

  // Wire quick actions into their destination experiences.
  const quickActions = quickActionsBase.map(action =>
    action.label === 'View More'
      ? { ...action, onPress: () => setShowQuickActions(true) }
      : action.label === 'Buy & Sell'
        ? { ...action, onPress: () => onNavigate('listingWizard') }
        : action
  );
  const scrollRef = useRef<ScrollViewType>(null);
  const prevScrollY = useRef(0);
  const isScrollingDown = useRef(false);
  const isSnapping = useRef(false);
  const isUserDragging = useRef(false);
  const isMomentumScrolling = useRef(false);
  const dragStartY = useRef(0);
  const isFirstFoldRevealArmed = useRef(false);
  const SNAP_THRESHOLD = 110;
  const FOLD_BOUNDARY_TOLERANCE = 8;
  const animationFrame = useRef<number | null>(null);
  const feedTabItems = feedTabs.map(tab => ({
    ...tab,
    count: getFeedPostsForTab(feedPosts, tab.key).length,
  }));
  const visibleFeedPosts = getFeedPostsForTab(feedPosts, activeTab);

  const openFlatSwitcher = () => {
    flatSheetTranslateY.setValue(-(insets.top + 280));
    flatSheetOpacity.setValue(0);
    setShowFlatSwitcher(true);

    requestAnimationFrame(() => {
      Animated.parallel([
        Animated.timing(flatSheetTranslateY, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.timing(flatSheetOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeFlatSwitcher = () => {
    Animated.parallel([
      Animated.timing(flatSheetTranslateY, {
        toValue: -(insets.top + 280),
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(flatSheetOpacity, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        setShowFlatSwitcher(false);
      }
    });
  };

  const smoothScroll = (targetY: number, onComplete?: () => void) => {
    const startY = prevScrollY.current;
    const distance = targetY - startY;
    const duration = 400; // ms
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentY = startY + distance * easeProgress;

      scrollRef.current?.scrollTo({ y: currentY, animated: false });

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      } else {
        isSnapping.current = false;
        onComplete?.();
      }
    };

    animate();
  };

  const scrollToFeedTop = () => {
    const targetY = firstFoldHeight + preFeedSectionHeight;
    if (targetY <= 0) return;

    isFirstFoldRevealArmed.current = true;
    isSnapping.current = true;
    smoothScroll(targetY, () => {
      prevScrollY.current = targetY;
      setIsInSecondFold(true);
      isFirstFoldRevealArmed.current = true;
    });
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    const previousY = prevScrollY.current;
    isScrollingDown.current = currentY > previousY;
    prevScrollY.current = currentY;

    // Update header background color based on scroll position
    setIsInSecondFold(currentY >= firstFoldHeight);

    // Prevent snapping if already snapping
    if (isSnapping.current || firstFoldHeight <= 0) return;

    const direction = isScrollingDown.current;
    const crossedSecondFoldBoundary =
      !isUserDragging.current &&
      isMomentumScrolling.current &&
      dragStartY.current >= firstFoldHeight &&
      previousY >= firstFoldHeight &&
      currentY < firstFoldHeight;

    if (crossedSecondFoldBoundary) {
      scrollRef.current?.scrollTo({ y: firstFoldHeight, animated: false });
      prevScrollY.current = firstFoldHeight;
      isMomentumScrolling.current = false;
      isFirstFoldRevealArmed.current = true;
      setIsInSecondFold(true);
      return;
    }

    const shouldSnapDown = direction && currentY < firstFoldHeight && currentY > SNAP_THRESHOLD;
    const shouldSnapUp =
      isUserDragging.current &&
      isFirstFoldRevealArmed.current &&
      !direction &&
      currentY > 0 &&
      currentY < firstFoldHeight &&
      currentY > firstFoldHeight - SNAP_THRESHOLD;

    if (shouldSnapDown) {
      isFirstFoldRevealArmed.current = false;
      isSnapping.current = true;
      smoothScroll(firstFoldHeight, () => {
        isFirstFoldRevealArmed.current = true;
        setIsInSecondFold(true);
      });
    } else if (shouldSnapUp) {
      isFirstFoldRevealArmed.current = false;
      isSnapping.current = true;
      smoothScroll(0);
    }
  };

  const handleScrollBeginDrag = () => {
    isUserDragging.current = true;
    dragStartY.current =
      Math.abs(prevScrollY.current - firstFoldHeight) <= FOLD_BOUNDARY_TOLERANCE
        ? firstFoldHeight
        : prevScrollY.current;
  };

  const handleScrollEndDrag = () => {
    isUserDragging.current = false;
  };

  const handleMomentumScrollBegin = () => {
    isMomentumScrolling.current = true;
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentY = e.nativeEvent.contentOffset.y;
    isMomentumScrolling.current = false;

    if (isSnapping.current || firstFoldHeight <= 0) return;

    const wasInSecondFold = dragStartY.current > firstFoldHeight;
    const crossedIntoFirstFoldZone = currentY < firstFoldHeight;
    const isAtSecondFoldTop = Math.abs(currentY - firstFoldHeight) <= FOLD_BOUNDARY_TOLERANCE;

    if (wasInSecondFold && crossedIntoFirstFoldZone && currentY > 0) {
      isSnapping.current = true;
      smoothScroll(firstFoldHeight, () => {
        isFirstFoldRevealArmed.current = true;
      });
      return;
    }

    if (isAtSecondFoldTop) {
      isFirstFoldRevealArmed.current = true;
      return;
    }

    if (currentY <= 0 || currentY > firstFoldHeight) {
      isFirstFoldRevealArmed.current = false;
    }
  };

  const renderFeedAuthorArtwork = (post: FeedPost) => {
    if (post.category === 'notice') {
      return (
        <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceWarningSubtle, alignItems: 'center', justifyContent: 'center' }}>
          <ClipboardTextIcon size={iconSize.md} color={colors.contentWarning} weight="fill" />
        </View>
      );
    }

    if (post.category === 'marketplace') {
      return (
        <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }}>
          <TagIcon size={iconSize.md} color={colors.contentPrimary} weight="fill" />
        </View>
      );
    }

    if (post.category === 'localBuzz') {
      return (
        <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceInfoSubtle, alignItems: 'center', justifyContent: 'center' }}>
          <NewspaperIcon size={iconSize.md} color={colors.contentInfo} weight="fill" />
        </View>
      );
    }

    return <Avatar size="MD" type="Initials" name={post.authorName} />;
  };

  const EVENT_BANNER_BG = '#092d35';

  const renderFeedEventContent = (post: FeedEventPost) => {
    const hasBody = Boolean(post.body);

    const eventBanner = (
      <View style={{ backgroundColor: colors.contentPrimary, padding: spacing.md, gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <CalendarBlank size={14} color={colors.contentOnDark} weight="bold" />
          <Text style={[typography.bodyDefaultBold, { color: colors.contentOnDark }]}>
            {post.eventDate}
            {'  '}
            <Text style={[typography.bodyDefault, { color: colors.contentOnDark }]}>{post.eventTime}</Text>
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          <MapPin size={14} color={colors.contentOnDark} weight="bold" />
          <Text style={[typography.bodyDefault, { color: colors.contentOnDark }]} numberOfLines={1}>
            {post.eventLocation}
          </Text>
        </View>
      </View>
    );

    if (hasBody && post.images?.length) {
      return (
        <View style={{ borderWidth: 1, borderColor: colors.borderDefault, borderRadius: radius.lg, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm, padding: spacing.sm, backgroundColor: colors.surfacePrimary }}>
            <Image
              source={post.images[0]}
              style={{ width: 100, height: 100, borderRadius: radius.md, backgroundColor: colors.surfaceSecondary }}
              resizeMode="cover"
            />
            <View style={{ flex: 1, paddingVertical: spacing.xs, paddingRight: spacing.xs }}>
              <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]} numberOfLines={5}>
                {post.body}
              </Text>
            </View>
          </View>
          {eventBanner}
        </View>
      );
    }

    return (
      <View style={{ borderRadius: radius.lg, overflow: 'hidden' }}>
        {post.images?.length ? (
          <View style={{ width: '100%', aspectRatio: 1 }}>
            <Image
              source={post.images[0]}
              style={{ width: '100%', height: '100%', backgroundColor: colors.surfaceSecondary }}
              resizeMode="cover"
            />
          </View>
        ) : null}
        {eventBanner}
      </View>
    );
  };

  const renderFeedEventActions = (post: FeedEventPost) => (
    <>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Button kind="Tertiary" size="MD" label={String(post.attendeeCount)} showLeftIcon leftIcon={Users} />
        <View style={{ flex: 1 }}>
          <Button  kind="Tertiary" size="MD" label="Going?" fullWidth />
        </View>
      </View>
      {/* <View style={{ height: 1, backgroundColor: colors.borderSubtle }} /> */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <Pressable>
            <ThumbsUp size={iconSize.md} color={colors.contentSecondary} weight="regular" />
          </Pressable>
          <Pressable>
            <ShareNetwork size={iconSize.md} color={colors.contentSecondary} weight="regular" />
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Eye size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
            <Text style={[typography.caption, { color: colors.contentTertiary }]}>{post.likeCount}</Text>
          </View>
          
        </View>
      </View>
    </>
  );

  const renderFeedMetaRow = (post: FeedPost) => {
    if (!post.trendingInCommunity) return null;

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xs }}>
        <Tag kind="Positive" variant="Text" label="Trending" />
      </View>
    );
  };

  const renderNoticeTextBlock = (post: FeedPost) => (
    <View style={{ flex: 1, alignSelf: 'flex-start', gap: spacing.xs }}>
      {post.title ? (
        <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]} numberOfLines={2}>
          {post.title}
        </Text>
      ) : null}
      <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]} numberOfLines={2}>
        {post.body}
      </Text>
    </View>
  );

  const renderFeedImageContent = (post: FeedImagePost) => {
    if (post.category === 'notice' && post.images.length === 1) {
      return (
        <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
          {renderNoticeTextBlock(post)}
          <Image
            source={post.images[0]}
            style={{ width: 104, aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary }}
            resizeMode="cover"
          />
        </View>
      );
    }

    if (post.images.length === 1) {
      return (
        <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' }}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]} numberOfLines={5}>
              {post.body}
            </Text>
          </View>
          <Image
            source={post.images[0]}
            style={{ width: 104, aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary }}
            resizeMode="cover"
          />
        </View>
      );
    }

    return (
      <View style={{ gap: spacing.md }}>
        <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]} numberOfLines={4}>
          {post.body}
        </Text>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -spacing.lg }}>
          <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg }}>
            {post.images.map((image, index) => (
              <Image
                key={`${post.id}-image-${index}`}
                source={image}
                style={{ width: 180, aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary }}
                resizeMode="cover"
              />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderFeedPollContent = (post: FeedPollPost) => (
    <View style={{ gap: spacing.md }}>
      <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>{post.body}</Text>
      <View style={{ gap: spacing.sm }}>
        {post.options.map((option) => {
          const fillWidth = `${Math.max((option.votes / post.totalVotes) * 100, 16)}%` as const;

          return (
            <View key={`${post.id}-${option.label}`} style={{ gap: spacing.xs }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary, flex: 1 }]}>{option.label}</Text>
                <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{option.votes} votes</Text>
              </View>
              <View style={{ height: 8, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary, overflow: 'hidden' }}>
                <View style={{ width: fillWidth, height: '100%', borderRadius: radius.pill, backgroundColor: colors.surfaceActionSecondary }} />
              </View>
            </View>
          );
        })}
      </View>
      <Text style={[typography.caption, { color: colors.contentSecondary }]}>{post.totalVotes} residents voted</Text>
    </View>
  );

  const renderFeedListingContent = (post: FeedListingPost) => (
    <View style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'stretch' }}>
      <Image
        source={post.listing.imageSource}
        style={{ width: 112, aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, justifyContent: 'flex-start', gap: spacing.sm }}>
        <View >
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]} numberOfLines={2}>
            {post.listing.title}
          </Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]} numberOfLines={2}>
            {post.body}
          </Text>
        </View>
        <View >
          <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{post.listing.price}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
            <Text style={[typography.caption, { color: colors.contentTertiary, textDecorationLine: 'line-through' }]}>
              {post.listing.originalPrice}
            </Text>
            {post.listing.discountLabel ? (
              <Tag kind="Positive" variant="Solid" label={post.listing.discountLabel} />
            ) : null}
          </View>
        </View>
      </View>
      
    </View>
  );

  const renderFeedContent = (post: FeedPost) => {
    if (post.category === 'notice' && post.kind === 'text') {
      return renderNoticeTextBlock(post);
    }
    if (post.kind === 'event') return renderFeedEventContent(post);
    if (post.kind === 'image') return renderFeedImageContent(post);
    if (post.kind === 'listing') return renderFeedListingContent(post);
    if (post.kind === 'poll') return renderFeedPollContent(post);

    return (
      <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]} numberOfLines={4}>
        {post.body}
      </Text>
    );
  };

  const renderCreatePostCard = () => (
    <SurfaceCard elevated={false}>
      <View style={{ gap: spacing.md }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
          <Avatar size="MD" type="Initials" name="Niraj P" />

          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: spacing.md,
              minHeight: 40,
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceSecondary,
              borderWidth: 0,
              borderColor: colors.borderSubtle,
            }}
          >
            <Text style={[typography.bodyLarge, { color: colors.contentPlaceholder, flex: 1 }]}>
              What do you have to say?
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
              {[
                { label: 'Photo', icon: ImageIcon },
                { label: 'Poll', icon: ChartBarIcon },
                { label: 'Event', icon: CalendarBlank },
                { label: 'Sell', icon: TagIcon },
              ].map(item => {
                const ItemIcon = item.icon;
                return (
                  <View key={item.label}>
                    <ItemIcon size={iconSize.lg} color={colors.contentAction} weight="regular" />
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </SurfaceCard>
  );

  const firstFoldOpacity = scrollY.interpolate({
    inputRange: [0, Math.max(firstFoldHeight * 0.72, 1), Math.max(firstFoldHeight * 1.08, 1)],
    outputRange: [1, 0.55, 0],
    extrapolate: 'clamp',
  });

  const firstFoldScale = scrollY.interpolate({
    inputRange: [0, Math.max(firstFoldHeight * 0.28, 1), Math.max(firstFoldHeight * 1.08, 1)],
    outputRange: [1, 0.92, 0.88],
    extrapolate: 'clamp',
  });

  const firstFoldTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(firstFoldHeight * 1.08, 1)],
    outputRange: [0, -20],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>

      {/* Header */}
      <AppHeader
        variant="appHome"
        backgroundColor={colors.surfacePage}
        // showBottomBorder
        showShadow = {isInSecondFold}
        borderColor={colors.borderSubtle}
        leftSlot={
          <Pressable onPress={openFlatSwitcher} style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Text style={typography.titleSubsection}>B 102</Text>
            <CaretDown size={iconSize.sm} color={colors.contentPrimary} weight="bold" />
          </Pressable>
        }
        rightSlot={
          <>
            <Pressable onPress={() => onNavigate('searchExperience')} accessibilityRole="button" accessibilityLabel="Search MyGate">
              <MagnifyingGlass size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Notifications" style={{ position: 'relative' }}>
              <Bell size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
              <View
                style={{
                  position: 'absolute',
                  top: -6,
                  right: -6,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 99,
                  backgroundColor: colors.contentNegative,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                  borderWidth: 1.5,
                  borderColor: isInSecondFold ? colors.surfacePrimary : colors.surfacePage
                }}
              >
                <Text style={[typography.caption, { color: colors.contentOnDark, fontSize: 9 }]}>7</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => onNavigate('settings')} accessibilityRole="button" accessibilityLabel="Open settings">
              <Avatar size="SM" type="Initials" name="Niraj P" />
            </Pressable>
          </>
        }
      />

      {/* Scroll */}
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: true,
            listener: handleScroll,
          }
        )}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={e => {
          handleScrollEndDrag();
          handleScrollEnd(e);
        }}
        onMomentumScrollBegin={handleMomentumScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        stickyHeaderIndices={[3]}
      >
        {/* First fold */}
        <Animated.View
          onLayout={e => {
            const height = e.nativeEvent.layout.height;
            setFirstFoldHeight(height);
          }}
          style={{
            opacity: firstFoldOpacity,
            transform: [
              { translateY: firstFoldTranslateY },
              { scale: firstFoldScale },
            ],
          }}
        >
          <View style={{ height: 180, backgroundColor: colors.surfaceSecondary, margin: spacing.md, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[typography.bodySmall, { color: colors.contentTertiary }]}>Society Banner</Text>
          </View>
          <View style={{  paddingHorizontal: spacing.md, paddingVertical: spacing.md }}>
            <TileGrid items={quickActions} columns={4} gap={spacing.xs} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.lg, paddingVertical: spacing.md }}>
            <View style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surfaceSecondary }} />
            <Text style={[typography.bodyDefaultBold, { color: colors.contentSecondary, flex: 1 }]} numberOfLines={2}>
              Stay fuller for longer with Aashirvaad Multigrain Atta
            </Text>
            
            <CaretRight size={iconSize.md} color={colors.contentTertiary} weight="bold"/>
            
          </View>
        </Animated.View>

        {/* Second fold — free scroll */}
        <View
          onLayout={e => {
            setPreFeedSectionHeight(e.nativeEvent.layout.height);
          }}
          style={{ gap: spacing.sm, paddingHorizontal: spacing.md, paddingTop: spacing.md }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.xs }}>
            <Text style={typography.bodyLarge}>You have </Text>
            <Text style={typography.bodyLargeBold}>4 Visitors</Text>
            <Text style={typography.bodyLarge}> and </Text>
            <Text style={typography.bodyLargeBold}>3 Updates</Text>
          </View>

          <SurfaceCard elevated={false} >
            <SectionHeader
              title="Visitor Updates"
              rightSlot={
                <Pressable onPress={onOpenVisitorCalendar} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>View All</Text>
                  <CaretRight size={iconSize.sm} color={colors.contentAction} weight="bold" />
                </Pressable>
              }
            />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg }}>
              {visitors.map((v, i) => (
                <Pressable
                  key={i}
                  disabled={!v.helpProfile}
                  onPress={() => {
                    if (v.helpProfile) onOpenDailyHelpProfile(v.helpProfile);
                  }}
                  style={{ width: '21%', alignItems: 'center', gap: spacing.xs }}
                >
                  <Avatar status="Online" size="XL" type="Image" source={v.source} />
                  <Text numberOfLines={1} style={[typography.bodySmall, { color: colors.contentSecondary, textAlign: 'center' }]}>{v.name}</Text>
                </Pressable>
              ))}
            </View>
          </SurfaceCard>

          <UpdateCard
            elevated={false}
            icon={Buildings}
            iconColor={colors.contentSecondary}
            title="Your society due is overdue"
            subtitle="₹ 1289"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.xs, paddingTop: spacing.xl }}>
            <Text style={typography.bodyLargeBold}>Community Posts</Text>
            
          </View>
        </View>

        <View style={{ gap: spacing.md, paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          {renderCreatePostCard()}
        </View>

        <View style={{ backgroundColor: colors.surfacePage, paddingVertical: spacing.md }}>
          <ScrollView ref={filterScrollRef} horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.md }}>
              {feedTabItems.map(tab => {
                const isActive = tab.key === activeTab;
                const label = `${tab.label} (${tab.count})`;
                return (
                  <Pressable
                    key={tab.key}
                    onLayout={e => { filterPillOffsets.current[tab.key] = e.nativeEvent.layout.x; }}
                    onPress={() => {
                      const next = isActive ? null : tab.key;
                      setActiveTab(next);
                      scrollToFeedTop();
                      if (next !== null) {
                        const x = filterPillOffsets.current[next] ?? 0;
                        filterScrollRef.current?.scrollTo({ x: Math.max(0, x - spacing.md), animated: true });
                      }
                    }}
                    style={{
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderRadius: radius.pill,
                      backgroundColor: isActive ? colors.surfaceActionSecondarySubtle : colors.surfacePrimary,
                      borderWidth: 1,
                      borderColor: isActive ? colors.borderAction : colors.borderDefault,
                    }}
                  >
                    <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentAction : colors.contentSecondary }]}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        <View style={{ gap: spacing.sm, paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}>
          {visibleFeedPosts.map(post => (

            <SurfaceCard key={post.id} elevated={true} >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                {renderFeedAuthorArtwork(post)}
                <View style={{ flex: 1, gap: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs, flexWrap: 'wrap' }}>
                    <Text style={typography.bodyDefaultBold}>{post.authorName}</Text>
                    {post.authorRole === 'admin' ? (
                      <Tag kind="Neutral" variant="Solid" label="Admin" />
                    ) : null}
                  </View>
                  <Text style={[typography.caption, { color: colors.contentSecondary }]}>{getAuthorSubline(post)}</Text>
                </View>
                <DotsThreeVertical size={iconSize.md} color={colors.contentTertiary} weight="bold" />
              </View>
              <View style={{ gap: 4 }}>
                {renderFeedMetaRow(post)}
                {renderFeedContent(post)}
              </View>
              {post.category === 'notice' ? null : post.kind === 'listing' ? (
                <View style={{ flexDirection: 'row', gap: spacing.sm, paddingTop:spacing.md }}>
                  <View style={{ flex: 1 }}>
                    <Button kind="Tertiary" size="MD" label="Share" fullWidth />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button kind="Secondary" size="MD" label="Message" fullWidth />
                  </View>
                </View>
              ) : post.kind === 'event' ? renderFeedEventActions(post) : (
                <>
                  <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.lg }}>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <ThumbsUp size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                      {post.likeCount > 0 && <Text style={[typography.bodySmall, { color: colors.contentPrimary }]}>{post.likeCount}</Text>}
                    </Pressable>
                    <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                      <ChatCircle size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                      {post.replyCount > 0 && <Text style={[typography.bodySmall, { color: colors.contentPrimary }]}>{post.replyCount}</Text>}
                    </Pressable>
                    <Pressable>
                      <ShareNetwork size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                    </Pressable>
                  </View>
                </>
              )}
            </SurfaceCard>
          ))}

          {activeTab !== null && (() => {
            const meta = feedTabMeta[activeTab];
            const TabIcon = meta.icon;
            return (
              <>
                {meta.showCreateCard && (
                  <SurfaceCard elevated={true}>
                    <View style={{ alignItems: 'center', gap: spacing.lg, paddingVertical: spacing.md }}>
                      <View style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.surfaceSecondary, alignItems: 'center', justifyContent: 'center' }}>
                        <TabIcon size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
                      </View>
                      <View style={{ alignItems: 'center', gap: spacing.xs }}>
                        <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary, textAlign: 'center' }]}>{meta.createTitle}</Text>
                        <Text style={[typography.bodyDefault, { color: colors.contentSecondary, textAlign: 'center' }]}>{meta.createDescription}</Text>
                      </View>
                      <View style={{ alignSelf: 'center' }}>
                        <Button kind="Primary" size="MD" label={meta.createCTA} />
                      </View>
                    </View>
                  </SurfaceCard>
                )}

                <SurfaceCard elevated={true}>
                  <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                    <TabIcon size={iconSize.md} color={colors.contentSecondary} weight="regular" />
                    <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary, flex: 1 }]}>{meta.seeAllLabel}</Text>
                    <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="bold" />
                  </Pressable>
                </SurfaceCard>
              </>
            );
          })()}
        </View>
      </Animated.ScrollView>

      {/* Bottom nav */}
      <AppBottomNav
        items={mainNavItems}
        activeKey={activeNav}
        onPressItem={(key) => {
          if (key === 'marketplace') {
            onNavigate('marketplace');
            return;
          }
          if (key === 'social') {
            setActiveNav('social');
            return;
          }
          setActiveNav(key);
        }}
      />

      {/* Quick Actions Modal */}
      <Modal
        visible={showQuickActions}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowQuickActions(false)}
      >
        <QuickActionsScreen
          activeScreen="quickActions"
          onNavigate={onNavigate}
          onClose={() => setShowQuickActions(false)}
        />
      </Modal>

      <Modal
        visible={showFlatSwitcher}
        animationType="none"
        transparent
        statusBarTranslucent
        onRequestClose={closeFlatSwitcher}
      >
        <View style={{ flex: 1 }}>
          <Animated.View
            pointerEvents="none"
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: 'rgba(2, 6, 23, 0.48)',
              opacity: flatSheetOpacity,
            }}
          />
          <Pressable style={{ flex: 1 }} onPress={closeFlatSwitcher}>
            <Animated.View
              style={{
                transform: [{ translateY: flatSheetTranslateY }],
                opacity: flatSheetOpacity,
              }}
            >
              <Pressable onPress={(event) => event.stopPropagation()}>
                <SurfaceCard
                  style={{
                    gap: 0,
                    paddingTop: insets.top,
                    paddingRight: 0,
                    paddingBottom: spacing.sm,
                    paddingLeft: 0,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderBottomLeftRadius: radius.xxl,
                    borderBottomRightRadius: radius.xxl,
                    overflow:'hidden'
                  }}
                >
                  <View
                    style={{
                      overflow: 'hidden',
                      borderBottomLeftRadius: radius.xxl,
                      borderBottomRightRadius: radius.xxl,
                    }}
                  >
                    {flatOptions.map((flat, index) => (
                      <ListItem
                        key={flat.id}
                        label={flat.flatLabel}
                        paragraph={flat.societyLabel}
                        size="Standard"
                        artwork="Small"
                        leadingArtwork={<House size={iconSize.lg} color={colors.contentPrimary} weight={flat.isActive ? "fill" : "regular"} />}
                        labelStyle={flat.isActive ? typography.bodyLargeBold : typography.bodyLarge}
                        controlElement={
                          <View
                            style={{
                              minWidth: 20,
                              height: 20,
                              paddingHorizontal: spacing.xs,
                              borderRadius: radius.pill,
                              backgroundColor: flat.isActive ? colors.contentNegative : colors.contentNegative,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={[typography.captionBold, { color: flat.isActive ? colors.contentOnDark : colors.contentOnDark }]}>
                              {flat.badgeCount}
                            </Text>
                          </View>
                        }
                        divider={index < flatOptions.length - 0}
                      />
                    ))}
                    <ListItem
                      label="Add Flat/Villa / office"
                      size="Standard"
                      artwork="Small"
                      leadingArtwork={<PlusCircle size={iconSize.lg} color={colors.contentAction} weight="regular" />}
                      labelStyle={{ ...typography.bodyLargeBold, color: colors.contentAction }}
                      controlElement={null}
                    />
                  </View>
                </SurfaceCard>
              </Pressable>
            </Animated.View>
          </Pressable>
        </View>
      </Modal>

    </View>
  );
}
