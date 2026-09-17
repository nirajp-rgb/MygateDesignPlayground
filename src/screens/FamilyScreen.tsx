import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  Text,
  View,
} from 'react-native';
import {
  AddressBook,
  Check,
  DeviceMobile,
  DoorOpen,
  House,
  HouseLine,
  Megaphone,
  ShareNetwork,
  ShieldCheck,
  UsersThree,
  X,
} from 'phosphor-react-native';
import { AppHeader, Button, Radio, SurfaceCard } from '../components';
import { ActionFooter } from '../components';
import { TextField } from '../components';
import { colors, iconSize, radius, spacing, typography } from '../tokens';
import { ContactPicker, MemberTypeCard } from '../patterns/family';

type FamilyStep = 'overview' | 'add' | 'share';
type MemberType = 'adult' | 'child';
type ExitPreference = 'permission' | 'notification' | 'nothing';

type Props = {
  onBack: () => void;
};

type BenefitRowProps = {
  icon: React.ComponentType<{ size?: number; color?: string; weight?: 'regular' }>;
  title: string;
  description: string;
};

function BenefitRow({ icon: Icon, title, description }: BenefitRowProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, paddingVertical: spacing.xs }}>
      <View style={{ padding: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary }}>
        <Icon size={iconSize.lg} color={colors.contentSecondary} weight="regular" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>{title}</Text>
        <Text style={[typography.bodyDefault, { color: colors.contentTertiary }]}>{description}</Text>
      </View>
    </View>
  );
}

function FormField({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = 'default',
  prefix,
  trailingAction,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'phone-pad';
  prefix?: string;
  trailingAction?: React.ReactNode;
}) {
  return <TextField label={label} value={value} onChangeText={onChangeText} placeholder={placeholder} keyboardType={keyboardType} prefix={prefix} trailingContent={trailingAction} />;
}

function BottomAction({ label, disabled, onPress }: { label: string; disabled?: boolean; onPress: () => void }) {
  return <ActionFooter primary={{ label, disabled, onPress }} />;
}

