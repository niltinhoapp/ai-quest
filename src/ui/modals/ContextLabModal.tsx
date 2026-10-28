import React, { useState } from 'react';
import { simulatedAIEngine } from '../../game/ai-sim/SimulatedAIEngine';
import { ComparisonResult } from '../../game/ai-sim/types';
import { Mission } from '../../game/missions/types';
import { audioService } from '../../game/engine/AudioService';
import { X, Layers, Play, CheckCircle2, HelpCircle, AlertTriangle } from 'lucide-react';

interface ContextLabModalProps {
  onClose: () => void;
  mission: Mission | null;
  onCompleteMission: (missionId: 'mission-2') => void;
}

export const ContextLabModal: React.FC<ContextLabModalProps> = ({
  onClose,
  mission,
  onCompleteMission
}) => {
  const [isComparing, setIsComparing] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);

  // Quiz da Missão 2
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const isMission2Completed = mission?.status === 'completed';

  const handleRunComparison = async () => {
    setIsComparing(true);
    audioService.playTerminalBeep();
    try {
      const res = await simulatedAIEngine.compareContextRuns({
        systemPrompt: 'Você é o computador de bordo da NEXUS. Só responda dados da estação se estiverem explicitamente no contexto fornecido.',
        userPrompt: 'Qual é a pressão atual no reator quântico do Setor C da Estação NEXUS?',
        context: 'TELEMETRIA NEXUS [TIMESTAMP ATUAL]: Reator Setor C operando a 142.8 kPa, temperatura 285 Kelvin, status: ESTÁVEL.'
      });
      setResult(res);
      audioService.playInteract();
    } finally {
      setIsComparing(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !mission?.quiz) return;
    setQuizSubmitted(true);
    if (quizAnswer === mission.quiz.correctIndex) {
      setQuizFeedback('Excelente! Você compreendeu como a Janela de Contexto evita alucinações.');
      audioService.playSuccessFanfare();
      onCompleteMission('mission-2');
    } else {
      setQuizFeedback('Incorreto. Observe os resultados comparativos acima e tente novamente.');
      audioService.playTerminalBeep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100">
                  Laboratório de Contexto & RAG • Missão 2
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-500/30">
                  Grounding vs Zero-Shot
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Entenda por que modelos precisam de contexto para responder sobre dados em tempo real.
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

        {/* CORPO SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* CARTÃO DE CASO DE ESTUDO */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
              Caso de Teste da Missão: Telemetria do Reator
            </h3>
            <p className="text-xs text-slate-300">
              Uma LLM treinada em dados públicos do mundo não conhece a pressão do reator interno da NEXUS neste instante. Compare o que acontece quando executamos a pergunta sem contexto vs com a telemetria fornecida:
            </p>

            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={handleRunComparison}
                disabled={isComparing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isComparing ? 'Executando Teste Comparativo...' : 'Executar Comparação (Com vs Sem Contexto)'}
              </button>
            </div>
          </div>

          {/* PAINÉIS LADO A LADO DA COMPARAÇÃO */}
          {result && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* RUN A: SEM CONTEXTO */}
                <div className="bg-slate-950 border border-amber-500/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 mb-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Execução A: SEM Contexto
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded mb-3 border border-slate-800">
                      Entrada: "Qual a pressão atual do reator quântico?"
                      <br />
                      Contexto: [VAZIO / ZERO-SHOT]
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed font-sans">
                      {result.runA.response.text}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 italic">
                    ⚠️ Sem dados, o modelo recusa a informação para não alucinar.
                  </div>
                </div>

                {/* RUN B: COM CONTEXTO */}
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between shadow-lg">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Execução B: COM Contexto (RAG / Grounded)
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2 rounded mb-3 border border-slate-800">
                      Entrada: "Qual a pressão atual do reator quântico?"
                      <br />
                      Contexto: "Reator Setor C = 142.8 kPa, status ESTÁVEL"
                    </div>
                    <div className="text-xs text-slate-200 leading-relaxed font-sans">
                      {result.runB.response.text}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-emerald-300/90 font-medium">
                    ✅ Com o contexto no prompt, a resposta é exata e auditável.
                  </div>
                </div>
              </div>

              {/* CONCLUSÃO DIDÁTICA */}
              <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3.5 text-xs text-purple-200">
                <span className="font-bold text-purple-300 block mb-1">
                  💡 O que é RAG (Retrieval-Augmented Generation)?
                </span>
                {result.didacticTakeaway}
              </div>
            </div>
          )}

          {/* DESAFIO / QUIZ DA MISSÃO 2 */}
          {mission?.quiz && (
            <div className="border-t border-slate-800 pt-5 mt-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  Desafio de Compreensão • Concluir Missão 2 (+150 XP)
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-3">
                  {mission.quiz.question}
                </h3>

                <div className="space-y-2 mb-4">
                  {mission.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={isMission2Completed}
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

                {!isMission2Completed ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all active:scale-95 disabled:opacity-40"
                    >
                      Confirmar Resposta & Liberar Conexões
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
                    Missão 2 Concluída! A barreira de segurança foi desativada.
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
