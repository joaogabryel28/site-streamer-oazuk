import React, { useState } from 'react';
import type { StreamerUser } from '../types';
import { DONATION_ALERTS } from '../data';
import { useTheme } from '../context/ThemeContext';
import {
  Heart,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Volume2,
  Sparkles,
  ShieldAlert,
  DollarSign,
  Zap,
} from 'lucide-react';

interface DonationsViewProps {
  streamer: StreamerUser;
}

export const DonationsView: React.FC<DonationsViewProps> = ({ streamer }) => {
  const { isDark } = useTheme();
  const [copiedPix, setCopiedPix] = useState(false);

  const pixLink = streamer.livepixUrl || 'https://livepix.gg/azuk';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixLink);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
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
        {/* Header Hero */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/10 text-pink-600 dark:text-pink-300 border border-pink-500/20">
            <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
            <span>Apoie as Transmissões</span>
          </div>

          <h1 className={`text-3xl sm:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Contribua com a Live do <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">{streamer.name}</span>
          </h1>

          <p className={`max-w-2xl mx-auto text-sm sm:text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            "As doações ajudam diretamente a manter a live ativa todos os dias com qualidade, novos equipamentos e jogos. O valor não importa, o que importa é que veio do coração!"
          </p>
        </div>

        {/* Primary Donation Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. LivePix (Alerta na Tela com Mensagem de Voz TTS) */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group hover:scale-[1.01] ${
              isDark
                ? 'bg-gradient-to-br from-[#181226] via-[#121620] to-[#0f1118] border-purple-500/30 hover:border-purple-500/60 shadow-purple-950/20'
                : 'bg-gradient-to-br from-purple-50/80 via-white to-pink-50/50 border-purple-200 shadow-purple-100/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-600 text-white shadow-md">
                  Mais Popular • Alerta na Tela
                </span>
                <Zap className="w-5 h-5 text-purple-400" />
              </div>

              <div>
                <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  LivePix
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Sua mensagem é lida em voz alta na live (TTS) e o som de alerta toca instantaneamente na transmissão!
                </p>
              </div>

              {/* QR Code / Copy Link Card */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-4 ${
                  isDark
                    ? 'bg-black/50 border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="w-16 h-16 rounded-xl bg-white p-1.5 flex items-center justify-center flex-shrink-0 shadow-md">
                  <QrCode className="w-full h-full text-black" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className={`text-[11px] font-bold block ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    Link Oficial do LivePix:
                  </span>
                  <p className="text-xs font-mono font-bold text-pink-500 truncate mt-0.5">
                    {pixLink}
                  </p>
                  <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                    Pix imediato sem taxas
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6">
              <div className="flex gap-2">
                <a
                  href={pixLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
                >
                  <span>Abrir LivePix</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyPix}
                  className={`py-3 px-4 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedPix
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : isDark
                      ? 'bg-white/10 hover:bg-white/15 text-white border-white/15'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  }`}
                  title="Copiar link do PIX"
                >
                  {copiedPix ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {streamer.pixggUrl && (
                <a
                  href={streamer.pixggUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block text-center text-[11px] underline py-1 transition ${
                    isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ou doar via PixGG alternativo ({streamer.pixggUrl.replace('https://', '')})
                </a>
              )}
            </div>
          </div>

          {/* 2. Streamlabs Tips (Dólar / Euro / Cartão Internacional) */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border flex flex-col justify-between shadow-2xl relative overflow-hidden transition-all duration-300 group hover:scale-[1.01] ${
              isDark
                ? 'bg-gradient-to-br from-[#101726] via-[#121620] to-[#0f1118] border-blue-500/30 hover:border-blue-500/60 shadow-blue-950/20'
                : 'bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 border-blue-200 shadow-blue-100/50'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  Internacional • USD / EUR
                </span>
                <DollarSign className="w-5 h-5 text-blue-400" />
              </div>

              <div>
                <h3 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Streamlabs Tip
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Para quem mora no exterior ou prefere doar em Dólar, Euro ou Cartão de Crédito internacional (PayPal, etc.).
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark
                    ? 'bg-black/50 border-white/10'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Métodos Aceitos:</span>
                </div>
                <div className={`text-xs flex flex-wrap gap-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
                  <span className="px-2 py-0.5 rounded bg-black/20 border border-white/5">PayPal</span>
                  <span className="px-2 py-0.5 rounded bg-black/20 border border-white/5">Cartão de Crédito</span>
                  <span className="px-2 py-0.5 rounded bg-black/20 border border-white/5">USD / EUR</span>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={streamer.streamlabsUrl || 'https://streamlabs.com/oazuk/tip'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                <span>Doar pelo Streamlabs</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Custom Sound Alert Triggers (Direto da Twitch do oAzuK) */}
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl transition-colors ${
            isDark
              ? 'bg-[#121620] border-white/10'
              : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-pink-500" />
                <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Sons e Alertas Especiais da Live
                </h2>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Ao doar esses valores específicos, o áudio toca na live com o clássico som estourado!
              </p>
            </div>

            <span className="text-[11px] font-mono text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20 self-start sm:self-auto">
              Configurado na Twitch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {DONATION_ALERTS.map((alert, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden group hover:scale-[1.02] ${
                  alert.highlight
                    ? 'bg-gradient-to-br from-pink-950/40 via-purple-950/30 to-black/60 border-pink-500/50 shadow-md'
                    : isDark
                    ? 'bg-[#0b0e14] border-white/10 hover:border-white/20'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-pink-500">
                    {alert.value}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-200 text-slate-700'}`}>
                    {alert.bits}
                  </span>
                </div>

                <div className="flex items-start gap-2 mt-2">
                  <Volume2 className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5 group-hover:scale-110 transition" />
                  <span className={`font-bold text-xs uppercase leading-snug ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {alert.sound}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer / Notice */}
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-xs ${
            isDark
              ? 'bg-black/30 border-white/10 text-zinc-400'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
        >
          <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p>
            <strong>Aviso importante:</strong> As doações são voluntárias e destinadas ao apoio e manutenção das transmissões ao vivo. Todas as doações são finais e não reembolsáveis.
          </p>
        </div>
      </div>
    </section>
  );
};

