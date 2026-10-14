import React, { useState } from 'react';
import type { DaySchedule, ScheduleCard, DayOfWeek, StreamerUser } from '../types';
import { POSTER_PRESETS } from '../data';
import { parseTimeRange } from '../utils/weekDate';
import { useTheme } from '../context/ThemeContext';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  User,
  LogOut,
  ArrowLeft,
  Moon,
} from 'lucide-react';

interface StreamerDashboardProps {
  schedule: DaySchedule[];
  setSchedule: React.Dispatch<React.SetStateAction<DaySchedule[]>>;
  streamer: StreamerUser;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onBackToSchedule: () => void;
  onResetDefaults: () => void;
}

const DAYS: DayOfWeek[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

export const StreamerDashboard: React.FC<StreamerDashboardProps> = ({
  schedule,
  setSchedule,
  streamer,
  isLoggedIn,
  onLogin,
  onLogout,
  onBackToSchedule,
  onResetDefaults,
}) => {
  const { isDark } = useTheme();

  // Login form state
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Content card state
  const [targetDay, setTargetDay] = useState<DayOfWeek>('Quarta');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [cardForm, setCardForm] = useState<Omit<ScheduleCard, 'id'>>({
    title: 'The Flash',
    posterUrl: POSTER_PRESETS[0].posterUrl,
    badge: '1 EP',
    time: '20:00',
    category: 'Série',
    isFolga: false,
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (usernameInput.toLowerCase() === 'oazuk' || usernameInput.toLowerCase() === 'admin') &&
      (passwordInput === 'streamer123' || passwordInput === 'admin')
    ) {
      onLogin();
      setLoginError(null);
    } else {
      setLoginError('Credenciais inválidas. Use "oazuk" e senha "streamer123".');
    }
  };

  const fillDemoLogin = () => {
    setUsernameInput('oazuk');
    setPasswordInput('streamer123');
    setLoginError(null);
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.title.trim() && !cardForm.isFolga) return;

    const timeRange = parseTimeRange(cardForm.time, 14);
    const enrichedCard: Omit<ScheduleCard, 'id'> = {
      ...cardForm,
      startHour: cardForm.startHour ?? timeRange.start,
      endHour: cardForm.endHour ?? timeRange.end,
    };

    setSchedule((prevSchedule) => {
      return prevSchedule.map((day) => {
        if (day.dayOfWeek !== targetDay) return day;

        if (editingCardId) {
          return {
            ...day,
            items: day.items.map((c) =>
              c.id === editingCardId ? { ...enrichedCard, id: editingCardId } : c
            ),
          };
        } else {
          const newCard: ScheduleCard = {
            ...enrichedCard,
            id: `card-${Date.now()}`,
          };
          return {
            ...day,
            items: [...day.items, newCard],
          };
        }
      });
    });

    setFeedbackMsg('Card salvo com sucesso no cronograma!');
    setEditingCardId(null);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleStartEdit = (dayOfWeek: DayOfWeek, card: ScheduleCard) => {
    setTargetDay(dayOfWeek);
    setEditingCardId(card.id);
    setCardForm({
      title: card.title,
      posterUrl: card.posterUrl,
      badge: card.badge || '1 EP',
      time: card.time || '18:00',
      category: card.category || 'Série',
      isFolga: card.isFolga || false,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCard = (dayOfWeek: DayOfWeek, cardId: string) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          items: day.items.filter((c) => c.id !== cardId),
        };
      })
    );
    setFeedbackMsg('Card removido com sucesso.');
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleSetDayAsFolga = (dayOfWeek: DayOfWeek) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day;
        return {
          ...day,
          items: [
            {
              id: `folga-${Date.now()}`,
              title: 'Folga',
              posterUrl: '',
              isFolga: true,
              startHour: 14,
              endHour: 24,
              time: '14:00 - 00:00',
            },
          ],
        };
      })
    );
    setFeedbackMsg(`Dia ${dayOfWeek} marcado como Folga!`);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  // IF NOT LOGGED IN: In-page Login Form
  if (!isLoggedIn) {
    return (
      <section className="py-16 max-w-md mx-auto px-4">
        <div
          className={`border rounded-2xl p-6 sm:p-8 shadow-2xl transition-colors ${
            isDark
              ? 'bg-[#121620] border-white/10'
              : 'bg-white border-slate-200 shadow-slate-300/60'
          }`}
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-pink-600/20 border border-pink-500/40 text-pink-500 mx-auto flex items-center justify-center mb-3">
              <User className="w-6 h-6" />
            </div>
            <h2 className={`text-xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Conta do Streamer
            </h2>
            <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Acesse a conta para cadastrar e editar conteúdos no cronograma.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
                {loginError}
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Nome de Usuário
              </label>
              <input
                type="text"
                placeholder="Ex: oazuk"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Senha de Acesso
              </label>
              <input
                type="password"
                placeholder="Sua senha secreta"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full border rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
                required
              />
            </div>

            {/* Quick Demo Helper */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isDark
                  ? 'bg-pink-950/20 border-pink-500/30'
                  : 'bg-pink-50 border-pink-200'
              }`}
            >
              <div>
                <span className="font-bold text-pink-600 dark:text-pink-300 block">Conta Demo:</span>
                <span className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  User: <code className="font-bold">oazuk</code> | Senha:{' '}
                  <code className="font-bold">streamer123</code>
                </span>
              </div>
              <button
                type="button"
                onClick={fillDemoLogin}
                className="px-2.5 py-1 rounded-lg bg-pink-600/30 hover:bg-pink-600/50 text-pink-600 dark:text-pink-200 text-xs font-bold border border-pink-500/30 transition"
              >
                Preencher
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-600/25 transition cursor-pointer"
            >
              Entrar na Conta
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onBackToSchedule}
                className={`text-xs transition inline-flex items-center gap-1 ${
                  isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao cronograma público</span>
              </button>
            </div>
          </form>
        </div>
      </section>
    );
  }

  // IF LOGGED IN: In-page Management Dashboard
  return (
    <section className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner with Streamer Session Info */}
      <div
        className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
          isDark
            ? 'bg-[#121620] border-white/10'
            : 'bg-white border-slate-200 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3">
          <img
            src={streamer.avatarUrl}
            alt={streamer.name}
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-pink-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Painel do Streamer
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30">
                Logado como {streamer.name}
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Cadastre e gerencie os cards verticais de filmes, séries e animes no calendário.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30 flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5" />
              {feedbackMsg}
            </span>
          )}

          <button
            onClick={onBackToSchedule}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Cronograma</span>
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 transition cursor-pointer"
            title="Sair da Conta"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sair</span>
          </button>
        </div>
      </div>

      {/* CARD FORM: Add / Edit a poster card */}
      <div
        className={`border rounded-2xl p-6 sm:p-8 shadow-xl transition-colors ${
          isDark
            ? 'bg-[#121620] border-white/10'
            : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}
      >
        <div className={`flex items-center justify-between pb-4 mb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Plus className="w-4 h-4 text-pink-500" />
              {editingCardId ? 'Editar Card Selecionado' : 'Adicionar Novo Card no Calendário'}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Escolha o dia da semana, selecione um pôster pronto ou digite um novo filme/anime.
            </p>
          </div>

          {editingCardId && (
            <button
              onClick={() => {
                setEditingCardId(null);
                setCardForm({
                  title: 'The Flash',
                  posterUrl: POSTER_PRESETS[0].posterUrl,
                  badge: '1 EP',
                  time: '20:00',
                  category: 'Série',
                  isFolga: false,
                });
              }}
              className={`text-xs underline ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Cancelar edição
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCard} className="space-y-5">
          {/* Row 1: Target Day, Badge, Time, Category */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Dia da Semana (Coluna)
              </label>
              <select
                value={targetDay}
                onChange={(e) => setTargetDay(e.target.value as DayOfWeek)}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Badge do Card (Ex: 1 EP, 4 EPS, FILME)
              </label>
              <input
                type="text"
                placeholder="Ex: 4 EPS ou FILME"
                value={cardForm.badge}
                onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Horário Previsto
              </label>
              <input
                type="text"
                placeholder="Ex: 14:00 ou 14:00 - 17:00"
                value={cardForm.time}
                onChange={(e) => setCardForm({ ...cardForm, time: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Série, Anime, Filme"
                value={cardForm.category}
                onChange={(e) => setCardForm({ ...cardForm, category: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 transition ${
                  isDark
                    ? 'bg-[#0b0e14] border-white/10 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Row 2: Title & Quick Presets */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className={`block text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                Título do Conteúdo / Filme / Série
              </label>

              <button
                type="button"
                onClick={() => handleSetDayAsFolga(targetDay)}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition ${
                  isDark
                    ? 'text-zinc-400 hover:text-white bg-white/5 border-white/10'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Marcar este dia como Folga 🌙</span>
              </button>
            </div>

            <input
              type="text"
              placeholder="Ex: Ben 10 ou Rick and Morty"
              value={cardForm.title}
              onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 transition ${
                isDark
                  ? 'bg-[#0b0e14] border-white/10 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
              required={!cardForm.isFolga}
            />

            {/* Presets Grid */}
            <div
              className={`p-3.5 rounded-xl border space-y-2 ${
                isDark ? 'bg-[#0b0e14] border-white/10' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <span className={`text-[11px] font-semibold block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Escolher capa vertical pronta (da imagem de referência):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {POSTER_PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p.title}
                    onClick={() => {
                      setCardForm({
                        ...cardForm,
                        title: p.title,
                        badge: p.badge,
                        posterUrl: p.posterUrl,
                        category: p.category,
                        isFolga: false,
                      });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition ${
                      cardForm.title === p.title
                        ? 'bg-pink-600 text-white border-pink-500 shadow-sm'
                        : isDark
                        ? 'bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 shadow-xs'
                    }`}
                  >
                    {p.title} ({p.badge})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Poster URL & Preview */}
          <div
            className={`flex flex-col sm:flex-row gap-4 items-start p-4 rounded-xl border ${
              isDark ? 'bg-[#0b0e14] border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex-1 w-full space-y-2">
              <label className={`block text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                URL da Imagem Vertical (Pôster)
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/poster.jpg"
                value={cardForm.posterUrl}
                onChange={(e) => setCardForm({ ...cardForm, posterUrl: e.target.value })}
                className={`w-full border rounded-xl px-3 py-2 text-xs outline-none focus:border-pink-500 font-mono ${
                  isDark
                    ? 'bg-[#121620] border-white/10 text-white'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
            </div>

            {/* Live Vertical Preview */}
            <div className="flex items-center gap-3">
              <div className="w-20 aspect-[2/3] rounded-xl overflow-hidden border border-pink-500/40 bg-black shadow-lg relative flex-shrink-0">
                <img
                  src={cardForm.posterUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                {cardForm.badge && (
                  <div className="absolute top-1 right-1">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/80 text-white">
                      {cardForm.badge}
                    </span>
                  </div>
                )}
              </div>
              <div className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                <span className={`block font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  Preview 2:3
                </span>
                <span>Proporção de cartaz vertical</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-pink-600/30 transition hover:scale-105 cursor-pointer"
            >
              {editingCardId ? 'Salvar Alterações' : `Adicionar em ${targetDay}`}
            </button>
          </div>
        </form>
      </div>

      {/* ALL COLUMNS & CARDS MANAGEMENT TABLE */}
      <div
        className={`border rounded-2xl overflow-hidden shadow-xl transition-colors ${
          isDark ? 'bg-[#121620] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
        }`}
      >
        <div className={`p-4 sm:p-5 border-b flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div>
            <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Conteúdos por Dia da Semana
            </h3>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Gerencie cada coluna e ordene os filmes/episódios da grade.
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Restaurar o cronograma padrão da imagem de referência?')) {
                onResetDefaults();
                setFeedbackMsg('Padrão restaurado com sucesso!');
              }
            }}
            className={`flex items-center gap-1.5 text-xs transition ${
              isDark ? 'text-zinc-400 hover:text-pink-400' : 'text-slate-500 hover:text-pink-600'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão da Imagem</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {schedule.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`p-4 rounded-xl border space-y-3 transition-colors ${
                isDark ? 'bg-[#0b0e14] border-white/5' : 'bg-slate-50 border-slate-200/80'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-2 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {day.dayOfWeek}
                  </span>
                  <span className={`text-xs font-mono ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    {day.date}
                  </span>
                  {day.isToday && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/40">
                      HOJE
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setTargetDay(day.dayOfWeek);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Adicionar card em {day.dayOfWeek}</span>
                </button>
              </div>

              {/* Cards in this day */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {(day.items || []).map((card) => {
                  if (card.isFolga) {
                    return (
                      <div
                        key={card.id}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          isDark
                            ? 'border-white/10 bg-white/[0.02]'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className={`flex items-center gap-1.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          <Moon className="w-3.5 h-3.5" />
                          <span>Dia de Folga</span>
                        </div>
                        <button
                          onClick={() => handleDeleteCard(day.dayOfWeek, card.id)}
                          className="p-1 rounded text-red-500 hover:bg-red-500/10"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={card.id}
                      className={`group relative rounded-xl border overflow-hidden p-2 flex flex-col justify-between shadow-xs transition ${
                        isDark ? 'border-white/10 bg-black' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="aspect-[2/3] w-full rounded-lg overflow-hidden bg-zinc-900 mb-2 relative">
                        <img
                          src={card.posterUrl}
                          alt={card.title}
                          className="w-full h-full object-cover"
                        />
                        {card.badge && (
                          <div className="absolute top-1 right-1">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-black/80 text-white">
                              {card.badge}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className={`text-[11px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {card.title}
                      </div>
                      <div className={`text-[10px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                        {card.time || '--:--'}
                      </div>

                      <div className={`flex items-center justify-end gap-1 mt-2 pt-2 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                        <button
                          onClick={() => handleStartEdit(day.dayOfWeek, card)}
                          className="p-1 rounded bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-300"
                          title="Editar"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteCard(day.dayOfWeek, card.id)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-500"
                          title="Excluir"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
