import { Mission, MissionId, PipelineComponent } from './types';

export const INITIAL_MISSIONS: Record<MissionId, Mission> = {
  'mission-1': {
    id: 'mission-1',
    title: 'Missão 1: Reativar o NEXUS',
    subtitle: 'Instruções de Sistema e Prompts Básicos',
    zone: 'language_lab',
    description: 'A estação NEXUS sofreu uma sobrecarga e o assistente de linguagem perdeu suas diretrizes de sistema. Vá até o Terminal de Linguagem para restaurar as instruções e testar comandos de diagnóstico.',
    objective: 'Interaja com o Terminal de Linguagem, configure o papel do Assistente NEXUS na Instrução de Sistema e execute uma consulta de diagnóstico.',
    conceptsTaught: [
      'Prompts e Entradas (Input)',
      'Instruções de Sistema (System Prompt)',
      'Respostas e Saídas (Output)',
      'Definição de Personas e Limites Operacionais'
    ],
    xpReward: 100,
    status: 'available',
    quiz: {
      question: 'Qual é o principal papel da Instrução de Sistema (System Prompt) em uma aplicação com IA?',
      options: [
        'Aumentar a velocidade da placa de vídeo do usuário.',
        'Definir a persona, o formato das respostas e as regras fundamentais de conduta do modelo.',
        'Compilar o código TypeScript em tempo de execução.',
        'Salvar os dados no banco de dados sem passar pela rede.'
      ],
      correctIndex: 1,
      explanation: 'A Instrução de Sistema estabelece o "comportamento base", limites de segurança e formato de resposta do modelo antes mesmo de o usuário enviar sua primeira mensagem.'
    }
  },
  'mission-2': {
    id: 'mission-2',
    title: 'Missão 2: Memória de Contexto',
    subtitle: 'Janela de Contexto, RAG e Alucinações',
    zone: 'language_lab',
    description: 'O reator quântico do Setor C emitiu um alerta. Os sistemas precisam diagnosticar a pressão exata, mas um modelo sem contexto inventa dados (alucinação). Use o Terminal de Contexto para comparar uma resposta com e sem telemetria.',
    objective: 'Execute o teste comparativo de contexto no Terminal e identifique como o contexto fundamenta a resposta.',
    conceptsTaught: [
      'Janela de Contexto (Context Window)',
      'Prevenção de Alucinação (Grounded Generation)',
      'RAG (Retrieval-Augmented Generation)',
      'Limites da Base de Treino versus Dados em Tempo Real'
    ],
    xpReward: 150,
    prerequisiteId: 'mission-1',
    status: 'locked',
    quiz: {
      question: 'O que ocorre quando perguntamos a uma LLM sobre dados privados ou em tempo real sem passar contexto?',
      options: [
        'O modelo automaticamente hackeia a rede local para ler o dado.',
        'O modelo pode recusar por falta de informação ou alucinar inventando um dado plausível porém incorreto.',
        'O modelo sempre acerta porque ele sabe tudo o que existe no universo.',
        'O computador desliga por falta de memória.'
      ],
      correctIndex: 1,
      explanation: 'Modelos de linguagem não são oniscientes: eles só acessam informações de sua base de treinamento estática ou dados injetados dinamicamente na Janela de Contexto no momento da requisição.'
    }
  },
  'mission-3': {
    id: 'mission-3',
    title: 'Missão 3: Conectar os Sistemas',
    subtitle: 'Arquitetura Cliente-Servidor e Segurança de APIs',
    zone: 'comm_core',
    description: 'O barramento de rede do Núcleo de Comunicações foi rompido. Reorganize os componentes na sequência arquitetural correta de uma chamada de IA e garanta a proteção das chaves secretas.',
    objective: 'Organize o fluxo de 5 etapas da arquitetura Web + IA e responda ao desafio de segurança.',
    conceptsTaught: [
      'Arquitetura Cliente-Servidor',
      'Requisições e Respostas (HTTP/REST/WebSockets)',
      'Papel da API de Inferência',
      'Proteção de Credenciais e Segurança no Frontend'
    ],
    xpReward: 200,
    prerequisiteId: 'mission-2',
    status: 'locked',
    quiz: {
      question: 'Por que JAMAIS devemos colocar uma chave privada de API (API Key) diretamente no código JavaScript do frontend no navegador?',
      options: [
        'Porque navegadores não conseguem ler strings com números.',
        'Porque qualquer usuário pode inspecionar o código-fonte, ler a chave na aba Network e usá-la à vontade gerando custos e vazamento de dados.',
        'Porque a chave de API torna o arquivo HTML pesado demais.',
        'Porque o React não compila se houver caracteres especiais.'
      ],
      correctIndex: 1,
      explanation: 'O frontend é um ambiente 100% público controlado pelo usuário. Chaves privadas e lógicas proprietárias pertencem ao backend seguro, que autentica as requisições antes de chamar provedores de IA.'
    }
  },
  'mission-final': {
    id: 'mission-final',
    title: 'Missão Final: Restauração da NEXUS',
    subtitle: 'Reativação Completa do Núcleo de IA',
    zone: 'central_core',
    description: 'Com todos os subsistemas de linguagem, contexto e comunicação restabelecidos, vá até a câmara do Núcleo Central e ative a rotina de reativação mestre para devolver a consciência à Estação NEXUS.',
    objective: 'Dirija-se à câmara do Núcleo Central, ative o Console Mestre e conclua a reinicialização da estação.',
    conceptsTaught: [
      'Integração Completa de Sistemas de IA',
      'Boas Práticas para Desenvolvedores Web',
      'Evolução de Sistemas Baseados em Regras para Agentes Autônomos'
    ],
    xpReward: 300,
    prerequisiteId: 'mission-3',
    status: 'locked'
  }
};

