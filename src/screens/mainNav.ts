import {
  AppWindow,
  HouseLine,
  Storefront,
  Users,
  Wrench,
} from 'phosphor-react-native';
import type { AppBottomNavItem } from '../components';

export const mainNavItems: AppBottomNavItem[] = [
  { key: 'social', label: 'Social', icon: Users },
  { key: 'marketplace', label: 'Buy & Sell', icon: Storefront },
  { key: 'community', label: 'Community', icon: HouseLine },
  { key: 'services', label: 'Services', icon: Wrench },
  { key: 'devices', label: 'Devices', icon: AppWindow, badgeLabel: 'NEW' },
];
