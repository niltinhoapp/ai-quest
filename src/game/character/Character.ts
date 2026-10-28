import * as THREE from 'three';
import { audioService } from '../engine/AudioService';

export class Character {
  public mesh: THREE.Group;
  public position: THREE.Vector3;
  public rotationY: number = 0;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public isMoving: boolean = false;
  public isRunning: boolean = false;

  // Membros para animação procedural
  private leftLeg!: THREE.Group;
  private rightLeg!: THREE.Group;
  private leftArm!: THREE.Group;
  private rightArm!: THREE.Group;
  private head!: THREE.Group;
  private torso!: THREE.Group;
  private visorMaterial!: THREE.MeshBasicMaterial;

  private animTime: number = 0;
  private lastStepPhase: number = 0;

  constructor() {
    this.mesh = new THREE.Group();
    this.position = this.mesh.position;
    this.buildModel();
  }

  private buildModel() {
    // Materiais estilizados Sci-Fi com alto contraste e cores vibrantes
    const suitMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a, // Grafite escuro elegante
      metalness: 0.5,
      roughness: 0.4
    });

    const armorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // Armadura de cerâmica aeroespacial branca/prateada de alto contraste
      metalness: 0.85,
      roughness: 0.15
    });

    const darkPlateMaterial = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.8,
      roughness: 0.2
    });

    const glowCyanMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff
    });

    const glowGoldMaterial = new THREE.MeshBasicMaterial({
      color: 0xfbbf24
    });

    this.visorMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8
    });

    // --- TORSO ---
    this.torso = new THREE.Group();
    this.torso.position.y = 0.95;

    const chestGeo = new THREE.BoxGeometry(0.42, 0.5, 0.26);
    const chest = new THREE.Mesh(chestGeo, suitMaterial);
    chest.castShadow = true;
    this.torso.add(chest);

    // Placa peitoral de cerâmica branca com acabamento premium
    const plateGeo = new THREE.BoxGeometry(0.38, 0.35, 0.08);
    const plate = new THREE.Mesh(plateGeo, armorMaterial);
    plate.position.set(0, 0.05, 0.12);
    this.torso.add(plate);

    // Reator do peito (Emissive Arc Reactor ciano com moldura dourada)
    const arcRingGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 16);
    arcRingGeo.rotateX(Math.PI / 2);
    const arcRing = new THREE.Mesh(arcRingGeo, glowGoldMaterial);
    arcRing.position.set(0, 0.08, 0.16);
    this.torso.add(arcRing);

    const arcGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.05, 16);
    arcGeo.rotateX(Math.PI / 2);
    const arc = new THREE.Mesh(arcGeo, glowCyanMaterial);
    arc.position.set(0, 0.08, 0.17);
    this.torso.add(arc);

    // Mochila / Jetpack em grafite escuro com luzes
    const packGeo = new THREE.BoxGeometry(0.28, 0.38, 0.14);
    const pack = new THREE.Mesh(packGeo, darkPlateMaterial);
    pack.position.set(0, 0.06, -0.16);
    this.torso.add(pack);

    // Propulsores luminosos da mochila
    const thrusterGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.08, 12);
    const thrusterL = new THREE.Mesh(thrusterGeo, glowCyanMaterial);
    thrusterL.position.set(-0.08, -0.12, -0.16);
    const thrusterR = thrusterL.clone();
    thrusterR.position.x = 0.08;
    this.torso.add(thrusterL, thrusterR);

    this.mesh.add(this.torso);

    // --- CABEÇA / CAPACETE ---
    this.head = new THREE.Group();
    this.head.position.y = 1.38;

    const helmetGeo = new THREE.SphereGeometry(0.18, 16, 16);
    helmetGeo.scale(1, 1.15, 1.1);
    const helmet = new THREE.Mesh(helmetGeo, armorMaterial);
    helmet.castShadow = true;
    this.head.add(helmet);

    // Faixa dourada no topo do capacete
    const stripeGeo = new THREE.BoxGeometry(0.04, 0.22, 0.2);
    const stripe = new THREE.Mesh(stripeGeo, glowGoldMaterial);
    stripe.position.set(0, 0.1, 0);
    this.head.add(stripe);

    // Visor Neon curvado vibrante
    const visorGeo = new THREE.BoxGeometry(0.24, 0.1, 0.12);
    const visor = new THREE.Mesh(visorGeo, this.visorMaterial);
    visor.position.set(0, 0.02, 0.12);
    this.head.add(visor);

    this.mesh.add(this.head);

    // --- BRAÇOS ---
    const armGeo = new THREE.CylinderGeometry(0.055, 0.05, 0.42, 12);
    armGeo.translate(0, -0.2, 0);

    // Ombreiras brancas de cerâmica
    const shoulderGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);

    // Braço Esquerdo
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.28, 1.15, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, suitMaterial);
    leftArmMesh.castShadow = true;
    const leftShoulder = new THREE.Mesh(shoulderGeo, armorMaterial);
    leftShoulder.position.set(0, 0, 0);
    this.leftArm.add(leftArmMesh, leftShoulder);
    this.mesh.add(this.leftArm);

    // Braço Direito
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.28, 1.15, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, suitMaterial);
    rightArmMesh.castShadow = true;
    const rightShoulder = new THREE.Mesh(shoulderGeo, armorMaterial);
    rightShoulder.position.set(0, 0, 0);
    this.rightArm.add(rightArmMesh, rightShoulder);

    // Holo-comunicador de pulso no braço direito
    const commGeo = new THREE.BoxGeometry(0.08, 0.06, 0.06);
    const comm = new THREE.Mesh(commGeo, glowCyanMaterial);
    comm.position.set(0.04, -0.28, 0.04);
    this.rightArm.add(comm);

    this.mesh.add(this.rightArm);

    // --- PERNAS ---
    const legGeo = new THREE.CylinderGeometry(0.07, 0.06, 0.65, 12);
    legGeo.translate(0, -0.32, 0);

    const bootGeo = new THREE.BoxGeometry(0.14, 0.12, 0.22);
    bootGeo.translate(0, -0.6, 0.04);

    // Perna Esquerda
    this.leftLeg = new THREE.Group();
    this.leftLeg.position.set(-0.13, 0.7, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, suitMaterial);
    leftLegMesh.castShadow = true;
    const leftBootMesh = new THREE.Mesh(bootGeo, armorMaterial);
    leftBootMesh.castShadow = true;
    this.leftLeg.add(leftLegMesh, leftBootMesh);
    this.mesh.add(this.leftLeg);

    // Perna Direita
    this.rightLeg = new THREE.Group();
    this.rightLeg.position.set(0.13, 0.7, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, suitMaterial);
    rightLegMesh.castShadow = true;
    const rightBootMesh = new THREE.Mesh(bootGeo, armorMaterial);
    rightBootMesh.castShadow = true;
    this.rightLeg.add(rightLegMesh, rightBootMesh);
    this.mesh.add(this.rightLeg);

    // Sombra projetada simples e econômica (disco sob o personagem)
    const shadowGeo = new THREE.CircleGeometry(0.42, 16);
    shadowGeo.rotateX(-Math.PI / 2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.4
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.position.y = 0.02;
    this.mesh.add(shadowMesh);
  }

  public updateAnimation(delta: number, speed: number) {
    if (speed > 0.05) {
      this.isMoving = true;
      const animSpeed = this.isRunning ? 14 : 9;
      this.animTime += delta * animSpeed;

      const legSwing = Math.sin(this.animTime) * (this.isRunning ? 0.75 : 0.55);
      this.leftLeg.rotation.x = legSwing;
      this.rightLeg.rotation.x = -legSwing;

      const armSwing = Math.sin(this.animTime) * (this.isRunning ? 0.65 : 0.45);
      this.leftArm.rotation.x = -armSwing;
      this.rightArm.rotation.x = armSwing;

      // Leve oscilação de passos
      this.torso.position.y = 0.95 + Math.abs(Math.sin(this.animTime * 2)) * 0.04;
      this.head.position.y = 1.38 + Math.abs(Math.sin(this.animTime * 2)) * 0.04;

      // Detecção de passada para efeito sonoro de passos
      const currentStepPhase = Math.floor(this.animTime / Math.PI);
      if (currentStepPhase !== this.lastStepPhase) {
        this.lastStepPhase = currentStepPhase;
        audioService.playFootstep();
      }
    } else {
      this.isMoving = false;
      this.animTime += delta * 2;

      // Respiração em repouso (Idle)
      const breath = Math.sin(this.animTime) * 0.015;
      this.torso.position.y = 0.95 + breath;
      this.head.position.y = 1.38 + breath * 1.2;

      // Retorno suave dos membros
      this.leftLeg.rotation.x = THREE.MathUtils.lerp(this.leftLeg.rotation.x, 0, delta * 8);
      this.rightLeg.rotation.x = THREE.MathUtils.lerp(this.rightLeg.rotation.x, 0, delta * 8);
      this.leftArm.rotation.x = THREE.MathUtils.lerp(this.leftArm.rotation.x, 0, delta * 8);
      this.rightArm.rotation.x = THREE.MathUtils.lerp(this.rightArm.rotation.x, 0, delta * 8);
    }
  }

  public setRotation(angleY: number, smooth: boolean = true) {
    if (smooth) {
      // Interpolação angular correta para evitar giros de 360 graus
      const diff = Math.atan2(Math.sin(angleY - this.mesh.rotation.y), Math.cos(angleY - this.mesh.rotation.y));
      this.mesh.rotation.y += diff * 0.2;
    } else {
      this.mesh.rotation.y = angleY;
    }
    this.rotationY = this.mesh.rotation.y;
  }
}
