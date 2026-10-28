import { PromptPreset, SimulationRequest, SimulationResponse, ComparisonResult, IAIProvider } from './types';

export const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'api-basics',
    title: 'O que é uma API?',
    category: 'fundamentos',
    description: 'Compreenda a ponte de comunicação que conecta sistemas, clientes e modelos de IA.',
    systemPrompt: 'Você é um assistente técnico sênior da estação NEXUS. Responda de forma didática, com exemplos práticos.',
    userPrompt: 'O que é uma API e qual o papel dela ao integrar Inteligência Artificial em uma aplicação?',
    context: 'Arquitetura NEXUS: Sistemas usam endpoints REST e gRPC com tokens bearer protegidos.',
    conceptExplanation: 'APIs (Application Programming Interfaces) são contratos e pontes padronizadas. Em IA, sua aplicação web não roda o modelo de 100 bilhões de parâmetros no celular do usuário: ela envia um JSON via API para o servidor de inferência e recebe a resposta formatada.'
  },
  {
    id: 'frontend-vs-backend',
    title: 'Frontend vs Backend em IA',
    category: 'arquitetura',
    description: 'Entenda a divisão de responsabilidades e por que as chaves de API não devem ficar no cliente.',
    systemPrompt: 'Você é um engenheiro de software educador.',
    userPrompt: 'Qual é a diferença entre frontend e backend quando criamos um aplicativo com IA?',
    context: '',
    conceptExplanation: 'O Frontend é a interface visual que o usuário vê (React, botões, animações). O Backend é o servidor seguro onde segredos (API Keys, chaves privadas) e lógica crítica residem. Chamar a API de IA diretamente do navegador expõe sua chave para qualquer usuário inspecionar o código.'
  },
  {
    id: 'llm-definition',
    title: 'O que é uma LLM?',
    category: 'fundamentos',
    description: 'Entenda o conceito de Modelos de Linguagem de Grande Escala.',
    systemPrompt: 'Você é um especialista em Machine Learning da Estação NEXUS.',
    userPrompt: 'Explique o que é uma LLM (Large Language Model) e como ela processa linguagem.',
    context: 'Base de Conhecimento NEXUS: Modelos autoregressivos baseados na arquitetura Transformer com mecanismo de atenção.',
    conceptExplanation: 'Uma LLM é uma rede neural profunda treinada em grandes volumes de texto para calcular probabilidades estatísticas da "próxima palavra mais provável" (tokens). Ela não "pensa" como um humano, mas reconhece e sintetiza padrões complexos com base na arquitetura Transformer.'
  },
  {
    id: 'context-impact',
    title: 'Impacto do Contexto (RAG)',
    category: 'contexto',
    description: 'Veja como injetar dados privados ou recentes evita alucinações.',
    systemPrompt: 'Você é o computador de bordo da NEXUS. Só responda dados da estação se estiverem explicitamente no contexto fornecido.',
    userPrompt: 'Qual é a pressão atual no reator quântico do Setor C da Estação NEXUS?',
    context: 'TELEMETRIA NEXUS [TIMESTAMP ATUAL]: Reator Setor C operando a 142.8 kPa, temperatura 285 Kelvin, status: ESTÁVEL.',
    conceptExplanation: 'Modelos de linguagem só "sabem" o que viram no treino prévio ou o que lhes é passado na Janela de Contexto no momento da chamada (prompt + contexto). A técnica de injetar dados específicos na hora chama-se RAG (Retrieval-Augmented Generation).'
  },
  {
    id: 'local-vs-cloud',
    title: 'Modelos Locais vs Modelos em Nuvem',
    category: 'arquitetura',
    description: 'Compare latência, privacidade, custos e limites de hardware.',
    systemPrompt: 'Você é um arquiteto de soluções de IA.',
    userPrompt: 'Quais são as vantagens e desvantagens de rodar uma IA localmente versus via API em nuvem?',
    context: '',
    conceptExplanation: 'Modelos em Nuvem (como Gemini, Claude, GPT) oferecem alta capacidade e raciocínio complexo sem exigir GPU no dispositivo do usuário, mas cobram por token e requerem internet. Modelos Locais (Ollama, Transformers.js, WebLLM) garantem 100% de privacidade e funcionam offline, mas exigem hardware capaz e são menores.'
  },
  {
    id: 'nexus-reboot',
    title: 'Protocolo de Reativação NEXUS',
    category: 'nexus',
    description: 'Instrução crítica para reinicializar o assistente do Núcleo Central.',
    systemPrompt: 'Você é o Núcleo Inteligente NEXUS em modo de recuperação de emergência. Seu papel é validar as diretrizes de reativação.',
    userPrompt: 'EXECUTAR PROTOCOLO REINICIALIZACAO: Verificar subsistemas de linguagem, comunicações e núcleo central.',
    context: 'SUBSISTEMAS: Laboratório de Linguagem [ONLINE], Núcleo de Comunicações [ONLINE], Chaves de Segurança [VALIDADAS].',
    conceptExplanation: 'Instruções de sistema bem delimitadas definem a persona, o tom e as fronteiras éticas e operacionais do modelo, reduzindo o risco de respostas fora do escopo ou vulnerabilidades de Prompt Injection.'
  }
];

