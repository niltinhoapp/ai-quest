import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { SaveManager } from '../game/storage/saveManager';

describe('SaveManager (Persistência no LocalStorage)', () => {
  const store: Record<string, string> = {};

  beforeAll(() => {
    // Mock robusto de localStorage para o ambiente Node de testes
    const mockStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = String(value); },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => {
        Object.keys(store).forEach((k) => delete store[k]);
      },
      key: (i: number) => Object.keys(store)[i] ?? null,
      get length() {
        return Object.keys(store).length;
      }
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockStorage,
      writable: true
    });
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('deve retornar estado padrão quando nenhum save existir', () => {
    const data = SaveManager.loadGame();
    expect(data.version).toBe(1);
    expect(data.totalXP).toBe(0);
    expect(data.completedMissionIds).toEqual([]);
    expect(data.settings.audioEnabled).toBe(true);
  });

  it('deve salvar e carregar o progresso do jogador com sucesso', () => {
    SaveManager.saveGame({
      totalXP: 250,
      completedMissionIds: ['mission-1', 'mission-2']
    });

    const loaded = SaveManager.loadGame();
    expect(loaded.totalXP).toBe(250);
    expect(loaded.completedMissionIds).toEqual(['mission-1', 'mission-2']);
    expect(SaveManager.hasExistingSave()).toBe(true);
  });

  it('deve se recuperar com segurança se dados do storage estiverem corrompidos', () => {
    localStorage.setItem('ai_quest_nexus_save_v1', '{ invalid_json :::');

    const loaded = SaveManager.loadGame();
    expect(loaded.version).toBe(1);
    expect(loaded.totalXP).toBe(0);
    expect(loaded.completedMissionIds).toEqual([]);
  });

  it('deve resetar o progresso corretamente ao chamar resetSave()', () => {
    SaveManager.saveGame({
      totalXP: 500,
      completedMissionIds: ['mission-1', 'mission-2', 'mission-3']
    });
    expect(SaveManager.hasExistingSave()).toBe(true);

    SaveManager.resetSave();
    expect(SaveManager.hasExistingSave()).toBe(false);
  });
});
