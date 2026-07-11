import { useEffect, useMemo, useRef, useState } from 'react';
import { Image, Keyboard, LayoutAnimation, Platform, Pressable, ScrollView, Text, TextInput, UIManager, View } from 'react-native';
import { CalendarBlank, House, Buildings, ImageIcon, LightbulbIcon, Plus, X } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { SurfaceCard } from '../components/SurfaceCard';
import { colors, iconSize, radius, spacing, typography } from '../tokens';
import type { PrototypeScreenKey } from './types';

type Props = {
  activeScreen: PrototypeScreenKey;
  onNavigate: (screen: PrototypeScreenKey) => void;
  onExit: () => void;
};

type ListingDraft = {
  property: string;
  listingType: 'Sell' | 'Rent Out' | '';
  availability: string;
  propertyType: 'Apartment' | 'Villa' | '';
  bhk: '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK' | '5 BHK' | '5 BHK+' | '';
  builtUpArea: string;
  furnishing: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished' | '';
  floor: string;
  totalFloors: string;
  depositPreset: 'None' | '1 month' | '2 month' | 'Custom' | '';
  deposit: string;
  rent: string;
  maintenance: string;
  coverPhotoAdded: boolean;
  galleryPhotos: string[];
  description: string;
};

type StepKey = 'basics' | 'homeDetails' | 'pricing' | 'photos' | 'description' | 'review';

const steps: Array<{
  key: StepKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    key: 'basics',
    label: 'Basics',
    eyebrow: 'Step 1 of 6',
    title: 'Listing basics',
    description: 'Choose the property and listing type so we can tailor the rest of the flow.'
  },
  {
    key: 'homeDetails',
    label: 'Home',
    eyebrow: 'Step 2 of 6',
    title: 'Home details',
    description: 'A few strong details help residents quickly understand the size and setup.'
  },
  {
    key: 'pricing',
    label: 'Pricing',
    eyebrow: 'Step 3 of 6',
    title: 'Pricing details',
    description: 'Transparent pricing builds trust and usually leads to faster responses.'
  },
  {
    key: 'photos',
    label: 'Photos',
    eyebrow: 'Step 4 of 6',
    title: 'Property photos',
    description: 'Lead with one cover photo, then add a few supporting images for context.'
  },
  {
    key: 'description',
    label: 'Description',
    eyebrow: 'Step 5 of 6',
    title: 'Property description',
    description: 'A short, warm summary is often enough to get the right residents interested.'
  },
  {
    key: 'review',
    label: 'Review',
    eyebrow: 'Step 6 of 6',
    title: 'Review listing',
    description: 'Everything is grouped into clean sections so you can make one last pass.'
  }
];

const propertyOptions = ['567890 Mygate Dev Staging', 'B 102 Salarpuria Greenage'];
const listingTypeOptions: Array<ListingDraft['listingType']> = ['Sell', 'Rent Out'];
const propertyTypeOptions: Array<ListingDraft['propertyType']> = ['Apartment', 'Villa'];
const bhkOptions: Array<ListingDraft['bhk']> = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5 BHK+'];
const furnishingOptions: Array<ListingDraft['furnishing']> = ['Unfurnished', 'Semi-Furnished', 'Fully Furnished'];
const b102Property = 'B 102 Salarpuria Greenage';
const b102HomeDetailsPrefill: Pick<ListingDraft, 'propertyType' | 'bhk' | 'builtUpArea' | 'floor' | 'totalFloors' | 'furnishing'> = {
  propertyType: 'Apartment',
  bhk: '3 BHK',
  builtUpArea: '1650',
  floor: '1',
  totalFloors: '14',
  furnishing: ''
};
const logoAnimationSource = require('../assets/logoAnimation.gif');
const listingPhotoLibrary = [
  {
    label: 'Living room',
    source: require('../assets/MarketplaceITems/4E12EFC8-BBDE-481C-8A9D-756F68E647C8.png')
  },
  {
    label: 'Bedroom',
    source: require('../assets/MarketplaceITems/6B64D0E5-2B41-45D6-8BB5-4B523E62CC3F.png')
  },
  {
    label: 'Kitchen',
    source: require('../assets/MarketplaceITems/D532470A-D6BC-4023-BA67-2E4A7F5ED952.png')
  },
  {
    label: 'Balcony',
    source: require('../assets/MarketplaceITems/126660A4-6E8E-4024-AA49-9D1141CC2244.png')
  }
] as const;

const initialDraft: ListingDraft = {
  property: '',
  listingType: '',
  availability: '',
  propertyType: '',
  bhk: '',
  builtUpArea: '',
  furnishing: '',
  floor: '',
  totalFloors: '',
  depositPreset: '',
  deposit: '',
  rent: '',
  maintenance: '',
  coverPhotoAdded: false,
  galleryPhotos: [],
  description: ''
};

function formatCurrency(value: string) {
  if (!value) return '--';
  return `₹ ${Number(value).toLocaleString('en-IN')}`;
}

function formatArea(value: string) {
  if (!value) return '--';
  return `${Number(value).toLocaleString('en-IN')} sqft`;
}

function formatIndianNumber(value: string) {
  if (!value) return '';
  return Number(value).toLocaleString('en-IN');
}

function getComputedDepositValue(draft: ListingDraft) {
  if (draft.depositPreset === 'None') return '0';
  if (draft.depositPreset === '1 month') return draft.rent || '';
  if (draft.depositPreset === '2 month') return draft.rent ? String(Number(draft.rent) * 2) : '';
  return draft.deposit;
}

