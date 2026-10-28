export interface InputState {
  moveX: number; // -1 (left) to 1 (right)
  moveZ: number; // -1 (forward) to 1 (backward)
  sprint: boolean;
  interact: boolean;
  pause: boolean;
  lookDeltaX: number;
  lookDeltaY: number;
}

export class InputManager {
  private keys: Record<string, boolean> = {};
  public state: InputState = {
    moveX: 0,
    moveZ: 0,
    sprint: false,
    interact: false,
    pause: false,
    lookDeltaX: 0,
    lookDeltaY: 0
  };

  // Joystick virtual mobile
  private virtualJoystick = { x: 0, y: 0 };
  private virtualSprint: boolean = false;
  private virtualInteract: boolean = false;

  private isPointerDown: boolean = false;
  private lastPointerX: number = 0;
  private lastPointerY: number = 0;

  private onInteractCallback?: () => void;
  private onPauseCallback?: () => void;

  constructor(targetElement?: HTMLElement) {
    this.bindEvents(targetElement || window);
  }

  public setCallbacks(onInteract?: () => void, onPause?: () => void) {
    this.onInteractCallback = onInteract;
    this.onPauseCallback = onPause;
  }

  private bindEvents(target: EventTarget) {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleBlur);

    // Mouse drag para rotação de câmera no desktop
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);
  }

  public dispose() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleBlur);
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    // Evita captura de teclas quando o usuário estiver digitando em campos de texto/input
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
      return;
    }

    this.keys[e.code] = true;

    if (e.code === 'KeyE') {
      if (this.onInteractCallback) this.onInteractCallback();
    }
    if (e.code === 'Escape') {
      if (this.onPauseCallback) this.onPauseCallback();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
  };

  private handleBlur = () => {
    this.keys = {};
    this.isPointerDown = false;
  };

  private handleMouseDown = (e: MouseEvent) => {
    // Apenas se o clique for na área do jogo (canvas) e botão esquerdo ou direito
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'CANVAS') {
      this.isPointerDown = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (this.isPointerDown) {
      const deltaX = e.clientX - this.lastPointerX;
      const deltaY = e.clientY - this.lastPointerY;
      this.state.lookDeltaX += deltaX * 0.005;
      this.state.lookDeltaY += deltaY * 0.005;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
    }
  };

  private handleMouseUp = () => {
    this.isPointerDown = false;
  };

  // Controles virtuais chamados pelo componente MobileControls.tsx
  public setVirtualJoystick(x: number, y: number) {
    this.virtualJoystick.x = Math.max(-1, Math.min(1, x));
    this.virtualJoystick.y = Math.max(-1, Math.min(1, y));
  }

  public setVirtualSprint(sprint: boolean) {
    this.virtualSprint = sprint;
  }

  public triggerVirtualInteract() {
    if (this.onInteractCallback) this.onInteractCallback();
  }

  public applyTouchLookDelta(deltaX: number, deltaY: number) {
    this.state.lookDeltaX += deltaX * 0.006;
    this.state.lookDeltaY += deltaY * 0.006;
  }

  public update(): InputState {
    let x = 0;
    let z = 0;

    // Teclado
    if (this.keys['KeyW'] || this.keys['ArrowUp']) z -= 1;
    if (this.keys['KeyS'] || this.keys['ArrowDown']) z += 1;
    if (this.keys['KeyA'] || this.keys['ArrowLeft']) x -= 1;
    if (this.keys['KeyD'] || this.keys['ArrowRight']) x += 1;

    // Mesclar com Joystick Mobile se ativo
    if (Math.abs(this.virtualJoystick.x) > 0.05 || Math.abs(this.virtualJoystick.y) > 0.05) {
      x = this.virtualJoystick.x;
      z = this.virtualJoystick.y;
    } else {
      // Normalização diagonal do teclado
      const len = Math.hypot(x, z);
      if (len > 0) {
        x /= len;
        z /= len;
      }
    }

    this.state.moveX = x;
    this.state.moveZ = z;
    this.state.sprint = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.virtualSprint);
    this.state.interact = !!(this.keys['KeyE'] || this.virtualInteract);
    this.state.pause = !!this.keys['Escape'];

    return this.state;
  }

  public consumeLookDelta(): { dx: number; dy: number } {
    const dx = this.state.lookDeltaX;
    const dy = this.state.lookDeltaY;
    this.state.lookDeltaX = 0;
    this.state.lookDeltaY = 0;
    return { dx, dy };
  }
}
