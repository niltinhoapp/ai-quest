export interface PromptPreset {
  id: string;
  title: string;
  category: 'fundamentos' | 'contexto' | 'arquitetura' | 'nexus';
  description: string;
  systemPrompt: string;
  userPrompt: string;
  context: string;
  conceptExplanation: string;
}

export interface SimulationRequest {
  systemPrompt: string;
  userPrompt: string;
  context?: string;
}

export interface SimulationResponse {
  text: string;
  didacticExplanation: string;
  matchedRule: string;
  isSimulated: true;
  tokenCount: {
    system: number;
    prompt: number;
    context: number;
    total: number;
  };
}

export interface ComparisonResult {
  runA: {
    label: string;
    request: SimulationRequest;
    response: SimulationResponse;
  };
  runB: {
    label: string;
    request: SimulationRequest;
    response: SimulationResponse;
  };
  didacticTakeaway: string;
}

export interface IAIProvider {
  name: string;
  isSimulated: boolean;
  generateResponse(req: SimulationRequest): Promise<SimulationResponse>;
}
