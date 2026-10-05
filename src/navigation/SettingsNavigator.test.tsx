import { fireEvent, render } from '@testing-library/react-native';
import { SettingsNavigator } from './SettingsNavigator';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Text: NativeText, View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');

  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children, initialRouteName, screenOptions }: { children: React.ReactNode; initialRouteName: string; screenOptions: { gestureEnabled?: boolean } }) => {
        const [routes, setRoutes] = React.useState([initialRouteName]);
        const route = routes[routes.length - 1];
        const screens = React.Children.toArray(children) as React.ReactElement<{ name: string; children: (props: { navigation: { navigate: (name: string) => void; goBack: () => void } }) => React.ReactNode }>[];
        const activeScreen = screens.find((screen) => screen.props.name === route);
        const navigation = {
          navigate: (name: string) => setRoutes((current: string[]) => [...current, name]),
          goBack: () => setRoutes((current: string[]) => current.length > 1 ? current.slice(0, -1) : current),
        };

        return React.createElement(
          NativeView,
          null,
          React.createElement(NativeText, { accessibilityLabel: 'Native stack gestures' }, String(screenOptions.gestureEnabled)),
          activeScreen?.props.children({ navigation }),
        );
      },
      Screen: () => null,
    }),
  };
});

jest.mock('../screens', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable: NativePressable, Text: NativeText, View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');
  const action = (label: string, onPress: () => void) => React.createElement(NativePressable, { onPress }, React.createElement(NativeText, null, label));
  return {
    SettingsScreen: (props: { onOpenNotificationSettings: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Settings'), action('Open notifications', props.onOpenNotificationSettings)),
    NotificationSettingsScreen: (props: { onBack: () => void; onOpenApprovalNotifications: () => void; onOpenEntryExitNotifications: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Notification settings'), action('Open approval notifications', props.onOpenApprovalNotifications), action('Open entry exit notifications', props.onOpenEntryExitNotifications), action('Notification back', props.onBack)),
    ApprovalNotificationScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Approval notification'), action('Approval back', props.onBack)),
    EntryExitNotificationsScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Entry exit notifications'), action('Entry exit back', props.onBack)),
  };
});

describe('SettingsNavigator', () => {
  it('uses native stack gestures and pushes notification settings', () => {
    const view = render(
      <SettingsNavigator
        onBack={jest.fn()}
        themeMode="light"
        onToggleTheme={jest.fn()}
        onOpenFaceCapture={jest.fn()}
        onOpenFamily={jest.fn()}
      />,
    );

    expect(view.getByLabelText('Native stack gestures').props.children).toBe('true');
    fireEvent.press(view.getByText('Open notifications'));
    expect(view.getByText('Notification settings')).toBeTruthy();
    fireEvent.press(view.getByText('Open approval notifications'));
    expect(view.getByText('Approval notification')).toBeTruthy();
    fireEvent.press(view.getByText('Approval back'));
    expect(view.getByText('Notification settings')).toBeTruthy();
    fireEvent.press(view.getByText('Open entry exit notifications'));
    expect(view.getByText('Entry exit notifications')).toBeTruthy();
    fireEvent.press(view.getByText('Entry exit back'));
    expect(view.getByText('Notification settings')).toBeTruthy();
    fireEvent.press(view.getByText('Notification back'));
    expect(view.getByText('Settings')).toBeTruthy();
  });
});
