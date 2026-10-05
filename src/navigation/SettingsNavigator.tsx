import type { ImageSourcePropType } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ApprovalNotificationScreen, EntryExitNotificationsScreen, NotificationSettingsScreen, SettingsScreen } from '../screens';
import type { Mode } from '../tokens/color';

type SettingsStackParamList = {
  SettingsHome: undefined;
  NotificationSettings: undefined;
  ApprovalNotification: undefined;
  EntryExitNotifications: undefined;
};

type SettingsNavigatorProps = {
  onBack: () => void;
  themeMode: Mode;
  onToggleTheme: () => void;
  profilePhotoSource?: ImageSourcePropType;
  onOpenFaceCapture: () => void;
  onOpenFamily: () => void;
};

const Stack = createNativeStackNavigator<SettingsStackParamList>();

export function SettingsNavigator({
  onBack,
  themeMode,
  onToggleTheme,
  profilePhotoSource,
  onOpenFaceCapture,
  onOpenFamily,
}: SettingsNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SettingsHome"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="SettingsHome">
          {({ navigation }) => (
            <SettingsScreen
              onBack={onBack}
              themeMode={themeMode}
              onToggleTheme={onToggleTheme}
              profilePhotoSource={profilePhotoSource}
              onOpenFaceCapture={onOpenFaceCapture}
              onOpenFamily={onOpenFamily}
              onOpenNotificationSettings={() => navigation.navigate('NotificationSettings')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="NotificationSettings">
          {({ navigation }) => (
            <NotificationSettingsScreen
              onBack={() => navigation.goBack()}
              onOpenApprovalNotifications={() => navigation.navigate('ApprovalNotification')}
              onOpenEntryExitNotifications={() => navigation.navigate('EntryExitNotifications')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="ApprovalNotification">
          {({ navigation }) => (
            <ApprovalNotificationScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
        <Stack.Screen name="EntryExitNotifications">
          {({ navigation }) => (
            <EntryExitNotificationsScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
