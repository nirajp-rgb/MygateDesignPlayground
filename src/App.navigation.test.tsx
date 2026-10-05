import { fireEvent, render } from '@testing-library/react-native';
import App from '../App';

jest.mock('@expo-google-fonts/archivo', () => ({
  Archivo_400Regular: {},
  Archivo_600SemiBold: {},
  useFonts: () => [true],
}));
jest.mock('expo-status-bar', () => ({ StatusBar: () => null }));

jest.mock('./navigation', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable: NativePressable, Text: NativeText, View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    SettingsNavigator: (props: { onBack: () => void; onOpenFaceCapture: () => void; onOpenFamily: () => void }) => {
      const [showNotifications, setShowNotifications] = React.useState(false);
      const action = (label: string, onPress: () => void) => React.createElement(NativePressable, { onPress }, React.createElement(NativeText, null, label));
      return showNotifications
        ? React.createElement(NativeView, null, React.createElement(NativeText, null, 'Notification Settings'), action('Notification settings back', () => setShowNotifications(false)))
        : React.createElement(NativeView, null, React.createElement(NativeText, null, 'Settings'), action('Open family', props.onOpenFamily), action('Open notifications', () => setShowNotifications(true)), action('Open camera', props.onOpenFaceCapture), action('Settings back', props.onBack));
    },
  };
});

jest.mock('./screens', () => {
  const React = jest.requireActual<typeof import('react')>('react');
  const { Pressable: NativePressable, Text: NativeText, View: NativeView } = jest.requireActual<typeof import('react-native')>('react-native');
  const action = (label: string, onPress: () => void) => React.createElement(NativePressable, { onPress }, React.createElement(NativeText, null, label));
  return {
    AppHomeScreen: (props: { onNavigate: (key: string) => void; onOpenVisitorCalendar: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'App Home'), action('Open settings', () => props.onNavigate('settings')), action('Open marketplace', () => props.onNavigate('marketplace')), action('Open search', () => props.onNavigate('searchExperience')), action('Open calendar', props.onOpenVisitorCalendar)),
    SettingsScreen: (props: { onBack: () => void; onOpenFaceCapture: () => void; onOpenFamily: () => void; onOpenNotificationSettings: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Settings'), action('Open family', props.onOpenFamily), action('Open notifications', props.onOpenNotificationSettings), action('Open camera', props.onOpenFaceCapture), action('Settings back', props.onBack)),
    NotificationSettingsScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Notification Settings'), action('Notification settings back', props.onBack)),
    FamilyScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Family'), action('Family back', props.onBack)),
    MarketplaceScreen: (props: { onNavigate: (key: string) => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Marketplace'), action('Create listing', () => props.onNavigate('listingWizard'))),
    ListingWizardScreen: (props: { onExit: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Listing Wizard'), action('Exit listing', props.onExit)),
    SearchExperienceScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Search'), action('Search back', props.onBack)),
    FaceCaptureScreen: (props: { onSubmit: (uri: string) => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Face Capture'), action('Submit photo', () => props.onSubmit('photo://profile'))),
    VisitorCalendarScreen: (props: { onBack: () => void }) => React.createElement(NativeView, null, React.createElement(NativeText, null, 'Calendar'), action('Calendar back', props.onBack)),
    DailyHelpProfileScreen: () => React.createElement(NativeText, null, 'Daily Help'),
    HomeScreen: () => React.createElement(NativeText, null, 'Home'),
    QuickActionsScreen: () => React.createElement(NativeText, null, 'Quick Actions'),
    TemplateScreen: () => React.createElement(NativeText, null, 'Template'),
  };
});

describe('application navigation regression', () => {
  it('preserves settings, family, and camera routes', () => {
    const view = render(<App />);
    fireEvent.press(view.getByText('Open settings'));
    fireEvent.press(view.getByText('Open family'));
    fireEvent.press(view.getByText('Family back'));
    fireEvent.press(view.getByText('Open camera'));
    fireEvent.press(view.getByText('Submit photo'));
    expect(view.getByText('Settings')).toBeTruthy();
  });

  it('opens notification settings and returns to settings', () => {
    const view = render(<App />);
    fireEvent.press(view.getByText('Open settings'));
    fireEvent.press(view.getByText('Open notifications'));
    fireEvent.press(view.getByText('Notification settings back'));
    expect(view.getByText('Settings')).toBeTruthy();
  });

  it('preserves marketplace and listing routes', () => {
    const view = render(<App />);
    fireEvent.press(view.getByText('Open marketplace'));
    fireEvent.press(view.getByText('Create listing'));
    fireEvent.press(view.getByText('Exit listing'));
    expect(view.getByText('Marketplace')).toBeTruthy();
  });

  it('returns from search and calendar to the initiating screen', () => {
    const view = render(<App />);
    fireEvent.press(view.getByText('Open search'));
    fireEvent.press(view.getByText('Search back'));
    fireEvent.press(view.getByText('Open calendar'));
    fireEvent.press(view.getByText('Calendar back'));
    expect(view.getByText('App Home')).toBeTruthy();
  });
});
