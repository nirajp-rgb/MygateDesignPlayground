import type { ImageSourcePropType } from 'react-native';

export type PrototypeScreenKey =
  | 'home'
  | 'template'
  | 'settings'
  | 'dailyHelpProfile'
  | 'appHome'
  | 'quickActions'
  | 'marketplace'
  | 'listingWizard'
  | 'searchExperience'
  | 'faceCapture'
  | 'visitorCalendar';

export type DailyHelpProfileVisitor = {
  name: string;
  phone: string;
  source?: ImageSourcePropType;
  status?: 'Online' | 'Offline' | 'Busy' | 'none';
};
