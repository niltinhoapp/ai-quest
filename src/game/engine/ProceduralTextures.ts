import * as THREE from 'three';

export class ProceduralTextures {
  /**
   * Textura do piso: Placas modulares de liga metálica com circuitos luminosos
   * em ciano e detalhes hexagonais sutis.
   */
  public static getFloorTexture(): THREE.CanvasTexture {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Fundo azul-petróleo espacial profundo
    ctx.fillStyle = '#060b17';
    ctx.fillRect(0, 0, size, size);

    // Divisórias das placas modulares
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    const step = size / 4;

    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }

    // Circuitos e conduítes energéticos em Ciano e Roxo neon
    for (let x = 0; x < size; x += step) {
      for (let y = 0; y < size; y += step) {
        // Moldura interna da placa
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 8, y + 8, step - 16, step - 16);

        // Conector central luminoso em ciano brilhante
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(x + step / 2, y + step / 2, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(x + step / 2, y + step / 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Linhas de circuito sutis que saem do centro
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x + step / 2, y + 16);
        ctx.lineTo(x + step / 2, y + step - 16);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x + 16, y + step / 2);
        ctx.lineTo(x + step - 16, y + step / 2);
        ctx.stroke();

        // Parafusos angulares de titânio escovado
        ctx.fillStyle = '#475569';
        [
          [x + 14, y + 14],
          [x + step - 14, y + 14],
          [x + 14, y + step - 14],
          [x + step - 14, y + step - 14]
        ].forEach(([bx, by]) => {
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
  }

  /**
   * Textura de paredes: Painéis compostos de grafite com faixas de sinalização
   * e tubos de energia neon que dão vida e contraste à estação.
   */
  public static getWallTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Fundo grafite espacial elegante
    ctx.fillStyle = '#0b1329';
    ctx.fillRect(0, 0, 512, 512);

    // Painéis horizontais com chanfros luminosos
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, 500, 500);

    // Painéis acústicos e estruturais
    for (let y = 32; y < 512; y += 96) {
      ctx.fillStyle = '#0d1836';
      ctx.fillRect(16, y, 480, 80);
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 2;
      ctx.strokeRect(16, y, 480, 80);
    }

    // Faixa dupla emissiva de conduíte de dados (Ciano + Azul Cobalto)
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(16, 240, 480, 20);

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(16, 244, 480, 12);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(16, 248, 480, 4);

    // Detalhe de aviso chevron em âmbar/amarelo industrial nos cantos
    ctx.fillStyle = 'rgba(245, 158, 11, 0.7)';
    for (let i = 24; i < 180; i += 24) {
      ctx.beginPath();
      ctx.moveTo(i, 480);
      ctx.lineTo(i + 12, 480);
      ctx.lineTo(i + 24, 496);
      ctx.lineTo(i + 12, 496);
      ctx.closePath();
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  /**
   * Textura das telas de monitores e terminais holográficos
   */
  public static getTerminalScreenTexture(title: string, sub: string, accentColor = '#38bdf8'): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Fundo escuro com gradiente holográfico
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 256);
    bgGrad.addColorStop(0, '#030712');
    bgGrad.addColorStop(1, '#081730');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 256);

    // Borda vibrante neon
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 6;
    ctx.strokeRect(8, 8, 496, 240);

    // Scanlines holográficas horizontais
    ctx.fillStyle = 'rgba(56, 189, 248, 0.08)';
    for (let y = 0; y < 256; y += 6) {
      ctx.fillRect(0, y, 512, 2);
    }

    // Marca d'água / logotipo NEXUS no canto superior direito
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('⚡ NEXUS PROTOCOL', 310, 40);

    // Cabeçalho da interface
    ctx.fillStyle = accentColor;
    ctx.font = 'bold 24px monospace';
    ctx.fillText(`[SISTEMA ATIVO]`, 28, 48);

    // Título principal
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px monospace';
    ctx.fillText(title, 28, 105);

    // Subtítulo
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px monospace';
    ctx.fillText(sub, 28, 145);

    // Barra de status com gradiente vibrante
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(28, 180, 456, 4);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('● PRONTO PARA INTERAÇÃO [E]', 28, 222);

    return new THREE.CanvasTexture(canvas);
  }
}
