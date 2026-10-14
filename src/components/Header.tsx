import React from 'react';
import type { StreamerUser, ActiveTab } from '../types';
import { Calendar, User, LogOut, Settings, Radio, Sun, Moon, Heart, Info } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  streamer: StreamerUser;
  currentView: ActiveTab;
  setCurrentView: (view: ActiveTab) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streamer,
  currentView,
  setCurrentView,
  isLoggedIn,
  onLogout,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className={`border-b sticky top-0 z-30 transition-colors duration-300 ${
        isDark
          ? 'border-white/10 bg-[#0f131c]/90 backdrop-blur-md'
          : 'border-slate-200 bg-white/90 backdrop-blur-md shadow-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Streamer Branding */}
        <button
          onClick={() => setCurrentView('schedule')}
          className="flex items-center gap-3 text-left group flex-shrink-0 cursor-pointer"
        >
          <img
            src={streamer.avatarUrl}
            alt={streamer.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/50 group-hover:ring-purple-400 transition"
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-extrabold text-base sm:text-lg transition ${
                  isDark
                    ? 'text-white group-hover:text-purple-400'
                    : 'text-slate-900 group-hover:text-purple-600'
                }`}
              >
                {streamer.name}
              </span>
              <span
                className={`hidden xs:inline-block px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                  isDark
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                    : 'bg-purple-100 text-purple-700 border-purple-200'
                }`}
              >
                Oficial
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              Site & Cronograma
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Aba Cronograma */}
          <button
            onClick={() => setCurrentView('schedule')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentView === 'schedule'
                ? 'bg-purple-600 text-white shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Cronograma</span>
          </button>

          {/* Aba Doação */}
          <button
            onClick={() => setCurrentView('donations')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentView === 'donations'
                ? 'bg-pink-600 text-white shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${currentView === 'donations' ? 'fill-white' : 'text-pink-500'}`} />
            <span className="hidden sm:inline">Doações</span>
          </button>

          {/* Aba Informações / Sobre */}
          <button
            onClick={() => setCurrentView('about')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              currentView === 'about'
                ? 'bg-purple-600 text-white shadow-sm'
                : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-white/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">Sobre & Setup</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
              isDark
                ? 'bg-white/5 border-white/10 text-amber-400 hover:bg-white/10 hover:text-amber-300'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
            title={isDark ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
            aria-label="Alternar tema claro/escuro"
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                <span className="hidden lg:inline text-[11px] text-zinc-300">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
                <span className="hidden lg:inline text-[11px] text-slate-700">Escuro</span>
              </>
            )}
          </button>

          {/* Streamer Account Status */}
          {isLoggedIn ? (
            <div
              className={`flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isDark
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Painel</span>
              </button>

              <button
                onClick={onLogout}
                className={`p-1.5 rounded-lg transition cursor-pointer ${
                  isDark
                    ? 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10'
                    : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                }`}
                title="Desconectar do painel"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setCurrentView('login')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                currentView === 'login'
                  ? 'bg-purple-600 text-white border-purple-500'
                  : isDark
                  ? 'text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border-white/10'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Login Streamer</span>
            </button>
          )}

          {/* Twitch Channel Link */}
          <a
            href={`https://${streamer.channel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#9146FF] hover:bg-[#772ce8] text-white transition shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Twitch</span>
          </a>
        </div>
      </div>
    </header>
  );
};
