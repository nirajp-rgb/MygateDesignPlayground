import { fireEvent, render } from '@testing-library/react-native';
import { useState } from 'react';
import { Bell, House, User } from 'phosphor-react-native';
import {
  ActionFooter,
  Banner,
  ChipGroup,
  ListGroup,
  ListItem,
  ModalSheet,
  ProgressSteps,
  SearchField,
  TextField,
  TileGroup,
} from './index';

describe('component system interactions', () => {
  it('keeps TextField controlled and parses display input', () => {
    const onChangeText = jest.fn();
    const view = render(<TextField label="Rent" value="1200" onChangeText={onChangeText} formatDisplayValue={(value) => `₹ ${value}`} parseInputValue={(value) => value.replace(/\D/g, '')} />);
    fireEvent.changeText(view.getByLabelText('Rent'), '₹ 2,400');
    expect(onChangeText).toHaveBeenCalledWith('2400');
  });

  it('changes a single-select ChipGroup', () => {
    function Example() {
      const [value, setValue] = useState<string | string[] | null>('all');
      return <ChipGroup value={value} onChange={setValue} options={[{ key: 'all', label: 'All' }, { key: 'updates', label: 'Updates' }]} />;
    }
    const view = render(<Example />);
    fireEvent.press(view.getByText('Updates'));
    expect(view.getAllByRole('button').some((button) => button.props.accessibilityState?.selected)).toBe(true);
  });

  it('supports trigger-only search and pressable list rows', () => {
    const onSearch = jest.fn();
    const onRow = jest.fn();
    const view = render(<><SearchField mode="trigger" placeholder="Search all features" onPress={onSearch} /><ListItem label="Settings" onPress={onRow} /></>);
    fireEvent.press(view.getByText('Search all features'));
    fireEvent.press(view.getByText('Settings'));
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onRow).toHaveBeenCalledTimes(1);
  });

  it('clears search and exposes TextField error and disabled states', () => {
    const onClear = jest.fn();
    const onChange = jest.fn();
    const view = render(
      <>
        <SearchField value="visitor" onChangeText={onChange} onClear={onClear} />
        <TextField label="Email" value="" onChangeText={onChange} state="disabled" errorMessage="Required" />
      </>,
    );
    fireEvent.press(view.getByLabelText('Clear search'));
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(view.getByText('Required')).toBeTruthy();
    expect(view.getByLabelText('Email').props.accessibilityState.disabled).toBe(true);
  });

  it('supports accessible single and multiple tile selection', () => {
    const onChange = jest.fn();
    const items = [
      { key: 'home', label: 'Home', artworkType: 'icon' as const, icon: House },
      { key: 'profile', label: 'Profile', artworkType: 'icon' as const, icon: User },
    ];
    const view = render(<TileGroup items={items} value="home" onChange={onChange} />);
    fireEvent.press(view.getByText('Profile'));
    expect(onChange).toHaveBeenCalledWith('profile');
    expect(view.getAllByRole('button')[0].props.accessibilityState.selected).toBe(true);
  });

  it('owns list dividers and footer action behavior', () => {
    const primary = jest.fn();
    const disabled = jest.fn();
    const view = render(
      <>
        <ListGroup><ListItem label="First" /><ListItem label="Second" /></ListGroup>
        <ActionFooter safeArea={false} primary={{ label: 'Continue', onPress: primary }} secondary={{ label: 'Unavailable', onPress: disabled, disabled: true }} />
      </>,
    );
    fireEvent.press(view.getByText('Continue'));
    expect(primary).toHaveBeenCalledTimes(1);
    expect(disabled).not.toHaveBeenCalled();
    expect(view.getAllByRole('button').some((button) => button.props.accessibilityState?.disabled)).toBe(true);
  });

  it('reports progress and handles banner and modal dismissal', () => {
    const onBanner = jest.fn();
    const onDismiss = jest.fn();
    const view = render(
      <>
        <ProgressSteps currentIndex={1} total={4} labels={['Details', 'Photos']} />
        <Banner icon={Bell} title="Update" onPress={onBanner} />
        <ModalSheet visible onDismiss={onDismiss} presentation="bottom"><ListItem label="Sheet content" /></ModalSheet>
      </>,
    );
    expect(view.getByLabelText('Progress').props.accessibilityValue).toEqual({ min: 1, max: 4, now: 2 });
    expect(view.getByText('Photos')).toBeTruthy();
    fireEvent.press(view.getByText('Update'));
    fireEvent.press(view.getByLabelText('Dismiss'));
    expect(onBanner).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
