import { VisitorCalendarExperience } from '../patterns/calendar';

export function VisitorCalendarScreen({ onBack }: { onBack: () => void }) {
  return <VisitorCalendarExperience onBack={onBack} />;
}
