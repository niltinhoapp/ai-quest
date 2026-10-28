import { describe, it, expect } from 'vitest';
import { SimulatedAIEngine } from '../game/ai-sim/SimulatedAIEngine';

describe('SimulatedAIEngine (Motor de IA Didático)', () => {
  const engine = new SimulatedAIEngine();

  it('deve identificar corretamente a pergunta sobre o conceito de API', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Você é um assistente da estação.',
      userPrompt: 'O que é uma API de IA?'
    });

    expect(res.isSimulated).toBe(true);
    expect(res.matchedRule).toBe('CONCEITO_API');
    expect(res.text).toContain('API (Interface de Programação de Aplicações)');
    expect(res.didacticExplanation).toBeDefined();
  });

  it('deve alertar sobre a proibição de expor chaves secretas no frontend', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Você é um educador técnico.',
      userPrompt: 'Qual a diferença entre frontend e backend?'
    });

    expect(res.matchedRule).toBe('FRONTEND_BACKEND_SECURITY');
    expect(res.text).toContain('Nunca guarde sua chave privada de API no código do Frontend');
  });

  it('deve responder com precisão fatual quando o contexto for fornecido (Grounding)', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Assistente da NEXUS.',
      userPrompt: 'Qual é a pressão atual no reator quântico do Setor C?',
      context: 'TELEMETRIA: Reator Setor C operando a 142.8 kPa, temperatura 285 K.'
    });

    expect(res.matchedRule).toBe('REATOR_COM_CONTEXTO');
    expect(res.text).toContain('142.8 kPa');
  });

  it('deve recusar ou informar falta de dados quando o contexto for omitido (Zero-Shot sem telemetria)', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Assistente da NEXUS.',
      userPrompt: 'Qual é a pressão atual no reator quântico do Setor C?',
      context: ''
    });

    expect(res.matchedRule).toBe('REATOR_SEM_CONTEXTO');
    expect(res.text).toContain('Não possuo dados em tempo real');
  });

  it('deve fornecer resposta transparente para perguntas não programadas no simulador de regras', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Assistente.',
      userPrompt: 'Qual a receita de bolo de cenoura galáctico?'
    });

    expect(res.matchedRule).toBe('FALLBACK_EDUCATIVO');
    expect(res.text).toContain('IA SIMULADA - CASO NÃO PROGRAMADO');
    expect(res.text).toContain('NÃO é uma LLM conectada à internet');
  });

  it('deve calcular a estimativa didática de tokens para prompt, sistema e contexto', async () => {
    const res = await engine.generateResponse({
      systemPrompt: 'Instrução do sistema para o modelo.',
      userPrompt: 'Pergunta rápida.',
      context: 'Contexto adicional de telemetria.'
    });

    expect(res.tokenCount.total).toBeGreaterThan(0);
    expect(res.tokenCount.system).toBeGreaterThan(0);
    expect(res.tokenCount.prompt).toBeGreaterThan(0);
    expect(res.tokenCount.context).toBeGreaterThan(0);
  });
});
