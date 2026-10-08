/*
 * Comportamento dos formulários do site. Cada recurso é ligado por atributo no HTML:
 *
 *   data-moeda             máscara de dinheiro (R$ 1.234,56)
 *   data-minimo="100"      valor mínimo para campos de dinheiro
 *   data-cpf / data-cep / data-telefone / data-conta   máscaras
 *   data-maior-idade       data de nascimento de alguém com 18 anos ou mais
 *   data-senha-forte       8+ caracteres com letra e número
 *   data-assinatura        área para assinar com o mouse ou o dedo
 *   form[data-formulario]  valida tudo e mostra a mensagem de [data-sucesso]
 *   form[data-redirecionar="pagina.html"]  vai para outra página depois de validar
 */
(function () {
  const V = Validacao;

  // ---------- Máscaras ----------

  const mascaras = {
    moeda: V.mascararMoeda,
    cpf: V.mascararCpf,
    cep: V.mascararCep,
    telefone: V.mascararTelefone,
    conta: V.mascararConta,
  };

  Object.entries(mascaras).forEach(([nome, mascarar]) => {
    document.querySelectorAll(`[data-${nome}]`).forEach((campo) => {
      campo.addEventListener('input', () => {
        campo.value = mascarar(campo.value);
        validarCampo(campo);
      });
    });
  });

  // ---------- Regras extras, além das nativas (required, pattern...) ----------

  function validarCampo(campo) {
    let mensagem = '';
    const valor = campo.value;

    if (valor) {
      if ('cpf' in campo.dataset && !V.cpfValido(valor)) mensagem = 'CPF inválido';
      if ('maiorIdade' in campo.dataset && !V.maiorDeIdade(valor)) mensagem = 'É preciso ter 18 anos ou mais';
      if ('senhaForte' in campo.dataset && !V.senhaForte(valor)) mensagem = 'Senha fraca';
      if ('minimo' in campo.dataset && V.lerMoeda(valor) < Number(campo.dataset.minimo)) {
        mensagem = 'Valor abaixo do mínimo';
      }
    }
    campo.setCustomValidity(mensagem);
  }

  document.querySelectorAll('[data-maior-idade], [data-senha-forte]').forEach((campo) => {
    campo.addEventListener('input', () => validarCampo(campo));
  });

  // ---------- Assinatura digital ----------

  document.querySelectorAll('[data-assinatura]').forEach((bloco) => {
    const canvas = bloco.querySelector('canvas');
    const contexto = canvas.getContext('2d');
    let desenhando = false;
    bloco.assinado = false;

    function ajustarTamanho() {
      const escala = window.devicePixelRatio || 1;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * escala;
      canvas.height = height * escala;
      contexto.scale(escala, escala);
      contexto.lineWidth = 2.5;
      contexto.lineCap = 'round';
      contexto.strokeStyle = '#17151f';
      bloco.assinado = false;
    }

    function posicao(evento) {
      const caixa = canvas.getBoundingClientRect();
      return [evento.clientX - caixa.left, evento.clientY - caixa.top];
    }

    canvas.addEventListener('pointerdown', (evento) => {
      desenhando = true;
      canvas.setPointerCapture(evento.pointerId);
      contexto.beginPath();
      contexto.moveTo(...posicao(evento));
    });
    canvas.addEventListener('pointermove', (evento) => {
      if (!desenhando) return;
      contexto.lineTo(...posicao(evento));
      contexto.stroke();
      bloco.assinado = true;
      bloco.classList.remove('campo--com-erro');
    });
    canvas.addEventListener('pointerup', () => { desenhando = false; });

    bloco.querySelector('[data-limpar-assinatura]').addEventListener('click', () => {
      contexto.clearRect(0, 0, canvas.width, canvas.height);
      bloco.assinado = false;
    });

    ajustarTamanho();
    window.addEventListener('resize', ajustarTamanho);
  });

  // ---------- Envio ----------

  document.querySelectorAll('form[data-formulario]').forEach((form) => {
    const sucesso = form.querySelector('[data-sucesso]');

    // A confirmação do envio anterior some quando a pessoa começa um novo pedido
    form.addEventListener('input', () => {
      if (sucesso) sucesso.hidden = true;
    });

    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      form.querySelectorAll('input, select, textarea').forEach(validarCampo);
      form.classList.add('foi-validado');

      const assinaturas = [...form.querySelectorAll('[data-assinatura]')];
      const semAssinatura = assinaturas.filter((bloco) => !bloco.assinado);
      semAssinatura.forEach((bloco) => bloco.classList.add('campo--com-erro'));

      const primeiroInvalido = form.querySelector(':invalid:not(fieldset)') ||
        (semAssinatura[0] && semAssinatura[0].querySelector('canvas'));
      if (primeiroInvalido) {
        primeiroInvalido.focus();
        if (sucesso) sucesso.hidden = true;
        return;
      }

      if (form.dataset.redirecionar) {
        window.location.href = form.dataset.redirecionar;
        return;
      }

      if (sucesso) {
        sucesso.textContent = montarMensagem(form, sucesso.dataset.sucesso);
        sucesso.hidden = false;
      }
      form.reset();
      form.classList.remove('foi-validado');
      assinaturas.forEach((bloco) => bloco.querySelector('[data-limpar-assinatura]').click());
      form.dispatchEvent(new Event('enviado'));
    });
  });

  // Troca {nome-do-campo} na mensagem pelo valor que a pessoa preencheu
  function montarMensagem(form, modelo) {
    return modelo.replace(/\{([\w-]+)\}/g, (_, nome) => {
      const campo = form.elements[nome];
      if (!campo) return '';
      if (campo instanceof RadioNodeList) return campo.value;
      if (campo.tagName === 'SELECT') return campo.options[campo.selectedIndex].text;
      return campo.value;
    });
  }
})();
