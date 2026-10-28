import React, { useState } from 'react';
import { Mission } from '../../game/missions/types';
import { audioService } from '../../game/engine/AudioService';
import { X, Cpu, CheckCircle2, AlertOctagon, Sparkles, Power } from 'lucide-react';

interface CentralCoreModalProps {
  onClose: () => void;
  missions: Record<string, Mission>;
  onTriggerReboot: () => void;
  isRebooted: boolean;
}

export const CentralCoreModal: React.FC<CentralCoreModalProps> = ({
  onClose,
  missions,
  onTriggerReboot,
  isRebooted
}) => {
  const [isRebooting, setIsRebooting] = useState(false);

  const m1Done = missions['mission-1']?.status === 'completed';
  const m2Done = missions['mission-2']?.status === 'completed';
  const m3Done = missions['mission-3']?.status === 'completed';
  const allSubsystemsReady = m1Done && m2Done && m3Done;

  const handleReboot = () => {
    if (!allSubsystemsReady || isRebooted) return;
    setIsRebooting(true);
    audioService.playTerminalBeep();
    setTimeout(() => {
      onTriggerReboot();
      setIsRebooting(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.3)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100">
                  Console Mestre • Núcleo Central NEXUS
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  {isRebooted ? 'SISTEMA ATIVO' : 'MODO DE EMERGÊNCIA'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Sequência de inicialização e sincronização da inteligência da estação.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playInteract();
              onClose();
            }}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CORPO MODAL */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto">
          {/* DIAGNÓSTICO DOS SUBSISTEMAS */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-3">
              Status de Calibração dos Subsistemas de IA:
            </h3>
            <div className="space-y-2">
              {/* Subsistema 1 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-200">1. Motor de Prompts & Instruções (Missão 1)</span>
                {m1Done ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> CALIBRADO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-red-400 font-mono">
                    <AlertOctagon className="w-4 h-4" /> PENDENTE
                  </span>
                )}
              </div>

              {/* Subsistema 2 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-200">2. Janela de Contexto & RAG (Missão 2)</span>
                {m2Done ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> SINCRONIZADO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-red-400 font-mono">
                    <AlertOctagon className="w-4 h-4" /> PENDENTE
                  </span>
                )}
              </div>

              {/* Subsistema 3 */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="text-slate-200">3. Barramento Cliente-Servidor & APIs (Missão 3)</span>
                {m3Done ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> CONECTADO
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-bold text-red-400 font-mono">
                    <AlertOctagon className="w-4 h-4" /> PENDENTE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* BOTÃO MESTRE DE REINICIALIZAÇÃO */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 text-center space-y-4">
            {allSubsystemsReady ? (
              !isRebooted ? (
                <>
                  <div className="text-xs text-sky-300 font-medium">
                    Todos os três pilares foram restabelecidos com sucesso. Pressione o botão mestre para inicializar a consciência da Estação NEXUS.
                  </div>
                  <button
                    onClick={handleReboot}
                    disabled={isRebooting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-400 hover:brightness-110 text-slate-950 font-black text-sm font-mono tracking-widest uppercase transition-all shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Power className="w-5 h-5" />
                    {isRebooting ? 'INICIALIZANDO SUBSISTEMAS...' : 'REATIVAR ESTAÇÃO NEXUS'}
                  </button>
                </>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
                  <div className="flex items-center justify-center gap-2 font-bold text-sm mb-1">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    ESTAÇÃO NEXUS REINICIALIZADA COM SUCESSO!
                  </div>
                  <p className="text-xs text-slate-300">
                    O assistente virtual está online e todos os setores estão operando em harmonia.
                  </p>
                </div>
              )
            ) : (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                ⚠️ Complete as três missões anteriores para desbloquear os protocolos de reativação do Núcleo Central.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
