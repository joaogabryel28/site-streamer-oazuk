import React, { useState } from 'react';
import type { DaySchedule, ScheduleCard } from '../types';
import {
  getWeekDetails,
  SCHEDULE_HOURS,
  GRID_START_HOUR,
  GRID_ROW_HEIGHT,
  parseTimeToHour,
} from '../utils/weekDate';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Moon,
  Clock,
  Plus,
  LayoutGrid,
  Columns,
  Star,
  Info,
} from 'lucide-react';
import { MiniCalendarPopover } from './MiniCalendarPopover';
import { useTheme } from '../context/ThemeContext';

interface ScheduleTableProps {
  schedule: DaySchedule[];
  onManageClick?: () => void;
  isLoggedIn: boolean;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  schedule,
  onManageClick,
  isLoggedIn,
}) => {
  const { isDark } = useTheme();
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [activeModalCard, setActiveModalCard] = useState<ScheduleCard | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'cards'>('grid');
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  // Compute dynamic week details (dates and label) based on weekOffset
  const weekDetails = getWeekDetails(weekOffset);

  const handlePrevWeek = () => {
    setWeekOffset((prev) => prev - 1);
  };

  const handleNextWeek = () => {
    setWeekOffset((prev) => prev + 1);
  };

  const totalGridHeight = SCHEDULE_HOURS.length * GRID_ROW_HEIGHT;

  return (
    <section className="relative min-h-[calc(100vh-80px)] py-4 sm:py-6 px-2 sm:px-4 lg:px-6">
      {/* Background with Dark/Light Fantasy Castle & Embers */}
      <div
        className={`fixed inset-0 pointer-events-none -z-10 bg-cover bg-center transition-all duration-500 scale-105 ${
          isDark
            ? 'opacity-30 mix-blend-screen'
            : 'opacity-10 mix-blend-multiply'
        }`}
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      <div
        className={`fixed inset-0 pointer-events-none -z-10 transition-colors duration-500 ${
          isDark
            ? 'bg-gradient-to-b from-[#0b0c10]/80 via-[#0b0c10]/95 to-[#07080a]'
            : 'bg-gradient-to-b from-slate-100/90 via-slate-50/95 to-slate-100'
        }`}
      />

      <div className="max-w-[1380px] mx-auto">
        {/* Top Bar with Week Selector and View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 sm:mb-5">
          {/* View mode toggle */}
          <div
            className={`flex items-center p-1 rounded-full text-xs backdrop-blur-md border transition-colors ${
              isDark
                ? 'bg-black/60 border-white/10'
                : 'bg-white/80 border-slate-200 shadow-sm'
            }`}
          >
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grade com linhas alinhadas de hora em hora (14:00 - 23:00)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grade Horária</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold transition ${
                viewMode === 'cards'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                  : isDark
                  ? 'text-zinc-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Cards verticais compactos de pôsteres"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Cards Verticais</span>
            </button>
          </div>

          {/* Top Centered Week Selector with functional prev/next buttons */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handlePrevWeek}
              className={`p-1.5 rounded-full transition active:scale-95 ${
                isDark
                  ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Semana anterior (voltar 7 dias)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Central Date Button with Mini-Calendar Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md text-xs sm:text-sm font-semibold shadow-lg transition active:scale-95 cursor-pointer border ${
                  isDark
                    ? 'bg-black/70 hover:bg-black/90 border-white/10 text-zinc-200'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
                }`}
                title="Abrir calendário para escolher semana ou dia"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-pink-500" />
                <span>{weekDetails.label}</span>
                {isCalendarOpen ? (
                  <ChevronUp className={`w-3.5 h-3.5 ml-0.5 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`} />
                ) : (
                  <ChevronDown className={`w-3.5 h-3.5 ml-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
                )}
              </button>

              <MiniCalendarPopover
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                weekOffset={weekOffset}
                onSelectWeekOffset={(offset) => setWeekOffset(offset)}
              />
            </div>

            <button
              onClick={handleNextWeek}
              className={`p-1.5 rounded-full transition active:scale-95 ${
                isDark
                  ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
              title="Próxima semana (avançar 7 dias)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Edit schedule button if logged in */}
          {isLoggedIn && onManageClick ? (
            <button
              onClick={onManageClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-600/30 hover:bg-pink-600/50 text-pink-200 border border-pink-500/40 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Editar Cronograma</span>
            </button>
          ) : (
            <div className={`hidden sm:block text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
              Horário de Brasília (BRT)
            </div>
          )}
        </div>

        {/* =========================================================================
            VIEW 1: GRADE HORÁRIA DE HORA EM HORA (Aligned with table lines)
            ========================================================================= */}
        {viewMode === 'grid' && (
          <div className="overflow-x-auto no-scrollbar pb-2">
            <div
              className={`min-w-[980px] backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
                isDark
                  ? 'bg-black/60 border-white/10'
                  : 'bg-white/95 border-slate-200 shadow-slate-200/50'
              }`}
            >
              {/* Header Row: Horários column + 7 Day columns with Center Alignment */}
              <div
                className={`grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border-b ${
                  isDark
                    ? 'border-white/15 bg-black/40'
                    : 'border-slate-200 bg-slate-100/90'
                }`}
              >
                {/* Extreme Left Header (Horário) */}
                <div
                  className={`flex flex-col items-center justify-center py-2.5 px-1 border-r text-center ${
                    isDark ? 'border-white/10' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-pink-500" />
                    <span className={`font-bold text-xs tracking-wide ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      Hora
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono mt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    Início
                  </span>
                </div>

                {/* 7 Day Headers: Day centered on top (larger), Date below (smaller) */}
                {weekDetails.days.map((dayInfo) => {
                  const isToday = dayInfo.isToday;
                  return (
                    <div
                      key={dayInfo.dayOfWeek}
                      className={`flex flex-col items-center justify-center py-2 px-1 text-center border-r last:border-r-0 transition ${
                        isDark ? 'border-white/10' : 'border-slate-200'
                      } ${
                        isToday
                          ? isDark
                            ? 'bg-pink-950/20 text-white'
                            : 'bg-pink-50 text-pink-900'
                          : isDark
                          ? 'text-zinc-300'
                          : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                        )}
                        <span
                          className={`font-extrabold text-sm tracking-wide ${
                            isToday
                              ? isDark
                                ? 'text-white'
                                : 'text-pink-900'
                              : isDark
                              ? 'text-zinc-200'
                              : 'text-slate-800'
                          }`}
                        >
                          {dayInfo.dayOfWeek}
                        </span>
                        {isToday && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-pink-500 text-white shadow">
                            HOJE
                          </span>
                        )}
                      </div>

                      <span
                        className={`text-xs font-mono font-medium mt-0.5 ${
                          isToday
                            ? isDark
                              ? 'text-pink-300 font-bold'
                              : 'text-pink-600 font-bold'
                            : isDark
                            ? 'text-zinc-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {dayInfo.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Grid Body: 10 hourly rows (14:00 to 23:00) */}
              <div
                className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] relative"
                style={{ height: `${totalGridHeight}px` }}
              >
                {/* 1. EXTREME LEFT COLUMN: Hour by hour labels aligned with table row lines */}
                <div
                  className={`border-r flex flex-col ${
                    isDark
                      ? 'border-white/10 bg-black/25'
                      : 'border-slate-200 bg-slate-50/90'
                  }`}
                >
                  {SCHEDULE_HOURS.map((hour, idx) => (
                    <div
                      key={hour}
                      style={{ height: `${GRID_ROW_HEIGHT}px` }}
                      className={`flex items-center justify-center font-mono text-xs font-bold border-t transition ${
                        idx === 0
                          ? 'border-transparent'
                          : isDark
                          ? 'border-white/[0.08]'
                          : 'border-slate-200'
                      } ${
                        isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>{hour}</span>
                    </div>
                  ))}
                </div>

                {/* 2. 7 DAY COLUMNS: Hourly background lines + Content cards */}
                {weekDetails.days.map((dayInfo) => {
                  const dayData = schedule.find((d) => d.dayOfWeek === dayInfo.dayOfWeek);
                  const isToday = dayInfo.isToday;

                  return (
                    <div
                      key={dayInfo.dayOfWeek}
                      className={`relative border-r last:border-r-0 ${
                        isDark ? 'border-white/10' : 'border-slate-200'
                      } ${
                        isToday
                          ? isDark
                            ? 'bg-pink-950/5'
                            : 'bg-pink-50/30'
                          : ''
                      }`}
                      style={{ height: `${totalGridHeight}px` }}
                    >
                      {/* Background horizontal lines matching the left column hour-by-hour */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col">
                        {SCHEDULE_HOURS.map((_, idx) => (
                          <div
                            key={idx}
                            style={{ height: `${GRID_ROW_HEIGHT}px` }}
                            className={`w-full border-t ${
                              idx === 0
                                ? 'border-transparent'
                                : isDark
                                ? 'border-white/[0.08]'
                                : 'border-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Day Content Cards positioned at their respective hours */}
                      {(dayData?.items || []).map((card) => {
                        // Check if it's Folga (day off)
                        if (card.isFolga) {
                          return (
                            <div
                              key={card.id}
                              style={{
                                top: '4px',
                                bottom: '4px',
                                left: '4px',
                                right: '4px',
                              }}
                              className={`absolute rounded-xl border border-dashed flex flex-col items-center justify-center p-3 text-center transition group z-10 ${
                                isDark
                                  ? 'border-white/15 bg-black/30 text-zinc-500 hover:border-white/25'
                                  : 'border-slate-300 bg-slate-100/70 text-slate-500 hover:border-slate-400'
                              }`}
                            >
                              <Moon className="w-5 h-5 mb-1.5 text-zinc-400 group-hover:text-zinc-600 transition" />
                              <span
                                className={`text-xs font-bold tracking-wide ${
                                  isDark ? 'text-zinc-400' : 'text-slate-600'
                                }`}
                              >
                                Folga
                              </span>
                              <span
                                className={`text-[10px] mt-0.5 ${
                                  isDark ? 'text-zinc-600' : 'text-slate-400'
                                }`}
                              >
                                Sem transmissão hoje
                              </span>
                            </div>
                          );
                        }

                        // Determine start and end hours for precise vertical alignment
                        const start = card.startHour ?? parseTimeToHour(card.time, 14);
                        const end = card.endHour ?? (start + 2.5);
                        const clampedStart = Math.max(GRID_START_HOUR, Math.min(start, 24));
                        const clampedEnd = Math.max(clampedStart + 0.8, Math.min(end, 24));

                        const top = (clampedStart - GRID_START_HOUR) * GRID_ROW_HEIGHT;
                        const durationHours = clampedEnd - clampedStart;
                        const height = Math.max(
                          GRID_ROW_HEIGHT - 4,
                          durationHours * GRID_ROW_HEIGHT - 3
                        );

                        return (
                          <div
                            key={card.id}
                            onClick={() => setActiveModalCard(card)}
                            style={{
                              top: `${top + 1}px`,
                              height: `${height}px`,
                              left: '3px',
                              right: '3px',
                            }}
                            className={`absolute rounded-xl overflow-hidden border bg-[#121620] shadow-lg cursor-pointer group transition-all duration-200 z-10 hover:z-20 hover:scale-[1.01] ${
                              isDark
                                ? 'border-white/15 hover:border-pink-500/70 hover:shadow-pink-500/20'
                                : 'border-slate-300/80 hover:border-pink-500 shadow-slate-200/60 hover:shadow-pink-500/15'
                            }`}
                          >
                            {/* Background Poster Image */}
                            <img
                              src={card.posterUrl}
                              alt={card.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />

                            {/* Dark Gradient Overlay for Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/35 group-hover:via-black/45 transition-colors" />

                            {/* Card Details: Top Badge + Bottom Title and Time */}
                            <div className="relative h-full flex flex-col justify-between p-2">
                              {/* Top Bar: Rating and Episode/Movie Badge */}
                              <div className="flex items-center justify-between gap-1">
                                {card.rating ? (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold text-amber-400 bg-black/75 backdrop-blur-xs border border-amber-400/30 flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                                    {card.rating.replace('⭐', '').trim()}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-wider drop-shadow truncate">
                                    {card.category}
                                  </span>
                                )}

                                {card.badge && (
                                  <span className="px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] font-extrabold uppercase bg-black/85 backdrop-blur-md text-white border border-white/25 tracking-wider shadow">
                                    {card.badge}
                                  </span>
                                )}
                              </div>

                              {/* Bottom Bar: Title & Time */}
                              <div className="space-y-0.5">
                                <h4 className="font-extrabold text-white text-xs leading-snug drop-shadow truncate group-hover:text-pink-300 transition">
                                  {card.title}
                                </h4>

                                <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-300">
                                  <Clock className="w-2.5 h-2.5 text-pink-400 flex-shrink-0" />
                                  <span className="truncate">
                                    {card.time || `${Math.floor(start)}:00`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: CARDS VERTICAIS (Idêntico ao painel de administração / screenshot)
            ========================================================================= */}
        {viewMode === 'cards' && (
          <div
            className={`border rounded-2xl overflow-hidden shadow-2xl transition-colors ${
              isDark
                ? 'bg-[#121620]/95 border-white/10'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            {/* Header da Seção de Conteúdos por Dia */}
            <div
              className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Conteúdos por Dia da Semana
                  </h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold ${
                      isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {weekDetails.label}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  Grade organizada por dia com cartazes verticais (2:3) e horários de cada filme ou episódio.
                </p>
              </div>

              {isLoggedIn && onManageClick && (
                <button
                  type="button"
                  onClick={onManageClick}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-pink-600/20 transition self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Gerenciar no Painel</span>
                </button>
              )}
            </div>

            {/* Lista dos Dias da Semana */}
            <div className="p-4 sm:p-6 space-y-5">
              {weekDetails.days.map((dayInfo) => {
                const dayData = schedule.find((d) => d.dayOfWeek === dayInfo.dayOfWeek);
                const items = dayData?.items || [];
                const hasItems = items.length > 0;

                return (
                  <div
                    key={dayInfo.dayOfWeek}
                    className={`p-4 sm:p-5 rounded-2xl border space-y-3.5 transition-all ${
                      dayInfo.isToday
                        ? isDark
                          ? 'bg-gradient-to-r from-pink-950/20 via-[#0b0e14] to-[#0b0e14] border-pink-500/40 shadow-lg shadow-pink-950/20'
                          : 'bg-gradient-to-r from-pink-50/70 via-white to-white border-pink-300 shadow-md shadow-pink-100/60'
                        : isDark
                        ? 'bg-[#0b0e14] border-white/5 hover:border-white/10'
                        : 'bg-slate-50 border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    {/* Cabeçalho do Dia */}
                    <div
                      className={`flex items-center justify-between border-b pb-2.5 ${
                        dayInfo.isToday
                          ? isDark
                            ? 'border-pink-500/30'
                            : 'border-pink-200'
                          : isDark
                          ? 'border-white/5'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-2.5">
                        <span
                          className={`font-extrabold text-sm sm:text-base ${
                            dayInfo.isToday
                              ? isDark
                                ? 'text-pink-300'
                                : 'text-pink-600'
                              : isDark
                              ? 'text-white'
                              : 'text-slate-900'
                          }`}
                        >
                          {dayInfo.dayOfWeek}
                        </span>
                        <span
                          className={`text-xs font-mono ${
                            dayInfo.isToday
                              ? isDark
                                ? 'text-pink-400 font-bold'
                                : 'text-pink-600 font-bold'
                              : isDark
                              ? 'text-zinc-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {dayInfo.date}
                        </span>
                        {dayInfo.isToday && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/40">
                            HOJE
                          </span>
                        )}
                      </div>

                      {isLoggedIn && onManageClick ? (
                        <button
                          type="button"
                          onClick={onManageClick}
                          className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Adicionar card em {dayInfo.dayOfWeek}</span>
                        </button>
                      ) : (
                        <span
                          className={`text-[11px] font-mono ${
                            isDark ? 'text-zinc-500' : 'text-slate-400'
                          }`}
                        >
                          {items.length === 0 || (items.length === 1 && items[0].isFolga)
                            ? 'Folga'
                            : `${items.length} ${items.length === 1 ? 'conteúdo' : 'conteúdos'}`}
                        </span>
                      )}
                    </div>

                    {/* Cards do Dia */}
                    {!hasItems ? (
                      <div
                        className={`p-3.5 rounded-xl border border-dashed inline-flex items-center gap-2 text-xs ${
                          isDark
                            ? 'border-white/10 bg-white/[0.02] text-zinc-400'
                            : 'border-slate-200 bg-white text-slate-500'
                        }`}
                      >
                        <Moon className="w-4 h-4 text-purple-400" />
                        <span>Dia de Folga</span>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {items.map((card) => {
                          if (card.isFolga) {
                            return (
                              <div
                                key={card.id}
                                className={`col-span-2 sm:col-span-1 p-3 rounded-xl border flex items-center gap-2 text-xs ${
                                  isDark
                                    ? 'border-white/10 bg-white/[0.02] text-zinc-300'
                                    : 'border-slate-200 bg-white text-slate-700'
                                }`}
                              >
                                <Moon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                <span className="font-semibold">Dia de Folga</span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={card.id}
                              onClick={() => setActiveModalCard(card)}
                              className={`group relative rounded-xl border overflow-hidden p-2 flex flex-col justify-between shadow-xs transition-all duration-200 cursor-pointer hover:scale-[1.02] ${
                                isDark
                                  ? 'border-white/10 bg-black hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-950/30'
                                  : 'border-slate-200 bg-white hover:border-pink-500/50 hover:shadow-md'
                              }`}
                            >
                              {/* Capa Vertical (2:3) */}
                              <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-900 mb-2 relative">
                                <img
                                  src={card.posterUrl}
                                  alt={card.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
                                  }}
                                />
                                {card.badge && (
                                  <div className="absolute top-1 right-1">
                                    <span className="px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-extrabold uppercase bg-black/85 backdrop-blur-md text-white border border-white/20 tracking-wider shadow">
                                      {card.badge}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Título e Horário */}
                              <div className="space-y-0.5">
                                <div
                                  className={`text-xs font-bold truncate group-hover:text-pink-400 transition-colors ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                  }`}
                                  title={card.title}
                                >
                                  {card.title}
                                </div>
                                <div
                                  className={`text-[10px] sm:text-[11px] font-mono flex items-center gap-1 ${
                                    isDark ? 'text-zinc-400' : 'text-slate-500'
                                  }`}
                                >
                                  <Clock className="w-2.5 h-2.5 text-pink-400 flex-shrink-0" />
                                  <span className="truncate">{card.time || '--:--'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div
          className={`mt-3 flex flex-col sm:flex-row items-center justify-between text-xs px-2 gap-2 ${
            isDark ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-pink-400" />
            <span>
              Clique em qualquer card da grade para ver informações completas do filme ou série.
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              <span>Transmissões ao vivo</span>
            </span>
            <span className={isDark ? 'text-zinc-600' : 'text-slate-400'}>|</span>
            <span>Grade compacta sem scroll vertical excessivo</span>
          </div>
        </div>
      </div>

      {/* Modal with Full 2:3 Vertical Poster & Details */}
      {activeModalCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className={`border rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 transition-colors ${
              isDark
                ? 'bg-[#121620] border-white/15 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-slate-400/50'
            }`}
          >
            <div className="flex gap-4">
              <div className="w-28 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-black border border-white/10 shadow-lg">
                <img
                  src={activeModalCard.posterUrl}
                  alt={activeModalCard.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  {activeModalCard.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/40">
                      {activeModalCard.badge}
                    </span>
                  )}
                  {activeModalCard.category && (
                    <span className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                      {activeModalCard.category}
                    </span>
                  )}
                </div>

                <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {activeModalCard.title}
                </h3>

                {activeModalCard.time && (
                  <div className={`flex items-center gap-1.5 text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                    <Clock className="w-3.5 h-3.5 text-pink-400" />
                    <span>Horário previsto: {activeModalCard.time}</span>
                  </div>
                )}

                <p className={`text-xs pt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Transmissão ao vivo interativa na Twitch com o chat assistindo junto no Discord.
                </p>
              </div>
            </div>

            <div className={`mt-6 pt-4 border-t flex justify-end ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <button
                onClick={() => setActiveModalCard(null)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
