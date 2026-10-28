import { describe, it, expect } from 'vitest';
import { MissionManager, PIPELINE_STEPS } from '../game/missions/MissionManager';

describe('MissionManager (Progressão de Missões e Gamificação)', () => {
  it('deve inicializar com a Missão 1 disponível e as demais bloqueadas', () => {
    const manager = new MissionManager();
    const missions = manager.getMissions();

    expect(missions['mission-1'].status).toBe('available');
    expect(missions['mission-2'].status).toBe('locked');
    expect(missions['mission-3'].status).toBe('locked');
    expect(missions['mission-final'].status).toBe('locked');
    expect(manager.getTotalXP()).toBe(0);
  });

  it('deve conceder 100 XP e desbloquear a Missão 2 após concluir a Missão 1', () => {
    const manager = new MissionManager();
    const result = manager.completeMission('mission-1');

    expect(result.xpEarned).toBe(100);
    expect(result.newTotalXP).toBe(100);
    expect(result.unlockedMissionId).toBe('mission-2');

    const missions = manager.getMissions();
    expect(missions['mission-1'].status).toBe('completed');
    expect(missions['mission-2'].status).toBe('available');
  });

  it('deve desbloquear a Missão 3 ao concluir a Missão 2 com ganho de XP acumulado', () => {
    const manager = new MissionManager();
    manager.completeMission('mission-1');
    const result = manager.completeMission('mission-2');

    expect(result.xpEarned).toBe(150);
    expect(result.newTotalXP).toBe(250);
    expect(result.unlockedMissionId).toBe('mission-3');

    const missions = manager.getMissions();
    expect(missions['mission-3'].status).toBe('available');
  });

  it('deve desbloquear a Missão Final ao concluir a Missão 3', () => {
    const manager = new MissionManager();
    manager.completeMission('mission-1');
    manager.completeMission('mission-2');
    const result = manager.completeMission('mission-3');

    expect(result.xpEarned).toBe(200);
    expect(result.newTotalXP).toBe(450);
    expect(result.unlockedMissionId).toBe('mission-final');

    const missions = manager.getMissions();
    expect(missions['mission-final'].status).toBe('available');
  });

  it('deve conter as 5 etapas corretas do pipeline na sequência arquitetural', () => {
    expect(PIPELINE_STEPS).toHaveLength(5);
    expect(PIPELINE_STEPS[0].stepNumber).toBe(1);
    expect(PIPELINE_STEPS[0].name).toContain('Frontend');
    expect(PIPELINE_STEPS[2].stepNumber).toBe(3);
    expect(PIPELINE_STEPS[2].name).toContain('Backend');
    expect(PIPELINE_STEPS[4].stepNumber).toBe(5);
    expect(PIPELINE_STEPS[4].name).toContain('Resposta');
  });
});
