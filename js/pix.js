// Interações da Área Pix: troca de ações, cópia de chaves e QR Code ilustrativo.
(function () {
  // ---------- Troca entre as ações ----------

  const botoes = document.querySelectorAll('[data-acao]');
  const paineis = document.querySelectorAll('[data-painel]');

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      botoes.forEach((b) => b.setAttribute('aria-pressed', String(b === botao)));
      paineis.forEach((painel) => { painel.hidden = painel.dataset.painel !== botao.dataset.acao; });
      const aberto = document.querySelector(`[data-painel="${botao.dataset.acao}"]`);
      aberto.querySelector('input')?.focus();
    });
  });

  // ---------- Copiar chave ----------

  const avisoCopia = document.getElementById('aviso-copia');
  document.querySelectorAll('[data-copiar]').forEach((botao) => {
    botao.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(botao.dataset.copiar);
        avisoCopia.textContent = 'Chave copiada!';
      } catch {
        avisoCopia.textContent = `Não foi possível copiar. Sua chave é: ${botao.dataset.copiar}`;
      }
      avisoCopia.hidden = false;
    });
  });

  // ---------- QR Code ilustrativo ----------
  // Desenha um padrão com a cara de um QR Code (com os três quadrados de canto) que muda
  // conforme o valor. Não é um QR Code de verdade: gerar um exigiria uma biblioteca e o
  // código "copia e cola" do Pix, que depende do servidor do banco.

  const TAMANHO = 21;
  const qrcode = document.getElementById('qrcode');
  const legenda = document.getElementById('legenda-qrcode');
  const campoValor = document.getElementById('valor-receber');

  function ehCanto(linha, coluna) {
    const dentro = (l, c) => l >= 0 && l < 7 && c >= 0 && c < 7;
    const desenhoCanto = (l, c) => l === 0 || l === 6 || c === 0 || c === 6 || (l >= 2 && l <= 4 && c >= 2 && c <= 4);
    for (const [dl, dc] of [[0, 0], [0, TAMANHO - 7], [TAMANHO - 7, 0]]) {
      if (dentro(linha - dl, coluna - dc)) return { canto: true, preto: desenhoCanto(linha - dl, coluna - dc) };
    }
    return { canto: false };
  }

  function desenhar(semente) {
    let estado = semente || 1;
    const aleatorio = () => {
      estado = (estado * 1103515245 + 12345) % 2147483648;
      return estado / 2147483648;
    };

    const celulas = [];
    for (let linha = 0; linha < TAMANHO; linha++) {
      for (let coluna = 0; coluna < TAMANHO; coluna++) {
        const { canto, preto } = ehCanto(linha, coluna);
        const celula = document.createElement('span');
        if (canto ? preto : aleatorio() > 0.5) celula.className = 'preto';
        celulas.push(celula);
      }
    }
    qrcode.replaceChildren(...celulas);
  }

  campoValor.addEventListener('input', () => {
    const valor = Validacao.lerMoeda(campoValor.value);
    desenhar(Math.round(valor * 100) + 7);
    legenda.firstChild.textContent = valor ? `Receber ${Validacao.formatarMoeda(valor)}` : 'Valor livre';
  });

  desenhar(7);
})();
