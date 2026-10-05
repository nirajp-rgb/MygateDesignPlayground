import { View } from 'react-native';
import { ChatCircleDots, User, UserMinus } from 'phosphor-react-native';
import { ListItem, ModalSheet } from '../../components';
import { colors, iconSize, radius, spacing } from '../../tokens';

type FeedActionsSheetProps = {
  visible: boolean;
  onDismiss: () => void;
  onViewProfile?: () => void;
  onReportPost?: () => void;
  onBlockUser?: () => void;
};

export function FeedActionsSheet({
  visible,
  onDismiss,
  onViewProfile,
  onReportPost,
  onBlockUser,
}: FeedActionsSheetProps) {
  const runAction = (dismiss: () => void, action?: () => void) => {
    action?.();
    dismiss();
  };

  return (
    <ModalSheet visible={visible} presentation="bottom" onDismiss={onDismiss}>
      {(dismiss) => (
        <>
      <View style={{ alignItems: 'center', paddingTop: spacing.md, paddingBottom: spacing.sm }}>
        <View
          style={{
            width: spacing['4xl'],
            height: spacing.xs,
            borderRadius: radius.pill,
            backgroundColor: colors.surfaceTertiary,
          }}
        />
      </View>
      
      <View style={{ paddingHorizontal: spacing.md }}>
        <ListItem
          label="View Profile"
          artwork="Small"
          size="Large"
          iconBacking
          divider
          leadingArtwork={<User size={iconSize.md} color={colors.contentPrimary} weight="regular" />}
          controlElement={null}
          onPress={() => runAction(dismiss, onViewProfile)}
        />
      </View>
      <View style={{ paddingHorizontal: spacing.md }}>
        <ListItem
          label="Report Post"
          size="Large"
          artwork="Small"
          surface="transparent"
          divider
          iconBacking
          leadingArtwork={<ChatCircleDots size={iconSize.md} color={colors.contentPrimary} weight="regular" />}
          controlElement={null}
          onPress={() => runAction(dismiss, onReportPost)}
        />
      </View>
      {/* <View style={{ height: 1, backgroundColor: colors.borderSubtle }} /> */}
      <View style={{ paddingHorizontal: spacing.md }}>
        <ListItem
          size="Large"
          label="Block User"
          artwork="Small"
          iconBacking
          leadingArtwork={<UserMinus size={iconSize.md} color={colors.contentPrimary} weight="regular" />}
          controlElement={null}
          onPress={() => runAction(dismiss, onBlockUser)}
        />
      </View>
      <View style={{ height: spacing['4xl'] }} />
        </>
      )}
    </ModalSheet>
  );
}
