import * as THREE from 'three';
import { ProceduralTextures } from '../engine/ProceduralTextures';
import { InteractableObject, CollisionBox } from './Types';
import { audioService } from '../engine/AudioService';

export class StationMap {
  public group: THREE.Group;
  public collisionBoxes: CollisionBox[] = [];
  public interactables: InteractableObject[] = [];

  // Portas e barreiras dinâmicas
  private doorABarrier!: THREE.Mesh;
  private doorBBarrier!: THREE.Mesh;
  private centralCoreSphere!: THREE.Mesh;
  private centralCoreRing1!: THREE.Mesh;
  private centralCoreRing2!: THREE.Mesh;
  private isCoreRebooted: boolean = false;

  private pulseTime: number = 0;

  constructor() {
    this.group = new THREE.Group();
    this.buildStation();
  }

  private buildStation() {
    const floorTexture = ProceduralTextures.getFloorTexture();
    const wallTexture = ProceduralTextures.getWallTexture();

    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.4,
      metalness: 0.6
    });

    const wallMat = new THREE.MeshStandardMaterial({
      map: wallTexture,
      roughness: 0.3,
      metalness: 0.7
    });

    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0x050914,
      roughness: 0.9,
      metalness: 0.1
    });

    const neonBlueMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const neonAmberMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b });
    const neonGreenMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });

    // 1. CHÃO GERAL com reflexo metálico e rugosidade calibrada
    const floorGeo = new THREE.PlaneGeometry(50, 20);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(4, 0, 0);
    floor.receiveShadow = true;
    this.group.add(floor);

    // TETO com estrutura arquitetônica
    const ceiling = new THREE.Mesh(floorGeo, ceilingMat);
    ceiling.position.set(4, 4.5, 0);
    ceiling.rotation.x = Math.PI;
    this.group.add(ceiling);

    // 2. PAREDES EXTERNAS (Perímetro da Estação)
    this.createWall(-21, 0, 0.6, 20, wallMat); // Parede Oeste (fundo do hangar)
    this.createWall(29, 0, 0.6, 20, wallMat);  // Parede Leste (fundo do núcleo central)
    this.createWall(4, -10, 50, 0.6, wallMat); // Parede Norte
    this.createWall(4, 10, 50, 0.6, wallMat);  // Parede Sul

    // Faixas de piso energéticas com cores setoriais:
    // Hangar: Âmbar e Ciano
    this.createNeonStrip(-16, 0.04, 0, 8, 0.15, neonAmberMat);
    // Lab de Linguagem: Violeta e Ciano
    const neonPurpleMat = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    this.createNeonStrip(-4, 0.04, -4, 0.15, 6, neonBlueMat);
    this.createNeonStrip(-4, 0.04, 4, 0.15, 6, neonPurpleMat);
    // Núcleo de Comunicações: Verde Esmeralda Matrix
    this.createNeonStrip(9, 0.04, 0, 10, 0.15, neonGreenMat);
    // Núcleo Central: Dourado / Ciano Cósmico
    const neonGoldMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
    this.createNeonStrip(22, 0.04, 0, 8, 0.15, neonGoldMat);

    // 3. DIVISÓRIAS INTERNAS & CORREDORES
    // Parede Divisória A-B (Entre Entrada x=-11 e Lab Linguagem x=-9)
    this.createWall(-11, -5.5, 0.6, 9, wallMat);
    this.createWall(-11, 5.5, 0.6, 9, wallMat);
    // Vão da Porta A-B em z=[-1, 1] é livre para passagem

    // Parede Divisória B-C (Entre Lab Linguagem x=3 e Comunicação x=5)
    this.createWall(3, -5.5, 0.6, 9, wallMat);
    this.createWall(3, 5.5, 0.6, 9, wallMat);
    // Barreira Laser da Porta B-C (Desbloqueada após Missão 1/2)
    const barrierGeo = new THREE.BoxGeometry(0.2, 3.8, 2.2);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      transparent: true,
      opacity: 0.65
    });
    this.doorABarrier = new THREE.Mesh(barrierGeo, laserMat);
    this.doorABarrier.position.set(3, 2, 0);
    this.group.add(this.doorABarrier);
    this.collisionBoxes.push({
      min: new THREE.Vector3(2.8, 0, -1.1),
      max: new THREE.Vector3(3.2, 4, 1.1),
      name: 'barrier_door_b'
    });

    // Parede Divisória C-D (Entre Comunicação x=15 e Núcleo Central x=17)
    this.createWall(15, -5.5, 0.6, 9, wallMat);
    this.createWall(15, 5.5, 0.6, 9, wallMat);
    // Barreira Laser da Porta C-D (Desbloqueada após Missão 3)
    this.doorBBarrier = new THREE.Mesh(barrierGeo, laserMat.clone());
    this.doorBBarrier.position.set(15, 2, 0);
    this.group.add(this.doorBBarrier);
    this.collisionBoxes.push({
      min: new THREE.Vector3(14.8, 0, -1.1),
      max: new THREE.Vector3(15.2, 4, 1.1),
      name: 'barrier_door_c'
    });

    // 4. ELEMENTOS DO HANGAR DE ENTRADA (x: -19 a -11)
    this.buildEntranceBay();

    // 5. ELEMENTOS DO LABORATÓRIO DE LINGUAGEM (x: -10 a 2)
    this.buildLanguageLab();

    // 6. ELEMENTOS DO NÚCLEO DE COMUNICAÇÕES (x: 4 a 14)
    this.buildCommunicationsCore();

    // 7. ELEMENTOS DO NÚCLEO CENTRAL NEXUS (x: 16 a 28)
    this.buildCentralCore();

    // 8. JANELAS ESPACIAIS PANORÂMICAS
    this.buildSpaceWindows();
  }

  private createWall(x: number, z: number, widthX: number, depthZ: number, mat: THREE.Material) {
    const height = 4.5;
    const geo = new THREE.BoxGeometry(widthX, height, depthZ);
    const wall = new THREE.Mesh(geo, mat);
    wall.position.set(x, height / 2, z);
    wall.castShadow = true;
    wall.receiveShadow = true;
    this.group.add(wall);

    // Registro de colisão AABB
    this.collisionBoxes.push({
      min: new THREE.Vector3(x - widthX / 2 - 0.2, 0, z - depthZ / 2 - 0.2),
      max: new THREE.Vector3(x + widthX / 2 + 0.2, height, z + depthZ / 2 + 0.2),
      name: `wall_${x}_${z}`
    });
  }

  private createNeonStrip(x: number, y: number, z: number, w: number, d: number, mat: THREE.Material) {
    const geo = new THREE.BoxGeometry(w, 0.05, d);
    const strip = new THREE.Mesh(geo, mat);
    strip.position.set(x, y, z);
    this.group.add(strip);
  }

  // --- ZONA A: HANGAR DE ENTRADA ---
  private buildEntranceBay() {
    // Totem de Boas-Vindas Holográfico
    const totemBaseGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.9, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });
    const totem = new THREE.Mesh(totemBaseGeo, baseMat);
    totem.position.set(-15, 0.45, -2.5);
    this.group.add(totem);

    const screenTexture = ProceduralTextures.getTerminalScreenTexture('MANUAL DE OPERAÇÃO', 'Estação NEXUS - Boas-Vindas');
    const screenGeo = new THREE.BoxGeometry(0.9, 0.6, 0.05);
    screenGeo.rotateY(Math.PI / 4);
    const screenMat = new THREE.MeshBasicMaterial({ map: screenTexture });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(-15, 1.25, -2.5);
    this.group.add(screenMesh);

    this.interactables.push({
      id: 'datapad_welcome',
      type: 'datapad',
      position: new THREE.Vector3(-15, 1, -2.5),
      title: 'Guia de Operações NEXUS',
      subtitle: 'Controles & Missão Primária',
      radius: 2.2,
      isLocked: false,
      onInteract: () => {}
    });

    // Pads no piso ensinando movimentação
    const padGeo = new THREE.RingGeometry(0.8, 1.0, 32);
    padGeo.rotateX(-Math.PI / 2);
    const padMat = new THREE.MeshBasicMaterial({ color: 0x0284c7, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.set(-15, 0.02, 0);
    this.group.add(pad);
  }

  // --- ZONA B: LABORATÓRIO DE LINGUAGEM ---
  private buildLanguageLab() {
    // 1. Console Terminal 1: Prompts & Instruções (Missão 1) - Ciano Neon
    const consoleGeo = new THREE.BoxGeometry(1.6, 1.0, 1.0);
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 });

    const terminal1 = new THREE.Mesh(consoleGeo, consoleMat);
    terminal1.position.set(-4, 0.5, -4);
    this.group.add(terminal1);

    const screen1Tex = ProceduralTextures.getTerminalScreenTexture('LABORATÓRIO DE LINGUAGEM', 'Terminal de Prompts & Instruções', '#38bdf8');
    const screen1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), new THREE.MeshBasicMaterial({ map: screen1Tex }));
    screen1.position.set(-4, 1.3, -4.4);
    this.group.add(screen1);

    this.collisionBoxes.push({
      min: new THREE.Vector3(-4.9, 0, -4.6),
      max: new THREE.Vector3(-3.1, 2, -3.4),
      name: 'terminal_language_collider'
    });

    this.interactables.push({
      id: 'terminal_language',
      type: 'terminal_language',
      position: new THREE.Vector3(-4, 1, -3.2),
      title: 'Terminal de Linguagem',
      subtitle: 'Missão 1: Prompts e Instruções',
      radius: 2.5,
      isLocked: false,
      meshRef: screen1,
      onInteract: () => {}
    });

    // 2. Console Terminal 2: Memória de Contexto & RAG (Missão 2) - Roxo / Magenta Holográfico
    const terminal2 = new THREE.Mesh(consoleGeo, consoleMat);
    terminal2.position.set(-4, 0.5, 4);
    this.group.add(terminal2);

    const screen2Tex = ProceduralTextures.getTerminalScreenTexture('TELEMETRIA DO REATOR', 'Janela de Contexto & RAG', '#c084fc');
    const screen2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), new THREE.MeshBasicMaterial({ map: screen2Tex }));
    screen2.position.set(-4, 1.3, 3.6);
    this.group.add(screen2);

    this.collisionBoxes.push({
      min: new THREE.Vector3(-4.9, 0, 3.4),
      max: new THREE.Vector3(-3.1, 2, 4.6),
      name: 'terminal_context_collider'
    });

    this.interactables.push({
      id: 'terminal_context',
      type: 'terminal_context',
      position: new THREE.Vector3(-4, 1, 3.2),
      title: 'Terminal de Contexto',
      subtitle: 'Missão 2: Memória e Telemetria',
      radius: 2.5,
      isLocked: false,
      meshRef: screen2,
      onInteract: () => {}
    });

    // Racks de Servidores Centrais com luzes piscantes
    for (let i = -1; i <= 1; i++) {
      const rack = new THREE.Mesh(new THREE.BoxGeometry(0.8, 2.8, 0.8), consoleMat);
      rack.position.set(0, 1.4, i * 2.5);
      this.group.add(rack);
      this.collisionBoxes.push({
        min: new THREE.Vector3(-0.5, 0, i * 2.5 - 0.5),
        max: new THREE.Vector3(0.5, 3, i * 2.5 + 0.5),
        name: `rack_${i}`
      });

      // Detalhes emissivos nos racks
      const stripMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      for (let s = 0.5; s < 2.5; s += 0.4) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.04, 0.02), stripMat);
        led.position.set(0, s, i * 2.5 + 0.41);
        this.group.add(led);
      }
    }
  }

  // --- ZONA C: NÚCLEO DE COMUNICAÇÕES ---
  private buildCommunicationsCore() {
    const consoleGeo = new THREE.BoxGeometry(2.4, 1.0, 1.2);
    const consoleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8 });

    const pipeTerminal = new THREE.Mesh(consoleGeo, consoleMat);
    pipeTerminal.position.set(9, 0.5, 0);
    this.group.add(pipeTerminal);

    const screenTex = ProceduralTextures.getTerminalScreenTexture('ARQUITETURA DE REDE', 'Fluxo Cliente-Servidor & APIs', '#10b981');
    const screen = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.05), new THREE.MeshBasicMaterial({ map: screenTex }));
    screen.position.set(9, 1.4, -0.5);
    this.group.add(screen);

    this.collisionBoxes.push({
      min: new THREE.Vector3(7.6, 0, -0.7),
      max: new THREE.Vector3(10.4, 2, 0.7),
      name: 'pipeline_collider'
    });

    this.interactables.push({
      id: 'terminal_pipeline',
      type: 'terminal_pipeline',
      position: new THREE.Vector3(9, 1, 0.9),
      title: 'Console de Comunicação',
      subtitle: 'Missão 3: Arquitetura Cliente-Servidor',
      radius: 2.8,
      isLocked: false,
      meshRef: screen,
      onInteract: () => {}
    });

    // Conduítes aéreos de energia ligando Comunicações ao Núcleo Central
    const conduitGeo = new THREE.CylinderGeometry(0.12, 0.12, 10, 16);
    conduitGeo.rotateZ(Math.PI / 2);
    const conduitMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
    const conduit = new THREE.Mesh(conduitGeo, conduitMat);
    conduit.position.set(10, 4.0, 0);
    this.group.add(conduit);

    const glowTubeMat = new THREE.MeshBasicMaterial({ color: 0x0284c7 });
    const glowTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 10, 8), glowTubeMat);
    glowTube.position.set(10, 3.8, 0);
    glowTube.rotation.z = Math.PI / 2;
    this.group.add(glowTube);
  }

  // --- ZONA D: NÚCLEO CENTRAL NEXUS ---
  private buildCentralCore() {
    // 1. Núcleo Holográfico Central (Esfera flutuante com anéis em órbita)
    const coreSphereGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const coreSphereMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      wireframe: true
    });
    this.centralCoreSphere = new THREE.Mesh(coreSphereGeo, coreSphereMat);
    this.centralCoreSphere.position.set(22, 2.6, 0);
    this.group.add(this.centralCoreSphere);

    // Anel Orbital 1
    const ringGeo = new THREE.TorusGeometry(2.4, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    this.centralCoreRing1 = new THREE.Mesh(ringGeo, ringMat);
    this.centralCoreRing1.position.set(22, 2.6, 0);
    this.group.add(this.centralCoreRing1);

    // Anel Orbital 2
    this.centralCoreRing2 = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0x06b6d4 }));
    this.centralCoreRing2.position.set(22, 2.6, 0);
    this.centralCoreRing2.rotation.x = Math.PI / 3;
    this.group.add(this.centralCoreRing2);

    // Base do Núcleo
    const baseGeo = new THREE.CylinderGeometry(2.8, 3.2, 0.6, 32);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(22, 0.3, 0);
    this.group.add(base);

    // 2. Console Mestre de Reativação
    const masterConsole = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.8), baseMat);
    masterConsole.position.set(18, 0.55, 0);
    this.group.add(masterConsole);

    const masterTex = ProceduralTextures.getTerminalScreenTexture('NÚCLEO MESTRE NEXUS', 'Protocolo de Reinicialização', '#00f0ff');
    const masterScreen = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 0.05), new THREE.MeshBasicMaterial({ map: masterTex }));
    masterScreen.position.set(18, 1.35, 0.35);
    masterScreen.rotation.y = Math.PI;
    this.group.add(masterScreen);

    this.collisionBoxes.push({
      min: new THREE.Vector3(17.1, 0, -0.5),
      max: new THREE.Vector3(18.9, 2, 0.5),
      name: 'master_console_collider'
    });

    this.interactables.push({
      id: 'terminal_core',
      type: 'terminal_core',
      position: new THREE.Vector3(18, 1, -1.0),
      title: 'Console Mestre NEXUS',
      subtitle: 'Missão Final: Reinicialização da Estação',
      radius: 2.8,
      isLocked: false,
      meshRef: masterScreen,
      onInteract: () => {}
    });
  }

  // --- JANELAS PANORÂMICAS & ESPAÇO SIDERAL COM NEBULOSA COLORIDA ---
  private buildSpaceWindows() {
    // 1. Campo de estrelas azuis e brancas
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const palette = [
      new THREE.Color(0x38bdf8), // Ciano
      new THREE.Color(0xc084fc), // Roxo
      new THREE.Color(0xfde047), // Amarelo/Ouro
      new THREE.Color(0xffffff)  // Branco
    ];

    for (let i = 0; i < starCount; i++) {
      const idx = i * 3;
      starPositions[idx] = 30 + Math.random() * 50;     // X distante além das janelas
      starPositions[idx + 1] = -15 + Math.random() * 40; // Y altura
      starPositions[idx + 2] = -40 + Math.random() * 80; // Z profundidade

      const c = palette[Math.floor(Math.random() * palette.length)];
      starColors[idx] = c.r;
      starColors[idx + 1] = c.g;
      starColors[idx + 2] = c.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.9
    });
    const starField = new THREE.Points(starGeo, starMat);
    this.group.add(starField);

    // 2. Nuvens de poeira cósmica / Nebulosa
    const nebulaCount = 60;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);

    for (let i = 0; i < nebulaCount * 3; i += 3) {
      nebulaPos[i] = 45 + Math.random() * 30;
      nebulaPos[i + 1] = -5 + Math.random() * 25;
      nebulaPos[i + 2] = -25 + Math.random() * 50;
    }
    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    const nebulaMat = new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 4.5,
      transparent: true,
      opacity: 0.35
    });
    this.group.add(new THREE.Points(nebulaGeo, nebulaMat));
  }

  public unlockDoorB() {
    if (this.doorABarrier) {
      // Transforma a barreira laser em verde transparente e desce
      (this.doorABarrier.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
      this.doorABarrier.position.y = -2;
      // Remove da lista de colisão
      this.collisionBoxes = this.collisionBoxes.filter(c => c.name !== 'barrier_door_b');
      audioService.playDoorSlide();
    }
  }

  public unlockDoorC() {
    if (this.doorBBarrier) {
      (this.doorBBarrier.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
      this.doorBBarrier.position.y = -2;
      this.collisionBoxes = this.collisionBoxes.filter(c => c.name !== 'barrier_door_c');
      audioService.playDoorSlide();
    }
  }

  public triggerCoreReboot() {
    this.isCoreRebooted = true;
    if (this.centralCoreSphere) {
      const mat = this.centralCoreSphere.material as THREE.MeshStandardMaterial;
      mat.color.setHex(0x38bdf8);
      mat.emissive.setHex(0x00f0ff);
      mat.emissiveIntensity = 1.8;
      mat.wireframe = false;
    }
    audioService.playRebootGlory();
  }

  public update(delta: number) {
    this.pulseTime += delta;

    // Rotação dos anéis orbitais do Núcleo Central
    if (this.centralCoreRing1 && this.centralCoreRing2) {
      const rotSpeed = this.isCoreRebooted ? 2.5 : 0.8;
      this.centralCoreRing1.rotation.y += delta * rotSpeed;
      this.centralCoreRing1.rotation.z += delta * (rotSpeed * 0.5);

      this.centralCoreRing2.rotation.x += delta * (rotSpeed * 0.7);
      this.centralCoreRing2.rotation.y -= delta * rotSpeed;
    }

    if (this.centralCoreSphere) {
      const floatY = 2.6 + Math.sin(this.pulseTime * 2) * 0.12;
      this.centralCoreSphere.position.y = floatY;
    }
  }
}
