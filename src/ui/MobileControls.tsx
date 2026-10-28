import React, { useRef, useState, useEffect } from 'react';
import { InputManager } from '../game/controls/InputManager';
import { Zap, Hand } from 'lucide-react';

interface MobileControlsProps {
  inputManager: InputManager | null;
  onInteract: () => void;
  canInteract: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  inputManager,
  onInteract,
  canInteract
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 });
  const [isJoystickActive, setIsJoystickActive] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const activePointerIdRef = useRef<number | null>(null);
  const activeLookPointerIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  const JOYSTICK_RADIUS = 50;

  // --- CONTROLE ANALÓGICO DO JOYSTICK ---
  const handleJoystickPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Captura o ponteiro para rastreamento contínuo mesmo que o dedo saia do círculo
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);
    activePointerIdRef.current = e.pointerId;
    setIsJoystickActive(true);

    updateJoystickPosition(e.clientX, e.clientY);
  };

  const handleJoystickPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    updateJoystickPosition(e.clientX, e.clientY);
  };

  const handleJoystickPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    activePointerIdRef.current = null;
    setIsJoystickActive(false);
    setStickPos({ x: 0, y: 0 });

    if (inputManager) {
      inputManager.setVirtualJoystick(0, 0);
    }
  };

  const updateJoystickPosition = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    const clampedDist = Math.min(distance, JOYSTICK_RADIUS);
    const angle = Math.atan2(deltaY, deltaX);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setStickPos({ x: stickX, y: stickY });

    if (inputManager) {
      // Normalização em [-1, 1]
      const normX = stickX / JOYSTICK_RADIUS;
      const normY = stickY / JOYSTICK_RADIUS;
      inputManager.setVirtualJoystick(normX, normY);
    }
  };

  // --- CONTROLE DE ROTAÇÃO DE CÂMERA (SWIPE NA ÁREA DIREITA) ---
  const handleLookPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeLookPointerIdRef.current !== null) return;
    // Ignora se o toque foi nos botões de ação
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    activeLookPointerIdRef.current = e.pointerId;
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleLookPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeLookPointerIdRef.current !== e.pointerId || !lastLookPosRef.current) return;
    const dx = e.clientX - lastLookPosRef.current.x;
    const dy = e.clientY - lastLookPosRef.current.y;

    if (inputManager) {
      inputManager.applyTouchLookDelta(dx, dy);
    }
    lastLookPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleLookPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeLookPointerIdRef.current === e.pointerId) {
      activeLookPointerIdRef.current = null;
      lastLookPosRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  const toggleRun = () => {
    const next = !isRunning;
    setIsRunning(next);
    if (inputManager) {
      inputManager.setVirtualSprint(next);
    }
  };

  return (
    <div className="absolute inset-0 select-none z-30 pointer-events-none" style={{ touchAction: 'none' }}>
      {/* ÁREA DIREITA DE SWIPE PARA ORBITAR A CÂMERA */}
      <div
        className="absolute top-16 right-0 bottom-24 w-1/2 pointer-events-auto"
        style={{ touchAction: 'none' }}
        onPointerDown={handleLookPointerDown}
        onPointerMove={handleLookPointerMove}
        onPointerUp={handleLookPointerUp}
        onPointerCancel={handleLookPointerUp}
      />

      {/* JOYSTICK ANALÓGICO VIRTUAL (Canto Inferior Esquerdo) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto" style={{ touchAction: 'none' }}>
        <div
          ref={joystickBaseRef}
          onPointerDown={handleJoystickPointerDown}
          onPointerMove={handleJoystickPointerMove}
          onPointerUp={handleJoystickPointerUp}
          onPointerCancel={handleJoystickPointerUp}
          className={`w-32 h-32 rounded-full border-2 border-sky-400/50 bg-slate-950/70 backdrop-blur-md relative flex items-center justify-center transition-colors cursor-pointer select-none ${
            isJoystickActive ? 'border-sky-300 bg-sky-950/60 shadow-[0_0_20px_rgba(56,189,248,0.4)]' : ''
          }`}
          style={{ touchAction: 'none' }}
        >
          {/* Guias direcionais sutis */}
          <div className="absolute top-1 text-[10px] font-mono font-bold text-sky-400/60">W</div>
          <div className="absolute bottom-1 text-[10px] font-mono font-bold text-sky-400/60">S</div>
          <div className="absolute left-1 text-[10px] font-mono font-bold text-sky-400/60">A</div>
          <div className="absolute right-1 text-[10px] font-mono font-bold text-sky-400/60">D</div>

          {/* Manípulo (Thumb Stick) */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-500 via-cyan-400 to-white border-2 border-white/60 shadow-xl pointer-events-none transition-transform duration-75"
            style={{
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
            }}
          />
        </div>
      </div>

      {/* BOTÕES DE AÇÃO (Canto Inferior Direito) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-end gap-3" style={{ touchAction: 'none' }}>
        {/* Botão de Corrida (Sprint Toggle) */}
        <button
          type="button"
          onClick={toggleRun}
          className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center transition-all active:scale-90 shadow-xl ${
            isRunning
              ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.7)]'
              : 'bg-slate-900/90 border-slate-700 text-slate-300'
          }`}
          title="Alternar Corrida"
        >
          <Zap className="w-5 h-5 fill-current" />
          <span className="text-[9px] font-mono uppercase font-bold">Run</span>
        </button>

        {/* Botão de Interação / Ação */}
        <button
          type="button"
          onClick={onInteract}
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold border-2 transition-all active:scale-95 shadow-2xl ${
            canInteract
              ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-white border-white animate-pulse shadow-[0_0_30px_rgba(56,189,248,0.9)]'
              : 'bg-slate-900/80 border-slate-700/80 text-slate-400'
          }`}
          title="Interagir"
        >
          <Hand className="w-7 h-7" />
          <span className="text-[10px] font-mono uppercase tracking-wider mt-0.5">Ação</span>
        </button>
      </div>
    </div>
  );
};
