import type { DayOfWeek } from '../types';

export interface WeekDayInfo {
  dayOfWeek: DayOfWeek;
  date: string; // 'DD/MM'
  isToday: boolean;
  fullDate: string; // 'YYYY-MM-DD'
}

const DAY_NAMES: DayOfWeek[] = [
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
  'Domingo',
];

export function getWeekDetails(offset: number = 0) {
  // Base reference Monday: 12 de Outubro de 2026 (matching reference screenshot 12/10 - 18/10)
  const baseMonday = new Date(2026, 9, 12);
  baseMonday.setDate(baseMonday.getDate() + offset * 7);

  const days: WeekDayInfo[] = [];

  for (let i = 0; i < 7; i++) {
    const current = new Date(baseMonday);
    current.setDate(baseMonday.getDate() + i);

    const day = String(current.getDate()).padStart(2, '0');
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const year = current.getFullYear();

    days.push({
      dayOfWeek: DAY_NAMES[i],
      date: `${day}/${month}`,
      // When offset is 0, Quarta (14/10) is marked as HOJE as shown in the screenshot
      isToday: offset === 0 && i === 2,
      fullDate: `${year}-${month}-${day}`,
    });
  }

  const startDay = days[0].date;
  const endDay = days[6].date;
  const label = `${startDay} - ${endDay}`;

  return {
    label,
    days,
    startDay,
    endDay,
  };
}

// 10 hour slots: from 14:00 to 23:00 (hour by hour)
export const SCHEDULE_HOURS = [
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

export const GRID_START_HOUR = 14;
export const GRID_END_HOUR = 24; // up to 00:00
export const GRID_ROW_HEIGHT = 44; // 44px per hour slot -> total grid height: 440px (very compact, no vertical scrolling needed)

export function parseTimeToHour(timeStr?: string, defaultHour: number = 14): number {
  if (!timeStr) return defaultHour;
  // Supports formats like "14:00", "17:30", "14:00 - 17:00"
  const clean = timeStr.trim().split('-')[0].trim();
  const parts = clean.split(':');
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1] || '0', 10);
  if (isNaN(h)) return defaultHour;
  return h + (isNaN(m) ? 0 : m / 60);
}

export function parseTimeRange(timeStr?: string, defaultStart: number = 14): { start: number; end: number } {
  if (!timeStr) return { start: defaultStart, end: defaultStart + 2.5 };
  const parts = timeStr.trim().split('-');
  const start = parseTimeToHour(parts[0], defaultStart);
  if (parts.length > 1) {
    const end = parseTimeToHour(parts[1], start + 2.5);
    return { start, end: Math.max(start + 0.8, end) };
  }
  return { start, end: Math.min(24, start + 2.5) };
}

