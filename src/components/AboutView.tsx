import React, { useState } from 'react';
import type { StreamerUser } from '../types';
import { PC_SPECS, PERIPHERALS } from '../data';
import { useTheme } from '../context/ThemeContext';
import {
  Cpu,
  Headphones,
  Copy,
  Check,
  Radio,
  Star,
  ShieldCheck,
  Globe,
  Heart,
} from 'lucide-react';

interface AboutViewProps {
  streamer: StreamerUser;
  onNavigateToDonations: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  streamer,
  onNavigateToDonations,
}) => {
  const { isDark } = useTheme();
  const [copiedEpic, setCopiedEpic] = useState(false);

  const handleCopyEpic = () => {
    navigator.clipboard.writeText(streamer.epicCode || 'AZUK');
    setCopiedEpic(true);
    setTimeout(() => setCopiedEpic(false), 2500);
  };

  return (
    <section className="relative min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8">
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

      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Streamer Profile Hero Card */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-colors ${
            isDark
              ? 'bg-[#121620]/90 backdrop-blur-xl border-white/10'
              : 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            {/* Streamer Avatar */}
            <div className="relative flex-shrink-0">
              <img
                src={streamer.avatarUrl}
                alt={streamer.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-pink-500/50 shadow-2xl"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase bg-pink-600 text-white shadow-md border-2 border-[#121620]">
                Ao Vivo
              </span>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {streamer.fullName || 'Patrick Dória'} ({streamer.name})
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30">
                  Streamer & Criador
                </span>
              </div>

              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {streamer.age || '28 anos'} • {streamer.location || 'São Paulo - SP'} • Ex-Pro Player de FPS, focado em ARPGs, MMOs e Sobrevivência.
              </p>

              <blockquote className={`text-xs sm:text-sm italic leading-relaxed p-3 rounded-2xl border ${
                isDark
                  ? 'bg-black/30 border-white/5 text-zinc-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                "{streamer.bio}"
              </blockquote>

              {/* Epic Code Badge & Action */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  isDark ? 'bg-black/40 border-white/10' : 'bg-slate-100 border-slate-200'
                }`}>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className={`text-xs font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    Tag Epic Games:
                  </span>
                  <code className="text-xs font-black text-pink-500 font-mono">
                    {streamer.epicCode || 'AZUK'}
                  </code>
                  <button
                    onClick={handleCopyEpic}
                    className="p-1 rounded text-zinc-400 hover:text-white transition cursor-pointer"
                    title="Copiar código Epic"
                  >
                    {copiedEpic ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <button
                  onClick={onNavigateToDonations}
                  className="px-4 py-1.5 rounded-xl font-bold text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white transition shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>Apoiar Streamer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <a
            href={`https://${streamer.channel}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#9146FF]/15 hover:bg-[#9146FF]/25 border border-[#9146FF]/30 text-purple-300 hover:text-white flex items-center justify-center gap-2 transition group shadow-sm"
          >
            <Radio className="w-4 h-4 text-[#9146FF] group-hover:scale-110 transition" />
            <span className="text-xs font-bold">Twitch</span>
          </a>

          <a
            href={streamer.kickUrl || 'https://kick.com/azuk'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#53FC18]/10 hover:bg-[#53FC18]/20 border border-[#53FC18]/30 text-[#53FC18] flex items-center justify-center gap-2 transition group shadow-sm"
          >
            <Globe className="w-4 h-4 text-[#53FC18] group-hover:scale-110 transition" />
            <span className="text-xs font-bold">Kick</span>
          </a>

          <a
            href={streamer.youtubeUrl || 'https://www.youtube.com/@TTVoAzuK'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-red-600/10 hover:bg-red-600/20 border border-red-500/30 text-red-400 hover:text-red-300 flex items-center justify-center gap-2 transition group shadow-sm"
          >
            <svg className="w-4 h-4 fill-red-500 group-hover:scale-110 transition" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-xs font-bold">YouTube</span>
          </a>

          <a
            href={streamer.instagramUrl || 'https://www.instagram.com/patrickdoria'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-pink-600/10 hover:bg-pink-600/20 border border-pink-500/30 text-pink-400 hover:text-pink-300 flex items-center justify-center gap-2 transition group shadow-sm"
          >
            <svg className="w-4 h-4 fill-pink-500 group-hover:scale-110 transition" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="text-xs font-bold">Instagram</span>
          </a>

          <a
            href={streamer.twitterUrl || 'https://www.twitter.com/fourzuk'}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-sky-600/10 hover:bg-sky-600/20 border border-sky-500/30 text-sky-400 hover:text-sky-300 flex items-center justify-center gap-2 transition group shadow-sm col-span-2 sm:col-span-1"
          >
            <svg className="w-4 h-4 fill-sky-400 group-hover:scale-110 transition" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span className="text-xs font-bold">Twitter (X)</span>
          </a>
        </div>

        {/* Hardware & Peripherals Setup Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PC Specs */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-colors ${
              isDark
                ? 'bg-[#121620] border-white/10'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
              <Cpu className="w-5 h-5 text-pink-500" />
              <h2 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Setup do Computador (Hardware)
              </h2>
            </div>

            <div className="space-y-2.5">
              {PC_SPECS.map((spec, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                    isDark
                      ? 'bg-[#0b0e14] border-white/5'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-zinc-400 font-medium' : 'text-slate-500 font-medium'}>
                    {spec.label}
                  </span>
                  <span className={`font-mono font-bold text-right ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {spec.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Peripherals & Accessories */}
          <div
            className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-colors ${
              isDark
                ? 'bg-[#121620] border-white/10'
                : 'bg-white border-slate-200 shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
              <Headphones className="w-5 h-5 text-purple-400" />
              <h2 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Periféricos & Equipamentos
              </h2>
            </div>

            <div className="space-y-2.5">
              {PERIPHERALS.map((peri, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition ${
                    isDark
                      ? 'bg-[#0b0e14] border-white/5'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className={isDark ? 'text-zinc-400 font-medium' : 'text-slate-500 font-medium'}>
                    {peri.label}
                  </span>
                  <span className={`font-mono font-bold text-right ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {peri.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Atalho para aba de Inscrições e Doações */}
            <div
              className={`mt-4 p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isDark
                  ? 'bg-purple-950/20 border-purple-500/20'
                  : 'bg-purple-50 border-purple-200'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Heart className="w-4 h-4 text-pink-500 flex-shrink-0" />
                <span className={isDark ? 'text-zinc-300' : 'text-slate-700'}>
                  Quer apoiar o streamer ou se tornar SUB?
                </span>
              </div>
              <button
                type="button"
                onClick={onNavigateToDonations}
                className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition flex-shrink-0 cursor-pointer shadow-sm"
              >
                Ver Doações & SUB
              </button>
            </div>
          </div>
        </div>

        {/* Rules & Community */}
        <div
          className={`p-6 sm:p-7 rounded-3xl border shadow-xl transition-colors ${
            isDark ? 'bg-[#121620] border-white/10' : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className={`font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Regras e Convivência no Chat
            </h2>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-pink-500 mb-1">1. Resenha & Chat Aberto</h4>
              <p>O foco principal da live é interagir com o chat. Fique à vontade para conversar, dar risada e opinar sobre a gameplay.</p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-purple-400 mb-1">2. Respeito Mútuo</h4>
              <p>Não seja tóxico com outros espectadores ou moderadores. Discursos de ódio, spam ou preconceito geram banimento imediato.</p>
            </div>

            <div className={`p-4 rounded-2xl border ${isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <h4 className="font-bold text-blue-400 mb-1">3. English Speakers Welcome</h4>
              <p>Feel free to chat in English! Patrick and the community are happy to communicate with international viewers.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

