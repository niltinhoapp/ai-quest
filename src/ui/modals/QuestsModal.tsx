import React from 'react';
import { Mission, MissionId } from '../../game/missions/types';
import { audioService } from '../../game/engine/AudioService';
import { ProgressBar } from '../components/ProgressBar';
import { X, Award, CheckCircle2, Lock, Sparkles, BookOpen } from 'lucide-react';

interface QuestsModalProps {
  onClose: () => void;
  missions: Record<MissionId, Mission>;
  totalXP: number;
}

export const QuestsModal: React.FC<QuestsModalProps> = ({
  onClose,
  missions,
  totalXP
}) => {
  const missionList = Object.values(missions);
  const completedCount = missionList.filter(m => m.status === 'completed').length;
  const progressPercent = Math.round((completedCount / missionList.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100">
                  Registro de Missões & Conhecimento
                </h1>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-500/30 text-xs font-mono font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{totalXP} XP</span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Progresso geral da Estação NEXUS ({completedCount} de {missionList.length} concluídas)
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

        {/* BARRA DE PROGRESSO */}
        <div className="px-6 pt-4">
          <ProgressBar value={progressPercent} label="Progresso da Restauração" color="sky" />
        </div>

        {/* LISTA DE MISSÕES */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {missionList.map((m) => {
            const isDone = m.status === 'completed';
            const isLocked = m.status === 'locked';

            return (
              <div
                key={m.id}
                className={`p-4 rounded-xl border transition-all ${
                  isDone
                    ? 'bg-slate-950/80 border-emerald-500/40'
                    : isLocked
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    : 'bg-slate-950 border-sky-500/40 shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-400 uppercase">
                        {m.subtitle}
                      </span>
                      {isDone && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Concluída
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Bloqueada
                        </span>
                      )}
                    </div>
                    <h2 className="text-sm font-bold text-slate-100 mt-0.5">{m.title}</h2>
                  </div>
                  <div className="text-xs font-mono font-bold text-amber-400 shrink-0">
                    +{m.xpReward} XP
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-3">{m.description}</p>

                {/* Conceitos Ensinados */}
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1.5 flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-sky-400" />
                    Conceitos Didáticos:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.conceptsTaught.map((c, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
