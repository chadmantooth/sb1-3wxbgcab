export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  registrationUrl: string;
  category: 'webinar' | 'conference' | 'workshop';
}

export interface EventsState {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  filter: string;
}