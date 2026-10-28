# AI Quest: NEXUS Research Station 🚀🤖
**Jogo 3D Educacional em Terceira Pessoa sobre Inteligência Artificial para Desenvolvedores Web**

![Status](https://img.shields.io/badge/status-funcional%20%26%20testado-success)
![Tecnologias](https://img.shields.io/badge/stack-React%20%7C%20Three.js%20%7C%20TypeScript%20%7C%20Vite-blue)
![Testes](https://img.shields.io/badge/testes-15%2F15%20passando-emerald)

---

## 1. Visão Geral do Jogo

**AI Quest** é uma aventura 3D desenvolvida para ensinar aos desenvolvedores web e profissionais de tecnologia os conceitos fundamentais de Inteligência Artificial, LLMs, Engenharia de Prompt, RAG (Retrieval-Augmented Generation), Arquitetura Cliente-Servidor e Segurança de APIs.

O jogador assume o papel de um especialista em computação enviado à **NEXUS Research Station**, uma estação orbital cujos subsistemas inteligentes entraram em modo de emergência após uma sobrecarga. O objetivo principal é restaurar os subsistemas da estação e reativar o assistente central NEXUS através de experimentação prática.

---

## 2. Áreas da Estação e Missões

### 🚪 Setor A: Hangar de Entrada (Área de Boas-Vindas)
- **Objetivo**: Ambientação, tutorial de controles e introdução à história.
- **Elementos**: Pads holográficos de movimentação, Totem DataPad de operações e corredor de acesso ao laboratório.

### 🔬 Setor B: Laboratório de Linguagem
- **Missão 1: Reativar o NEXUS**
  - **Conceitos**: Instrução de Sistema (*System Prompt*), Prompts de Usuário (*User Prompt*), Entradas e Saídas (*Input/Output*), Tokens e definição de Personas.
  - **Desafio**: Configurar as diretrizes do Assistente NEXUS no terminal de IA simulada e responder ao quiz de fixação.
  - **Recompensa**: 100 XP + Abertura da Barreira de Segurança do Núcleo de Comunicações.
- **Missão 2: Memória de Contexto & RAG**
  - **Conceitos**: Janela de Contexto (*Context Window*), *Grounding*, Prevenção de Alucinação e RAG (*Retrieval-Augmented Generation*).
  - **Desafio**: Executar testes comparativos com e sem telemetria do reator quântico da estação para observar como o modelo fundamenta suas respostas em fatos concretos.
  - **Recompensa**: 150 XP + Sincronização dos sistemas de dados.

### 🌐 Setor C: Núcleo de Comunicações
- **Missão 3: Conectar os Sistemas (Arquitetura Cliente-Servidor & APIs)**
  - **Conceitos**: Interface do Usuário (Frontend), Requisições HTTP/JSON, Servidor Backend Seguro, Provedor de Inferência de IA e Segurança de Chaves de API (*API Keys*).
  - **Desafio**: Reorganizar interativamente as 5 etapas do pipeline e responder por que credenciais secretas jamais devem ser expostas no código do navegador.
  - **Recompensa**: 200 XP + Desbloqueio do Portal da Câmara do Núcleo Central.

### ⚡ Setor D: Núcleo Central NEXUS
- **Missão Final: Restauração da Estação**
  - **Conceitos**: Integração total de sistemas de IA, boas práticas em produção e diplomação.
  - **Desafio**: Validar os três subsistemas calibrados no Console Mestre e disparar o protocolo de reinicialização da estação.
  - **Recompensa**: 300 XP + Sequência de reativação com iluminação total do núcleo, fanfarra sonora e Diploma de Especialista.

---

## 3. Arquitetura do Código

```
e:/jogo tipo iniciante/
├── index.html                   # Entry point HTML com metatags mobile/PWA
├── package.json                 # Dependências oficiais (Three.js, React, Lucide, Vitest)
├── tsconfig.json                # Configuração TypeScript ES2020
├── vite.config.ts               # Bundler Vite configurado para porta 3000
├── src/
│   ├── main.tsx                 # Montagem do React no DOM
│   ├── index.css                # Sistema de design futurista e utilitários responsivos
│   ├── App.tsx                  # Coordenador de estado, persistência e modais
│   ├── game/
│   │   ├── engine/
│   │   │   ├── GameEngine.ts         # Motor Three.js, iluminação, loop e colisões
│   │   │   ├── AudioService.ts       # Síntese sonora nativa via Web Audio API
│   │   │   └── ProceduralTextures.ts # Texturas procedurais (chão, paredes, displays)
│   │   ├── world/
│   │   │   ├── StationMap.ts         # Geometria 3D modular das 4 zonas da estação
│   │   │   ├── Materials.ts          # Materiais e iluminação da estação
│   │   │   └── Types.ts              # Tipos de colisões e objetos interativos
│   │   ├── character/
│   │   │   └── Character.ts          # Modelo 3D do especialista e animação de passos
│   │   ├── controls/
│   │   │   ├── InputManager.ts       # Teclado, mouse drag e joystick touch
│   │   │   └── CameraController.ts   # Câmera orbital em 3ª pessoa com amortecimento
│   │   ├── ai-sim/
│   │   │   ├── SimulatedAIEngine.ts  # Motor didático de IA por regras explicadas
│   │   │   └── types.ts              # Presets, requisições, tokens e IAIProvider
│   │   ├── missions/
│   │   │   ├── MissionManager.ts     # Máquina de estados das missões e pipeline
│   │   │   └── types.ts              # Definições de missões e quizzes
│   │   └── storage/
│   │       └── saveManager.ts        # Persistência com validação no LocalStorage
│   ├── ui/
│   │   ├── HUD.tsx                   # Interface superior, XP, objetivos e prompt [E]
│   │   ├── MobileControls.tsx        # Joystick analógico virtual e botões touch
│   │   ├── MainMenu.tsx              # Tela inicial, novo jogo e continuar
│   │   ├── PauseMenu.tsx             # Menu de pausa, qualidade 3D e reset de save
│   │   ├── components/               # Badges e Barras de Progresso
│   │   └── modals/
│   │       ├── LanguageLabModal.tsx  # Terminal de prompts e Missão 1
│   │       ├── ContextLabModal.tsx   # Comparador de RAG e Missão 2
│   │       ├── PipelineModal.tsx     # Puzzle de arquitetura e Missão 3
│   │       ├── CentralCoreModal.tsx  # Console mestre de reativação
│   │       ├── VictoryModal.tsx      # Certificado de conclusão e resumo
│   │       ├── DataPadModal.tsx      # Totem de manual e lore
│   │       └── QuestsModal.tsx       # Log geral de missões e conceitos
│   └── tests/
│       ├── aiEngine.test.ts          # Testes unitários do motor de IA
│       ├── missions.test.ts          # Testes de progressão e pré-requisitos
│       └── storage.test.ts           # Testes de salvamento e recuperação
```

---

## 4. Controles

### 🖥️ Computador (Desktop)
| Comando | Tecla / Ação |
| :--- | :--- |
| **Mover** | `W`, `A`, `S`, `D` ou Setas do teclado |
| **Correr** | `Shift` (Segurar enquanto move) |
| **Girar Câmera** | Clicar com o mouse na tela e arrastar |
| **Interagir** | Tecla `E` (quando próximo a um terminal ou console) |
| **Pausar / Menu** | Tecla `Esc` |

### 📱 Celular / Tablet (Android & iOS)
| Controle | Região / Ação |
| :--- | :--- |
| **Joystick Analógico** | Canto inferior esquerdo (arraste para navegar em 360°) |
| **Girar Câmera** | Toque e deslize na metade direita da tela |
| **Botão Ação** | Botão circular grande no canto inferior direito |
| **Botão Run** | Botão de raio para alternar entre caminhada e corrida |

---

## 5. Como Executar o Projeto Localmente

### Pré-requisitos
- Node.js instalado (v18, v20 ou v24+).
- Navegador web moderno com suporte a WebGL (Chrome, Edge, Firefox, Safari).

### Passo a passo
1. Instale as dependências (já instaladas neste workspace):
   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abra o endereço exibido no terminal (por padrão `http://localhost:3000`) no seu navegador ou conecte seu smartphone pela mesma rede Wi-Fi!

4. Para executar a suíte completa de testes automatizados:
   ```bash
   npm test
   ```

5. Para gerar o build de produção otimizado:
   ```bash
   npm run build
   ```

---

## 6. Transparência do Motor de IA

O MVP utiliza uma classe `SimulatedAIEngine` totalmente local e determinística baseada em heurísticas e regras programadas. 
- **Sem Custos ou Chaves**: Não requer tokens pagos, chaves da OpenAI, Google Gemini ou Anthropic.
- **Transparência Educacional**: O terminal explica explicitamente que um motor de regras não aprende autonomamente, contrastando com o mecanismo de atenção de uma LLM real.
- **Preparado para o Futuro**: A arquitetura implementa a interface `IAIProvider`. Em versões futuras, um adaptador real (ex: `@google/genai` ou WebLLM no navegador) pode ser plugado substituindo apenas a implementação da interface, sem alterar nenhuma linha de cena ou interface gráfica.

---

## 7. Resultados dos Testes Automatizados

Foram executados 15 testes unitários cobrindo todos os módulos centrais:
- `src/tests/aiEngine.test.ts` (6 testes): Casos de API, Frontend vs Backend, Grounding com telemetria, Zero-Shot sem contexto, Fallback didático transparente e cálculo de tokens.
- `src/tests/missions.test.ts` (5 testes): Estado inicial, desbloqueio encadeado das missões 1, 2, 3 e Final, e ordem canônica dos 5 componentes do pipeline.
- `src/tests/storage.test.ts` (4 testes): Recuperação de padrões, gravação de XP, tolerância a dados corrompidos e reset de campanha.

Status: **15/15 testes aprovados com sucesso.**
