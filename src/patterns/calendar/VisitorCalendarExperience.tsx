import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  ScrollView,
  Text,
  View,
} from 'react-native';
import {
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  Clock,
  MapPin,
  Users,
} from 'phosphor-react-native';
import Svg, { Defs, LinearGradient, Polygon, Rect, Stop } from 'react-native-svg';
import { AppHeader } from '../../components';
import { ModalSurface as Modal } from '../../components/internal/ModalSurface';
import { PressableSurface as Pressable } from '../../components/internal/PressableSurface';
import { colors, elevation, iconSize, radius, spacing, typography } from '../../tokens';

type Props = {
  onBack: () => void;
};

type EventTone = 'primary' | 'secondary' | 'warning';

type CalendarEvent = {
  id: string;
  title: string;
  time: string;
  location: string;
  host: string;
  tone: EventTone;
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekDayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const yearOptions = [2025, 2026, 2027, 2028];
const monthMastheadColors = [
  colors.contentAction,
  colors.surfaceInfoBold,
  colors.contentPositive,
  colors.surfaceActionSecondary,
  colors.contentWarning,
  colors.feedbackInfo,
  colors.surfaceActionPrimary,
  colors.borderInfo,
  colors.contentSecondary,
  colors.borderWarning,
  colors.borderPositive,
  colors.borderAction,
];

const eventMap: Record<string, CalendarEvent[]> = {
  '2026-07-09': [
    { id: 'inspection', title: 'Lift inspection window', time: '09:30 - 10:15', location: 'Tower B lobby', host: 'Facility team', tone: 'secondary' },
    { id: 'delivery', title: 'Visitor delivery cluster', time: '11:00 - 12:00', location: 'Gate 2', host: 'Security desk', tone: 'primary' },
    { id: 'book-club', title: 'Community book swap', time: '18:30 - 19:30', location: 'Clubhouse deck', host: 'Residents forum', tone: 'warning' },
  ],
  '2026-07-12': [
    { id: 'pool-clean', title: 'Pool maintenance hold', time: '08:00 - 11:00', location: 'Amenities block', host: 'Maintenance', tone: 'secondary' },
  ],
  '2026-07-18': [
    { id: 'music-night', title: 'Monsoon music night', time: '19:00 - 21:00', location: 'Central lawn', host: 'Cultural committee', tone: 'primary' },
    { id: 'pet-meet', title: 'Pet parents meet-up', time: '17:00 - 18:00', location: 'Pet park', host: 'Tower D residents', tone: 'warning' },
  ],
  '2026-08-03': [
    { id: 'vendor', title: 'Verified vendor round', time: '10:00 - 11:30', location: 'Visitor gate', host: 'Front desk', tone: 'secondary' },
  ],
};

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildMonthGrid(date: Date) {
  const firstDay = startOfMonth(date);
  const startOffset = firstDay.getDay();
  const gridStart = new Date(firstDay);
  gridStart.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 6 }, (_, weekIndex) =>
    Array.from({ length: 7 }, (_, dayIndex) => {
      const cellDate = new Date(gridStart);
      cellDate.setDate(gridStart.getDate() + weekIndex * 7 + dayIndex);
      return cellDate;
    })
  );
}

function startOfWeek(date: Date) {
  const weekStart = new Date(date);
  weekStart.setDate(date.getDate() - date.getDay());
  return weekStart;
}

function endOfWeek(date: Date) {
  const weekEnd = new Date(date);
  weekEnd.setDate(date.getDate() + (6 - date.getDay()));
  return weekEnd;
}

function buildYearWeekPages(year: number) {
  const start = startOfWeek(new Date(year, 0, 1));
  const end = endOfWeek(new Date(year, 11, 31));
  const weeks: Date[][] = [];
  const cursor = new Date(start);

  while (cursor <= end) {
    weeks.push(
      Array.from({ length: 7 }, (_, dayIndex) => {
        const day = new Date(cursor);
        day.setDate(cursor.getDate() + dayIndex);
        return day;
      })
    );
    cursor.setDate(cursor.getDate() + 7);
  }

  return weeks;
}

function clampDateToMonth(targetMonth: Date, candidateDate: Date) {
  const lastDay = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(candidateDate.getDate(), lastDay));
}

function eventToneColor(tone: EventTone) {
  if (tone === 'primary') return colors.surfaceActionPrimary;
  if (tone === 'warning') return colors.contentWarning;
  return colors.surfaceActionSecondary;
}