export const PIPELINE_STEPS: PipelineComponent[] = [
  {
    id: 'step-ui',
    stepNumber: 1,
    name: '1. Interface do Usuário (Frontend)',
    category: 'client',
    description: 'Aplicação web React no navegador do usuário capturando o input digitado.',
    securityNote: 'Ambiente público; não deve conter chaves secretas ou dados sensíveis.',
    iconName: 'Layout'
  },
  {
    id: 'step-request',
    stepNumber: 2,
    name: '2. Requisição HTTP / JSON',
    category: 'network',
    description: 'Disparo de payload estruturado via HTTPS (POST) contendo o prompt e dados de sessão.',
    securityNote: 'Tráfego criptografado via TLS/SSL.',
    iconName: 'Send'
  },
  {
    id: 'step-backend',
    stepNumber: 3,
    name: '3. Servidor Backend & Autenticação',
    category: 'security',
    description: 'Seu servidor intermediário seguro (Node/Python) que valida a sessão e guarda as chaves privadas.',
    securityNote: 'Ambiente protegido: lê API_KEY das variáveis de ambiente (.env).',
    iconName: 'ShieldCheck'
  },
  {
    id: 'step-ai-api',
    stepNumber: 4,
    name: '4. Provedor de IA / Motor de Inferência',
    category: 'server',
    description: 'Servidores de alto desempenho com GPUs que executam a rede neural e processam os tokens.',
    securityNote: 'Recebe a chamada do seu backend autenticado e calcula os tokens.',
    iconName: 'Cpu'
  },
  {
    id: 'step-response',
    stepNumber: 5,
    name: '5. Resposta Estruturada / Streaming',
    category: 'client',
    description: 'Retorno dos tokens gerados para a interface, atualizando o chat em tempo real.',
    securityNote: 'Renderização sanitizada no cliente prevenindo XSS.',
    iconName: 'CheckCircle2'
  }
];

export class MissionManager {
  private missions: Record<MissionId, Mission>;
  private totalXP: number = 0;

  constructor(initialMissions = INITIAL_MISSIONS, initialXP = 0) {
    this.missions = JSON.parse(JSON.stringify(initialMissions));
    this.totalXP = initialXP;
    this.refreshAvailableMissions();
  }

  public getMissions(): Record<MissionId, Mission> {
    return this.missions;
  }

  public getMission(id: MissionId): Mission {
    return this.missions[id];
  }

  public getTotalXP(): number {
    return this.totalXP;
  }

  public getActiveMission(): Mission | null {
    // Retorna a primeira missão disponível ou em progresso
    const order: MissionId[] = ['mission-1', 'mission-2', 'mission-3', 'mission-final'];
    for (const id of order) {
      if (this.missions[id].status === 'available' || this.missions[id].status === 'in_progress') {
        return this.missions[id];
      }
    }
    return null;
  }

  public completeMission(id: MissionId): { xpEarned: number; newTotalXP: number; unlockedMissionId?: MissionId } {
    const mission = this.missions[id];
    if (!mission || mission.status === 'completed') {
      return { xpEarned: 0, newTotalXP: this.totalXP };
    }

    mission.status = 'completed';
    this.totalXP += mission.xpReward;

    const unlocked = this.refreshAvailableMissions();
    return {
      xpEarned: mission.xpReward,
      newTotalXP: this.totalXP,
      unlockedMissionId: unlocked
    };
  }

  public refreshAvailableMissions(): MissionId | undefined {
    let newlyUnlocked: MissionId | undefined;
    const order: MissionId[] = ['mission-1', 'mission-2', 'mission-3', 'mission-final'];

    for (const id of order) {
      const mission = this.missions[id];
      if (mission.status === 'locked' && mission.prerequisiteId) {
        const prereq = this.missions[mission.prerequisiteId];
        if (prereq && prereq.status === 'completed') {
          mission.status = 'available';
          if (!newlyUnlocked) newlyUnlocked = id;
        }
      }
    }
    return newlyUnlocked;
  }

  public areAllMissionsCompleted(): boolean {
    return Object.values(this.missions).every(m => m.status === 'completed');
  }

  public resetProgress() {
    this.missions = JSON.parse(JSON.stringify(INITIAL_MISSIONS));
    this.totalXP = 0;
    this.refreshAvailableMissions();
  }
}
