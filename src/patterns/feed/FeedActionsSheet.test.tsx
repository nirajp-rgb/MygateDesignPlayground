import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';
import { radius } from '../../tokens';
import { FeedActionsSheet } from './FeedActionsSheet';
import { FeedCard } from './FeedCards';

describe('feed actions', () => {
  it('opens from a feed card more-action callback', () => {
    const onMorePress = jest.fn();
    const view = render(
      <FeedCard
        authorArtwork={<View />}
        authorName="Sunil Bhadouriya"
        subline="B 102"
        onMorePress={onMorePress}
      >
        <Text>Post content</Text>
      </FeedCard>,
    );

    fireEvent.press(view.getByLabelText('More actions for Sunil Bhadouriya'));

    expect(onMorePress).toHaveBeenCalledTimes(1);
  });

  it('runs a sheet action and dismisses the sheet', async () => {
    const reduceMotion = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const onDismiss = jest.fn();
    const onViewProfile = jest.fn();
    const view = render(
      <FeedActionsSheet
        visible
        onDismiss={onDismiss}
        onViewProfile={onViewProfile}
      />,
    );

    expect(view.getByText('Report Post')).toBeTruthy();
    expect(view.getByText('Block User')).toBeTruthy();
    await waitFor(() => expect(reduceMotion).toHaveBeenCalled());
    fireEvent.press(view.getByText('View Profile'));

    expect(onViewProfile).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    reduceMotion.mockRestore();
  });

  it('clips the visible sheet surface to rounded top corners', async () => {
    const reduceMotion = jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const view = render(<FeedActionsSheet visible onDismiss={jest.fn()} />);
    await waitFor(() => expect(reduceMotion).toHaveBeenCalled());
    const clippingSurface = view.UNSAFE_getAllByType(View).find((node) => {
      const style = StyleSheet.flatten(node.props.style);
      return style?.overflow === 'hidden' && style?.borderTopLeftRadius === radius.xl;
    });

    expect(clippingSurface).toBeTruthy();
    expect(StyleSheet.flatten(clippingSurface?.props.style)).toMatchObject({
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      overflow: 'hidden',
    });
    reduceMotion.mockRestore();
  });
});
