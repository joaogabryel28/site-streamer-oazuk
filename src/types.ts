export type DayOfWeek = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';

export type ActiveTab = 'schedule' | 'donations' | 'about' | 'admin' | 'login';

export interface ScheduleCard {
  id: string;
  title: string;
  posterUrl: string;
  badge?: string; // e.g. '1 EP', '4 EPS', '3 EPS', '6 EPS', 'FILME', 'AO VIVO'
  rating?: string; // e.g. '⭐ 7'
  isFolga?: boolean;
  time?: string; // e.g. '14:00', '18:30', '21:00'
  startHour?: number; // e.g. 14
  endHour?: number; // e.g. 17
  category?: string; // e.g. 'Série', 'Anime', 'Filme', 'Desenho', 'Jogo'
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek;
  date: string; // e.g. '12/10', '13/10', '14/10'
  isToday?: boolean;
  items: ScheduleCard[];
}

export interface StreamerUser {
  username: string;
  name: string;
  fullName?: string;
  age?: string;
  location?: string;
  bio?: string;
  epicCode?: string;
  channel: string;
  avatarUrl: string;
  livepixUrl?: string;
  pixggUrl?: string;
  streamlabsUrl?: string;
  kickUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}
