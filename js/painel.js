// Interações do painel do cliente.
(function () {
  // ---------- Ocultar e mostrar saldos ----------

  const botaoSaldo = document.getElementById('alternar-saldo');
  const valores = document.querySelectorAll('[data-valor-sensivel]');
  const CHAVE = 'techinfin-saldo-oculto';

  function aplicar(oculto) {
    valores.forEach((valor) => valor.classList.toggle('oculto-valor', oculto));
    botaoSaldo.setAttribute('aria-pressed', String(oculto));
    botaoSaldo.setAttribute('aria-label', oculto ? 'Mostrar saldos' : 'Ocultar saldos');
    botaoSaldo.querySelector('i').className = oculto ? 'bi bi-eye-slash' : 'bi bi-eye';
  }

  let oculto = false;
  try {
    oculto = localStorage.getItem(CHAVE) === 'sim';
  } catch {
    // Sem storage: começa com os saldos visíveis
  }
  aplicar(oculto);

  botaoSaldo.addEventListener('click', () => {
    oculto = !oculto;
    aplicar(oculto);
    try {
      localStorage.setItem(CHAVE, oculto ? 'sim' : 'nao');
    } catch {
      // A preferência só não fica salva
    }
  });

  // ---------- Expandir histórico ----------

  const botaoHistorico = document.getElementById('expandir-historico');
  const linhasExtras = document.querySelectorAll('[data-extra]');

  botaoHistorico.addEventListener('click', () => {
    const expandido = botaoHistorico.getAttribute('aria-expanded') !== 'true';
    linhasExtras.forEach((linha) => { linha.hidden = !expandido; });
    botaoHistorico.setAttribute('aria-expanded', String(expandido));
    botaoHistorico.querySelector('span').textContent = expandido ? 'Recolher histórico' : 'Expandir histórico';
    botaoHistorico.querySelector('i').className = expandido ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
  });

  // ---------- Código para compra virtual ----------

  const botaoCodigo = document.getElementById('gerar-codigo');
  const codigo = document.getElementById('codigo-virtual');

  botaoCodigo.addEventListener('click', () => {
    const numeros = Array.from(crypto.getRandomValues(new Uint8Array(4)), (n) => String(n % 10));
    codigo.textContent = `Código de segurança: ${numeros.join('')} · válido por 10 minutos`;
    codigo.hidden = false;
  });
})();
