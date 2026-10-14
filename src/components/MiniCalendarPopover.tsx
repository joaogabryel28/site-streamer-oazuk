import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface MiniCalendarPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  weekOffset: number;
  onSelectWeekOffset: (offset: number) => void;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const WEEK_DAYS = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];

export const MiniCalendarPopover: React.FC<MiniCalendarPopoverProps> = ({
  isOpen,
  onClose,
  weekOffset,
  onSelectWeekOffset,
}) => {
  const { isDark } = useTheme();

  // Base reference Monday: 12/10/2026
  const baseMonday = new Date(2026, 9, 12);
  baseMonday.setHours(0, 0, 0, 0);

  // Today reference: 14/10/2026
  const todayDate = new Date(2026, 9, 14);
  todayDate.setHours(0, 0, 0, 0);

  // Calculate the Monday of the currently selected week
  const currentSelectedMonday = new Date(baseMonday);
  currentSelectedMonday.setDate(currentSelectedMonday.getDate() + weekOffset * 7);

  // Month shown in the mini-calendar view
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    return new Date(currentSelectedMonday.getFullYear(), currentSelectedMonday.getMonth(), 1);
  });

  // Sync calendar month when opened with a different week
  useEffect(() => {
    if (isOpen) {
      setViewMonth(
        new Date(currentSelectedMonday.getFullYear(), currentSelectedMonday.getMonth(), 1)
      );
    }
  }, [isOpen, weekOffset]);

  if (!isOpen) return null;

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleResetCurrentWeek = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectWeekOffset(0);
    setViewMonth(new Date(2026, 9, 1));
    onClose();
  };

  const handleSelectDay = (dayDate: Date) => {
    const dayOfWeek = dayDate.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const clickedMonday = new Date(dayDate);
    clickedMonday.setDate(dayDate.getDate() + diffToMonday);
    clickedMonday.setHours(0, 0, 0, 0);

    const diffTime = clickedMonday.getTime() - baseMonday.getTime();
    const calculatedOffset = Math.round(diffTime / (7 * 24 * 60 * 60 * 1000));

    onSelectWeekOffset(calculatedOffset);
    onClose();
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const firstDayIndex = (firstDay.getDay() + 6) % 7;

  const calendarStartDate = new Date(year, month, 1 - firstDayIndex);
  calendarStartDate.setHours(0, 0, 0, 0);

  const weeks: {
    weekMonday: Date;
    isSelectedWeek: boolean;
    days: {
      date: Date;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[];
  }[] = [];

  const currentCursor = new Date(calendarStartDate);
  const totalWeeksCount = 5;

  for (let w = 0; w < totalWeeksCount; w++) {
    const weekDays = [];
    const weekMonday = new Date(currentCursor);

    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(currentCursor);
      const isCurrentMonth = dayDate.getMonth() === month;
      const isToday =
        dayDate.getDate() === todayDate.getDate() &&
        dayDate.getMonth() === todayDate.getMonth() &&
        dayDate.getFullYear() === todayDate.getFullYear();

      weekDays.push({
        date: dayDate,
        dayNumber: dayDate.getDate(),
        isCurrentMonth,
        isToday,
      });

      currentCursor.setDate(currentCursor.getDate() + 1);
    }

    const isSelectedWeek =
      weekMonday.getDate() === currentSelectedMonday.getDate() &&
      weekMonday.getMonth() === currentSelectedMonday.getMonth() &&
      weekMonday.getFullYear() === currentSelectedMonday.getFullYear();

    weeks.push({
      weekMonday,
      isSelectedWeek,
      days: weekDays,
    });
  }

  const monthTitle = `${MONTH_NAMES[month]} ${year}`;

  return (
    <>
      {/* Invisible backdrop for click-outside */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      {/* Mini Calendar Popover Modal */}
      <div
        className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 w-[310px] sm:w-[325px] rounded-2xl backdrop-blur-2xl border shadow-2xl p-4 animate-fade-in transition-colors ${
          isDark
            ? 'bg-[#14161d]/95 border-white/10 text-slate-100'
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/60'
        }`}
      >
        {/* Month Selector Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={`p-1 rounded-lg transition active:scale-95 ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span
            className={`font-bold text-sm sm:text-base tracking-wide ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            {monthTitle}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            className={`p-1 rounded-lg transition active:scale-95 ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center mb-1">
          {WEEK_DAYS.map((wd) => (
            <span
              key={wd}
              className={`text-[10px] font-bold py-1 tracking-wider uppercase ${
                isDark ? 'text-zinc-400' : 'text-slate-500'
              }`}
            >
              {wd}
            </span>
          ))}
        </div>

        {/* Weeks Matrix */}
        <div className="space-y-1">
          {weeks.map((week, wIdx) => {
            return (
              <div
                key={wIdx}
                className={`grid grid-cols-7 transition-all ${
                  week.isSelectedWeek
                    ? isDark
                      ? 'rounded-xl bg-[#4a1d2e] py-0.5 px-0.5 text-white shadow-md'
                      : 'rounded-xl bg-pink-700 py-0.5 px-0.5 text-white shadow-md'
                    : 'py-0.5 px-0.5'
                }`}
              >
                {week.days.map((day, dIdx) => {
                  const isDayHighlighted = day.isToday;

                  return (
                    <button
                      key={dIdx}
                      type="button"
                      onClick={() => handleSelectDay(day.date)}
                      className={`h-8 flex items-center justify-center text-xs transition-all relative ${
                        week.isSelectedWeek
                          ? isDayHighlighted
                            ? isDark
                              ? 'rounded-lg border border-pink-400/80 bg-white/10 font-black text-white shadow-xs'
                              : 'rounded-lg border border-white bg-white/20 font-black text-white shadow-xs'
                            : 'font-bold text-white hover:bg-white/15 rounded-lg'
                          : day.isCurrentMonth
                          ? isDark
                            ? 'font-medium text-zinc-200 hover:text-white hover:bg-white/10 rounded-lg'
                            : 'font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg'
                          : isDark
                          ? 'font-normal text-zinc-500 hover:text-zinc-300 rounded-lg'
                          : 'font-normal text-slate-400 hover:text-slate-600 rounded-lg'
                      }`}
                      title={`${day.dayNumber}/${day.date.getMonth() + 1}/${day.date.getFullYear()}`}
                    >
                      <span>{day.dayNumber}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom Action: Semana Atual */}
        <div
          className={`mt-3 pt-2.5 border-t ${
            isDark ? 'border-white/10' : 'border-slate-200'
          }`}
        >
          <button
            type="button"
            onClick={handleResetCurrentWeek}
            className={`w-full py-2 rounded-xl border font-semibold text-xs transition active:scale-98 shadow-sm flex items-center justify-center ${
              isDark
                ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                : 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            Semana Atual
          </button>
        </div>
      </div>
    </>
  );
};
