import React, { useState } from 'react';
import { audioService } from '../game/engine/AudioService';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, BookOpen, Monitor, ShieldCheck, ChevronRight } from 'lucide-react';

interface MainMenuProps {
  hasExistingSave: boolean;
  totalXP: number;
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onResetSave: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  hasExistingSave,
  totalXP,
  onStartNewGame,
  onContinueGame,
  onResetSave,
  audioEnabled,
  onToggleAudio
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="absolute inset-0 z-40 bg-slate-950 flex flex-col items-center justify-between p-6 overflow-y-auto select-none">
      {/* BACKGROUND DE ESTRELAS E NEON */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full bg-blue-600/15 blur-3xl" />
      </div>

      {/* CABEÇALHO / LOGO */}
      <div className="relative pt-6 sm:pt-12 text-center max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-400 text-xs font-mono font-bold uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(56,189,248,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-sky-300" />
          Aventura 3D Educacional • Web & Mobile
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-200 to-white tracking-tight drop-shadow-sm font-sans">
          AI QUEST
        </h1>
        <h2 className="text-sm sm:text-base font-mono uppercase tracking-[0.25em] text-cyan-400 mt-1">
          NEXUS Research Station
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          Aprenda como funcionam Inteligência Artificial, LLMs, Prompts, APIs, Servidores e Modelos Locais explorando uma estação espacial interativa.
        </p>
      </div>

      {/* BOTÕES DE ENTRADA NO JOGO */}
      <div className="relative w-full max-w-sm space-y-3 my-6">
        {hasExistingSave && (
          <button
            onClick={() => {
              audioService.playInteract();
              onContinueGame();
            }}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-400 hover:brightness-110 text-slate-950 font-black text-sm font-mono uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] active:scale-95 flex items-center justify-center gap-3"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Continuar Missão ({totalXP} XP)</span>
          </button>
        )}

        <button
          onClick={() => {
            audioService.playInteract();
            onStartNewGame();
          }}
          className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm font-mono uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 ${
            hasExistingSave
              ? 'bg-slate-900/90 border border-slate-700 text-slate-200 hover:bg-slate-800'
              : 'bg-gradient-to-r from-sky-500 via-cyan-400 to-sky-400 hover:brightness-110 text-slate-950 shadow-[0_0_30px_rgba(56,189,248,0.5)] font-black'
          }`}
        >
          <Play className="w-4 h-4 fill-current" />
          <span>{hasExistingSave ? 'Reiniciar Nova Partida' : 'Iniciar Jornada NEXUS'}</span>
        </button>

        <button
          onClick={() => {
            audioService.playInteract();
            setShowAbout(true);
          }}
          className="w-full py-3 px-6 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-slate-300 font-semibold text-xs font-mono transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>Guia Didático & Sobre</span>
        </button>
      </div>

      {/* RODAPÉ DO MENU COM AJUSTES */}
      <div className="relative w-full max-w-sm flex items-center justify-between text-xs font-mono text-slate-500 pb-4">
        <button
          onClick={() => {
            onToggleAudio();
            audioService.playInteract();
          }}
          className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4" />}
          <span>{audioEnabled ? 'Áudio Ligado' : 'Áudio Mudo'}</span>
        </button>

        {hasExistingSave && (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1 hover:text-red-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resetar Save</span>
          </button>
        )}
      </div>

      {/* MODAL CONFIRMAÇÃO DE RESET */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-100">Apagar Progresso Salvo?</h3>
            <p className="text-xs text-slate-300">
              Esta ação apagará todo o XP ({totalXP} XP) e redefinirá as portas e missões da estação. Tem certeza?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-mono text-xs hover:bg-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetSave();
                  setShowConfirmReset(false);
                }}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold"
              >
                Confirmar Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SOBRE O PROJETO */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-500/50 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto text-xs text-slate-300 leading-relaxed">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              Sobre AI Quest: NEXUS Research Station
            </h3>
            <p>
              AI Quest é um jogo 3D educacional em terceira pessoa projetado para ensinar aos desenvolvedores web como aplicações reais se conectam à Inteligência Artificial.
            </p>
            <div className="space-y-1.5 p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px]">
              <div className="text-sky-300 font-bold">• 100% Executável no Navegador (Web & Mobile)</div>
              <div>• Motor de IA Didático Local (Zero chaves ou custos de API)</div>
              <div>• 3 Missões Interativas completas com quiz de validação</div>
              <div>• Áudio procedural com Web Audio API nativo</div>
            </div>
            <button
              onClick={() => setShowAbout(false)}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono uppercase text-xs transition-colors"
            >
              Fechar Guia
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