type CalendarGridProps = {
  month: Date;
  weeks: Date[][];
  activeDate: Date;
  focusDate: Date;
  today: Date;
  sheetMode: 'peek' | 'full';
  gridHeight: number;
  pageWidth: number;
  onVisibleMonthChange: (date: Date) => void;
  onSelectDay: (day: Date) => void;
};

const weekStripTileHeight = 70;

// Memoized so that per-frame drag updates (which only resize a wrapping
// container elsewhere) never force this 42-cell grid to re-render — that
// reconciliation cost was the source of the drag jitter.
const CalendarGrid = memo(function CalendarGrid({
  month,
  weeks,
  activeDate,
  focusDate,
  today,
  sheetMode,
  gridHeight,
  pageWidth,
  onVisibleMonthChange,
  onSelectDay,
}: CalendarGridProps) {
  const weekStripRef = useRef<ScrollView>(null);
  const monthKey = `${month.getFullYear()}-${month.getMonth()}`;
  const previousMonthKeyRef = useRef(monthKey);
  const yearWeeks = useMemo(() => buildYearWeekPages(month.getFullYear()), [month]);
  const selectedWeekIndex = useMemo(
    () => Math.max(0, yearWeeks.findIndex((week) => week.some((day) => sameDay(day, focusDate)))),
    [focusDate, yearWeeks]
  );
  const weekPageWidth = Math.max(1, pageWidth - spacing.md * 2);
  const weekTileGap = spacing.xs / 2;
  const weekTileSize = Math.floor((weekPageWidth - weekTileGap * 6) / 7);

  useEffect(() => {
    if (sheetMode !== 'full') {
      previousMonthKeyRef.current = monthKey;
      return;
    }

    const shouldSnap = previousMonthKeyRef.current !== monthKey;
    const targetX = selectedWeekIndex * weekPageWidth;

    requestAnimationFrame(() => {
      weekStripRef.current?.scrollTo({ x: targetX, y: 0, animated: shouldSnap });
    });

    previousMonthKeyRef.current = monthKey;
  }, [monthKey, selectedWeekIndex, sheetMode, weekPageWidth]);

  return (
    <View
      style={{
        height: gridHeight,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: sheetMode === 'peek' ? spacing.sm : 0,
        backgroundColor: colors.surfacePrimary,
      }}
    >
      {sheetMode === 'full' ? (
        <>
          <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
            {weekDayLabels.map((label) => (
              <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentTertiary }]}>{label}</Text>
              </View>
            ))}
          </View>
          <ScrollView
            ref={weekStripRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.md }}
            onMomentumScrollEnd={(event) => {
              const pageIndex = Math.round(event.nativeEvent.contentOffset.x / weekPageWidth);
              const boundedIndex = Math.max(0, Math.min(yearWeeks.length - 1, pageIndex));
              const midpointDay = yearWeeks[boundedIndex]?.[3];
              if (midpointDay) {
                onVisibleMonthChange(midpointDay);
              }
            }}
          >
            {yearWeeks.map((week, weekIndex) => (
              <View key={`${month.getMonth()}-week-strip-${weekIndex}`} style={{ width: weekPageWidth }}>
                <View style={{ flexDirection: 'row', gap: weekTileGap }}>
                  {week.map((day) => {
                    const isSelected = sameDay(day, activeDate);
                    const isToday = sameDay(day, today);
                    const inCurrentMonth = day.getMonth() === month.getMonth();
                    const hasEvent = (eventMap[toDateKey(day)] ?? []).length > 0;

                    return (
                      <Pressable
                        key={day.toISOString()}
                        onPress={() => onSelectDay(day)}
                        style={{
                          flex: 1,
                          height: weekTileSize,
                          borderRadius: radius.xl,
                          paddingVertical: spacing.sm,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: isSelected
                            ? colors.surfaceActionPrimary
                            : hasEvent
                              ? colors.surfaceSecondary
                              : colors.surfacePrimary,
                          borderWidth: 1,
                          borderColor: isSelected ? colors.surfaceActionPrimary : isToday ? colors.contentAction : colors.borderSubtle,
                        }}
                      >
                        <Text
                          style={[
                            typography.bodyLargeBold,
                            {
                              color: isSelected
                                ? colors.contentOnDark
                                : inCurrentMonth
                                  ? colors.contentPrimary
                                  : colors.contentTertiary,
                            },
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                        {hasEvent ? (
                          <View
                            style={{
                              position: 'absolute',
                              bottom: 8,
                              width: 8,
                              height: 8,
                              borderRadius: radius.pill,
                              backgroundColor: isSelected ? colors.contentOnDark : colors.contentAction,
                            }}
                          />
                        ) : null}
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>
        </>
      ) : (
        <>
          <View style={{ flexDirection: 'row', marginBottom: spacing.sm }}>
            {weekDayLabels.map((label) => (
              <View key={label} style={{ flex: 1, alignItems: 'center' }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentTertiary }]}>{label}</Text>
              </View>
            ))}
          </View>

          <View style={{ gap: spacing.xs }}>
            {weeks.map((week, weekIndex) => (
              <View key={`${month.getMonth()}-${weekIndex}`} style={{ flexDirection: 'row', gap: spacing.xs / 2 }}>
                {week.map((day) => {
                  const isSelected = sameDay(day, activeDate);
                  const isToday = sameDay(day, today);
                  const inCurrentMonth = day.getMonth() === month.getMonth();
                  const hasEvent = (eventMap[toDateKey(day)] ?? []).length > 0;

                  return (
                    <Pressable
                      key={day.toISOString()}
                      onPress={() => onSelectDay(day)}
                      style={{
                        flex: 1,
                        minHeight: 44,
                        borderRadius: radius.xl,
                        paddingVertical: spacing.sm,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: isSelected
                          ? colors.surfaceActionPrimary
                          : hasEvent
                            ? colors.surfaceSecondary
                            : 'transparent',
                        borderWidth: isToday ? 1 : 0,
                        borderColor: isSelected ? colors.surfaceActionPrimary : isToday ? colors.contentAction : colors.borderSubtle,
                      }}
                    >
                      <Text
                        style={[
                          typography.bodyLargeBold,
                          {
                            color: isSelected
                              ? colors.contentOnDark
                              : inCurrentMonth
                                ? colors.contentPrimary
                                : colors.contentTertiary,
                          },
                        ]}
                      >
                        {day.getDate()}
                      </Text>
                      {hasEvent ? (
                        <View
                          style={{
                            position: 'absolute',
                            bottom: 6,
                            width: 6,
                            height: 6,
                            borderRadius: radius.pill,
                            backgroundColor: isSelected ? colors.contentOnDark : colors.contentAction,
                          }}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
});

export function VisitorCalendarExperience({ onBack }: Props) {
  const initialDate = useMemo(() => new Date(2026, 6, 9), []);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(initialDate));
  const [weekFocusDate, setWeekFocusDate] = useState(initialDate);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'peek' | 'full'>('peek');
  const [anchorSide, setAnchorSide] = useState<'left' | 'right'>('right');
  const [cardWidth, setCardWidth] = useState(320);
  // How tall the fold would grow if it only ever tracked the touch 1:1.
  const [touchReachY, setTouchReachY] = useState(124);
  const [dragProgress, setDragProgress] = useState(0);
  const [calendarGestureActive, setCalendarGestureActive] = useState(false);
  const hasCommittedRef = useRef(false);
  const touchStartYRef = useRef(0);
  const COMMIT_THRESHOLD = 0.6;
  const DRAG_DISTANCE_RATIO = 0.5;
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = flipAnim.addListener(({ value }) => setDragProgress(value));
    return () => flipAnim.removeListener(id);
  }, [flipAnim]);

  const calendarHeaderHeight = 112;
  const monthGrid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);
  const activeEvents = eventMap[toDateKey(selectedDate)] ?? [];
  const currentMonthWeeks = monthGrid;
  const calendarWeekdayRowHeight = 20;
  const calendarMonthCellHeight = 44;
  const calendarWeekCellHeight = weekStripTileHeight;
  const currentGridHeightEstimate =
    sheetMode === 'full'
      ? spacing.md + calendarWeekdayRowHeight + spacing.sm + calendarWeekCellHeight
      : spacing.md + calendarWeekdayRowHeight + spacing.sm + 6 * calendarMonthCellHeight + 5 * spacing.xs + spacing.sm;
  const currentCalendarPageHeight = calendarHeaderHeight + currentGridHeightEstimate;
  const monthFlipCommitDistance = currentCalendarPageHeight * DRAG_DISTANCE_RATIO;

  const runMonthFlip = (targetMonth: Date, direction: 'next' | 'prev' = 'next') => {
    if (targetMonth.getFullYear() === visibleMonth.getFullYear() && targetMonth.getMonth() === visibleMonth.getMonth()) {
      return;
    }

    const nextSelected = clampDateToMonth(targetMonth, selectedDate);
    if (sheetMode === 'full') {
      setWeekFocusDate(clampDateToMonth(targetMonth, weekFocusDate));
      setVisibleMonth(startOfMonth(targetMonth));
      return;
    }
    setAnchorSide(direction === 'next' ? 'right' : 'left');
    setTouchReachY(currentCalendarPageHeight * 0.4);
    flipAnim.setValue(0);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setVisibleMonth(startOfMonth(targetMonth));
      setSelectedDate(nextSelected);
      setWeekFocusDate(nextSelected);
      flipAnim.setValue(0);
      setCalendarGestureActive(false);
    });
  };

  const completeDragFlip = (direction: 'next' | 'prev') => {
    const targetMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + (direction === 'next' ? 1 : -1), 1);
    const nextSelected = clampDateToMonth(targetMonth, selectedDate);
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setVisibleMonth(startOfMonth(targetMonth));
      setSelectedDate(nextSelected);
      setWeekFocusDate(nextSelected);
      flipAnim.setValue(0);
      hasCommittedRef.current = false;
      setCalendarGestureActive(false);
    });
  };

  const springBack = () => {
    if (hasCommittedRef.current) {
      return;
    }
    Animated.timing(flipAnim, {
      toValue: 0,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      setCalendarGestureActive(false);
    });
  };

  const calendarPanResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponderCapture: (_, gestureState) => sheetMode === 'peek' && Math.abs(gestureState.dy) > 10,
        onMoveShouldSetPanResponder: (_, gestureState) => sheetMode === 'peek' && Math.abs(gestureState.dy) > 10,
        onPanResponderGrant: (evt) => {
          hasCommittedRef.current = false;
          touchStartYRef.current = evt.nativeEvent.locationY;
          setCalendarGestureActive(true);
        },
        onPanResponderMove: (_, gestureState) => {
          if (hasCommittedRef.current) {
            return;
          }
          const height = currentCalendarPageHeight;
          // Swipe direction (not which side you touched) picks next vs prev:
          // up reveals next month, down reveals the previous one.
          const direction: 'left' | 'right' = gestureState.dy < 0 ? 'right' : 'left';
          setAnchorSide(direction);
          const rawReachY = direction === 'right' ? height - touchStartYRef.current : touchStartYRef.current;
          setTouchReachY(Math.min(Math.max(rawReachY, 72), height * 0.92));

          const progress = Math.min(1, Math.abs(gestureState.dy) / monthFlipCommitDistance);
          flipAnim.setValue(progress);

          if (progress >= COMMIT_THRESHOLD) {
            hasCommittedRef.current = true;
            completeDragFlip(direction === 'right' ? 'next' : 'prev');
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          if (hasCommittedRef.current) {
            return;
          }
          const direction: 'left' | 'right' = gestureState.dy < 0 ? 'right' : 'left';
          const progress = Math.min(1, Math.abs(gestureState.dy) / monthFlipCommitDistance);
          const fastFlick = Math.abs(gestureState.vy) > 0.45;

          if (progress > COMMIT_THRESHOLD || fastFlick) {
            hasCommittedRef.current = true;
            completeDragFlip(direction === 'right' ? 'next' : 'prev');
          } else {
            springBack();
          }
        },
        onPanResponderTerminate: springBack,
      }),
    [currentCalendarPageHeight, flipAnim, monthFlipCommitDistance, sheetMode, visibleMonth, selectedDate]
  );

  // Memoized so these keep the same array/Date references across the
  // per-frame re-renders a drag causes — that reference stability is what lets
  // CalendarGrid's memo() actually skip re-rendering during a drag.
  const weeksToRender = currentMonthWeeks;

  // The month the peeling bottom strip should reveal underneath it.
  const previewMonth = useMemo(
    () => new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + (anchorSide === 'right' ? 1 : -1), 1),
    [visibleMonth, anchorSide]
  );
  const previewSelectedDate = useMemo(() => clampDateToMonth(previewMonth, selectedDate), [previewMonth, selectedDate]);
  const previewGrid = useMemo(() => buildMonthGrid(previewMonth), [previewMonth]);
  const previewMonthWeeks = previewGrid;
  const previewWeeks = previewMonthWeeks;
  const gridHeight = useMemo(() => {
    if (sheetMode === 'full') {
      return spacing.md + calendarWeekdayRowHeight + spacing.sm + calendarWeekCellHeight;
    }
    return spacing.md + calendarWeekdayRowHeight + spacing.sm + 6 * calendarMonthCellHeight + 5 * spacing.xs + spacing.sm;
  }, [sheetMode]);
  const calendarPageHeight = calendarHeaderHeight + gridHeight;

  // Shared fold height, driven by drag progress: 1:1 with the touch up to the
  // commit threshold, then keeps growing smoothly (no jump) toward a
  // near-full-page reach so the "turn over" reads as a completed page turn.
  const fullReachY = calendarPageHeight;
  const reachY =
    dragProgress <= COMMIT_THRESHOLD
      ? touchReachY * (dragProgress / COMMIT_THRESHOLD)
      : touchReachY + (fullReachY - touchReachY) * ((dragProgress - COMMIT_THRESHOLD) / (1 - COMMIT_THRESHOLD));

  const renderCalendarHeader = (month: Date, interactive: boolean) => {
    const mastheadColor = monthMastheadColors[month.getMonth()] ?? colors.contentAction;

    return (
    <View
      style={{
        height: calendarHeaderHeight,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
        backgroundColor: colors.surfaceSecondary,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderSubtle,
        gap: spacing.md,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Svg
        width={cardWidth}
        height={calendarHeaderHeight}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      >
        <Defs>
          <LinearGradient id="calendarMastheadSheen" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="black" stopOpacity={0.08} />
            {/* <Stop offset="0.42" stopColor="white" stopOpacity={0.08} /> */}
            <Stop offset="1" stopColor="white" stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width={cardWidth} height={calendarHeaderHeight} fill={mastheadColor} />
        <Rect x="0" y="0" width={cardWidth} height={calendarHeaderHeight} fill="url(#calendarMastheadSheen)" />
      </Svg>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable
          disabled={!interactive}
          onPress={() => runMonthFlip(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1), 'prev')}
        >
          <CaretLeft size={iconSize.md} color={interactive ? colors.contentOnDark : colors.contentTertiary} weight="bold" />
        </Pressable>

        <Pressable
          disabled={!interactive}
          onPress={() => setPickerOpen(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.xs,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: radius.pill,
            backgroundColor: colors.surfacePrimary,
            borderWidth: 1,
            borderColor: colors.borderDefault,
          }}
        >
          <CalendarBlank size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
          <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>
            {monthNames[month.getMonth()]} {month.getFullYear()}
          </Text>
          <CaretDown size={iconSize.sm} color={colors.contentSecondary} weight="bold" />
        </Pressable>

        <Pressable
          disabled={!interactive}
          onPress={() => runMonthFlip(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1), 'next')}
        >
          <CaretRight size={iconSize.md} color={interactive ? colors.contentOnDark : colors.contentTertiary} weight="bold" />
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {Array.from({ length: 2 }).map((_, index) => (
          <View
            key={index}
            style={{
              width: 42,
              height: 10,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceInfo,
              borderWidth: 0,
              borderColor: colors.borderSubtle,
            }}
          />
        ))}
      </View>
    </View>
    );
  };

  // useCallback keeps this reference stable across drag-frame re-renders —
  // otherwise CalendarGrid's memo() would see a "new" prop every frame and
  // re-render anyway, defeating the point.
  const handleSelectDay = useCallback(
    (day: Date) => {
      setSelectedDate(day);
      setWeekFocusDate(day);
      if (day.getMonth() !== visibleMonth.getMonth()) {
        setVisibleMonth(startOfMonth(day));
      }
    },
    [visibleMonth]
  );

  const handleVisibleMonthChange = useCallback((nextDate: Date) => {
    setWeekFocusDate(nextDate);
    if (
      nextDate.getFullYear() === visibleMonth.getFullYear() &&
      nextDate.getMonth() === visibleMonth.getMonth()
    ) {
      return;
    }
    setVisibleMonth(startOfMonth(nextDate));
  }, [visibleMonth]);

  const handleCalendarTouchStart = useCallback(() => {
    if (sheetMode === 'peek') {
      setCalendarGestureActive(true);
    }
  }, [sheetMode]);

  const handleCalendarTouchEnd = useCallback(() => {
    if (sheetMode !== 'peek') {
      return;
    }
    if (!hasCommittedRef.current && dragProgress <= 0.001) {
      setCalendarGestureActive(false);
    }
  }, [dragProgress, sheetMode]);

  const renderCalendarPage = (
    month: Date,
    weeks: Date[][],
    activeDate: Date,
    interactive: boolean
  ) => (
    <View style={{ height: calendarPageHeight,backgroundColor: colors.surfacePrimary}}>
      {renderCalendarHeader(month, interactive)}
      <CalendarGrid
        month={month}
        weeks={weeks}
        activeDate={activeDate}
        focusDate={weekFocusDate}
        today={initialDate}
        sheetMode={sheetMode}
        gridHeight={gridHeight}
        pageWidth={cardWidth}
        onVisibleMonthChange={handleVisibleMonthChange}
        onSelectDay={handleSelectDay}
      />
    </View>
  );

  const renderCurlPolygon = () => {
    if (dragProgress <= 0.001) {
      return null;
    }

    const width = cardWidth;
    const height = calendarPageHeight;
    const isNext = anchorSide === 'right';
    const foldY = isNext ? height - reachY : reachY;
    const overhang = Math.min(22, width * 0.06 + 6);
    const nextPeelBell =
      dragProgress <= 0.5
        ? dragProgress / 0.5
        : Math.max(0, 1 - (dragProgress - 0.5) / 0.5);
    const matchedFlapMax = Math.min(height * 0.58, 164);
    const bandDepth = isNext
      ? matchedFlapMax * Math.pow(nextPeelBell, 0.7)
      : matchedFlapMax * Math.pow(1 - dragProgress, 0.7);
    if (bandDepth <= 0.5) {
      return null;
    }
    const bandTopY = isNext ? foldY : Math.max(0, foldY - bandDepth);
    const bandBottomY = isNext ? Math.min(height, foldY + bandDepth) : foldY;
    const leftOuter = -overhang;
    const rightOuter = width + overhang;
    const flapPoints = `${leftOuter},${bandTopY} ${rightOuter},${bandTopY} ${rightOuter},${bandBottomY} ${leftOuter},${bandBottomY}`;

    const shadowMargin = 14 + 26 * dragProgress;
    const shadowOuterY = isNext ? foldY - shadowMargin : foldY + shadowMargin;
    const shadowPoints = isNext
      ? `0,${foldY} ${width},${foldY} ${width},${shadowOuterY} 0,${shadowOuterY}`
      : `0,${foldY} ${width},${foldY} ${width},${shadowOuterY} 0,${shadowOuterY}`;
    const castShadowExtent = Math.max(22, bandDepth * 0.42);
    const castShadowFarY = isNext
      ? Math.min(height, bandBottomY + castShadowExtent)
      : Math.max(0, bandTopY - castShadowExtent);
    const castShadowPoints = isNext
      ? `0,${bandBottomY} ${width},${bandBottomY} ${width},${castShadowFarY} 0,${castShadowFarY}`
      : `0,${castShadowFarY} ${width},${castShadowFarY} ${width},${bandTopY} 0,${bandTopY}`;

    return (
      <Svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }} pointerEvents="none">
        <Defs>
          <LinearGradient
            id="curlShadow"
            x1={width / 2}
            y1={foldY}
            x2={width / 2}
            y2={shadowOuterY}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={colors.contentPrimary} stopOpacity={0.32} />
            <Stop offset="1" stopColor={colors.contentPrimary} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient
            id="curlCastShadow"
            x1={width / 2}
            y1={isNext ? bandBottomY : bandTopY}
            x2={width / 2}
            y2={castShadowFarY}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor={colors.contentPrimary} stopOpacity={0.24} />
            <Stop offset="0.42" stopColor={colors.contentPrimary} stopOpacity={0.1} />
            <Stop offset="1" stopColor={colors.contentPrimary} stopOpacity={0} />
          </LinearGradient>
          <LinearGradient
            id="curlFlap"
            x1={width / 2}
            y1={bandTopY}
            x2={width / 2}
            y2={bandBottomY}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="0" stopColor="white" stopOpacity={1} />
            <Stop offset="0.52" stopColor="rgb(217, 217, 217)" stopOpacity={1} />
            <Stop offset="0.8" stopColor="white" stopOpacity={1} />
            <Stop offset="1" stopColor="rgb(170, 167, 167)" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Polygon points={shadowPoints} fill="url(#curlShadow)" />
        <Polygon points={castShadowPoints} fill="url(#curlCastShadow)" />
        <Polygon points={flapPoints} fill="url(#curlFlap)" stroke={colors.borderSubtle} strokeWidth={1} />
      </Svg>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong }}>
      <AppHeader
        title="Visitor Calendar"
        titleAlign="left"
        variant="transparent"
        onBack={onBack}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={!calendarGestureActive}
          contentContainerStyle={{
            paddingHorizontal: spacing.md,
            paddingTop: 0,
            paddingBottom: spacing.xxl,
            gap: spacing.lg,
          }}
        >
          <View style={{ position: 'relative', paddingTop: spacing.xs, paddingBottom: spacing.sm, paddingHorizontal: spacing.xs }}>
            <View
              style={{
                position: 'absolute',
                top: spacing.xl,
                left: spacing.lg,
                right: spacing.lg,
                bottom: spacing.sm,
                borderRadius: radius.xl,
                backgroundColor: colors.surfaceSecondary,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
                transform: [{ rotate: '-2deg' }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: spacing.lg,
                left: spacing.md,
                right: spacing.md,
                bottom: spacing.xs,
                borderRadius: radius.xl,
                backgroundColor: colors.surfacePrimary,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
                transform: [{ rotate: '1.4deg' }],
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: spacing.sm,
                left: spacing.xs,
                right: spacing.xs,
                bottom: 0,
                borderRadius: radius.xl,
                backgroundColor: colors.surfaceSecondary,
                borderWidth: 0,
                borderColor: colors.borderSubtle,
              }}
            />
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                top: spacing.md,
                left: spacing.sm,
                right: spacing.sm,
                bottom: 0,
                borderRadius: radius.xl,
                backgroundColor: colors.contentPrimary,
                opacity: 0.12,
                shadowColor: elevation.lg.shadowColor,
                shadowOpacity: 0.22,
                shadowRadius: 12,
                shadowOffset: { width: 2, height: 4 },
                elevation: 10,
              }}
            />

            <View
              style={{
                borderRadius: radius.xl,
                shadowColor: elevation.lg.shadowColor,
                shadowOpacity: 0.18,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
                elevation: 14,
                backgroundColor: colors.surfacePrimary,
              }}
            >
              <View
                style={{
                  borderRadius: radius.xl,
                  backgroundColor: colors.surfacePrimary,
                  borderWidth: 1,
                  borderColor: colors.borderDefault,
                  overflow: 'hidden',
                }}
              >
              {/* A fixed-height stack of 3 layers, back to front:
                  1. next/prev month card (bottom, always there)
                  2. current month card, clipped as it curls (middle)
                  3. the curl overlay itself (top) */}
              <View
                {...(sheetMode === 'peek' ? calendarPanResponder.panHandlers : {})}
                onTouchStart={handleCalendarTouchStart}
                onTouchEnd={handleCalendarTouchEnd}
                onTouchCancel={handleCalendarTouchEnd}
                onLayout={(evt) => {
                  setCardWidth(evt.nativeEvent.layout.width);
                }}
                style={{ height: calendarPageHeight, position: 'relative', overflow: 'hidden' }}
              >
                {sheetMode === 'peek' ? (
                  <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, zIndex: 0 }}>
                    {renderCalendarPage(previewMonth, previewWeeks, previewSelectedDate, false)}
                  </View>
                ) : null}

                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: dragProgress <= 0.001 ? 0 : anchorSide === 'right' ? 0 : Math.min(calendarPageHeight, reachY),
                    height:
                      dragProgress <= 0.001
                        ? calendarPageHeight
                        : Math.max(0, calendarPageHeight - reachY),
                    overflow: 'hidden',
                    zIndex: 1,
                  }}
                >
                  <View
                    style={{
                      marginTop: dragProgress <= 0.001 ? 0 : anchorSide === 'right' ? 0 : -Math.min(calendarPageHeight, reachY),
                    }}
                  >
                    {renderCalendarPage(visibleMonth, weeksToRender, selectedDate, true)}
                  </View>
                </View>

                {sheetMode === 'peek' ? (
                  <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, zIndex: 2 }}>
                    {renderCurlPolygon()}
                  </View>
                ) : null}
              </View>
              </View>
            </View>
          </View>

          <View
            style={{
              gap: spacing.md,
              // backgroundColor: colors.surfacePageStrong,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <View>
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary, letterSpacing: 1.2 }]}>ACTIVE DATE</Text>
                <Text style={[typography.titleSubsection, { color: colors.contentPrimary }]}>
                  {selectedDate.getDate()} {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </Text>
              </View>
              <Pressable
                onPress={() => setSheetMode(sheetMode === 'full' ? 'peek' : 'full')}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.xs,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.sm,
                  borderRadius: radius.pill,
                  backgroundColor: colors.surfaceSecondary,
                }}
              >
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>
                  {sheetMode === 'full' ? 'Month view' : 'Week focus'}
                </Text>
              </Pressable>
            </View>

            {activeEvents.length > 0 ? (
              <View style={{ gap: spacing.md }}>
                {activeEvents.map((event) => (
                  <View
                    key={event.id}
                    style={{
                      borderRadius: radius.xl,
                      padding: spacing.lg,
                      backgroundColor: colors.surfacePage,
                      borderWidth: 1,
                      borderColor: colors.borderSubtle,
                      gap: spacing.md,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                      <View style={{ width: 12, height: 44, borderRadius: radius.pill, backgroundColor: eventToneColor(event.tone) }} />
                      <View style={{ flex: 1 }}>
                        <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>{event.title}</Text>
                        <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>{event.host}</Text>
                      </View>
                    </View>

                    <View style={{ gap: spacing.sm }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Clock size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                        <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>{event.time}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <MapPin size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                        <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>{event.location}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                        <Users size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                        <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>Expected via visitor lane and resident lobby.</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View
                style={{
                  borderRadius: radius.xl,
                  padding: spacing.lg,
                  backgroundColor: colors.surfacePage,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                  gap: spacing.md,
                  justifyContent: 'center',
                }}
              >
                <CalendarBlank size={iconSize.lg} color={colors.contentTertiary} weight="regular" />
                <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>No events pinned to this date</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
                  Swipe back to the month, or choose a dot-marked day to see scheduled visitor activity.
                </Text>
              </View>
            )}

          </View>
        </ScrollView>
      </View>

      <Modal transparent visible={pickerOpen} animationType="fade" onRequestClose={() => setPickerOpen(false)}>
        <Pressable
          onPress={() => setPickerOpen(false)}
          style={{
            flex: 1,
            backgroundColor: 'rgba(15, 23, 42, 0.24)',
            justifyContent: 'center',
            padding: spacing.lg,
          }}
        >
          <Pressable
            onPress={() => {}}
            style={{
              borderRadius: radius.xxl,
              backgroundColor: colors.surfacePrimary,
              padding: spacing.lg,
              gap: spacing.lg,
              borderWidth: 1,
              borderColor: colors.borderSubtle,
            }}
          >
            <Text style={[typography.titleSubsection, { color: colors.contentPrimary }]}>Choose month and year</Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {monthNames.map((monthName, monthIndex) => {
                const isActive = monthIndex === visibleMonth.getMonth();
                return (
                  <Pressable
                    key={monthName}
                    onPress={() => {
                      const next = new Date(visibleMonth.getFullYear(), monthIndex, 1);
                      setPickerOpen(false);
                      runMonthFlip(next, monthIndex > visibleMonth.getMonth() ? 'next' : 'prev');
                    }}
                    style={{
                      width: '30%',
                      borderRadius: radius.lg,
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      backgroundColor: isActive ? colors.surfaceActionPrimary : colors.surfaceSecondary,
                    }}
                  >
                    <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentOnDark : colors.contentPrimary }]}>
                      {monthName.slice(0, 3)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.sm }}>
              {yearOptions.map((year) => {
                const isActive = year === visibleMonth.getFullYear();
                return (
                  <Pressable
                    key={year}
                    onPress={() => {
                      const next = new Date(year, visibleMonth.getMonth(), 1);
                      setPickerOpen(false);
                      runMonthFlip(next, year > visibleMonth.getFullYear() ? 'next' : 'prev');
                    }}
                    style={{
                      flex: 1,
                      borderRadius: radius.lg,
                      paddingVertical: spacing.sm,
                      alignItems: 'center',
                      backgroundColor: isActive ? colors.surfaceActionPrimary : colors.surfaceSecondary,
                    }}
                  >
                    <Text style={[typography.bodyDefaultBold, { color: isActive ? colors.contentOnDark : colors.contentPrimary }]}>{year}</Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
