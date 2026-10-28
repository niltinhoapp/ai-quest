import * as THREE from 'three';
import { StationMap } from '../world/StationMap';
import { Character } from '../character/Character';
import { CameraController } from '../controls/CameraController';
import { InputManager } from '../controls/InputManager';
import { InteractableObject } from '../world/Types';
import { audioService } from './AudioService';

export interface GameEngineOptions {
  canvas: HTMLCanvasElement;
  onActiveInteractableChange: (interactable: InteractableObject | null) => void;
  onOpenModal: (type: string) => void;
  onPause: () => void;
}

export class GameEngine {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private clock: THREE.Clock;

  public stationMap!: StationMap;
  public character!: Character;
  public cameraController!: CameraController;
  public inputManager!: InputManager;

  private isRunning: boolean = false;
  private isPaused: boolean = false;
  private animationFrameId: number | null = null;

  public activeInteractable: InteractableObject | null = null;
  private onActiveInteractableChange: (interactable: InteractableObject | null) => void;
  private onOpenModal: (type: string) => void;
  private onPause: () => void;

  constructor(options: GameEngineOptions) {
    this.onActiveInteractableChange = options.onActiveInteractableChange;
    this.onOpenModal = options.onOpenModal;
    this.onPause = options.onPause;
    this.clock = new THREE.Clock();

    this.initThree(options.canvas);
    this.initWorld();
    this.initControls(options.canvas);
    this.bindWindowEvents();
  }

  private initThree(canvas: HTMLCanvasElement) {
    // 1. Verificação defensiva de WebGL
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.error('Falha ao inicializar o WebGLRenderer:', e);
      throw new Error('Seu navegador ou dispositivo não possui suporte ativo a WebGL.');
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 2. Cena & Iluminação futurista com paleta rica de cores
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050914);
    this.scene.fog = new THREE.FogExp2(0x060c1d, 0.022);

    // Luz Ambiente com tonalidade azulada profunda
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    this.scene.add(ambientLight);

    // Luz Direcional Principal (Radiação estelar vinda das janelas)
    const dirLight = new THREE.DirectionalLight(0xbae6fd, 2.0);
    dirLight.position.set(12, 22, 16);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 60;
    dirLight.shadow.camera.left = -25;
    dirLight.shadow.camera.right = 25;
    dirLight.shadow.camera.top = 25;
    dirLight.shadow.camera.bottom = -25;
    this.scene.add(dirLight);

    // Luzes Pontuais com identidades visuais por setor:
    // Setor A (Hangar): Luz de acolhimento e contraste tecnológico
    this.addSectorPointLight(-15, 3.5, -2, 0x38bdf8, 3.5); // Ciano brilhante
    this.addSectorPointLight(-15, 3.5, 2, 0xf59e0b, 2.0);  // Âmbar industrial

    // Setor B (Lab de Linguagem): Ciano elétrico & Violeta holográfico
    this.addSectorPointLight(-4, 3.6, -4, 0x06b6d4, 3.8); // Terminal 1 (Ciano)
    this.addSectorPointLight(-4, 3.6, 4, 0xc084fc, 3.5);  // Terminal 2 (Roxo/Magenta)

    // Setor C (Núcleo de Comunicações): Verde Esmeralda & Teal (Rede e Tráfego)
    this.addSectorPointLight(9, 3.6, 0, 0x10b981, 4.0);
    this.addSectorPointLight(9, 3.6, -4, 0x06b6d4, 2.5);

    // Setor D (Núcleo Central NEXUS): Turquesa Radiante e Ouro Cósmico
    this.addSectorPointLight(22, 4.0, 0, 0x00f0ff, 5.5);
    this.addSectorPointLight(22, 1.0, 0, 0x38bdf8, 3.0);

