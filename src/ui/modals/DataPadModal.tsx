import React from 'react';
import { audioService } from '../../game/engine/AudioService';
import { X, BookOpen, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

interface DataPadModalProps {
  onClose: () => void;
  isTouchDevice: boolean;
}

export const DataPadModal: React.FC<DataPadModalProps> = ({ onClose, isTouchDevice }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-sky-500/50 rounded-2xl w-full max-w-xl flex flex-col shadow-[0_0_40px_rgba(56,189,248,0.2)] overflow-hidden">
        {/* CABEÇALHO */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-950/80 border border-sky-500/40 flex items-center justify-center text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100">
                DataPad de Boas-Vindas • Estação NEXUS
              </h1>
              <p className="text-[11px] text-slate-400">
                Manual de Instruções e Diretrizes da Missão
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              audioService.playInteract();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-slate-300 leading-relaxed overflow-y-auto">
          <p>
            Bem-vindo à <strong className="text-sky-300">NEXUS Research Station</strong>, o complexo orbital pioneiro de pesquisa em Inteligência Artificial e Arquitetura de Software.
          </p>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="font-bold text-sky-400 font-mono text-[11px] uppercase tracking-wider block">
              🎮 Comandos do Especialista:
            </span>
            {isTouchDevice ? (
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• <strong>Joystick Virtual (Esquerda):</strong> Mova o personagem.</li>
                <li>• <strong>Arrastar na Tela (Direita):</strong> Gire e orbite a câmera 3D.</li>
                <li>• <strong>Botão Run:</strong> Alterna corrida rápida.</li>
                <li>• <strong>Botão Ação:</strong> Interage com terminais e consoles próximos.</li>
              </ul>
            ) : (
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>• <strong>WASD ou Setas:</strong> Mova o especialista.</li>
                <li>• <strong>Mouse (Clique e Arraste):</strong> Gire a câmera 3D em terceira pessoa.</li>
                <li>• <strong>Shift:</strong> Correr rapidamente.</li>
                <li>• <strong>Tecla [E]:</strong> Interagir com consoles e terminais holográficos.</li>
                <li>• <strong>Tecla [Esc]:</strong> Pausar o jogo e abrir configurações.</li>
              </ul>
            )}
          </div>

          <div className="p-3.5 rounded-xl bg-sky-950/40 border border-sky-500/30 text-sky-200">
            <span className="font-bold text-sky-300 block mb-0.5">
              🎯 Próximo Objetivo:
            </span>
            Siga em frente pelo corredor até o <strong>Laboratório de Linguagem</strong> e interaja com o Terminal 1 para iniciar a Missão 1: Reativar o NEXUS.
          </div>
        </div>

        {/* RODAPÉ */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={() => {
              audioService.playInteract();
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono uppercase transition-all shadow-md active:scale-95 flex items-center gap-1.5"
          >
            Entendido, Iniciar Exploração
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
