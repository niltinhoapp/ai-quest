import React, { useEffect, useRef, useState, useMemo } from 'react';
import { GameEngine } from './game/engine/GameEngine';
import { MissionManager, INITIAL_MISSIONS } from './game/missions/MissionManager';
import { Mission, MissionId } from './game/missions/types';
import { SaveManager, GameSettings } from './game/storage/saveManager';
import { audioService } from './game/engine/AudioService';
import { InteractableObject } from './game/world/Types';

// UI
import { HUD } from './ui/HUD';
import { MobileControls } from './ui/MobileControls';
import { MainMenu } from './ui/MainMenu';
import { PauseMenu } from './ui/PauseMenu';
import { LanguageLabModal } from './ui/modals/LanguageLabModal';
import { ContextLabModal } from './ui/modals/ContextLabModal';
import { PipelineModal } from './ui/modals/PipelineModal';
import { CentralCoreModal } from './ui/modals/CentralCoreModal';
import { VictoryModal } from './ui/modals/VictoryModal';
import { DataPadModal } from './ui/modals/DataPadModal';
import { QuestsModal } from './ui/modals/QuestsModal';

export const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);

  // Telas e Modais
  const [inGame, setInGame] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Estado do Jogo e Missões
  const [savedData, setSavedData] = useState(() => SaveManager.loadGame());
  const [missionManager, setMissionManager] = useState<MissionManager>(() => {
    const loaded = SaveManager.loadGame();
    const mm = new MissionManager(INITIAL_MISSIONS, loaded.totalXP);
    // Restaura missões concluídas
    loaded.completedMissionIds.forEach((id) => {
      mm.completeMission(id);
    });
    return mm;
  });

  const [missions, setMissions] = useState<Record<MissionId, Mission>>(() => missionManager.getMissions());
  const [totalXP, setTotalXP] = useState<number>(() => missionManager.getTotalXP());
  const [activeInteractable, setActiveInteractable] = useState<InteractableObject | null>(null);
  const [isCoreRebooted, setIsCoreRebooted] = useState<boolean>(false);

  // Configurações
  const [audioEnabled, setAudioEnabled] = useState<boolean>(savedData.settings.audioEnabled);
  const [graphicsQuality, setGraphicsQuality] = useState<'low' | 'medium' | 'high'>(savedData.settings.graphicsQuality);

  // Detecção de Dispositivo Touch / Mobile
  const isTouchDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Inicializa ou atualiza áudio no início
  useEffect(() => {
    audioService.setEnabled(audioEnabled);
  }, [audioEnabled]);

  // Inicializa a Engine 3D Three.js quando entrar no jogo
  useEffect(() => {
    if (!inGame || !canvasRef.current) return;

    try {
      const engine = new GameEngine({
        canvas: canvasRef.current,
        onActiveInteractableChange: (item) => {
          setActiveInteractable(item);
        },
        onOpenModal: (type) => {
          setIsPaused(true);
          setActiveModal(type);
        },
        onPause: () => {
          setIsPaused(true);
        }
      });

      engine.setQuality(graphicsQuality);
      engine.start();
      gameEngineRef.current = engine;

      // Restaura destravamento de portas se o jogador já possuir save
      if (missions['mission-1']?.status === 'completed' || missions['mission-2']?.status === 'completed') {
        engine.stationMap.unlockDoorB();
      }
      if (missions['mission-3']?.status === 'completed') {
        engine.stationMap.unlockDoorC();
      }
      if (missions['mission-final']?.status === 'completed') {
        engine.stationMap.triggerCoreReboot();
        setIsCoreRebooted(true);
      }

      return () => {
        engine.dispose();
        gameEngineRef.current = null;
      };
    } catch (err) {
      console.error('Erro ao inicializar o motor de jogo 3D:', err);
    }
  }, [inGame]);

  // Pausa / Retoma o loop da simulação
  useEffect(() => {
    if (gameEngineRef.current) {
      gameEngineRef.current.setPaused(isPaused || activeModal !== null);
    }
  }, [isPaused, activeModal]);

  // Persistência automática ao mudar missões ou XP
  const persistGameState = (completedIds: MissionId[], xp: number) => {
    SaveManager.saveGame({
      totalXP: xp,
      completedMissionIds: completedIds,
      settings: {
        graphicsQuality,
        audioEnabled,
        musicVolume: 0.6,
        sfxVolume: 0.8
      }
    });
  };

  // Conclusão de Missão
  const handleCompleteMission = (missionId: MissionId) => {
    const result = missionManager.completeMission(missionId);
    const updatedMissions = { ...missionManager.getMissions() };
    setMissions(updatedMissions);
    setTotalXP(result.newTotalXP);

    const completedIds = (Object.keys(updatedMissions) as MissionId[]).filter(
      (id) => updatedMissions[id].status === 'completed'
    );
    persistGameState(completedIds, result.newTotalXP);

    // Destrava barreiras 3D correspondentes no mundo
    if (gameEngineRef.current) {
      if (missionId === 'mission-1' || missionId === 'mission-2') {
        gameEngineRef.current.stationMap.unlockDoorB();
      }
      if (missionId === 'mission-3') {
        gameEngineRef.current.stationMap.unlockDoorC();
      }
      if (missionId === 'mission-final') {
        gameEngineRef.current.stationMap.triggerCoreReboot();
        setIsCoreRebooted(true);
      }
    }
  };

  // Reinicialização do Núcleo Central
  const handleTriggerReboot = () => {
    handleCompleteMission('mission-final');
    setActiveModal('victory');
  };

  // Controle de Áudio
  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    audioService.setEnabled(next);
    SaveManager.saveGame({
      settings: { ...savedData.settings, audioEnabled: next }
    });
  };

  // Controle de Qualidade Gráfica
  const handleChangeGraphics = (quality: 'low' | 'medium' | 'high') => {
    setGraphicsQuality(quality);
    if (gameEngineRef.current) {
      gameEngineRef.current.setQuality(quality);
    }
    SaveManager.saveGame({
      settings: { ...savedData.settings, graphicsQuality: quality }
    });
  };

  // Reset Geral
  const handleResetProgress = () => {
    SaveManager.resetSave();
    const mm = new MissionManager(INITIAL_MISSIONS, 0);
    setMissionManager(mm);
    setMissions(mm.getMissions());
    setTotalXP(0);
    setIsCoreRebooted(false);
    setSavedData(SaveManager.loadGame());
    if (gameEngineRef.current) {
      gameEngineRef.current.character.position.set(-15, 0, 0);
    }
  };

  const activeMission = missionManager.getActiveMission();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* TELA DE MENU PRINCIPAL */}
      {!inGame ? (
        <MainMenu
          hasExistingSave={SaveManager.hasExistingSave()}
          totalXP={totalXP}
          onStartNewGame={() => {
            handleResetProgress();
            setInGame(true);
          }}
          onContinueGame={() => {
            setInGame(true);
          }}
          onResetSave={handleResetProgress}
          audioEnabled={audioEnabled}
          onToggleAudio={handleToggleAudio}
        />
      ) : (
        <>
          {/* CANVAS 3D THREE.JS */}
          <canvas
            ref={canvasRef}
            className="w-full h-full block touch-none cursor-grab active:cursor-grabbing"
          />

          {/* HUD DO JOGO (Objetivos, XP, Interação) */}
          <HUD
            activeMission={activeMission}
            totalXP={totalXP}
            activeInteractable={activeInteractable}
            audioEnabled={audioEnabled}
            onToggleAudio={handleToggleAudio}
            onOpenPauseMenu={() => setIsPaused(true)}
            onOpenQuestsModal={() => setActiveModal('quests')}
            onInteract={() => {
              if (gameEngineRef.current) {
                gameEngineRef.current.handleInteractionTrigger();
              }
            }}
            isTouchDevice={isTouchDevice}
          />

          {/* CONTROLES MOBILE VIRTUAIS (Apenas se tela touch e sem modal aberto) */}
          {isTouchDevice && !isPaused && activeModal === null && (
            <MobileControls
              inputManager={gameEngineRef.current?.inputManager || null}
              onInteract={() => {
                if (gameEngineRef.current) {
                  gameEngineRef.current.handleInteractionTrigger();
                }
              }}
              canInteract={!!activeInteractable}
            />
          )}

          {/* MENU DE PAUSA */}
          {isPaused && activeModal === null && (
            <PauseMenu
              onResume={() => setIsPaused(false)}
              onReturnToMainMenu={() => {
                setIsPaused(false);
                setInGame(false);
              }}
              onResetProgress={handleResetProgress}
              audioEnabled={audioEnabled}
              onToggleAudio={handleToggleAudio}
              graphicsQuality={graphicsQuality}
              onChangeGraphics={handleChangeGraphics}
              isTouchDevice={isTouchDevice}
            />
          )}

          {/* MODAIS DIDÁTICOS DE MISSÃO */}
          {activeModal === 'terminal_language' && (
            <LanguageLabModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              mission={missions['mission-1']}
              onCompleteMission={() => handleCompleteMission('mission-1')}
            />
          )}

          {activeModal === 'terminal_context' && (
            <ContextLabModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              mission={missions['mission-2']}
              onCompleteMission={() => handleCompleteMission('mission-2')}
            />
          )}

          {activeModal === 'terminal_pipeline' && (
            <PipelineModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              mission={missions['mission-3']}
              onCompleteMission={() => handleCompleteMission('mission-3')}
            />
          )}

          {activeModal === 'terminal_core' && (
            <CentralCoreModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              missions={missions}
              onTriggerReboot={handleTriggerReboot}
              isRebooted={isCoreRebooted}
            />
          )}

          {activeModal === 'datapad' && (
            <DataPadModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              isTouchDevice={isTouchDevice}
            />
          )}

          {activeModal === 'quests' && (
            <QuestsModal
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              missions={missions}
              totalXP={totalXP}
            />
          )}

          {activeModal === 'victory' && (
            <VictoryModal
              totalXP={totalXP}
              onClose={() => {
                setActiveModal(null);
                setIsPaused(false);
              }}
              onRestart={() => {
                handleResetProgress();
                setActiveModal(null);
                setIsPaused(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
