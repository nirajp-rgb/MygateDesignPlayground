import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { QuestionIcon, SignIn, SignOut } from 'phosphor-react-native';
import { AppHeader, IconButton, ListItem, SurfaceCard, Switch } from '../components';
import { appPagePaddingBottom, colors, iconSize, spacing, typography } from '../tokens';

type EntryExitNotificationsScreenProps = {
  onBack?: () => void;
};

type NotificationKey =
  | 'dailyHelpEntry'
  | 'dailyHelpExit'
  | 'guestEntry'
  | 'guestExit'
  | 'deliveryEntry'
  | 'deliveryExit';

const groups: Array<{
  title: string;
  rows: Array<{ key: NotificationKey; label: string; direction: 'entry' | 'exit' }>;
}> = [
  {
    title: 'Daily Helps',
    rows: [
      { key: 'dailyHelpEntry', label: 'Notify on Entry', direction: 'entry' },
      { key: 'dailyHelpExit', label: 'Notify on Exit', direction: 'exit' },
    ],
  },
  {
    title: 'Your Guests',
    rows: [
      { key: 'guestEntry', label: 'Notify on Entry', direction: 'entry' },
      { key: 'guestExit', label: 'Notify on Exit', direction: 'exit' },
    ],
  },
  {
    title: 'Delivery, Cabs and others',
    rows: [
      { key: 'deliveryEntry', label: 'Notify on Entry', direction: 'entry' },
      { key: 'deliveryExit', label: 'Notify on Exit', direction: 'exit' },
    ],
  },
];

export function EntryExitNotificationsScreen({ onBack }: EntryExitNotificationsScreenProps) {
  const [enabled, setEnabled] = useState(false);
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    dailyHelpEntry: false,
    dailyHelpExit: false,
    guestEntry: false,
    guestExit: false,
    deliveryEntry: false,
    deliveryExit: false,
  });

  const toggleNotification = (key: NotificationKey) => {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePageStrong, paddingBottom: appPagePaddingBottom }}>
      <AppHeader
        title="Entry/Exit Notifications"
        variant="solid"
        onBack={onBack}
        rightSlot={<IconButton type="Ghost" size="MD" icon={QuestionIcon} accessibilityLabel="About entry and exit notifications" />}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xxl }}
      >
        <SurfaceCard borderWidth={0} style={{ padding: 0, overflow: 'hidden' }}>
          <ListItem
            label="Entry/Exit Notification"
            titleWeight="bold"
            labelStyle={typography.bodyDefaultBold}
            paragraph="Entry and Exit notifications for different categories can be turned ON or OFF"
            rightSlot={<Switch value={enabled ? 'on' : 'off'} onPress={() => setEnabled((current) => !current)} />}
          />

          {groups.map((group) => (
            <View
              key={group.title}
              style={{
                borderTopWidth: 1,
                borderTopColor: colors.borderSubtle,
                paddingVertical: spacing.md,
              }}
            >
              <Text
                style={[
                  typography.bodyDefaultBold,
                  {
                    color: enabled ? colors.contentSecondary : colors.contentDisabled,
                    paddingHorizontal: spacing.lg,
                    paddingBottom: spacing.xs,
                  },
                ]}
              >
                {group.title}
              </Text>

              {group.rows.map((row) => {
                const DirectionIcon = row.direction === 'entry' ? SignIn : SignOut;
                const contentColor = enabled ? colors.contentSecondary : colors.contentDisabled;
                return (
                  <ListItem
                    key={row.key}
                    label={row.label}
                    size="Compact"
                    artwork="Small"
                    surface="transparent"
                    labelColor={contentColor}
                    leadingArtwork={<DirectionIcon size={iconSize.md} color={contentColor} weight="regular" />}
                    rightSlot={
                      <Switch
                        value={notifications[row.key] ? 'on' : 'off'}
                        state={enabled ? 'Default' : 'Disabled'}
                        onPress={() => toggleNotification(row.key)}
                      />
                    }
                  />
                );
              })}
            </View>
          ))}
        </SurfaceCard>
      </ScrollView>
    </View>
  );
}