    // 3. Câmera
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
    this.cameraController = new CameraController(this.camera);
  }

  private addSectorPointLight(x: number, y: number, z: number, color: number, intensity: number) {
    const light = new THREE.PointLight(color, intensity, 14, 1.5);
    light.position.set(x, y, z);
    this.scene.add(light);
  }

  private initWorld() {
    this.stationMap = new StationMap();
    this.scene.add(this.stationMap.group);

    this.character = new Character();
    // Posição inicial no Hangar de Entrada
    this.character.position.set(-15, 0, 0);
    this.scene.add(this.character.mesh);

    // Configurar ações dos objetos interativos
    this.stationMap.interactables.forEach(item => {
      item.onInteract = () => {
        audioService.playInteract();
        this.onOpenModal(item.type);
      };
    });
  }

  private initControls(canvas: HTMLCanvasElement) {
    this.inputManager = new InputManager(canvas);
    this.inputManager.setCallbacks(
      () => this.handleInteractionTrigger(),
      () => this.onPause()
    );
  }

  private bindWindowEvents() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleResize = () => {
    if (!this.renderer || !this.camera) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  private handleVisibilityChange = () => {
    if (document.hidden) {
      // Pausa automática da simulação quando a aba estiver oculta
      this.isPaused = true;
    } else {
      this.isPaused = false;
      this.clock.getDelta(); // Limpa delta acumulado para evitar teletransporte
    }
  };

  public handleInteractionTrigger() {
    if (this.activeInteractable && !this.activeInteractable.isLocked) {
      this.activeInteractable.onInteract();
    }
  }

  public setQuality(quality: 'low' | 'medium' | 'high') {
    if (!this.renderer) return;
    if (quality === 'low') {
      this.renderer.setPixelRatio(1);
      this.renderer.shadowMap.enabled = false;
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
    }
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.clock.start();
    this.loop();
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  public setPaused(paused: boolean) {
    this.isPaused = paused;
    if (!paused) {
      this.clock.getDelta();
    }
  }

  private loop = () => {
    if (!this.isRunning) return;
    this.animationFrameId = requestAnimationFrame(this.loop);

    const delta = Math.min(this.clock.getDelta(), 0.1); // Clamp contra quedas de FPS
    if (!this.isPaused) {
      this.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  };

  private update(delta: number) {
    // 1. Processa entrada do jogador
    const input = this.inputManager.update();
    const { dx, dy } = this.inputManager.consumeLookDelta();
    this.cameraController.applyRotation(dx, dy);

    // 2. Calcula vetor de movimento relativo à direção da câmera
    const camYaw = this.cameraController.getYaw();
    const baseSpeed = input.sprint ? 7.5 : 4.5;
    this.character.isRunning = input.sprint;

    let moveVec = new THREE.Vector3();
    if (input.moveX !== 0 || input.moveZ !== 0) {
      // Direção relativa ao ângulo da câmera
      const forward = new THREE.Vector3(-Math.sin(camYaw), 0, -Math.cos(camYaw));
      const right = new THREE.Vector3(Math.cos(camYaw), 0, -Math.sin(camYaw));

      moveVec.addScaledVector(forward, -input.moveZ);
      moveVec.addScaledVector(right, input.moveX);

      if (moveVec.lengthSq() > 0.001) {
        moveVec.normalize();
        const targetAngle = Math.atan2(moveVec.x, moveVec.z);
        this.character.setRotation(targetAngle, true);
      }
    }

    // 3. Aplica velocidade com detecção de colisão AABB
    const displacement = moveVec.clone().multiplyScalar(baseSpeed * delta);
    this.applyMovementWithCollisions(displacement);

    // 4. Animação procedural de passada
    const actualSpeed = moveVec.length() * baseSpeed;
    this.character.updateAnimation(delta, actualSpeed);

    // 5. Câmera segue o personagem
    this.cameraController.update(delta, this.character.position);

    // 6. Atualização dos elementos dinâmicos do cenário
    this.stationMap.update(delta);

    // 7. Checagem de proximidade para interações
    this.checkInteractables();
  }

  private applyMovementWithCollisions(displacement: THREE.Vector3) {
    const charRadius = 0.45;
    const currentPos = this.character.position;

    // Teste no eixo X
    let nextX = currentPos.x + displacement.x;
    for (const box of this.stationMap.collisionBoxes) {
      if (
        nextX + charRadius > box.min.x &&
        nextX - charRadius < box.max.x &&
        currentPos.z + charRadius > box.min.z &&
        currentPos.z - charRadius < box.max.z
      ) {
        // Colisão em X: anula deslocamento em X
        displacement.x = 0;
        nextX = currentPos.x;
        break;
      }
    }

    // Teste no eixo Z
    let nextZ = currentPos.z + displacement.z;
    for (const box of this.stationMap.collisionBoxes) {
      if (
        nextX + charRadius > box.min.x &&
        nextX - charRadius < box.max.x &&
        nextZ + charRadius > box.min.z &&
        nextZ - charRadius < box.max.z
      ) {
        // Colisão em Z: anula deslocamento em Z
        displacement.z = 0;
        nextZ = currentPos.z;
        break;
      }
    }

    currentPos.x += displacement.x;
    currentPos.z += displacement.z;
  }

  private checkInteractables() {
    const charPos = this.character.position;
    let closest: InteractableObject | null = null;
    let minDist = Infinity;

    for (const item of this.stationMap.interactables) {
      const dist = charPos.distanceTo(item.position);
      if (dist <= item.radius && dist < minDist) {
        minDist = dist;
        closest = item;
      }
    }

    if (closest !== this.activeInteractable) {
      this.activeInteractable = closest;
      this.onActiveInteractableChange(closest);
    }
  }

  public dispose() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    if (this.inputManager) {
      this.inputManager.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
