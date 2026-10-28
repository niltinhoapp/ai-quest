import { MissionId } from '../missions/types';

export interface GameSettings {
  graphicsQuality: 'low' | 'medium' | 'high';
  audioEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
}

export interface SavedGameData {
  version: number;
  totalXP: number;
  completedMissionIds: MissionId[];
  collectedDataPads: string[];
  settings: GameSettings;
  lastSavedAt: string;
}

const STORAGE_KEY = 'ai_quest_nexus_save_v1';

const DEFAULT_SETTINGS: GameSettings = {
  graphicsQuality: 'medium',
  audioEnabled: true,
  musicVolume: 0.6,
  sfxVolume: 0.8
};

const DEFAULT_SAVE: SavedGameData = {
  version: 1,
  totalXP: 0,
  completedMissionIds: [],
  collectedDataPads: [],
  settings: DEFAULT_SETTINGS,
  lastSavedAt: new Date().toISOString()
};

export class SaveManager {
  public static saveGame(data: Partial<SavedGameData>): boolean {
    try {
      const current = this.loadGame();
      const updated: SavedGameData = {
        ...current,
        ...data,
        version: 1,
        lastSavedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return true;
    } catch (err) {
      console.warn('Falha ao salvar o progresso no LocalStorage:', err);
      return false;
    }
  }

  public static loadGame(): SavedGameData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_SAVE };

      const parsed = JSON.parse(raw);

      // Validação defensiva com defaults
      const validated: SavedGameData = {
        version: 1,
        totalXP: typeof parsed.totalXP === 'number' && parsed.totalXP >= 0 ? parsed.totalXP : 0,
        completedMissionIds: Array.isArray(parsed.completedMissionIds) ? parsed.completedMissionIds : [],
        collectedDataPads: Array.isArray(parsed.collectedDataPads) ? parsed.collectedDataPads : [],
        settings: {
          graphicsQuality: ['low', 'medium', 'high'].includes(parsed.settings?.graphicsQuality)
            ? parsed.settings.graphicsQuality
            : DEFAULT_SETTINGS.graphicsQuality,
          audioEnabled: typeof parsed.settings?.audioEnabled === 'boolean'
            ? parsed.settings.audioEnabled
            : DEFAULT_SETTINGS.audioEnabled,
          musicVolume: typeof parsed.settings?.musicVolume === 'number'
            ? parsed.settings.musicVolume
            : DEFAULT_SETTINGS.musicVolume,
          sfxVolume: typeof parsed.settings?.sfxVolume === 'number'
            ? parsed.settings.sfxVolume
            : DEFAULT_SETTINGS.sfxVolume
        },
        lastSavedAt: parsed.lastSavedAt || new Date().toISOString()
      };

      return validated;
    } catch (err) {
      console.warn('Arquivo de save corrompido ou inacessível. Usando valores padrão.', err);
      return { ...DEFAULT_SAVE };
    }
  }

  public static hasExistingSave(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return (parsed.completedMissionIds && parsed.completedMissionIds.length > 0) || (parsed.totalXP && parsed.totalXP > 0);
    } catch {
      return false;
    }
  }

  public static resetSave(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Erro ao resetar dados:', err);
    }
  }
}
