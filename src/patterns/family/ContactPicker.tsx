import { ScrollView, Text, View } from 'react-native';
import { UserCircle } from 'phosphor-react-native';
import { ListGroup, ListItem, ModalSheet } from '../../components';
import { colors, iconSize, spacing, typography } from '../../tokens';

export type FamilyContact = { name: string; mobile: string };

export const sampleFamilyContacts: readonly FamilyContact[] = [
  { name: 'Aditi Sharma', mobile: '9876543210' },
  { name: 'Rohan Mehta', mobile: '9988776655' },
  { name: 'Priya Nair', mobile: '9123456780' },
];

export type ContactPickerProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (contact: FamilyContact) => void;
  contacts?: readonly FamilyContact[];
};

export function ContactPicker({ visible, onClose, onSelect, contacts = sampleFamilyContacts }: ContactPickerProps) {
  return (
    <ModalSheet visible={visible} onDismiss={onClose} title="Select contact" presentation="page">
      <ScrollView contentContainerStyle={{ gap: spacing.lg, padding: spacing.lg, paddingBottom: spacing.xxl }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: spacing.xs }}>
          <Text style={[typography.titleSection, { color: colors.contentPrimary }]}>Choose from contacts</Text>
          <Text style={[typography.bodyDefault, { color: colors.contentSecondary }]}>Selecting someone fills their name and mobile number.</Text>
        </View>
        <ListGroup>
          {contacts.map((contact) => (
            <ListItem
              key={contact.mobile}
              label={contact.name}
              paragraph={`+91 ${contact.mobile}`}
              artwork="Small"
              leadingArtwork={<UserCircle size={iconSize.lg} color={colors.contentSecondary} weight="regular" />}
              accessibilityLabel={`Select contact ${contact.name}`}
              onPress={() => onSelect(contact)}
            />
          ))}
        </ListGroup>
      </ScrollView>
    </ModalSheet>
  );
}
