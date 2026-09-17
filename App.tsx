import { useState } from 'react';
import { Archivo_400Regular, Archivo_600SemiBold, useFonts } from '@expo-google-fonts/archivo';
import { StatusBar } from 'expo-status-bar';
import type { Mode } from './src/tokens/color';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen, TemplateScreen, SettingsScreen, DailyHelpProfileScreen, AppHomeScreen, MarketplaceScreen, QuickActionsScreen, ListingWizardScreen, SearchExperienceScreen, FaceCaptureScreen, VisitorCalendarScreen, FamilyScreen, type PrototypeScreenKey } from './src/screens';
import type { DailyHelpProfileVisitor } from './src/screens/types';
import type { ImageSourcePropType } from 'react-native';
import { currentMode, getStatusBarStyle, setUIMode } from './src/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    Archivo_400Regular,
    Archivo_600SemiBold
  });
  const [themeMode, setThemeMode] = useState<Mode>(currentMode);
  const [activeScreen, setActiveScreen] = useState<PrototypeScreenKey>('appHome');
  const [previousScreen, setPreviousScreen] = useState<PrototypeScreenKey>('appHome');
  const [selectedHelpProfile, setSelectedHelpProfile] = useState<DailyHelpProfileVisitor | undefined>(undefined);
  const [profilePhotoSource, setProfilePhotoSource] = useState<ImageSourcePropType | undefined>(undefined);

  const navigateTo = (screen: PrototypeScreenKey) => {
    if (screen === activeScreen) return;
    setPreviousScreen(activeScreen);
    setActiveScreen(screen);
  };

  const handleToggleTheme = () => {
    const nextMode: Mode = themeMode === 'dark' ? 'light' : 'dark';
    setUIMode(nextMode);
    setThemeMode(nextMode);
  };

  const handleOpenDailyHelpProfile = (visitor: DailyHelpProfileVisitor) => {
    setSelectedHelpProfile(visitor);
    navigateTo('dailyHelpProfile');
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider key={themeMode}>
      <StatusBar style={getStatusBarStyle(themeMode)} />
      {activeScreen === 'home' ? (
        <HomeScreen key={`home-${themeMode}`} activeScreen={activeScreen} onNavigate={navigateTo} />
      ) : activeScreen === 'settings' ? (
        <SettingsScreen
          key={`settings-${themeMode}`}
          onBack={() => setActiveScreen(previousScreen)}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          profilePhotoSource={profilePhotoSource}
          onOpenFaceCapture={() => navigateTo('faceCapture')}
          onOpenFamily={() => setActiveScreen('family')}
        />
      ) : activeScreen === 'family' ? (
        <FamilyScreen key={`family-${themeMode}`} onBack={() => setActiveScreen('settings')} />
      ) : activeScreen === 'dailyHelpProfile' ? (
        <DailyHelpProfileScreen
          key={`dailyHelpProfile-${themeMode}-${selectedHelpProfile?.name ?? 'default'}`}
          activeScreen={activeScreen}
          onNavigate={navigateTo}
          onBack={() => setActiveScreen(previousScreen)}
          visitor={selectedHelpProfile}
        />
      ) : activeScreen === 'appHome' ? (
        <AppHomeScreen
          key={`appHome-${themeMode}`}
          activeScreen={activeScreen}
          onNavigate={navigateTo}
          onOpenDailyHelpProfile={handleOpenDailyHelpProfile}
          onOpenVisitorCalendar={() => navigateTo('visitorCalendar')}
        />
      ) : activeScreen === 'marketplace' ? (
        <MarketplaceScreen key={`marketplace-${themeMode}`} onNavigate={navigateTo} />
      ) : activeScreen === 'listingWizard' ? (
        <ListingWizardScreen
          key={`listingWizard-${themeMode}`}
          activeScreen={activeScreen}
          onNavigate={navigateTo}
          onExit={() => setActiveScreen(previousScreen)}
        />
      ) : activeScreen === 'searchExperience' ? (
        <SearchExperienceScreen
          key={`searchExperience-${themeMode}`}
          activeScreen={activeScreen}
          onNavigate={navigateTo}
          onBack={() => setActiveScreen(previousScreen)}
          onOpenDailyHelpProfile={handleOpenDailyHelpProfile}
        />
      ) : activeScreen === 'faceCapture' ? (
        <FaceCaptureScreen
          key={`faceCapture-${themeMode}`}
          onBack={() => setActiveScreen(previousScreen)}
          onSubmit={(uri) => {
            setProfilePhotoSource({ uri });
            setActiveScreen('settings');
          }}
        />
      ) : activeScreen === 'quickActions' ? (
        <QuickActionsScreen key={`quickActions-${themeMode}`} activeScreen={activeScreen} onNavigate={navigateTo} onClose={() => setActiveScreen(previousScreen)} />
      ) : activeScreen === 'visitorCalendar' ? (
        <VisitorCalendarScreen
          key={`visitorCalendar-${themeMode}`}
          onBack={() => setActiveScreen(previousScreen)}
        />
      ) : (
        <TemplateScreen key={`template-${themeMode}`} activeScreen={activeScreen} onNavigate={navigateTo} />
      )}
    </SafeAreaProvider>
  );
}
