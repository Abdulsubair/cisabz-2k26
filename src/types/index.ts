export type EventCategory = 'technical' | 'non-technical';

export interface EventItem {
  id: string;
  code: string;
  name: string;
  subtitle: string;
  category: EventCategory;
  type: string;
  tagline: string;
  shortDescription: string;
  rounds: string;
  teamSize: string;
  guidelines: string[];
  evaluationCriteria?: string[];
  iconName: string;
  colorTheme: string;
  registrationLink?: string;
}

export interface Coordinator {
  name: string;
  role: string;
  department?: string;
  phone: string;
  type: 'student' | 'staff';
  avatar?: string;
}

export interface ScheduleDay {
  date: string;
  title: string;
  status: 'announced' | 'tba';
  items: {
    sNo?: number;
    time: string;
    event: string;
    venue: string;
    type?: string;
    isHighlight?: boolean;
  }[];
}

export interface GeneralRule {
  id: number;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  aspect: 'normal' | 'tall' | 'wide';
}

export interface Dignitary {
  id: string;
  name: string;
  role: string;
  title: string;
  institution: string;
  description: string;
  avatar: string;
  badge?: string;
}
