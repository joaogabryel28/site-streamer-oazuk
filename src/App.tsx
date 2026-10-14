import { useState, useEffect } from 'react';
import type { DaySchedule, StreamerUser, ActiveTab } from './types';
import { INITIAL_STREAMER, INITIAL_WEEK_SCHEDULE } from './data';
import { Header } from './components/Header';
import { ScheduleTable } from './components/ScheduleTable';
import { DonationsView } from './components/DonationsView';
import { AboutView } from './components/AboutView';
import { StreamerDashboard } from './components/StreamerDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const { isDark } = useTheme();
  const [streamer] = useState<StreamerUser>(INITIAL_STREAMER);

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem('clean_streamer_week_schedule_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].items)) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_WEEK_SCHEDULE;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('clean_streamer_auth_v2') === 'true';
  });

  const [currentView, setCurrentView] = useState<ActiveTab>('schedule');

  // Persist schedule
  useEffect(() => {
    localStorage.setItem('clean_streamer_week_schedule_v3', JSON.stringify(schedule));
  }, [schedule]);

  // Persist login
  useEffect(() => {
    localStorage.setItem('clean_streamer_auth_v2', isLoggedIn ? 'true' : 'false');
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('admin');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('schedule');
  };

  const handleResetDefaults = () => {
    setSchedule(INITIAL_WEEK_SCHEDULE);
    localStorage.removeItem('clean_streamer_week_schedule_v3');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-pink-600 selection:text-white transition-colors duration-300 ${
        isDark ? 'bg-[#0b0c10] text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Clean Header with Navigation and Theme Toggle */}
      <Header
        streamer={streamer}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'schedule' && (
          <ScheduleTable
            schedule={schedule}
            onManageClick={() => setCurrentView('admin')}
            isLoggedIn={isLoggedIn}
          />
        )}

        {currentView === 'donations' && (
          <DonationsView streamer={streamer} />
        )}

        {currentView === 'about' && (
          <AboutView
            streamer={streamer}
            onNavigateToDonations={() => setCurrentView('donations')}
          />
        )}

        {(currentView === 'admin' || currentView === 'login') && (
          <StreamerDashboard
            schedule={schedule}
            setSchedule={setSchedule}
            streamer={streamer}
            isLoggedIn={isLoggedIn}
            onLogin={handleLogin}
            onLogout={handleLogout}
            onBackToSchedule={() => setCurrentView('schedule')}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </main>

      {/* Minimal Footer */}
      <footer
        className={`border-t py-4 text-center text-xs backdrop-blur-sm transition-colors ${
          isDark
            ? 'border-white/5 bg-[#07080a]/80 text-zinc-500'
            : 'border-slate-200 bg-white/80 text-slate-500'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} {streamer.name} • Cronograma Semanal de Transmissões
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <button
              onClick={() => setCurrentView('schedule')}
              className="hover:underline cursor-pointer"
            >
              Cronograma
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('donations')}
              className="hover:underline cursor-pointer"
            >
              Doações
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentView('about')}
              className="hover:underline cursor-pointer"
            >
              Sobre & Setup
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
