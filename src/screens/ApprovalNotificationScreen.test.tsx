import { fireEvent, render } from '@testing-library/react-native';
import { ApprovalNotificationScreen } from './ApprovalNotificationScreen';

describe('ApprovalNotificationScreen', () => {
  it('shows the approval flow and updates its master notification state', () => {
    const view = render(<ApprovalNotificationScreen />);
    const toggle = view.getByRole('switch');

    expect(view.getByText('How it works')).toBeTruthy();
    expect(view.getByText('App Notification')).toBeTruthy();
    expect(view.getByText('IVR Call')).toBeTruthy();
    expect(view.getByText('Security guard')).toBeTruthy();
    expect(toggle.props.accessibilityState.checked).toBe(false);
    expect(view.getByText(/You will not receive any visitor approval alerts/)).toBeTruthy();

    fireEvent.press(toggle);

    expect(view.getByRole('switch').props.accessibilityState.checked).toBe(true);
    expect(view.queryByText(/You will not receive any visitor approval alerts/)).toBeNull();
  });

  it('delegates Back to the native stack', () => {
    const onBack = jest.fn();
    const view = render(<ApprovalNotificationScreen onBack={onBack} />);

    fireEvent.press(view.getByLabelText('Go back'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
