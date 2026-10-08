// Comportamentos específicos do cadastro: tipo de documento, estados e busca de CEP.
(function () {
  const ESTADOS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

  const selectEstado = document.getElementById('estado');
  ESTADOS.forEach((uf) => selectEstado.add(new Option(uf, uf)));

  // ---------- CPF ou passaporte ----------

  const tipo = document.getElementById('tipo-documento');
  const documento = document.getElementById('documento');
  const erroDocumento = document.getElementById('erro-documento');

  function validarDocumento() {
    if (tipo.value === 'cpf') {
      documento.value = Validacao.mascararCpf(documento.value);
      documento.setCustomValidity(documento.value && !Validacao.cpfValido(documento.value) ? 'CPF inválido' : '');
    } else {
      // Passaporte brasileiro: 2 letras e 6 números (ex.: AB123456)
      documento.value = documento.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9);
      const valido = /^[A-Z]{2}\d{6}$/.test(documento.value);
      documento.setCustomValidity(documento.value && !valido ? 'Passaporte inválido' : '');
    }
  }

  tipo.addEventListener('change', () => {
    const ehCpf = tipo.value === 'cpf';
    documento.value = '';
    documento.placeholder = ehCpf ? '000.000.000-00' : 'AB123456';
    documento.inputMode = ehCpf ? 'numeric' : 'text';
    erroDocumento.textContent = ehCpf ? 'Informe um CPF válido.' : 'Use 2 letras e 6 números, como AB123456.';
    documento.setCustomValidity('');
  });
  documento.addEventListener('input', validarDocumento);

  // ---------- Endereço pelo CEP (API pública ViaCEP) ----------

  const cep = document.getElementById('cep');
  const status = document.getElementById('status-cep');
  const campos = {
    logradouro: document.getElementById('logradouro'),
    bairro: document.getElementById('bairro'),
    localidade: document.getElementById('cidade'),
    uf: selectEstado,
  };

  cep.addEventListener('input', async () => {
    const digitos = Validacao.somenteDigitos(cep.value);
    if (digitos.length !== 8) return;

    status.textContent = 'Buscando endereço…';
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const endereco = await resposta.json();
      if (endereco.erro) {
        status.textContent = 'CEP não encontrado. Preencha o endereço manualmente.';
        return;
      }
      Object.entries(campos).forEach(([chave, campo]) => {
        if (endereco[chave]) campo.value = endereco[chave];
      });
      status.textContent = 'Endereço preenchido. Confira e informe o número.';
      document.getElementById('numero').focus();
    } catch {
      status.textContent = 'Não foi possível buscar o CEP agora. Preencha o endereço manualmente.';
    }
  });
})();
