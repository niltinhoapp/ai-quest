export type MissionId = 'mission-1' | 'mission-2' | 'mission-3' | 'mission-final';

export type MissionStatus = 'locked' | 'available' | 'in_progress' | 'completed';

export interface MissionQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Mission {
  id: MissionId;
  title: string;
  subtitle: string;
  zone: 'hangar' | 'language_lab' | 'comm_core' | 'central_core';
  description: string;
  objective: string;
  conceptsTaught: string[];
  xpReward: number;
  prerequisiteId?: MissionId;
  status: MissionStatus;
  quiz?: MissionQuiz;
}

export interface PipelineComponent {
  id: string;
  stepNumber: number;
  name: string;
  category: 'client' | 'network' | 'security' | 'server';
  description: string;
  securityNote?: string;
  iconName: string;
}
