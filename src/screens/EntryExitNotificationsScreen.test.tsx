import { fireEvent, render } from '@testing-library/react-native';
import { EntryExitNotificationsScreen } from './EntryExitNotificationsScreen';

describe('EntryExitNotificationsScreen', () => {
  it('enables category controls from the master switch', () => {
    const view = render(<EntryExitNotificationsScreen />);
    const switches = view.getAllByRole('switch');

    expect(view.getByText('Entry/Exit Notifications')).toBeTruthy();
    expect(switches).toHaveLength(7);
    expect(switches[0].props.accessibilityState.checked).toBe(false);
    expect(switches[1].props.accessibilityState.disabled).toBe(true);

    fireEvent.press(switches[0]);

    const enabledSwitches = view.getAllByRole('switch');
    expect(enabledSwitches[0].props.accessibilityState.checked).toBe(true);
    expect(enabledSwitches[1].props.accessibilityState.disabled).toBe(false);

    fireEvent.press(enabledSwitches[1]);
    expect(view.getAllByRole('switch')[1].props.accessibilityState.checked).toBe(true);
  });

  it('delegates Back to the native stack', () => {
    const onBack = jest.fn();
    const view = render(<EntryExitNotificationsScreen onBack={onBack} />);

    fireEvent.press(view.getByLabelText('Go back'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});
