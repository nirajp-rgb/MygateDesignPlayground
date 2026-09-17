import { fireEvent, render } from '@testing-library/react-native';
import { SettingsScreen } from './SettingsScreen';

describe('SettingsScreen', () => {
  it('renders and keeps its migrated controls interactive', () => {
    const onToggleTheme = jest.fn();
    const onOpenFamily = jest.fn();
    const view = render(
      <SettingsScreen
        themeMode="light"
        onToggleTheme={onToggleTheme}
        onOpenFaceCapture={jest.fn()}
        onOpenFamily={onOpenFamily}
      />,
    );

    fireEvent.press(view.getByLabelText('Switch to dark mode'));
    fireEvent.press(view.getByText('Family'));
    fireEvent.press(view.getByRole('switch'));

    expect(onToggleTheme).toHaveBeenCalledTimes(1);
    expect(onOpenFamily).toHaveBeenCalledTimes(1);
    expect(view.getByRole('switch').props.accessibilityState.checked).toBe(true);
  });
});
