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
  const touchIdRef = useRef<number | null>(null);

  // Look drag na metade direita da tela
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number } | null>(null);

  const JOYSTICK_RADIUS = 55;

  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsJoystickActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleJoystickTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        updateJoystick(touch.clientX, touch.clientY);
        break;
      }
    }
  };

  const handleJoystickTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsJoystickActive(false);
        setStickPos({ x: 0, y: 0 });
        if (inputManager) {
          inputManager.setVirtualJoystick(0, 0);
        }
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
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
      // Normalização [-1, 1]
      const normX = stickX / JOYSTICK_RADIUS;
      const normY = stickY / JOYSTICK_RADIUS;
      inputManager.setVirtualJoystick(normX, normY);
    }
  };

  const toggleRun = () => {
    const next = !isRunning;
    setIsRunning(next);
    if (inputManager) {
      inputManager.setVirtualSprint(next);
    }
  };

  // Swipe de Câmera na área direita
  const handleLookTouchStart = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    // Apenas se o toque for na metade direita da tela
    if (touch.clientX > window.innerWidth * 0.45) {
      lookTouchIdRef.current = touch.identifier;
      lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleLookTouchMove = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      if (touch.identifier === lookTouchIdRef.current && lastLookPosRef.current) {
        const dx = touch.clientX - lastLookPosRef.current.x;
        const dy = touch.clientY - lastLookPosRef.current.y;
        if (inputManager) {
          inputManager.applyTouchLookDelta(dx, dy);
        }
        lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
        break;
      }
    }
  };

  const handleLookTouchEnd = (e: React.TouchEvent) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
        lastLookPosRef.current = null;
        break;
      }
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-20"
      onTouchStart={handleLookTouchStart}
      onTouchMove={handleLookTouchMove}
      onTouchEnd={handleLookTouchEnd}
      onTouchCancel={handleLookTouchEnd}
    >
      {/* JOYSTICK VIRTUAL (Canto Inferior Esquerdo) */}
      <div className="absolute bottom-6 left-6 pointer-events-auto">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleJoystickTouchStart}
          onTouchMove={handleJoystickTouchMove}
          onTouchEnd={handleJoystickTouchEnd}
          onTouchCancel={handleJoystickTouchEnd}
          className={`w-32 h-32 rounded-full border-2 border-sky-400/40 bg-slate-950/60 backdrop-blur-md relative flex items-center justify-center transition-colors ${
            isJoystickActive ? 'border-sky-400 bg-sky-950/40' : ''
          }`}
        >
          {/* Indicadores cardeais sutis */}
          <div className="absolute top-1 text-[9px] font-mono text-sky-400/60">W</div>
          <div className="absolute bottom-1 text-[9px] font-mono text-sky-400/60">S</div>
          <div className="absolute left-1 text-[9px] font-mono text-sky-400/60">A</div>
          <div className="absolute right-1 text-[9px] font-mono text-sky-400/60">D</div>

          {/* Botão de controle (Thumb Stick) */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-400 border border-white/40 shadow-lg pointer-events-none transition-transform duration-75"
            style={{
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`
            }}
          />
        </div>
      </div>

      {/* BOTÕES DE AÇÃO (Canto Inferior Direito) */}
      <div className="absolute bottom-6 right-6 pointer-events-auto flex items-end gap-3">
        {/* Botão de Corrida (Sprint Toggle) */}
        <button
          onClick={toggleRun}
          className={`w-14 h-14 rounded-full border flex flex-col items-center justify-center transition-all active:scale-90 shadow-xl ${
            isRunning
              ? 'bg-amber-500 border-amber-300 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.6)]'
              : 'bg-slate-900/80 border-slate-700 text-slate-300'
          }`}
          title="Alternar Corrida"
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] font-mono uppercase">Run</span>
        </button>

        {/* Botão Principal de Interação */}
        <button
          onClick={onInteract}
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center font-bold border-2 transition-all active:scale-95 shadow-2xl ${
            canInteract
              ? 'bg-gradient-to-tr from-sky-500 to-cyan-400 text-white border-white animate-pulse shadow-[0_0_25px_rgba(56,189,248,0.8)]'
              : 'bg-slate-900/60 border-slate-700/60 text-slate-500'
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
