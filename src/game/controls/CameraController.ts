import * as THREE from 'three';

export class CameraController {
  public camera: THREE.PerspectiveCamera;
  private targetPosition: THREE.Vector3 = new THREE.Vector3();
  private currentCameraPos: THREE.Vector3 = new THREE.Vector3(0, 3, 6);

  // Ângulos orbitais esféricos
  private yaw: number = 0;       // Rotação horizontal (azimuth)
  private pitch: number = 0.25;  // Rotação vertical (elevação)
  private distance: number = 4.8;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  public applyRotation(deltaYaw: number, deltaPitch: number) {
    this.yaw -= deltaYaw;
    this.pitch = Math.max(-0.15, Math.min(0.95, this.pitch + deltaPitch));
  }

  public getYaw(): number {
    return this.yaw;
  }

  public update(delta: number, characterPos: THREE.Vector3) {
    // Alvo focado no peito do personagem
    this.targetPosition.set(characterPos.x, characterPos.y + 1.2, characterPos.z);

    // Cálculo das coordenadas esféricas
    const cosPitch = Math.cos(this.pitch);
    const sinPitch = Math.sin(this.pitch);
    const sinYaw = Math.sin(this.yaw);
    const cosYaw = Math.cos(this.yaw);

    const desiredX = this.targetPosition.x + this.distance * sinYaw * cosPitch;
    const desiredY = Math.max(0.6, this.targetPosition.y + this.distance * sinPitch);
    const desiredZ = this.targetPosition.z + this.distance * cosYaw * cosPitch;

    // Suavização (damping) para transição fluida
    const smoothFactor = Math.min(1, delta * 12);
    this.currentCameraPos.x += (desiredX - this.currentCameraPos.x) * smoothFactor;
    this.currentCameraPos.y += (desiredY - this.currentCameraPos.y) * smoothFactor;
    this.currentCameraPos.z += (desiredZ - this.currentCameraPos.z) * smoothFactor;

    this.camera.position.copy(this.currentCameraPos);
    this.camera.lookAt(this.targetPosition);
  }
}