export function FamilyScreen({ onBack }: Props) {
  const [step, setStep] = useState<FamilyStep>('overview');
  const [memberType, setMemberType] = useState<MemberType>('adult');
  const [adultName, setAdultName] = useState('');
  const [adultMobile, setAdultMobile] = useState('');
  const [childName, setChildName] = useState('');
  const [exitPreference, setExitPreference] = useState<ExitPreference>('permission');
  const [confirmation, setConfirmation] = useState<MemberType | null>(null);
  const [contactPickerVisible, setContactPickerVisible] = useState(false);

  const cleanMobile = adultMobile.replace(/\D/g, '');
  const addDisabled = memberType === 'adult'
    ? adultName.trim().length < 2 || cleanMobile.length !== 10
    : childName.trim().length < 2;

  const goBack = () => {
    if (step === 'overview') onBack();
    else setStep('overview');
  };

  const startAdding = () => {
    setMemberType('adult');
    setAdultName('');
    setAdultMobile('');
    setChildName('');
    setExitPreference('permission');
    setConfirmation(null);
    setStep('add');
  };

  const createMember = () => {
    setConfirmation(memberType);
    setStep(memberType === 'adult' ? 'share' : 'overview');
  };

  const shareInvite = async () => {
    await Share.share({
      message: `${adultName.trim()}, Niraj has invited you to join their home on MyGate. Log in using +91 ${cleanMobile}.`,
    });
  };

  const renderOverview = () => (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.xl, paddingBottom: spacing.xxl }}
      >
        {confirmation ? (
          <SurfaceCard accent borderWidth={1}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
              <Check size={iconSize.md} color={colors.contentAction} weight="regular" />
              <View style={{ flex: 1, gap: spacing.xs }}>
                <Text style={[typography.bodyDefaultBold, { color: colors.contentPrimary }]}>
                  {confirmation === 'adult' ? 'Invitation ready' : 'Child added'}
                </Text>
                <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>
                  {confirmation === 'adult'
                    ? `${adultName.trim()} is pending. You can reopen and share the invitation anytime.`
                    : `${childName.trim()} is now part of your household.`}
                </Text>
              </View>
            </View>
          </SurfaceCard>
        ) : null}

        <View style={{ alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg }}>
          <View style={{ padding: spacing.xl, borderRadius: radius.pill, backgroundColor: colors.surfaceActionSecondarySubtle }}>
            <UsersThree size={iconSize.xl} color={colors.contentAction} weight="regular" />
          </View>
          <View style={{ alignItems: 'center', gap: spacing.sm }}>
            <Text style={[typography.titleSection, { color: colors.contentPrimary, textAlign: 'center' }]}>Your home, together</Text>
            <Text style={[typography.bodyDefault, { color: colors.contentSecondary, textAlign: 'center' }]}>Add people who live with you so each person gets the right access for your home.</Text>
          </View>
        </View>

        <SurfaceCard borderWidth={0} style={{ backgroundColor: colors.surfacePage }}>
          <BenefitRow icon={House} title="One connected household" description="Keep family profiles and home access together in one place." />
          <BenefitRow icon={DoorOpen} title="Smoother entry and exits" description="Adults can use their own account, while you can manage child exit preferences." />
          <BenefitRow icon={Megaphone} title="Stay informed" description="Family members can receive updates relevant to your home and community." />
        </SurfaceCard>
      </ScrollView>
      <BottomAction label="Add family member" onPress={startAdding} />
    </>
  );

  const renderAdd = () => (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl }}
      >
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.titleSection, { color: colors.contentPrimary }]}>Who would you like to add?</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Choose a member type and complete the fields that appear.</Text>
        </View>

        <View accessibilityRole="radiogroup" style={{ gap: spacing.md }}>
          <MemberTypeCard type="adult" selected={memberType === 'adult'} onSelect={() => setMemberType('adult')}>
            <FormField label="Full name" value={adultName} placeholder="Enter name" onChangeText={setAdultName} />
            <FormField
              label="Mobile number"
              value={adultMobile}
              placeholder="10-digit mobile number"
              prefix="+91"
              keyboardType="phone-pad"
              onChangeText={(value) => setAdultMobile(value.replace(/\D/g, '').slice(0, 10))}
              trailingAction={(
                <Button kind="Tertiary" size="SM" label="Contacts" showLeftIcon leftIcon={AddressBook} onPress={() => setContactPickerVisible(true)} />
              )}
            />
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm }}>
              <ShieldCheck size={iconSize.md} color={colors.contentSecondary} weight="regular" />
              <Text style={[typography.bodySmall, { flex: 1, color: colors.contentSecondary }]}>They’ll use their own number and account. You can remove their access later.</Text>
            </View>
          </MemberTypeCard>

          <MemberTypeCard type="child" selected={memberType === 'child'} onSelect={() => setMemberType('child')}>
            <FormField label="Full name" value={childName} placeholder="Enter name" onChangeText={setChildName} />
            <View style={{ gap: spacing.md }}>
              <View style={{ gap: spacing.xs }}>
                <Text style={[typography.bodyLargeBold, { color: colors.contentPrimary }]}>When they exit</Text>
                <Text style={[typography.bodySmall, { color: colors.contentSecondary }]}>Choose one exit preference for this child.</Text>
              </View>
              <Radio
                label="Require my permission"
                description="You’ll need to approve every exit request."
                checked={exitPreference === 'permission'}
                onPress={() => setExitPreference('permission')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
              <Radio
                label="Send me a notification"
                description="The exit can proceed and you’ll be notified."
                checked={exitPreference === 'notification'}
                onPress={() => setExitPreference('notification')}
              />
              <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />
              <Radio
                label="Do nothing"
                description="No approval or notification is needed."
                checked={exitPreference === 'nothing'}
                onPress={() => setExitPreference('nothing')}
              />
            </View>
          </MemberTypeCard>
        </View>
      </ScrollView>
      <BottomAction
        label={memberType === 'adult' ? 'Create invite' : 'Add child'}
        disabled={addDisabled}
        onPress={createMember}
      />
    </KeyboardAvoidingView>
  );

  const renderShare = () => (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.xl, padding: spacing.lg, paddingBottom: spacing.xxl }}
      >
        <SurfaceCard borderWidth={0} elevated style={{ padding: 0, overflow: 'hidden' }}>
          <View style={{ alignItems: 'center', gap: spacing.md, backgroundColor: colors.surfaceActionSecondarySubtle, padding: spacing.xl }}>
            <View style={{ padding: spacing.lg, borderRadius: radius.pill, backgroundColor: colors.surfacePrimary }}>
              <UsersThree size={iconSize.xl} color={colors.contentAction} weight="regular" />
            </View>
            <View style={{ alignItems: 'center', gap: spacing.sm }}>
              <Text style={[typography.titleScreen, { color: colors.contentPrimary, textAlign: 'center' }]}>Hi {adultName.trim()}! 👋</Text>
              <Text style={[typography.bodyLarge, { color: colors.contentSecondary, textAlign: 'center' }]}>Niraj has invited you to join their home on MyGate.</Text>
            </View>
          </View>

          <View style={{ padding: spacing.xl, gap: spacing.lg }}>
            <SurfaceCard borderWidth={1} style={{ backgroundColor: colors.surfaceSecondary }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <Check size={iconSize.sm} color={colors.contentPositive} weight="regular" />
                <Text style={[typography.bodySmallBold, { color: colors.contentPositive }]}>INVITATION READY</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
                <View style={{ flex: 1, gap: spacing.xs }}>
                  <Text style={[typography.titleSection, { color: colors.contentPrimary }]}>Home B 102</Text>
                  <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Your MyGate community</Text>
                </View>
                <HouseLine size={iconSize.xl} color={colors.contentSecondary} weight="regular" />
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
                <House size={iconSize.sm} color={colors.contentSecondary} weight="regular" />
                <Text style={[typography.bodySmallBold, { color: colors.contentSecondary }]}>FAMILY MEMBER</Text>
              </View>
            </SurfaceCard>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
              <View style={{ padding: spacing.md, borderRadius: radius.pill, backgroundColor: colors.surfaceSecondary }}>
                <DeviceMobile size={iconSize.md} color={colors.contentSecondary} weight="regular" />
              </View>
              <View style={{ gap: spacing.xs }}>
                <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Login using</Text>
                <Text style={[typography.titleSubsection, { color: colors.contentPrimary }]}>+91 {cleanMobile}</Text>
              </View>
            </View>
          </View>
        </SurfaceCard>

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md }}>
          <ShareNetwork size={iconSize.md} color={colors.contentSecondary} weight="regular" />
          <Text style={[typography.bodyDefault, { flex: 1, color: colors.contentSecondary }]}>Share this invite with {adultName.trim()} so they can join your household. Closing this page will not delete the invitation.</Text>
        </View>
      </ScrollView>
      <BottomAction label="Share invite" onPress={shareInvite} />
    </>
  );

  const title = step === 'overview' ? 'Family' : step === 'add' ? 'Add family member' : `Invite for ${adultName.trim()}`;

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfacePage }}>
      <AppHeader
        title={title}
        titleAlign="center"
        variant="solid"
        onBack={goBack}
        backIcon={step === 'share' ? X : undefined}
        backLabel={step === 'share' ? 'Close invite' : 'Go back'}
      />
      {step === 'overview' ? renderOverview() : null}
      {step === 'add' ? renderAdd() : null}
      {step === 'share' ? renderShare() : null}
      <ContactPicker
        visible={contactPickerVisible}
        onClose={() => setContactPickerVisible(false)}
        onSelect={(contact) => {
          setAdultName(contact.name);
          setAdultMobile(contact.mobile);
          setContactPickerVisible(false);
        }}
      />
    </View>
  );
}
