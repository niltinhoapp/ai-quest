import React, { useState } from 'react';
import { PIPELINE_STEPS } from '../../game/missions/MissionManager';
import { PipelineComponent, Mission } from '../../game/missions/types';
import { audioService } from '../../game/engine/AudioService';
import { X, Network, ArrowDown, ShieldCheck, CheckCircle2, HelpCircle, AlertCircle, ArrowUp } from 'lucide-react';

interface PipelineModalProps {
  onClose: () => void;
  mission: Mission | null;
  onCompleteMission: (missionId: 'mission-3') => void;
}

export const PipelineModal: React.FC<PipelineModalProps> = ({
  onClose,
  mission,
  onCompleteMission
}) => {
  // Inicialmente embaralhado para o jogador ordenar
  const [items, setItems] = useState<PipelineComponent[]>(() => {
    return [...PIPELINE_STEPS].sort(() => 0.5 - Math.random());
  });

  const [isOrderValid, setIsOrderValid] = useState<boolean>(false);
  const [orderChecked, setOrderChecked] = useState<boolean>(false);

  // Quiz da Missão 3
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const isMission3Completed = mission?.status === 'completed';

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    setItems(newItems);
    setOrderChecked(false);
    audioService.playTerminalBeep();
  };

  const handleVerifyOrder = () => {
    setOrderChecked(true);
    const valid = items.every((item, idx) => item.stepNumber === idx + 1);
    setIsOrderValid(valid);

    if (valid) {
      audioService.playSuccessFanfare();
    } else {
      audioService.playTerminalBeep();
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !mission?.quiz) return;
    setQuizSubmitted(true);
    if (quizAnswer === mission.quiz.correctIndex) {
      setQuizFeedback('Perfeito! A proteção de chaves de API é essencial para segurança em produção.');
      audioService.playSuccessFanfare();
      onCompleteMission('mission-3');
    } else {
      setQuizFeedback('Incorreto. Leia com atenção a nota de segurança do Backend e tente novamente.');
      audioService.playTerminalBeep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100">
                  Núcleo de Comunicações • Arquitetura Cliente-Servidor & APIs
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                  Missão 3
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Organize as etapas da requisição de IA e aprenda por que segredos não pertencem ao navegador.
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* INSTRUÇÕES DO PUZZLE DE ARQUITETURA */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
              Desafio: Monte o Fluxo de Comunicação na Ordem Correta
            </h3>
            <p className="text-xs text-slate-300">
              Use as setas para posicionar cada etapa na sequência lógica de uma requisição de Inteligência Artificial: desde a interação do usuário na página web até o retorno dos tokens calculados pelo modelo.
            </p>
          </div>

          {/* LISTA ORDENÁVEL DE ETAPAS */}
          <div className="space-y-2.5">
            {items.map((item, index) => {
              const isCorrectPos = orderChecked && item.stepNumber === index + 1;
              const isWrongPos = orderChecked && item.stepNumber !== index + 1;

              return (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isCorrectPos
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : isWrongPos
                      ? 'bg-red-950/30 border-red-500/50'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-300">
                      {index + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-100">{item.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                      {item.securityNote && (
                        <div className="flex items-center gap-1 text-[10px] text-sky-400 font-mono mt-1">
                          <ShieldCheck className="w-3 h-3 text-sky-400" />
                          <span>Segurança: {item.securityNote}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0 || isMission3Completed}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                      title="Mover para cima"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === items.length - 1 || isMission3Completed}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 disabled:opacity-30 text-slate-300"
                      title="Mover para baixo"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* BOTÃO DE VALIDAÇÃO DO FLUXO */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleVerifyOrder}
              disabled={isMission3Completed}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-95 shadow-lg disabled:opacity-50"
            >
              Validar Arquitetura do Fluxo
            </button>

            {orderChecked && (
              <span className={`text-xs font-bold ${isOrderValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isOrderValid
                  ? '✅ Fluxo perfeitamente alinhado!'
                  : '⚠️ Algumas etapas estão fora da sequência lógica. Reordene-as.'}
              </span>
            )}
          </div>

          {/* DESAFIO / QUIZ DE SEGURANÇA DA MISSÃO 3 */}
          {isOrderValid && mission?.quiz && (
            <div className="border-t border-slate-800 pt-5 mt-6 animate-fadeIn">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  Desafio de Segurança em Produção (+200 XP)
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-3">
                  {mission.quiz.question}
                </h3>

                <div className="space-y-2 mb-4">
                  {mission.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={isMission3Completed}
                      onClick={() => {
                        setQuizAnswer(idx);
                        audioService.playTerminalBeep();
                      }}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                        quizAnswer === idx
                          ? 'bg-amber-950/70 border-amber-400 text-amber-200 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="font-mono font-bold text-slate-400 mr-2">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>

                {!isMission3Completed ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all active:scale-95 disabled:opacity-40"
                    >
                      Confirmar Resposta & Liberar Núcleo Central
                    </button>
                    {quizFeedback && (
                      <span className={`text-xs font-semibold ${quizSubmitted && quizAnswer === mission.quiz.correctIndex ? 'text-emerald-400' : 'text-red-400'}`}>
                        {quizFeedback}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 p-3 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Missão 3 Concluída! O portal para a Câmara do Núcleo Central NEXUS está aberto!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