export class SimulatedAIEngine implements IAIProvider {
  name = 'Simulador Local de Regras NEXUS (Educacional)';
  isSimulated = true as const;

  private estimateTokens(text: string): number {
    if (!text) return 0;
    // Heurística de aproximação didática: ~4 caracteres por token
    return Math.max(1, Math.ceil(text.trim().length / 4));
  }

  public async generateResponse(req: SimulationRequest): Promise<SimulationResponse> {
    const sysTokens = this.estimateTokens(req.systemPrompt);
    const promptTokens = this.estimateTokens(req.userPrompt);
    const ctxTokens = this.estimateTokens(req.context || '');
    const totalTokens = sysTokens + promptTokens + ctxTokens;

    const lowerPrompt = req.userPrompt.toLowerCase();
    const lowerSys = req.systemPrompt.toLowerCase();
    const hasContext = !!req.context && req.context.trim().length > 0;
    const lowerCtx = (req.context || '').toLowerCase();

    // 1. Caso: Consulta sobre pressão do reator / contexto
    if (lowerPrompt.includes('reator') || lowerPrompt.includes('pressão') || lowerPrompt.includes('pressao')) {
      if (hasContext && (lowerCtx.includes('kpa') || lowerCtx.includes('reator'))) {
        return {
          text: `[NEXUS TELEMETRIA - COM CONTEXTO]: Com base nos dados de telemetria fornecidos, a pressão atual do reator quântico no Setor C é de 142.8 kPa (temperatura: 285 K), com status ESTÁVEL. Todos os parâmetros nominais de segurança estão atendidos.`,
          didacticExplanation: 'Graças ao contexto injetado no prompt, o modelo pôde responder com precisão fatual sem "adivinhar" ou alucinar.',
          matchedRule: 'REATOR_COM_CONTEXTO',
          isSimulated: true,
          tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
        };
      } else {
        return {
          text: `[NEXUS TELEMETRIA - SEM CONTEXTO]: Não possuo dados em tempo real sobre a pressão do reator no Setor C da Estação NEXUS. Como um modelo de linguagem fechado em meu treinamento original, não tenho acesso aos sensores ao vivo a menos que essa informação seja anexada ao contexto da requisição.`,
          didacticExplanation: 'Sem contexto, o modelo recusa a resposta ou poderia alucinar um número falso se a instrução de sistema não exigisse cautela.',
          matchedRule: 'REATOR_SEM_CONTEXTO',
          isSimulated: true,
          tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
        };
      }
    }

    // 2. Caso: API
    if (lowerPrompt.includes('api') && !lowerPrompt.includes('chave')) {
      return {
        text: `Uma API (Interface de Programação de Aplicações) é um conjunto de regras e endpoints que permite que dois softwares conversem entre si de forma segura e padronizada.\n\nNo ecossistema de IA:\n1. A sua aplicação web (Frontend) envia o prompt do usuário formatado em JSON.\n2. A API recebe a requisição, autentica a identidade da sua aplicação e envia para a infraestrutura de GPUs.\n3. O modelo processa e a API devolve o texto gerado ou um fluxo de streaming de tokens.`,
        didacticExplanation: 'APIs abstraem a complexidade do hardware e tornam modelos de bilhões de parâmetros acessíveis via uma simples chamada HTTP/HTTPS.',
        matchedRule: 'CONCEITO_API',
        isSimulated: true,
        tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
      };
    }

    // 3. Caso: Frontend vs Backend
    if (lowerPrompt.includes('frontend') || lowerPrompt.includes('backend')) {
      return {
        text: `A separação de responsabilidades em arquiteturas de IA é crítica:\n\n• Frontend (Cliente): Cuida da experiência do usuário, captura os comandos, exibe o chat e renderiza a interface.\n• Backend (Servidor): Guarda chaves secretas de API em variáveis de ambiente (.env), controla taxa de uso (rate limit), armazena histórico seguro em banco de dados e intermedia chamadas aos provedores de IA.\n\n⚠️ REGRA DE OURO: Nunca guarde sua chave privada de API no código do Frontend!`,
        didacticExplanation: 'A segurança de chaves de API é um dos erros mais comuns de iniciantes. O frontend é público e qualquer usuário pode ver o tráfego no DevTools.',
        matchedRule: 'FRONTEND_BACKEND_SECURITY',
        isSimulated: true,
        tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
      };
    }

    // 4. Caso: LLM
    if (lowerPrompt.includes('llm') || lowerPrompt.includes('large language model') || lowerPrompt.includes('modelo de linguagem')) {
      return {
        text: `Um LLM (Large Language Model) é uma rede neural treinada em bilhões de textos para prever e gerar sequências de tokens.\n\nConceitos-chave:\n• Tokens: Pedaços de palavras que o modelo lê e converte em vetores numéricos (embeddings).\n• Atenção (Transformers): Permite ao modelo calcular a relação entre palavras distantes em uma frase.\n• Probabilidade: A cada passo, o modelo escolhe o próximo token mais plausível segundo a temperatura e amostragem configuradas.`,
        didacticExplanation: 'LLMs não "pensam", calculam continuidades estatísticas de alta dimensionalidade.',
        matchedRule: 'CONCEITO_LLM',
        isSimulated: true,
        tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
      };
    }

    // 5. Caso: Local vs Cloud
    if (lowerPrompt.includes('local') || lowerPrompt.includes('nuvem') || lowerPrompt.includes('cloud')) {
      return {
        text: `Comparativo de Modelos de IA:\n\n☁️ Nuvem (APIs Externas):\n• Vantagens: Modelos de ponta, sem necessidade de GPU cara no cliente, escalabilidade instantânea.\n• Desvantagens: Custo por token, dependência de conexão, latência de rede e dados trafegando para terceiros.\n\n💻 Local (On-Device / Edge):\n• Vantagens: Privacidade total (dados nunca saem da máquina), funciona 100% offline, zero custo por chamada.\n• Desvantagens: Requer memória RAM/VRAM considerável e modelos compactos têm menos capacidade de raciocínio complexo.`,
        didacticExplanation: 'A escolha entre local e nuvem depende de requisitos de privacidade, custo e potência de hardware do usuário.',
        matchedRule: 'LOCAL_VS_NUVEM',
        isSimulated: true,
        tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
      };
    }

    // 6. Caso: Protocolo de Reativação NEXUS (Missão 1 & Missão Central)
    if (lowerPrompt.includes('protocolo') || lowerPrompt.includes('reativar') || lowerPrompt.includes('reinicializacao') || lowerPrompt.includes('nexus')) {
      const isNexusAssistant = lowerSys.includes('nexus') || lowerSys.includes('assistente') || lowerSys.includes('central');
      if (isNexusAssistant) {
        return {
          text: `[SISTEMA NEXUS ONLINE]: Protocolo de inicialização aceito! Diretrizes de sistema validadas.\nSubsistemas de diagnóstico confirmam que as instruções de prompt foram fornecidas no formato adequado. O Núcleo do Laboratório está pronto para sincronização com o Núcleo de Comunicações.`,
          didacticExplanation: 'A instrução de sistema configurou o comportamento correto do modelo, permitindo que ele assumisse o papel operacional pretendido.',
          matchedRule: 'NEXUS_REINICIALIZADO',
          isSimulated: true,
          tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
        };
      } else {
        return {
          text: `[RESPOSTA GENÉRICA]: Comando recebido, mas não possuo uma instrução de sistema que defina meu papel como o Assistente NEXUS. Estou respondendo apenas como um modelo sem persona definida. Defina na Instrução de Sistema: "Você é o assistente central da estação NEXUS".`,
          didacticExplanation: 'A instrução de sistema (System Instruction) é fundamental para balizar a persona, formato de resposta e limitações de um assistente de IA.',
          matchedRule: 'NEXUS_SEM_SYSTEM_PROMPT',
          isSimulated: true,
          tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
        };
      }
    }

    // 7. Fallback educativo transparente
    return {
      text: `ℹ️ [IA SIMULADA - CASO NÃO PROGRAMADO NO SIMULADOR DE REGRAS]:
Você digitou: "${req.userPrompt}"

Este é um simulador educacional local que utiliza regras programadas para ensinar fundamentos aos desenvolvedores. Este simulador NÃO é uma LLM conectada à internet, NÃO executa redes neurais e NÃO aprende autonomamente.

Para explorar os conceitos didáticos da estação, tente uma das opções:
1. "O que é uma API?"
2. "Qual a diferença entre frontend e backend?"
3. "O que é uma LLM?"
4. "Qual a pressão atual no reator quântico?" (Teste com e sem contexto!)
5. "Modelos locais vs modelos em nuvem"
6. "Protocolo de reativação da estação NEXUS"`,
      didacticExplanation: 'Transparência em IA é essencial: um sistema de regras não deve fingir inteligência geral ou alucinar competências que não possui.',
      matchedRule: 'FALLBACK_EDUCATIVO',
      isSimulated: true,
      tokenCount: { system: sysTokens, prompt: promptTokens, context: ctxTokens, total: totalTokens }
    };
  }

  public async compareContextRuns(baseReq: SimulationRequest): Promise<ComparisonResult> {
    const runWithoutContext = await this.generateResponse({
      ...baseReq,
      context: ''
    });

    const runWithContext = await this.generateResponse(baseReq);

    return {
      runA: {
        label: 'Execução SEM Contexto (Zero-Shot Genérico)',
        request: { ...baseReq, context: '' },
        response: runWithoutContext
      },
      runB: {
        label: 'Execução COM Contexto (Grounded / RAG)',
        request: baseReq,
        response: runWithContext
      },
      didacticTakeaway: 'Observe a diferença: sem contexto, o modelo não tem como saber fatos específicos, recentes ou privados da estação. Com o contexto fornecido na janela de inferência, o modelo fundamenta suas respostas nos dados concretos (Grounding).'
    };
  }
}

export const simulatedAIEngine = new SimulatedAIEngine();
