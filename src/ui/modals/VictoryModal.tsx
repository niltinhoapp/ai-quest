import React from 'react';
import { audioService } from '../../game/engine/AudioService';
import { Award, CheckCircle2, Sparkles, BookOpen, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface VictoryModalProps {
  totalXP: number;
  onClose: () => void;
  onRestart: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  totalXP,
  onClose,
  onRestart
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-[0_0_80px_rgba(16,185,129,0.3)] overflow-hidden animate-fadeIn">
        {/* CABEÇALHO CELEBRAÇÃO */}
        <div className="p-6 bg-gradient-to-b from-emerald-950/80 to-slate-900 border-b border-emerald-500/30 text-center relative">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 mb-3 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Award className="w-10 h-10" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
            ESTAÇÃO NEXUS TOTALMENTE RESTAURADA!
          </h1>
          <p className="text-xs sm:text-sm text-emerald-300 font-mono mt-1">
            Você completou a jornada de IA Quest com {totalXP} XP acumulados
          </p>
        </div>

        {/* CORPO DO DIPLOMA / RESUMO DOS CONCEITOS APRENDIDOS */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-3 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Manifesto dos Conhecimentos Adquiridos:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Conceito 1 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-sky-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  1. Prompts & Instruções
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  A Instrução de Sistema molda o comportamento, restrições e persona da IA antes mesmo da interação do usuário.
                </p>
              </div>

              {/* Conceito 2 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  2. Memória & RAG
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Sem dados na Janela de Contexto, modelos podem alucinar. O RAG injeta telemetria e dados privados dinamicamente.
                </p>
              </div>

              {/* Conceito 3 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-emerald-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  3. Segurança de APIs
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Chaves de API jamais ficam no frontend. O backend valida a sessão e protege os segredos do provedor de inferência.
                </p>
              </div>

              {/* Conceito 4 */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  4. Nuvem vs Modelos Locais
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  APIs em nuvem oferecem alta capacidade sem pesar no cliente; modelos locais oferecem privacidade offline total.
                </p>
              </div>
            </div>
          </div>

          {/* DICA DE PRÓXIMOS PASSOS PARA DESENVOLVEDORES */}
          <div className="p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 text-xs text-sky-200">
            <span className="font-bold text-sky-300 block mb-1">
              🚀 Próximo Passo na sua Carreira Web:
            </span>
            Agora você sabe exatamente como estruturar sua aplicação web: crie uma rota segura em seu backend (Node.js/Next.js/Express/FastAPI), chame o provedor de IA com um bom System Prompt e repasse o streaming de tokens para o React via Server-Sent Events (SSE) ou WebSockets!
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              audioService.playInteract();
              onRestart();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-mono transition-colors"
          >
            Reiniciar Campanha
          </button>

          <button
            onClick={() => {
              audioService.playInteract();
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            Continuar Explorando a Estação
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
