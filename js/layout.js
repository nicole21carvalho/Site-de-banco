/*
 * Monta as partes que se repetem em todas as páginas: cabeçalho, rodapé e o menu
 * lateral da área logada. Antes cada página tinha uma cópia desse HTML; agora uma
 * mudança no menu vale para o site inteiro, sem precisar de ferramenta de build.
 *
 * Cada página só indica onde está, com atributos no <body>:
 *   data-raiz="../"           caminho até a raiz do site (para páginas em subpastas)
 *   data-pagina="pix"         item do menu que fica marcado como atual
 *   data-area="cliente"       qual menu lateral usar (cliente ou funcionario)
 */
(function () {
  const corpo = document.body;
  const raiz = corpo.dataset.raiz || '';
  const paginaAtual = corpo.dataset.pagina || '';

  const atual = (id) => (id === paginaAtual ? ' aria-current="page"' : '');

  // ---------- Páginas públicas ----------

  const cabecalho = `
    <a class="pular" href="#conteudo">Pular para o conteúdo</a>
    <div class="container">
      <a class="marca" href="${raiz}index.html">
        <img src="${raiz}img/logo.png" alt="" width="108" height="79">
        <span>Banco Tech.In.Fin</span>
      </a>
      <button class="cabecalho__menu-botao" type="button" aria-expanded="false" aria-controls="menu-publico" aria-label="Abrir menu">
        <i class="bi bi-list" aria-hidden="true"></i>
      </button>
      <nav class="cabecalho__navegacao" id="menu-publico" aria-label="Principal">
        <ul class="menu">
          <li><a href="${raiz}index.html"${atual('inicio')}>Página inicial</a></li>
          <li><a href="${raiz}index.html#pessoa-fisica">Pessoa física</a></li>
          <li><a href="${raiz}index.html#mei">MEI</a></li>
          <li><a href="${raiz}index.html#pessoa-juridica">Pessoa jurídica</a></li>
        </ul>
      </nav>
      <div class="cabecalho__acoes">
        <a class="botao botao--roxo" href="${raiz}entrar.html"${atual('entrar')}>Entrar</a>
        <a class="botao botao--roxo" href="${raiz}cadastro.html"${atual('cadastro')}>Abrir conta</a>
      </div>
    </div>`;

  const rodape = `
    <div class="container">
      <div class="rodape__colunas">
        <section>
          <h2>Sobre nós</h2>
          <ul>
            <li><a href="#">Carreiras</a></li>
            <li><a href="#">Imprensa</a></li>
            <li><a href="#">Sustentabilidade</a></li>
            <li><a href="#">Privacidade</a></li>
            <li><a href="#">Integridade e ética</a></li>
          </ul>
        </section>
        <section>
          <h2>Explore</h2>
          <ul>
            <li><a href="#">Assessoria de investimento</a></li>
            <li><a href="${raiz}index.html#pessoa-juridica">Para empresas</a></li>
            <li><a href="#">Para o poder público</a></li>
            <li><a href="#">Consórcio</a></li>
          </ul>
        </section>
        <section>
          <h2>Perguntas frequentes</h2>
          <ul>
            <li><a href="#">Quem pode ter uma conta?</a></li>
            <li><a href="#">Como posso fazer saques com a minha conta?</a></li>
            <li><a href="#">Pacotes e tarifas</a></li>
          </ul>
        </section>
        <section>
          <h2>Canais de atendimento</h2>
          <p>Tire suas dúvidas e receba suporte 24 horas por dia, 7 dias por semana, pelo chat do aplicativo ou por telefone.</p>
          <form class="newsletter" data-newsletter novalidate>
            <label class="sr-only" for="email-newsletter">Seu e-mail</label>
            <input id="email-newsletter" type="email" placeholder="Seu e-mail" required>
            <button class="botao botao--vermelho" type="submit">Inscrever</button>
          </form>
          <p class="newsletter__mensagem" role="status" hidden></p>
        </section>
      </div>
      <div class="rodape__base">
        <span>© 2026 Banco Tech.In.Fin · Banco fictício, projeto de estudo</span>
        <div class="redes" aria-label="Redes sociais">
          <a href="#" aria-label="Instagram"><i class="bi bi-instagram" aria-hidden="true"></i></a>
          <a href="#" aria-label="Facebook"><i class="bi bi-facebook" aria-hidden="true"></i></a>
          <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin" aria-hidden="true"></i></a>
          <a href="#" aria-label="YouTube"><i class="bi bi-youtube" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>`;

  // ---------- Área logada ----------

  const menus = {
    cliente: {
      usuario: 'Ana',
      itens: [
        ['painel', 'painel.html', 'bi-grid-1x2', 'Painel'],
        ['investimentos', 'investimentos.html', 'bi-graph-up-arrow', 'Investimentos'],
        ['emprestimos', 'emprestimos.html', 'bi-cash-coin', 'Empréstimos'],
        ['financiamentos', 'financiamentos.html', 'bi-house-door', 'Financiamentos'],
        ['previdencia', 'previdencia.html', 'bi-shield-check', 'Previdência'],
        ['transferencia', 'transferencia.html', 'bi-arrow-left-right', 'Transferência'],
        ['pix', 'pix.html', 'bi-lightning-charge', 'Pix'],
      ],
    },
    funcionario: {
      usuario: 'Albert',
      itens: [
        ['painel', 'painel.html', 'bi-grid-1x2', 'Painel'],
        ['contas', 'painel.html#contas-correntes', 'bi-bank', 'Contas correntes'],
        ['investimentos', 'painel.html#investimentos', 'bi-graph-up-arrow', 'Investimentos'],
        ['poupancas', 'painel.html#poupanca', 'bi-piggy-bank', 'Poupanças'],
        ['cartoes', 'painel.html#cartoes', 'bi-credit-card', 'Cartões de crédito'],
        ['outras', 'painel.html#mais-informacoes', 'bi-info-circle', 'Outras informações'],
      ],
    },
  };

  function montarLateral(area) {
    const { itens } = menus[area];
    const links = itens
      .map(([id, href, icone, texto]) =>
        `<li><a href="${href}"${atual(id)}><i class="bi ${icone}" aria-hidden="true"></i>${texto}</a></li>`)
      .join('');

    return `
      <a class="marca" href="painel.html">
        <img src="${raiz}img/logo.png" alt="" width="108" height="79">
        <span>Tech.In.Fin</span>
      </a>
      <nav aria-label="Área ${area === 'cliente' ? 'do cliente' : 'do funcionário'}">
        <ul>${links}</ul>
      </nav>
      <nav class="lateral__rodape" aria-label="Ajuda">
        <p class="lateral__titulo">Central de ajuda</p>
        <ul>
          <li><a href="#"><i class="bi bi-question-circle" aria-hidden="true"></i>Perguntas frequentes</a></li>
          <li><a href="#"><i class="bi bi-shield-exclamation" aria-hidden="true"></i>Prevenção de golpes</a></li>
          <li><a href="#"><i class="bi bi-gear" aria-hidden="true"></i>Configurações</a></li>
          <li><a href="${raiz}index.html"><i class="bi bi-box-arrow-left" aria-hidden="true"></i>Sair</a></li>
        </ul>
      </nav>`;
  }

  function montarBarraTopo(area) {
    const nome = menus[area].usuario;
    return `
      <button class="barra-topo__menu" type="button" aria-expanded="false" aria-label="Abrir menu">
        <i class="bi bi-list" aria-hidden="true"></i>
      </button>
      <form class="pesquisa" role="search" onsubmit="return false">
        <label class="sr-only" for="pesquisa">Pesquisar</label>
        <i class="bi bi-search" aria-hidden="true"></i>
        <input id="pesquisa" type="search" placeholder="Pesquisar">
      </form>
      <div class="usuario">
        <a class="usuario__sino" href="#" aria-label="Notificações"><i class="bi bi-bell-fill" aria-hidden="true"></i></a>
        <span class="usuario__nome">Olá, ${nome}!</span>
        <span class="avatar" aria-hidden="true">${nome[0]}</span>
      </div>`;
  }

  // ---------- Inserção na página ----------

  const elCabecalho = document.querySelector('[data-componente="cabecalho"]');
  if (elCabecalho) {
    elCabecalho.classList.add('cabecalho');
    elCabecalho.innerHTML = cabecalho;
    const botao = elCabecalho.querySelector('.cabecalho__menu-botao');
    botao.addEventListener('click', () => {
      const aberto = elCabecalho.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', String(aberto));
    });
  }

  const elRodape = document.querySelector('[data-componente="rodape"]');
  if (elRodape) {
    elRodape.classList.add('rodape');
    elRodape.innerHTML = rodape;
    const form = elRodape.querySelector('[data-newsletter]');
    const mensagem = elRodape.querySelector('.newsletter__mensagem');
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      if (!form.checkValidity()) {
        form.querySelector('input').reportValidity();
        return;
      }
      mensagem.textContent = 'Pronto! Você vai receber nossas novidades por e-mail.';
      mensagem.hidden = false;
      form.reset();
    });
  }

  const area = corpo.dataset.area;
  const elLateral = document.querySelector('[data-componente="lateral"]');
  const elTopo = document.querySelector('[data-componente="barra-topo"]');
  if (area && elLateral && elTopo) {
    elLateral.classList.add('lateral');
    elLateral.innerHTML = montarLateral(area);
    elTopo.classList.add('barra-topo');
    elTopo.innerHTML = montarBarraTopo(area);

    const conteiner = document.querySelector('.area');
    const botao = elTopo.querySelector('.barra-topo__menu');
    botao.addEventListener('click', (evento) => {
      evento.stopPropagation();
      const aberto = conteiner.classList.toggle('menu-aberto');
      botao.setAttribute('aria-expanded', String(aberto));
    });
    document.addEventListener('click', (evento) => {
      if (conteiner.classList.contains('menu-aberto') && !elLateral.contains(evento.target)) {
        conteiner.classList.remove('menu-aberto');
        botao.setAttribute('aria-expanded', 'false');
      }
    });
  }
})();
