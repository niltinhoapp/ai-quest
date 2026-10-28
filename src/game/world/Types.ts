import * as THREE from 'three';

export type InteractableType = 
  | 'terminal_language'
  | 'terminal_context'
  | 'terminal_pipeline'
  | 'terminal_core'
  | 'datapad'
  | 'door_sensor';

export interface InteractableObject {
  id: string;
  type: InteractableType;
  position: THREE.Vector3;
  title: string;
  subtitle: string;
  radius: number;
  isLocked: boolean;
  lockReason?: string;
  meshRef?: THREE.Object3D;
  onInteract: () => void;
}

export interface CollisionBox {
  min: THREE.Vector3;
  max: THREE.Vector3;
  name?: string;
}
