import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  DeviceMobileIcon,
  Lightbulb,
  MusicNote,
  PencilSimpleIcon,
  PhoneCall,
  PhoneDisconnectIcon,
  QuestionIcon,
  Warning,
} from 'phosphor-react-native';
import { AppHeader, IconButton, IconTile, SurfaceCard, Switch } from '../components';
import { appPagePaddingBottom, colors, iconSize, radius, spacing, typography } from '../tokens';

type ApprovalNotificationScreenProps = {
  onBack?: () => void;
};

export function ApprovalNotificationScreen({ onBack }: ApprovalNotificationScreenProps) {
  const [enabled, setEnabled] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingBottom: appPagePaddingBottom }}>
      <AppHeader
        title="Approval Notification"
        variant="solid"
        onBack={onBack}
        rightSlot={<IconButton type="Ghost" size="MD" icon={QuestionIcon} accessibilityLabel="About approval notifications" />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.md, padding: spacing.md, paddingBottom: spacing.xxl }}
      >
        <SurfaceCard borderWidth={0}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
            <View style={{ flex: 1, gap: spacing.xs }}>
              <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>Approval Notification</Text>
              <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>
                Receive Approval notifications and IVR call when an uninvited guest is at the gate.
              </Text>
            </View>
            <Switch value={enabled ? 'on' : 'off'} onPress={() => setEnabled((current) => !current)} />
          </View>

          {!enabled ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.sm,
                padding: spacing.md,
                borderRadius: radius.md,
                backgroundColor: colors.surfaceNegativeSubtle,
              }}
            >
              <Warning size={iconSize.md} color={colors.contentNegative} weight="regular" />
              <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentNegative }]}>
                You will not receive any visitor approval alerts or IVR call unless this setting is turned ON.
              </Text>
            </View>
          ) : null}
        </SurfaceCard>

        <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary, textAlign: 'center', paddingVertical: spacing.xs }]}>
          How it works
        </Text>

        <SurfaceCard borderWidth={0} style={{ gap: 0 }}>
          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ width: 54, alignItems: 'center' }}>
              <IconTile icon={DeviceMobileIcon} iconColor={colors.contentAction} iconSize={iconSize.lg} cornerRadius={radius.pill} tileSize={54} />
              <View style={{ width: 2, flex: 1, minHeight: spacing.xl,marginVertical: spacing.sm, backgroundColor: colors.borderDefault }} />
            </View>
            <View style={{ flex: 1, gap: spacing.md, paddingBottom: spacing.xl }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>App Notification</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}> 
                  Every member registered on the flat gets an instant alert to approve or deny the visitor.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 40 }}>
                <MusicNote size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentPrimary }]}>Notification Sound</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Muted</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ width: 54, alignItems: 'center' }}>
              <IconTile icon={PhoneCall} iconColor={colors.contentAction} iconSize={iconSize.lg} cornerRadius={radius.pill} tileSize={54} />
              <View style={{ width: 2, flex: 1, minHeight: spacing.xl,marginVertical: spacing.sm, backgroundColor: colors.borderDefault }} />
            </View>
            <View style={{ flex: 1, gap: spacing.md, paddingBottom: spacing.xl }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>IVR Call</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}> 
                  If nobody responds to the notification, a phone call will be triggered on the number below.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 40 }}>
                <PhoneCall size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentPrimary }]}>Primary number</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentPrimary }]}>7488482819</Text>
                <PencilSimpleIcon size={iconSize.sm} color={colors.contentAction} weight="bold" />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.md }}>
            <View style={{ width: 54, alignItems: 'center' }}>
              <IconTile icon={PhoneDisconnectIcon} iconColor={colors.contentAction} iconSize={iconSize.lg} cornerRadius={radius.pill} tileSize={54} />
            </View>
            <View style={{ flex: 1, gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>Security guard</Text>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}> 
                  If the call goes unanswered, the guard will seek alternative methods to contact you, such as reaching out through your home intercom.
                </Text>
              </View>
            </View>
          </View>
        </SurfaceCard>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: spacing.sm,
                  padding: spacing.md,
                  borderRadius: radius.lg,
                  backgroundColor: colors.surfaceInfoSubtle,
                }}
              >
                <Lightbulb size={iconSize.md} color={colors.contentInfo} weight="regular" />
                <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentInfo }]}> 
                  Pre-approve expected visitors to skip these steps and give them seamless entry.
                </Text>
              </View>
      </ScrollView>
    </View>
  );
}
