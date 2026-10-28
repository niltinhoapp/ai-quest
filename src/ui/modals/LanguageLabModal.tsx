import React, { useState } from 'react';
import { simulatedAIEngine, PROMPT_PRESETS } from '../../game/ai-sim/SimulatedAIEngine';
import { SimulationResponse, PromptPreset } from '../../game/ai-sim/types';
import { Mission } from '../../game/missions/types';
import { audioService } from '../../game/engine/AudioService';
import { X, Play, Sparkles, BookOpen, AlertCircle, HelpCircle, CheckCircle2, RotateCcw } from 'lucide-react';

interface LanguageLabModalProps {
  onClose: () => void;
  mission: Mission | null;
  onCompleteMission: (missionId: 'mission-1') => void;
}

export const LanguageLabModal: React.FC<LanguageLabModalProps> = ({
  onClose,
  mission,
  onCompleteMission
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('nexus-reboot');
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'Você é o assistente central da estação NEXUS. Responda com precisão técnica e diretrizes de recuperação.'
  );
  const [userPrompt, setUserPrompt] = useState<string>(
    'EXECUTAR PROTOCOLO REINICIALIZACAO: Verificar subsistemas de linguagem, comunicações e núcleo central.'
  );
  const [context, setContext] = useState<string>(
    'SUBSISTEMAS: Laboratório de Linguagem [ONLINE], Núcleo de Comunicações [ONLINE], Chaves de Segurança [VALIDADAS].'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<SimulationResponse | null>(null);

  // Quiz da Missão 1
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const isMission1Completed = mission?.status === 'completed';

  const applyPreset = (preset: PromptPreset) => {
    setSelectedPresetId(preset.id);
    setSystemPrompt(preset.systemPrompt);
    setUserPrompt(preset.userPrompt);
    setContext(preset.context);
    setResponse(null);
    audioService.playTerminalBeep();
  };

  const handleRunSimulation = async () => {
    setIsLoading(true);
    audioService.playTerminalBeep();
    try {
      const res = await simulatedAIEngine.generateResponse({
        systemPrompt,
        userPrompt,
        context
      });
      setResponse(res);
      audioService.playInteract();
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (quizAnswer === null || !mission?.quiz) return;
    setQuizSubmitted(true);
    if (quizAnswer === mission.quiz.correctIndex) {
      setQuizFeedback('Correto! Você dominou o conceito de Instrução de Sistema e Prompts.');
      audioService.playSuccessFanfare();
      onCompleteMission('mission-1');
    } else {
      setQuizFeedback('Incorreto. Revise a explicação acima e tente novamente.');
      audioService.playTerminalBeep();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(56,189,248,0.2)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-100">
                  Laboratório de Linguagem • Terminal de Prompts
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-500/30">
                  IA Simulada Local
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Experimente o impacto de Instruções de Sistema, Prompts de Usuário e Contexto.
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

        {/* CORPO MODAL SCROLLÁVEL */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* BANNER DE TRANSPARÊNCIA DIDÁTICA OBRIGATÓRIA */}
          <div className="bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-400 block mb-0.5">
                TRANSPARÊNCIA: Este terminal opera com um Motor de Regras Didático Local
              </span>
              Ele NÃO se conecta a servidores externos nem a LLMs pagas, não consome créditos e não aprende sozinho. Seu objetivo é ilustrar como a estrutura de chamada de IA funciona antes de você integrar um modelo real em sua aplicação web.
            </div>
          </div>

          {/* SELETOR DE PRESETS DIDÁTICOS */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              📚 Cenários Didáticos Pré-Configurados:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROMPT_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedPresetId === p.id
                      ? 'bg-sky-950/90 border-sky-400 text-sky-200 font-semibold shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold truncate">{p.title}</div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">{p.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* CAMPOS DE ENTRADA DO MODELO */}
          <div className="space-y-4">
            {/* 1. Instrução de Sistema (System Prompt) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono font-bold text-sky-400 uppercase">
                  1. Instrução de Sistema (System Prompt / Persona):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {Math.ceil(systemPrompt.length / 4)} tokens estimados
                </span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none transition-colors resize-none"
                placeholder="Ex: Você é um assistente técnico da estação NEXUS..."
              />
            </div>

            {/* 2. Prompt do Usuário (User Prompt) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  2. Prompt do Usuário (User Message):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {Math.ceil(userPrompt.length / 4)} tokens estimados
                </span>
              </div>
              <input
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none transition-colors"
                placeholder="Digite a pergunta ou comando para a IA..."
              />
            </div>

            {/* 3. Contexto Opcional (Grounding / RAG) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-mono font-bold text-purple-400 uppercase">
                  3. Dados de Contexto (Context / Documentos / Telemetria):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {Math.ceil(context.length / 4)} tokens estimados
                </span>
              </div>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 focus:border-purple-500 rounded-xl p-3 text-xs font-mono text-slate-200 outline-none transition-colors resize-none"
                placeholder="Insira dados de contexto que o modelo pode usar..."
              />
            </div>

            {/* BOTÃO EXECUTAR SIMULAÇÃO */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleRunSimulation}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-current" />
                {isLoading ? 'Simulando Inferência...' : 'Executar Simulação de IA'}
              </button>

              <div className="text-xs font-mono text-slate-400">
                Total estimado: ~{Math.ceil((systemPrompt.length + userPrompt.length + context.length) / 4)} tokens
              </div>
            </div>
          </div>

          {/* ÁREA DE SAÍDA / RESPOSTA */}
          {response && (
            <div className="space-y-3 animate-fadeIn">
              <div className="bg-slate-950 border border-sky-500/40 rounded-xl p-4 shadow-xl">
                <div className="flex items-center justify-between text-xs font-mono text-sky-400 border-b border-slate-800/80 pb-2 mb-3">
                  <span className="flex items-center gap-1.5 font-bold">
                    <BookOpen className="w-4 h-4" />
                    Resposta Gerada (Saída / Output)
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    Regra Heurística: {response.matchedRule}
                  </span>
                </div>
                <div className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {response.text}
                </div>
              </div>

              {/* Explicação Didática da Resposta */}
              <div className="bg-sky-950/40 border border-sky-500/30 rounded-xl p-3.5 text-xs text-sky-200">
                <span className="font-bold text-sky-300 block mb-1">
                  💡 Por que essa resposta ocorreu?
                </span>
                {response.didacticExplanation}
              </div>
            </div>
          )}

          {/* DESAFIO / QUIZ DA MISSÃO 1 */}
          {mission?.quiz && (
            <div className="border-t border-slate-800 pt-5 mt-6">
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-2">
                  <HelpCircle className="w-4 h-4" />
                  Desafio de Compreensão • Concluir Missão 1 (+100 XP)
                </div>
                <h3 className="text-sm font-bold text-slate-100 mb-3">
                  {mission.quiz.question}
                </h3>

                <div className="space-y-2 mb-4">
                  {mission.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={isMission1Completed}
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

                {!isMission1Completed ? (
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={quizAnswer === null}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition-all active:scale-95 disabled:opacity-40"
                    >
                      Confirmar Resposta & Reativar Subsistema
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
                    Missão 1 Concluída! O Portão para o Núcleo de Comunicações foi destravado.
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