function getDepositSummary(draft: ListingDraft) {
  if (draft.depositPreset === 'None') return 'None';
  if (draft.depositPreset === '1 month') return draft.rent ? ` ${formatCurrency(draft.rent)}` : '1 month';
  if (draft.depositPreset === '2 month') {
    return draft.rent ? ` ${formatCurrency(String(Number(draft.rent) * 2))}` : '2 months';
  }
  return formatCurrency(getComputedDepositValue(draft));
}

function ProgressSegments({ currentStep }: { currentStep: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.xs }}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isComplete = index < currentStep;
        return (
          <View
            key={step.key}
            style={{
              flex: 1,
              height: 6,
              borderRadius: radius.pill,
              backgroundColor: isComplete || isActive ? colors.contentPrimary : colors.borderDefault,
              opacity: isActive ? 1 : isComplete ? 0.72 : 1
            }}
          />
        );
      })}
    </View>
  );
}

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  suffix,
  inputRef,
  onFocus,
  required = false,
  minHeight,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric';
  multiline?: boolean;
  suffix?: string;
  inputRef?: React.RefObject<TextInput | null>;
  onFocus?: () => void;
  required?: boolean;
  minHeight?: number;
}) {
  return (
    <View style={{ gap: spacing.sm }}>
      <FieldLabel label={label} required={required} />
      <View
        style={[
          {
            minHeight: multiline ? minHeight ?? 156 : 60,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfacePrimary,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            flexDirection: 'row',
            alignItems: multiline ? 'flex-start' : 'center',
            gap: spacing.sm
          }
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.contentTertiary}
          keyboardType={keyboardType}
          multiline={multiline}
          onFocus={onFocus}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={[
            typography.bodyLarge,
            {
              flex: 1,
              color: colors.contentPrimary,
              paddingVertical: 0
            }
          ]}
        />
        {suffix ? (
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary, paddingTop: multiline ? spacing.xs : 0 }]}>
            {suffix}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function CurrencyInputField({
  label,
  value,
  onChangeText,
  placeholder,
  inputRef,
  onFocus,
  required = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  inputRef?: React.RefObject<TextInput | null>;
  onFocus?: () => void;
  required?: boolean;
}) {
  const displayValue = value ? `₹ ${formatIndianNumber(value)}` : '';

  return (
    <View style={{ gap: spacing.sm }}>
      <FieldLabel label={label} required={required} />
      <TextInput
        ref={inputRef}
        value={displayValue}
        onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ''))}
        placeholder={placeholder}
        placeholderTextColor={colors.contentTertiary}
        keyboardType="numeric"
        onFocus={onFocus}
        style={[
          typography.bodyLarge,
          {
            minHeight: 60,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfacePrimary,
            color: colors.contentPrimary,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md
          }
        ]}
      />
    </View>
  );
}

function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Text style={typography.bodyDefault}>{label}</Text>
      {required ? <Text style={[typography.bodyDefaultBold, { color: colors.contentNegative }]}>*</Text> : null}
    </View>
  );
}

function ChoiceTiles<T extends string>({
  value,
  options,
  onSelect,
  layout = 'center',
}: {
  value: T | '';
  options: ReadonlyArray<{ value: T; label: string; description?: string; icon?: React.ReactNode }>;
  onSelect: (value: T) => void;
  layout?: 'center' | 'row';
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onSelect(option.value)}
            style={{
              width: '48%',
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.md,
              borderRadius: radius.xl,
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? colors.contentAction : colors.borderDefault,
              backgroundColor: colors.surfacePrimary,
              gap: layout === 'row' ? spacing.sm : 2,
              flexDirection: layout === 'row' ? 'row' : 'column',
              alignItems: layout === 'row' ? 'center' : 'center',
              justifyContent: layout === 'row' ? 'center' : 'center',
              minHeight: 76,
            }}
          >
            {option.icon ? option.icon : null}
            <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentAction : colors.contentPrimary, textAlign: layout === 'row' ? 'left' : 'center' }]}>
              {option.label}
            </Text>
            {option.description && layout === 'center' ? (
              <Text style={[typography.bodyDefault, { color: colors.contentSecondary, textAlign: 'center' }]}>
                {option.description}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

function ScrollPills<T extends string>({
  value,
  options,
  onSelect,
}: {
  value: T | '';
  options: readonly T[];
  onSelect: (value: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.md }}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={{
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: radius.pill,
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? colors.contentAction : colors.borderDefault,
              backgroundColor: colors.surfacePrimary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentAction : colors.contentPrimary }]}>
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function ChoicePills<T extends string>({
  value,
  options,
  onSelect,
  columns = 2,
  hugContent = false,
}: {
  value: T | '';
  options: readonly T[];
  onSelect: (value: T) => void;
  columns?: number;
  hugContent?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onSelect(option)}
            style={{
              minWidth: columns === 1 ? '100%' : undefined,
              flex: hugContent ? undefined : columns === 2 ? 1 : undefined,
              flexGrow: hugContent ? 0 : columns === 2 ? 1 : 0,
              paddingHorizontal: spacing.lg,
              paddingVertical: spacing.md,
              borderRadius: radius.pill,
              borderWidth: isActive ? 2 : 1,
              borderColor: isActive ? colors.contentAction : colors.borderDefault,
              backgroundColor: colors.surfacePrimary,
              alignItems: 'center',
            }}
          >
            <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentAction : colors.contentPrimary }]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ gap: 2 }}>
      <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>{label}</Text>
      <Text style={typography.bodyDefaultBold}>{value}</Text>
    </View>
  );
}

function SummaryInlineRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md }}>
      <Text style={[typography.bodyDefault, { color: colors.contentSecondary, flex: 0.9 }]}>{label}</Text>
      <Text
        numberOfLines={1}
        style={[typography.bodyDefaultBold, { color: colors.contentPrimary, flex: 1.4, textAlign: 'right' }]}
      >
        {value}
      </Text>
    </View>
  );
}

