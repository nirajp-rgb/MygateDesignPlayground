import { fireEvent, render } from '@testing-library/react-native';
import { NotificationSettingsScreen } from './NotificationSettingsScreen';

describe('NotificationSettingsScreen', () => {
  it('renders the notification controls and toggles approval notifications', () => {
    const view = render(<NotificationSettingsScreen />);
    const switches = view.getAllByRole('switch');

    expect(view.getByText('Notification settings')).toBeTruthy();
    expect(switches[0].props.accessibilityState.checked).toBe(false);

    fireEvent.press(switches[0]);

    expect(view.getAllByRole('switch')[0].props.accessibilityState.checked).toBe(true);
  });

  it('delegates Back immediately to its presentation owner', () => {
    const onBack = jest.fn();
    const view = render(<NotificationSettingsScreen onBack={onBack} />);

    fireEvent.press(view.getByLabelText('Go back'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('opens approval notification settings from the summary row', () => {
    const onOpenApprovalNotifications = jest.fn();
    const view = render(
      <NotificationSettingsScreen onOpenApprovalNotifications={onOpenApprovalNotifications} />,
    );

    fireEvent.press(view.getAllByText('Approval Notification')[0]);

    expect(onOpenApprovalNotifications).toHaveBeenCalledTimes(1);
  });

  it('opens entry and exit notification settings from the summary card', () => {
    const onOpenEntryExitNotifications = jest.fn();
    const view = render(
      <NotificationSettingsScreen onOpenEntryExitNotifications={onOpenEntryExitNotifications} />,
    );

    fireEvent.press(view.getByText('Entry/Exit Notification'));

    expect(onOpenEntryExitNotifications).toHaveBeenCalledTimes(1);
  });
});
