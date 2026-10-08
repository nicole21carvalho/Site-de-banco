// Regras de validação e formatação, sem depender da página (testadas em validacao.test.js).

const Validacao = (() => {
  const somenteDigitos = (texto) => String(texto).replace(/\D/g, '');

  const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  function formatarMoeda(valor) {
    // Intl usa espaço não separável depois do "R$"; troca por espaço comum
    return moeda.format(valor).replace(/ /g, ' ');
  }

  // Máscara de dinheiro que cresce da direita: "1" → R$ 0,01, "1234" → R$ 12,34
  function mascararMoeda(texto) {
    const digitos = somenteDigitos(texto).replace(/^0+/, '').slice(0, 13);
    if (!digitos) return '';
    return formatarMoeda(Number(digitos) / 100);
  }

  function lerMoeda(texto) {
    const digitos = somenteDigitos(texto);
    return digitos ? Number(digitos) / 100 : 0;
  }

  function cpfValido(cpf) {
    const d = somenteDigitos(cpf);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    const digito = (quantidade) => {
      let soma = 0;
      for (let i = 0; i < quantidade; i++) soma += Number(d[i]) * (quantidade + 1 - i);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    };
    return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
  }

  function mascararCpf(texto) {
    return somenteDigitos(texto).slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function mascararCep(texto) {
    return somenteDigitos(texto).slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  }

  function mascararTelefone(texto) {
    const d = somenteDigitos(texto).slice(0, 11);
    if (d.length <= 2) return d.replace(/(\d+)/, '($1');
    if (d.length <= 6) return d.replace(/(\d{2})(\d+)/, '($1) $2');
    if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d+)/, '($1) $2-$3');
    return d.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  // Conta com dígito: "1234567" → "123456-7"
  function mascararConta(texto) {
    return somenteDigitos(texto).slice(0, 13).replace(/(\d+)(\d)$/, '$1-$2');
  }

  // Maior de idade na data de hoje
  function maiorDeIdade(dataIso, hoje = new Date()) {
    const nascimento = new Date(dataIso + 'T00:00:00');
    if (Number.isNaN(nascimento.getTime()) || nascimento > hoje) return false;
    const limite = new Date(nascimento);
    limite.setFullYear(limite.getFullYear() + 18);
    return limite <= hoje;
  }

  // Senha com pelo menos 8 caracteres, uma letra e um número
  function senhaForte(senha) {
    return senha.length >= 8 && /[a-zA-Z]/.test(senha) && /\d/.test(senha);
  }

  return {
    somenteDigitos, formatarMoeda, mascararMoeda, lerMoeda, cpfValido, mascararCpf,
    mascararCep, mascararTelefone, mascararConta, maiorDeIdade, senhaForte,
  };
})();

if (typeof module !== 'undefined') {
  module.exports = Validacao;
}