function SummaryWrappedSegments({ items }: { items: string[] }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', rowGap: spacing.xs, columnGap: spacing.xs }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <View key={`${item}-${index}`} style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={[typography.bodyLarge, { color: colors.contentPrimary }]}>{item}</Text>
            {isLast ? null : (
              <Text style={[typography.bodyLarge, { color: colors.borderDefault, marginHorizontal: spacing.sm }]}>
                •
              </Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

function PhotoCarousel({
  photos,
  variant = 'summary',
  onAddPhoto,
  onRemovePhoto,
}: {
  photos: Array<{ label: string; source: any }>;
  variant?: 'editable' | 'summary';
  onAddPhoto?: () => void;
  onRemovePhoto?: (label: string) => void;
}) {
  const isEditable = variant === 'editable';
  const tileWidth = isEditable ? '48%' : '23%';
  const rowGap = isEditable ? spacing.md : spacing.sm;

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap }}>
      {photos.map((photo) => (
        <View
          key={photo.label}
          style={{
            width: tileWidth,
            minWidth: tileWidth,
            maxWidth: tileWidth,
            aspectRatio: 1,
            borderRadius: radius.lg,
            overflow: 'hidden',
            backgroundColor: colors.surfaceSecondary
          }}
        >
          <Image source={photo.source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          {isEditable && onRemovePhoto ? (
            <Pressable
              onPress={() => onRemovePhoto(photo.label)}
              style={{
                position: 'absolute',
                top: spacing.xs,
                right: spacing.xs,
                width: 24,
                height: 24,
                borderRadius: radius.pill,
                backgroundColor: 'rgba(17, 24, 39, 0.72)',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={12} color={colors.contentOnDark} weight="bold" />
            </Pressable>
          ) : null}
        </View>
      ))}

      {isEditable && onAddPhoto ? (
        <Pressable
          onPress={onAddPhoto}
          style={{
            width: tileWidth,
            minWidth: tileWidth,
            maxWidth: tileWidth,
            aspectRatio: 1,
            borderRadius: radius.lg,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfaceSecondary,
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            paddingHorizontal: spacing.md
          }}
        >
          <Plus size={24} color={colors.contentAction} weight="bold" />
          <Text style={[typography.bodyDefaultBold, { color: colors.contentAction, textAlign: 'center' }]}>Add photos</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function getSectionButtonLabel({
  isSubmitted,
  isLastContentStep,
  stepKey,
  hasPhotos,
}: {
  isSubmitted: boolean;
  isLastContentStep: boolean;
  stepKey: StepKey;
  hasPhotos: boolean;
}) {
  if (isSubmitted) return 'Save changes';
  if (stepKey === 'photos' && !hasPhotos) return 'Skip for now';
  if (isLastContentStep) return 'Save and preview';
  return 'Proceed';
}

export function ListingWizardScreen({ onNavigate, onExit }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const builtUpAreaInputRef = useRef<TextInput>(null);
  const floorInputRef = useRef<TextInput>(null);
  const totalFloorsInputRef = useRef<TextInput>(null);
  const depositInputRef = useRef<TextInput>(null);
  const rentInputRef = useRef<TextInput>(null);
  const maintenanceInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  const homeDetailsPrefillTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fieldContainers = useRef<Record<string, View | null>>({});
  const cardsContainerOffsetY = useRef(0);
  const pendingScrollIndex = useRef<number | null>(null);
  const activeFieldKey = useRef<string | null>(null);
  const scrollOffsetY = useRef(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [flowVariant, setFlowVariant] = useState<'stepByStep' | 'stacked'>('stacked');
  const [stackedActiveStep, setStackedActiveStep] = useState(0);
  const [submittedSections, setSubmittedSections] = useState<boolean[]>(() => Array(steps.length - 1).fill(false));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isPrefillingHomeDetails, setIsPrefillingHomeDetails] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [scrollViewportHeight, setScrollViewportHeight] = useState(0);
  const [cardsContainerHeight, setCardsContainerHeight] = useState(0);
  const [stackedSpacerHeight, setStackedSpacerHeight] = useState(0);
  const [cardLayouts, setCardLayouts] = useState<Record<number, { y: number; height: number }>>({});
  const [draft, setDraft] = useState<ListingDraft>(initialDraft);

  useEffect(() => {
    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      const nextHeight = Math.max(0, event.endCoordinates.height - insets.bottom);
      setKeyboardHeight(nextHeight);
    });
    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [insets.bottom]);

  useEffect(() => {
    if (keyboardHeight <= 0 || !activeFieldKey.current) return;
    const timeoutId = setTimeout(() => {
      scrollFieldIntoView(activeFieldKey.current!);
    }, 40);

    return () => clearTimeout(timeoutId);
  }, [keyboardHeight]);

  useEffect(() => {
    return () => {
      if (homeDetailsPrefillTimeoutRef.current) {
        clearTimeout(homeDetailsPrefillTimeoutRef.current);
      }
    };
  }, []);

  const stepIsValid = useMemo(() => {
    const hasValidDeposit =
      draft.depositPreset === 'None' ||
      draft.depositPreset === '1 month' ||
      draft.depositPreset === '2 month' ||
      (draft.depositPreset === 'Custom' && Boolean(draft.deposit));

    return [
      Boolean(draft.property && draft.listingType && draft.availability),
      Boolean(
        draft.propertyType &&
        draft.bhk &&
        draft.builtUpArea &&
        draft.furnishing &&
        (draft.propertyType === 'Villa' || (draft.floor && draft.totalFloors))
      ),
      Boolean(draft.rent && draft.depositPreset && hasValidDeposit),
      true,
      draft.description.trim().length >= 24,
      true
    ];
  }, [draft]);

  const contentSteps = steps.filter((step) => step.key !== 'review');
  const contentStepValidity = stepIsValid.slice(0, contentSteps.length);
  const allContentStepsSubmitted = submittedSections.every(Boolean);
  const isStackedSummaryMode = flowVariant === 'stacked' && allContentStepsSubmitted && stackedActiveStep === -1;
  const firstPendingContentStep = submittedSections.findIndex((submitted) => !submitted);
  const currentMeta = steps[currentStep];
  const currentStepValid = stepIsValid[currentStep];
  const isFinalStep = currentStep === steps.length - 1;

  useEffect(() => {
    if (flowVariant !== 'stacked' || stackedActiveStep < 0 || !headerHeight) {
      setStackedSpacerHeight(0);
      return;
    }

    const activeLayout = cardLayouts[stackedActiveStep];
    const stackedBottomPadding = (isStackedSummaryMode ? spacing.xxl + 96 : spacing.xxl) + keyboardHeight;

    if (!activeLayout || !cardsContainerHeight || !scrollViewportHeight) {
      setStackedSpacerHeight(0);
      return;
    }

    const desiredTopOffset = spacing.md;
    const absoluteY = cardsContainerOffsetY.current + activeLayout.y;
    const targetScrollOffset = Math.max(0, absoluteY - desiredTopOffset);
    const totalContentHeightWithoutSpacer = cardsContainerOffsetY.current + cardsContainerHeight + stackedBottomPadding;
    const maxScrollableOffsetWithoutSpacer = Math.max(0, totalContentHeightWithoutSpacer - scrollViewportHeight);
    const nextSpacerHeight = Math.max(0, targetScrollOffset - maxScrollableOffsetWithoutSpacer);

    setStackedSpacerHeight((current) => (Math.abs(current - nextSpacerHeight) > 1 ? nextSpacerHeight : current));
  }, [
    cardLayouts,
    cardsContainerHeight,
    flowVariant,
    headerHeight,
    isStackedSummaryMode,
    keyboardHeight,
    scrollViewportHeight,
    stackedActiveStep,
  ]);

  const updateDraft = <K extends keyof ListingDraft>(key: K, value: ListingDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const clearHomeDetailsPrefill = () => {
    if (homeDetailsPrefillTimeoutRef.current) {
      clearTimeout(homeDetailsPrefillTimeoutRef.current);
      homeDetailsPrefillTimeoutRef.current = null;
    }
    setIsPrefillingHomeDetails(false);
  };

  const runHomeDetailsPrefillIfNeeded = () => {
    clearHomeDetailsPrefill();
    if (draft.property !== b102Property) return;

    setIsPrefillingHomeDetails(true);
    homeDetailsPrefillTimeoutRef.current = setTimeout(() => {
      setDraft((current) => ({
        ...current,
        ...b102HomeDetailsPrefill,
      }));
      setIsPrefillingHomeDetails(false);
      homeDetailsPrefillTimeoutRef.current = null;
    }, 3000);
  };

  const animateSectionTransition = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  };

  const setFieldContainerRef = (key: string) => (node: View | null) => {
    fieldContainers.current[key] = node;
  };

  const scrollFieldIntoView = (key: string) => {
    const fieldNode = fieldContainers.current[key];
    if (!fieldNode) return;

    fieldNode.measureInWindow((_x, y) => {
      const desiredTop = 184;
      const delta = y - desiredTop;
      if (Math.abs(delta) > 4) {
        const targetY = Math.max(0, scrollOffsetY.current + delta);
        scrollRef.current?.scrollTo({
          x: 0,
          y: targetY,
          animated: true
        });
      }
    });
  };

  const handleInputFocus = (
    key: string,
    inputRef: React.RefObject<TextInput | null>
  ) => {
    activeFieldKey.current = key;
    requestAnimationFrame(() => {
      scrollFieldIntoView(key);
    });
  };

  const markSectionSubmitted = (index: number) => {
    setSubmittedSections((current) => current.map((value, currentIndex) => (currentIndex === index ? true : value)));
  };

  const resetWizard = () => {
    clearHomeDetailsPrefill();
    animateSectionTransition();
    setDraft(initialDraft);
    setCurrentStep(0);
    setFlowVariant('stacked');
    setStackedActiveStep(0);
    setSubmittedSections(Array(steps.length - 1).fill(false));
    setKeyboardHeight(0);
    activeFieldKey.current = null;
    pendingScrollIndex.current = 0;
    scrollOffsetY.current = 0;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    });
  };

  const scrollToCardY = (y: number) => {
    const absoluteY = cardsContainerOffsetY.current + y;
    scrollRef.current?.scrollTo({ x: 0, y: Math.max(0, absoluteY - spacing.md), animated: true });
  };

  const scrollToCard = (index: number) => {
    const layout = cardLayouts[index];
    if (!layout) return;
    scrollToCardY(layout.y);
  };

  const handleBack = () => {
    clearHomeDetailsPrefill();
    onNavigate('appHome');
  };

  const handleNext = () => {
    if (isFinalStep) {
      onNavigate('marketplace');
      return;
    }
    if (!currentStepValid) return;
    if (currentStep === 0) {
      animateSectionTransition();
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
      runHomeDetailsPrefillIfNeeded();
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  };

  const seededPhotoLabels = listingPhotoLibrary.map((photo) => photo.label);
  const selectedListingPhotos = listingPhotoLibrary.filter((photo) => draft.galleryPhotos.includes(photo.label));
  const hasSelectedPhotos = selectedListingPhotos.length > 0;

  const activatePhotoSelection = () => {
    updateDraft('coverPhotoAdded', true);
    if (!draft.galleryPhotos.length) {
      updateDraft('galleryPhotos', seededPhotoLabels);
    }
  };

  const addGalleryPhoto = () => {
    const nextPhoto = listingPhotoLibrary.find((photo) => !draft.galleryPhotos.includes(photo.label));
    if (!nextPhoto) return;
    updateDraft('galleryPhotos', [...draft.galleryPhotos, nextPhoto.label]);
  };

  const removeGalleryPhoto = (label: string) => {
    const nextPhotos = draft.galleryPhotos.filter((photo) => photo !== label);
    updateDraft('galleryPhotos', nextPhotos);
    if (!nextPhotos.length) {
      updateDraft('coverPhotoAdded', false);
    }
  };

  const renderStepBody = (stepKey: StepKey) => {
    switch (stepKey) {
      case 'basics':
        return renderBasicsStep();
      case 'homeDetails':
        return renderHomeDetailsStep();
      case 'pricing':
        return renderPricingStep();
      case 'photos':
        return renderPhotosStep();
      case 'description':
        return renderDescriptionStep();
      case 'review':
        return renderReviewStep();
    }
  };

  const renderBasicsStep = () => (
    <View style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Property" required />
        <View style={{ gap: spacing.md }}>
          {propertyOptions.map((option) => {
            const isActive = option === draft.property;
            return (
              <Pressable
                key={option}
                onPress={() => updateDraft('property', option)}
                style={{
                  width: '100%',
                  padding: spacing.lg,
                  borderRadius: radius.pill,
                  borderWidth: isActive ? 2 : 1,
                  borderColor: isActive ? colors.contentAction : colors.borderDefault,
                  backgroundColor: colors.surfacePrimary,
                  gap: spacing.xs
                }}
              >
                <Text style={[typography.bodyDefaultBold, { textAlign: 'center', color: isActive ? colors.contentAction : colors.contentPrimary }]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Listing type" required />
        <ChoicePills value={draft.listingType} options={listingTypeOptions} onSelect={(value) => updateDraft('listingType', value)} />
      </View>

      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Available from" required />
        <Pressable
          onPress={() => updateDraft('availability', draft.availability ? '1 Jul 2026' : '25 Jun 2026')}
          style={{
            minHeight: 60,
            borderRadius: radius.xl,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            backgroundColor: colors.surfacePrimary,
            paddingHorizontal: spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Text style={[typography.bodyLarge, { color: draft.availability ? colors.contentPrimary : colors.contentTertiary }]}>
            {draft.availability || 'Select move-in date'}
          </Text>
          <CalendarBlank size={iconSize.md} color={colors.contentSecondary} weight="regular" />
        </Pressable>
      </View>
    </View>
  );

  const renderHomeDetailsStep = () => (
    isPrefillingHomeDetails ? (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.xxl,
          gap: spacing.lg,
        }}
      >
        <Image source={logoAnimationSource} style={{ width: 120, height: 120 }} resizeMode="contain" />
        <View style={{ gap: spacing.xs, alignItems: 'center' }}>
          <Text style={typography.bodyLargeBold}>Loading home details</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary, textAlign: 'center' }]}>
            We're fetching available details for B102 so you don't have to fill everything manually.
          </Text>
        </View>
      </View>
    ) : (
    <View style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Property type" required />
        {flowVariant === 'stacked' ? (
          <ChoiceTiles
            value={draft.propertyType}
            options={[
              {
                value: 'Apartment',
                label: 'Apartment',
                icon: <Buildings size={18} color={draft.propertyType === 'Apartment' ? colors.contentAction : colors.contentSecondary} weight="regular" />
              },
              {
                value: 'Villa',
                label: 'Villa',
                icon: <House size={18} color={draft.propertyType === 'Villa' ? colors.contentAction : colors.contentSecondary} weight="regular" />
              },
            ] as const}
            onSelect={(value) => updateDraft('propertyType', value)}
            layout="row"
          />
        ) : (
          <ChoicePills
            value={draft.propertyType}
            options={propertyTypeOptions}
            onSelect={(value) => updateDraft('propertyType', value)}
            columns={2}
          />
        )}
      </View>

      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="BHK" required />
        {flowVariant === 'stacked' ? (
          <ScrollPills value={draft.bhk} options={bhkOptions} onSelect={(value) => updateDraft('bhk', value)} />
        ) : (
          <ChoicePills value={draft.bhk} options={bhkOptions} onSelect={(value) => updateDraft('bhk', value)} columns={3} />
        )}
      </View>

      <View ref={setFieldContainerRef('builtUpArea')}>
        <InputField
          inputRef={builtUpAreaInputRef}
          label="Built-up area"
          required
          value={draft.builtUpArea}
          onChangeText={(value) => updateDraft('builtUpArea', value.replace(/[^0-9]/g, ''))}
          placeholder="Enter built-up area in sqft"
          keyboardType="numeric"
          suffix="Sqft."
          onFocus={() => handleInputFocus('builtUpArea', builtUpAreaInputRef)}
        />
      </View>

      {draft.propertyType === 'Villa' ? null : (
        <View style={{ flexDirection: 'row', gap: spacing.lg }}>
          <View style={{ flex: 1 }}>
            <View ref={setFieldContainerRef('floor')}>
              <InputField
                inputRef={floorInputRef}
                label="Floor"
                required
                value={draft.floor}
                onChangeText={(value) => updateDraft('floor', value.replace(/[^0-9]/g, ''))}
                placeholder="Floor number"
                keyboardType="numeric"
                onFocus={() => handleInputFocus('floor', floorInputRef)}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <View ref={setFieldContainerRef('totalFloors')}>
              <InputField
                inputRef={totalFloorsInputRef}
                label="Total floors"
                required
                value={draft.totalFloors}
                onChangeText={(value) => updateDraft('totalFloors', value.replace(/[^0-9]/g, ''))}
                placeholder="Total floors"
                keyboardType="numeric"
                onFocus={() => handleInputFocus('totalFloors', totalFloorsInputRef)}
              />
            </View>
          </View>
        </View>
      )}

      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Furnishing" required />
        {flowVariant === 'stacked' ? (
          <ScrollPills value={draft.furnishing} options={furnishingOptions} onSelect={(value) => updateDraft('furnishing', value)} />
        ) : (
          <ChoicePills
            value={draft.furnishing}
            options={furnishingOptions}
            onSelect={(value) => updateDraft('furnishing', value)}
            hugContent
          />
        )}
      </View>
    </View>
    )
  );

  const renderPricingStep = () => (
    <View style={{ gap: spacing.xl }}>
      <SurfaceCard style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceActionSecondarySubtle, borderWidth: 0 }}>
        {/* <Text style={typography.bodyDefaultBold}>Estimated rent</Text> */}
        <LightbulbIcon size={iconSize.lg} color={colors.contentAction} weight="regular" />
        <Text style={[typography.bodySmall, { color: colors.contentSecondary, flex: 1, lineHeight: 18 }]}>
          Based on recent price trends, the estimated rent for your property is around ₹ 42,000 - ₹ 48,000.
        </Text>
      </SurfaceCard>
      <View ref={setFieldContainerRef('rent')}>
        <CurrencyInputField
          inputRef={rentInputRef}
          label="Monthly rent"
          required
          value={draft.rent}
          onChangeText={(value) => updateDraft('rent', value.replace(/[^0-9]/g, ''))}
          placeholder="Ex. ₹ 45,000"
          onFocus={() => handleInputFocus('rent', rentInputRef)}
        />
      </View>
      <View ref={setFieldContainerRef('maintenance')}>
        <CurrencyInputField
          inputRef={maintenanceInputRef}
          label="Maintenance (Optional)"
          value={draft.maintenance}
          onChangeText={(value) => updateDraft('maintenance', value.replace(/[^0-9]/g, ''))}
          placeholder="Ex. ₹ 3,500"
          onFocus={() => handleInputFocus('maintenance', maintenanceInputRef)}
        />
      </View>
      <View style={{ gap: spacing.sm }}>
        <FieldLabel label="Security deposit" required />
        <ChoiceTiles
          value={draft.depositPreset}
          options={[
            { value: 'None', label: 'None' },
            {
              value: '1 month',
              label: '1 month',
              description: draft.rent ? formatCurrency(draft.rent) : 'Based on rent',
            },
            {
              value: '2 month',
              label: '2 months',
              description: draft.rent ? formatCurrency(String(Number(draft.rent) * 2)) : 'Based on rent',
            },
            { value: 'Custom', label: 'Custom' },
          ] as const}
          onSelect={(value) => {
            updateDraft('depositPreset', value);
            if (value !== 'Custom') {
              updateDraft('deposit', '');
            }
          }}
        />
      </View>
      {draft.depositPreset === 'Custom' ? (
        <View ref={setFieldContainerRef('deposit')}>
          <CurrencyInputField
            inputRef={depositInputRef}
            label="Custom deposit"
            required
            value={draft.deposit}
            onChangeText={(value) => updateDraft('deposit', value.replace(/[^0-9]/g, ''))}
            placeholder="Ex. ₹ 90,000"
            onFocus={() => handleInputFocus('deposit', depositInputRef)}
          />
        </View>
      ) : null}
    </View>
  );

  const renderPhotosStep = () => (
    <View style={{ gap: spacing.xl }}>
      <View style={{ gap: spacing.lg }}>
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
            The first image will be used as the cover photo in the feed and preview.
          </Text>
        </View>
        {!draft.coverPhotoAdded ? (
          <Pressable
            onPress={activatePhotoSelection}
            style={{
              minHeight: 180,
              borderRadius: radius.xl,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.borderDefault,
              backgroundColor: colors.surfaceSecondary,
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing.sm
            }}
          >
            <ImageIcon size={iconSize.xl} color={colors.contentAction} weight="regular" />
            <Text style={typography.bodyDefaultBold}>Tap to add photos</Text>
            <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>No watermarks. Bright daytime shots work best.</Text>
          </Pressable>
        ) : (
          <PhotoCarousel
            photos={selectedListingPhotos as Array<{ label: string; source: any }>}
            variant="editable"
            onAddPhoto={addGalleryPhoto}
            onRemovePhoto={removeGalleryPhoto}
          />
        )}
        {!draft.coverPhotoAdded ? (
          <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>You can skip this for now and add photos later.</Text>
        ) : null}
      </View>
    </View>
  );

  const renderDescriptionStep = () => (
    <View style={{ gap: spacing.xl }}>
      <View ref={setFieldContainerRef('description')}>
        <InputField
          inputRef={descriptionInputRef}
          label="Description"
          required
          value={draft.description}
          onChangeText={(value) => updateDraft('description', value)}
          placeholder="Eg: Semi-furnished family home with wardrobes, modular kitchen, and good cross-ventilation."
          multiline
          minHeight={240}
          onFocus={() => handleInputFocus('description', descriptionInputRef)}
        />
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View style={{ gap: spacing.lg }}>
      {/* <SurfaceCard style={{ gap: spacing.sm }}>
        <Text style={typography.bodyLargeBold}>Listing snapshot</Text>
        <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
          The experience is intentionally broken into clean stages, and this final screen mirrors that structure with editable summaries.
        </Text>
      </SurfaceCard> */}

      <SurfaceCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={typography.bodyLargeBold}>Basics</Text>
          <Pressable onPress={() => setCurrentStep(0)}>
            <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Edit</Text>
          </Pressable>
        </View>
        <SummaryRow label="Property" value={draft.property} />
        <SummaryRow label="Listing type" value={draft.listingType || '--'} />
        <SummaryRow label="Available from" value={draft.availability || '--'} />
      </SurfaceCard>

      <SurfaceCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={typography.bodyLargeBold}>Home details</Text>
          <Pressable onPress={() => setCurrentStep(1)}>
            <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Edit</Text>
          </Pressable>
        </View>
        <SummaryRow label="Configuration" value={`${draft.propertyType || '--'} • ${draft.bhk || '--'}`} />
        <SummaryRow label="Area" value={formatArea(draft.builtUpArea)} />
        <SummaryRow label="Furnishing" value={draft.furnishing || '--'} />
        {draft.propertyType === 'Villa' ? null : <SummaryRow label="Floor" value={`${draft.floor || '--'} / ${draft.totalFloors || '--'}`} />}
      </SurfaceCard>

      <SurfaceCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={typography.bodyLargeBold}>Pricing</Text>
          <Pressable onPress={() => setCurrentStep(2)}>
            <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Edit</Text>
          </Pressable>
        </View>
        <SummaryRow label="Deposit" value={getDepositSummary(draft)} />
        <SummaryRow label="Monthly rent" value={formatCurrency(draft.rent)} />
        <SummaryRow label="Maintenance" value={formatCurrency(draft.maintenance)} />
      </SurfaceCard>

      <SurfaceCard>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={typography.bodyLargeBold}>Photos & description</Text>
          <Pressable onPress={() => setCurrentStep(3)}>
            <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Edit</Text>
          </Pressable>
        </View>
        <View style={{ gap: spacing.sm }}>
          <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>Property photos</Text>
          {hasSelectedPhotos ? (
            <PhotoCarousel photos={selectedListingPhotos as Array<{ label: string; source: any }>} variant="summary" />
          ) : (
            <Text style={typography.bodyDefault}>No photos added yet</Text>
          )}
        </View>
        <SummaryRow label="Description" value={draft.description} />
      </SurfaceCard>
    </View>
  );

  const renderStackedPreview = (stepKey: StepKey) => {
    switch (stepKey) {
      case 'basics':
        return (
          <View style={{ gap: spacing.md }}>
            <SummaryWrappedSegments
              items={[
                draft.property || '--',
                draft.listingType || '--',
                draft.availability ? `Available from ${draft.availability}` : '--',
              ]}
            />
          </View>
        );
      case 'homeDetails':
        return (
          <View style={{ gap: spacing.md }}>
            <SummaryWrappedSegments
              items={[
                draft.propertyType || '--',
                draft.bhk || '--',
                formatArea(draft.builtUpArea),
                ...(draft.propertyType === 'Villa' ? [] : [`Floor ${draft.floor || '--'} / ${draft.totalFloors || '--'}`]),
                draft.furnishing || '--',
              ]}
            />
          </View>
        );
      case 'pricing':
        return (
          <View style={{ gap: spacing.md }}>
            <SummaryWrappedSegments
              items={[
                `Rent ${formatCurrency(draft.rent)}`,
                `Maintenance ${formatCurrency(draft.maintenance)}`,
                `Deposit ${getDepositSummary(draft)}`,
              ]}
            />
          </View>
        );
      case 'photos':
        return (
          <View style={{ gap: spacing.md }}>
            <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>Property photos</Text>
            {hasSelectedPhotos ? (
              <PhotoCarousel photos={selectedListingPhotos as Array<{ label: string; source: any }>} variant="summary" />
            ) : (
              <Text style={typography.bodyDefault}>No photos added yet</Text>
            )}
          </View>
        );
      case 'description':
        return (
          <View style={{ gap: spacing.md }}>
            <Text style={[typography.bodyLarge, { color: colors.contentPrimary }]}>
              {draft.description || '--'}
            </Text>
          </View>
        );
      case 'review':
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: flowVariant === 'stepByStep' ? colors.surfacePage : colors.surfacePageStrong }}>
      <View
        onLayout={(event) => {
          setHeaderHeight(event.nativeEvent.layout.height);
        }}
      >
        <AppHeader
          onBack={handleBack}
          variant="solid"
          title={flowVariant === 'stacked' ? 'List your home' : 'List your home'}
          titleAlign="left"
          rightSlot={
            <Pressable onPress={() => {
              if (flowVariant === 'stepByStep') {
                animateSectionTransition();
                setFlowVariant('stacked');
                const nextActiveStep = allContentStepsSubmitted ? -1 : Math.min(currentStep, contentSteps.length - 1);
                setStackedActiveStep(nextActiveStep);
                pendingScrollIndex.current = nextActiveStep === -1 ? null : nextActiveStep;
                return;
              }

              animateSectionTransition();
              setFlowVariant('stepByStep');
              setCurrentStep(stackedActiveStep === -1 ? steps.length - 1 : Math.min(stackedActiveStep, steps.length - 1));
            }}>
              <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Save draft</Text>
            </Pressable>
          }
        />
      </View>

      <ScrollView
        ref={scrollRef}
        onLayout={(event) => {
          setScrollViewportHeight(event.nativeEvent.layout.height);
        }}
        showsVerticalScrollIndicator={false}
        onScroll={(event) => {
          scrollOffsetY.current = event.nativeEvent.contentOffset.y;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={{
          gap: spacing.xl,
          paddingHorizontal: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom:
            flowVariant === 'stacked'
              ? (isStackedSummaryMode ? spacing.xxl + 96 : spacing.xxl) + keyboardHeight
              : spacing.xxl + 96 + keyboardHeight
        }}
        keyboardShouldPersistTaps="handled"
      >
        {flowVariant === 'stepByStep' ? (
          <View style={{ gap: spacing.lg }}>
            <>
              <ProgressSegments currentStep={currentStep} />
              <View style={{ gap: spacing.sm }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>{currentMeta.eyebrow}</Text>
                <Text style={typography.titleScreen}>{currentMeta.title}</Text>
                <Text style={[typography.bodyLarge, { color: colors.contentSecondary }]}>{currentMeta.description}</Text>
              </View>
              
            </>
          </View>
        ) : null}

        {flowVariant === 'stepByStep' ? (
          renderStepBody(currentMeta.key)
        ) : (
          <View
            style={{ gap: spacing.md }}
            onLayout={(event) => {
              cardsContainerOffsetY.current = event.nativeEvent.layout.y;
              setCardsContainerHeight(event.nativeEvent.layout.height);
            }}
          >
            {contentSteps.map((step, index) => {
              const isCompleted = contentStepValidity[index];
              const isSubmitted = submittedSections[index];
              const isFocused = index === stackedActiveStep;
              const isPrimaryPendingStep = firstPendingContentStep !== -1 && index === firstPendingContentStep && !isSubmitted;
              const isLastContentStep = index === contentSteps.length - 1;
              const isOpenPendingStep = isPrimaryPendingStep && !isSubmitted;
              const isPreviewState = isSubmitted && (!isFocused || isStackedSummaryMode);
              const isLoadingHomeDetailsStep = step.key === 'homeDetails' && isPrefillingHomeDetails;
              const shouldRenderSection = isStackedSummaryMode ? isSubmitted : isFocused || isSubmitted || isOpenPendingStep;

              if (!shouldRenderSection) {
                return null;
              }

              return (
                <View
                  key={step.key}
                  onLayout={(event) => {
                    const { y, height } = event.nativeEvent.layout;
                    setCardLayouts((current) => {
                      const previous = current[index];
                      if (previous && previous.y === y && previous.height === height) {
                        return current;
                      }

                      return {
                        ...current,
                        [index]: { y, height }
                      };
                    });
                    if (pendingScrollIndex.current === index) {
                      requestAnimationFrame(() => {
                        scrollToCardY(y);
                        pendingScrollIndex.current = null;
                      });
                    }
                  }}
                >
                  <SurfaceCard
                    style={{
                      gap: spacing.lg,
                      borderWidth: 0,
                      overflow: 'hidden'
                    }}
                  >
                    <View style={{ gap: spacing.sm }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }}>
                        <View style={{ flex: 1, gap: 2 }}>
                          {isStackedSummaryMode || isSubmitted ? null : (
                            <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>{step.eyebrow}</Text>
                          )}
                          <Text style={typography.titleSubsection}>{step.title}</Text>
                        </View>
                        {isSubmitted && !isFocused ? (
                          <Pressable
                            onPress={() => {
                              animateSectionTransition();
                              setStackedActiveStep(index);
                              pendingScrollIndex.current = index;
                            }}
                          >
                            <Text style={[typography.bodyDefaultBold, { color: colors.contentAction }]}>Edit</Text>
                          </Pressable>
                        ) : null}
                      </View>
                      {isPreviewState ? <View style={{ marginTop:spacing.md,height: 1, backgroundColor: colors.borderDefault }} /> : null}
                    </View>

                    {isPreviewState ? renderStackedPreview(step.key) : (isFocused || isOpenPendingStep) ? renderStepBody(step.key) : null}

                    {!isPreviewState && (isFocused || isOpenPendingStep) && !isLoadingHomeDetailsStep ? (
                      <View style={{ paddingTop: spacing.sm }}>
                        <Button
                          kind="Primary"
                          size="LG"
                          label={getSectionButtonLabel({
                            isSubmitted,
                            isLastContentStep,
                            stepKey: step.key,
                            hasPhotos: hasSelectedPhotos,
                          })}
                          state={isCompleted ? 'Default' : 'Disabled'}
                          fullWidth
                          onPress={() => {
                            if (!isCompleted) return;
                            animateSectionTransition();
                            markSectionSubmitted(index);
                            if (isSubmitted) {
                              setStackedActiveStep(-1);
                              pendingScrollIndex.current = null;
                              return;
                            }
                            if (isLastContentStep) {
                              setStackedActiveStep(-1);
                              pendingScrollIndex.current = null;
                              return;
                            }
                            const nextIndex = index + 1;
                            setStackedActiveStep(nextIndex);
                            pendingScrollIndex.current = nextIndex;
                            if (step.key === 'basics') {
                              runHomeDetailsPrefillIfNeeded();
                            }
                          }}
                        />
                      </View>
                    ) : null}
                  </SurfaceCard>
                </View>
              );
            })}
          </View>
        )}

        {flowVariant === 'stacked' && stackedSpacerHeight > 0 ? (
          <View style={{ height: stackedSpacerHeight, backgroundColor: 'transparent' }} />
        ) : null}
      </ScrollView>

      {flowVariant === 'stacked' && isStackedSummaryMode ? (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.surfacePrimary,
            borderTopWidth: 1,
            borderTopColor: colors.borderDefault
          }}
        >
          <Button
            kind="Primary"
            size="LG"
            label="See Preview"
            fullWidth
            onPress={resetWizard}
          />
        </View>
      ) : flowVariant === 'stacked' ? null : (
        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: insets.bottom + spacing.md,
            backgroundColor: colors.surfacePrimary,
            borderTopWidth: 1,
            borderTopColor: colors.borderDefault
          }}
        >
          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Button
                kind="Tertiary"
                size="LG"
                label={currentStep === 0 ? 'Cancel' : 'Back'}
                fullWidth
                onPress={handleBack}
              />
            </View>
            <View style={{ flex: 1.4 }}>
              <Button
                kind="Primary"
                size="LG"
                label={isFinalStep ? 'Publish listing' : 'Continue'}
                state={(!isFinalStep && !currentStepValid) || isPrefillingHomeDetails ? 'Disabled' : 'Default'}
                fullWidth
                onPress={handleNext}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
