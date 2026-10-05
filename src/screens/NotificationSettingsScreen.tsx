import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import {
  Bell,
  CaretRight,
  MusicNote,
  PhoneCall,
  QuestionIcon,
  Warning,
} from 'phosphor-react-native';
import { AppHeader, IconButton, ListItem, SurfaceCard, Switch } from '../components';
import { appPagePaddingBottom, colors, iconSize, spacing, typography } from '../tokens';

type NotificationSettingsScreenProps = {
  onBack?: () => void;
  onOpenApprovalNotifications?: () => void;
  onOpenEntryExitNotifications?: () => void;
};

type ToggleKey = 'payments' | 'helpdesk' | 'amenities' | 'whatsapp' | 'smartDevices';

const notificationRows: Array<{ key: ToggleKey; label: string; description: string }> = [
  {
    key: 'payments',
    label: 'Payments',
    description: 'Receive UPI, rent, maintenance and other payment notifications.',
  },
  {
    key: 'helpdesk',
    label: 'Helpdesk',
    description: 'Receive updates and responses on Helpdesk tickets.',
  },
  {
    key: 'amenities',
    label: 'Amenities',
    description: 'Receive alerts and reservation notifications for amenities.',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp Messages',
    description: 'Receive important Mygate updates and alerts on WhatsApp.',
  },
  {
    key: 'smartDevices',
    label: 'Smart Devices',
    description: 'Receive notifications for all Mygate smart devices.',
  },
];

export function NotificationSettingsScreen({ onBack, onOpenApprovalNotifications, onOpenEntryExitNotifications }: NotificationSettingsScreenProps) {
  const [approvalNotifications, setApprovalNotifications] = useState(false);
  const [enabled, setEnabled] = useState<Record<ToggleKey, boolean>>({
    payments: true,
    helpdesk: true,
    amenities: true,
    whatsapp: true,
    smartDevices: true,
  });

  const toggle = (key: ToggleKey) => {
    setEnabled((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingBottom: appPagePaddingBottom }}>
      <AppHeader
        title="Notification settings"
        variant="solid"
        onBack={onBack}
        rightSlot={<IconButton type="Ghost" size="MD" icon={QuestionIcon} accessibilityLabel="About notification settings" />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.sm, padding: spacing.md, paddingBottom: spacing.xxl }}
      >
        <SurfaceCard borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
          <ListItem
            label="Approval Notification"
            titleWeight="bold"
            paragraph="Get notified for all approval notifications."
            onPress={onOpenApprovalNotifications}
            rightSlot={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>OFF</Text>
                <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
              </View>
            }
            divider
          />
          <ListItem
            label="Approval Notification"
            titleWeight="regular"
            artwork="Small"
            size="Compact"
            leadingArtwork={<Bell size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            rightSlot={
              <Switch
                value={approvalNotifications ? 'on' : 'off'}
                onPress={() => setApprovalNotifications((current) => !current)}
              />
            }
            
          />
          <ListItem
            label="Notification Sound"
            titleWeight="regular"
            artwork="Small"
            size="Compact"
            leadingArtwork={<MusicNote size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            trailingLabel="Muted"
            layout="Label trailing"
            controlElement={null}
          />
          <ListItem
            label="IVR Calls"
            titleWeight="regular"
            artwork="Small"
            size="Compact"
            leadingArtwork={<PhoneCall size={iconSize.md} color={colors.contentSecondary} weight="regular" />}
            trailingLabel="All selected"
            layout="Label trailing"
            controlElement={null}
          />
          {!approvalNotifications ? (
            <View style={{ padding: spacing.md, paddingTop: 0 }}>
              <SurfaceCard borderWidth={0} style={{ backgroundColor: colors.surfaceNegativeSubtle }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                  <Warning size={iconSize.md} color={colors.contentNegative} weight="regular" />
                  <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentNegative }]}>
                    You will not receive any visitor approval alerts if notification settings are turned off.
                  </Text>
                </View>
              </SurfaceCard>
            </View>
          ) : null}
        </SurfaceCard>

        <SurfaceCard borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
          <ListItem
            label="Entry/Exit Notification"
            titleWeight="bold"
            paragraph="View entry and exit notifications for daily help, guests, and service providers."
            onPress={onOpenEntryExitNotifications}
            rightSlot={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>OFF</Text>
                <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
              </View>
            }
          />
        </SurfaceCard>

        <SurfaceCard borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
          <ListItem
            label="Social Feed"
            titleWeight="bold"
            paragraph="Receive notifications for new posts, comments, reactions, and other activity in Mygate."
            rightSlot={
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>OFF</Text>
                <CaretRight size={iconSize.sm} color={colors.contentTertiary} weight="regular" />
              </View>
            }
          />
        </SurfaceCard>

        {notificationRows.map((row) => (
          <SurfaceCard key={row.key} borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
            <ListItem
              label={row.label}
              titleWeight="bold"
              paragraph={row.description}
              rightSlot={
                <Switch value={enabled[row.key] ? 'on' : 'off'} onPress={() => toggle(row.key)} />
              }
            />
          </SurfaceCard>
        ))}

        <SurfaceCard borderWidth={0}>
          <View style={{ gap: spacing.xs }}>
            <Text style={typography.bodyDefaultBold}>Not receiving push notifications?</Text>
            <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
              Please check your phone settings and enable notifications. Sometimes we may send fewer or delayed
              notifications on a weak network.{' '}
              <Text style={[typography.bodySmallBold, { color: colors.contentAction, textDecorationLine: 'underline' }]}>
                Check your device settings
              </Text>
            </Text>
          </View>
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}
