import React from 'react';
import { Mission } from '../game/missions/types';
import { InteractableObject } from '../game/world/Types';
import { audioService } from '../game/engine/AudioService';
import { Volume2, VolumeX, Menu, Sparkles, Terminal, CheckCircle2, Award } from 'lucide-react';

interface HUDProps {
  activeMission: Mission | null;
  totalXP: number;
  activeInteractable: InteractableObject | null;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onOpenPauseMenu: () => void;
  onOpenQuestsModal: () => void;
  onInteract: () => void;
  isTouchDevice: boolean;
}

export const HUD: React.FC<HUDProps> = ({
  activeMission,
  totalXP,
  activeInteractable,
  audioEnabled,
  onToggleAudio,
  onOpenPauseMenu,
  onOpenQuestsModal,
  onInteract,
  isTouchDevice
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-3 sm:p-5">
      {/* BARRA SUPERIOR */}
      <div className="flex items-start justify-between gap-3">
        {/* Painel do Objetivo Ativo */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-sky-500/30 rounded-xl p-3 sm:p-4 max-w-sm sm:max-w-md shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping inline-block" />
              Estação NEXUS • Objetivo Ativo
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalXP} XP</span>
            </div>
          </div>

          {activeMission ? (
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-100 leading-tight">
                {activeMission.title}
              </h2>
              <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                {activeMission.objective}
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-sm sm:text-base font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Todas as Missões Concluídas!
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                A Estação NEXUS está totalmente operacional. Você dominou os fundamentos de IA e Web.
              </p>
            </div>
          )}
        </div>

        {/* Botões de Ação Rápida */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => {
              audioService.playInteract();
              onOpenQuestsModal();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur text-xs font-mono font-semibold transition-all active:scale-95 shadow-lg"
            title="Conceitos & Missões"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Missões</span>
          </button>

          <button
            onClick={() => {
              onToggleAudio();
              audioService.playInteract();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur transition-all active:scale-95 shadow-lg"
            title={audioEnabled ? 'Mutar Áudio' : 'Ativar Áudio'}
          >
            {audioEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500" />
            )}
          </button>

          <button
            onClick={() => {
              audioService.playInteract();
              onOpenPauseMenu();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 backdrop-blur transition-all active:scale-95 shadow-lg"
            title="Menu & Configurações"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-slate-200" />
          </button>
        </div>
      </div>

      {/* PROMPT DE INTERAÇÃO FLUTUANTE CENTRAL */}
      {activeInteractable && (
        <div className="self-center pointer-events-auto mb-20 sm:mb-8 animate-bounce transition-all">
          <button
            onClick={onInteract}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white font-bold shadow-[0_0_25px_rgba(56,189,248,0.7)] border border-sky-300 hover:brightness-110 active:scale-95 transition-transform"
          >
            <div className="w-7 h-7 rounded-lg bg-black/30 flex items-center justify-center font-mono text-sm border border-white/20">
              {isTouchDevice ? '👉' : 'E'}
            </div>
            <div className="text-left">
              <div className="text-xs uppercase tracking-wider text-sky-100 font-mono">
                {isTouchDevice ? 'Toque para Acessar' : 'Pressione [E] para Interagir'}
              </div>
              <div className="text-sm font-extrabold">{activeInteractable.title}</div>
            </div>
          </button>
        </div>
      )}

      {/* RODAPÉ: GUIA DE CONTROLES NO DESKTOP */}
      {!isTouchDevice && (
        <div className="hidden sm:flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/70 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-800 max-w-xl self-center">
          <span>[WASD] Mover</span>
          <span className="text-slate-600">•</span>
          <span>[Shift] Correr</span>
          <span className="text-slate-600">•</span>
          <span>[Mouse Arrastar] Rotacionar Câmera</span>
          <span className="text-slate-600">•</span>
          <span>[E] Interagir</span>
          <span className="text-slate-600">•</span>
          <span>[Esc] Pausa</span>
        </div>
      )}
    </div>
  );
};
