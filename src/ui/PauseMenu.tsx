import React, { useState } from 'react';
import { audioService } from '../game/engine/AudioService';
import { Play, Volume2, VolumeX, Monitor, RotateCcw, Home, X, ShieldCheck } from 'lucide-react';

interface PauseMenuProps {
  onResume: () => void;
  onReturnToMainMenu: () => void;
  onResetProgress: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  graphicsQuality: 'low' | 'medium' | 'high';
  onChangeGraphics: (quality: 'low' | 'medium' | 'high') => void;
  isTouchDevice: boolean;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onReturnToMainMenu,
  onResetProgress,
  audioEnabled,
  onToggleAudio,
  graphicsQuality,
  onChangeGraphics,
  isTouchDevice
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* CABEÇALHO */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Simulação Pausada</h2>
            <p className="text-xs text-slate-400 font-mono">NEXUS Research Station</p>
          </div>
          <button
            onClick={() => {
              audioService.playInteract();
              onResume();
            }}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* OPÇÕES PRINCIPAIS */}
        <div className="space-y-3">
          <button
            onClick={() => {
              audioService.playInteract();
              onResume();
            }}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 hover:brightness-110 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Retomar Jogo</span>
          </button>

          {/* Áudio */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-2">
              {audioEnabled ? <Volume2 className="w-4 h-4 text-sky-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              Efeitos Sonoros (SFX)
            </span>
            <button
              onClick={() => {
                onToggleAudio();
                audioService.playInteract();
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                audioEnabled
                  ? 'bg-sky-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {audioEnabled ? 'LIGADO' : 'MUTADO'}
            </button>
          </div>

          {/* Qualidade Gráfica */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="flex items-center gap-2">
                <Monitor className="w-4 h-4 text-sky-400" />
                Qualidade Gráfica (3D)
              </span>
              <span className="text-[10px] text-slate-500 font-mono uppercase">
                {graphicsQuality === 'low' ? 'Econômica' : graphicsQuality === 'medium' ? 'Equilibrada' : 'Alta'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
              {(['low', 'medium', 'high'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    onChangeGraphics(q);
                    audioService.playInteract();
                  }}
                  className={`py-1.5 rounded-lg border transition-all ${
                    graphicsQuality === q
                      ? 'bg-sky-950 border-sky-400 text-sky-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {q === 'low' ? 'Baixa' : q === 'medium' ? 'Média' : 'Alta'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* GUIA RÁPIDO DE CONTROLES */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono text-[11px]">
          <span className="font-bold text-slate-300 block mb-1">🎮 Controles:</span>
          {isTouchDevice ? (
            <>
              <div>• Joystick Esquerdo: Movimentação</div>
              <div>• Toque na Direita: Girar câmera</div>
              <div>• Botão Ação: Interagir com terminais</div>
              <div>• Botão Run: Alternar corrida</div>
            </>
          ) : (
            <>
              <div>• [WASD]: Movimentação</div>
              <div>• [Shift]: Correr</div>
              <div>• [Mouse Arrastar]: Girar câmera</div>
              <div>• [E]: Interagir com terminais</div>
            </>
          )}
        </div>

        {/* BOTÕES DE NAVEGAÇÃO E RESET */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => {
              audioService.playInteract();
              onReturnToMainMenu();
            }}
            className="w-full py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-mono text-xs font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Voltar ao Menu Principal</span>
          </button>

          <button
            onClick={() => setShowConfirmReset(true)}
            className="w-full py-2 text-slate-500 hover:text-red-400 font-mono text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Campanha do Zero</span>
          </button>
        </div>

        {/* MODAL CONFIRMAÇÃO DE RESET */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-500/50 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold text-slate-100">Reiniciar Campanha?</h3>
              <p className="text-xs text-slate-300">
                Todo o progresso de missões, portas desbloqueadas e XP acumulados serão zerados.
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
                    onResetProgress();
                    setShowConfirmReset(false);
                    onResume();
                  }}
                  className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
