# Apito Final

Apito Final é um site de futebol com tela inicial, carrossel, cartões, listas de times e jogadores, pesquisa por abas, contato, login e painel de acessibilidade. Foi feito em HTML, CSS e JavaScript puros, sem frameworks.
## Como abrir
Abra `index.html` no navegador.

## Arquivos
- `index.html`: estrutura das telas
- `style.css`: cores (variáveis), layout e temas claro/escuro
- `script.js`: rotas, pesquisa, carrossel, formulários e acessibilidade
# Passo a passo da construção:
1.	Planejamento. Escolhi o tema (futebol) e listei os itens obrigatórios do enunciado: cartões, abas de pesquisa, contato com formulário, carrossel, imagens, cartões explicativos, modo claro e escuro, rodapé, login e painel de acessibilidade.
2.	Paleta de cores. Defini verde gramado, amarelo de cartão e neutros esverdeados, com valores próprios para o modo escuro, e medi o contraste de cada par com a fórmula do WCAG.
3.	Variáveis no CSS. Declarei todas as cores como variáveis (--bg, --fg, --pitch, --card e outras) no seletor :root. Nenhum componente usa um código de cor direto.
4.	Temas. O modo escuro redefine as mesmas variáveis dentro de :root[data-theme="dark"] e de @media (prefers-color-scheme: dark). O JavaScript escreve data-theme na tag html quando o usuário escolhe Claro ou Escuro, e remove o atributo quando escolhe Sistema.
5.	Estrutura e telas. Fiz cada tela como uma div com a classe view. A função route() lê location.hash, mostra só a tela correspondente com o atributo hidden e marca o item atual do menu.
6.	Cartões e dados. Guardei jogadores, clubes e Copas em listas no JavaScript. A função cardHtml() gera o cartão de cada item, e acrescentar um item exige só uma linha na lista.
7.	Pesquisa, abas e filtros. As abas usam role="tab" e as setas do teclado. A busca remove acentos com normalize('NFD'), filtra a lista a cada tecla e atualiza o contador. As telas Times e Jogadores usam botões de filtro.
8.	Favoritos. O botão de favorito grava a lista no localStorage, dentro de try/catch para não quebrar se o navegador bloquear o armazenamento.
9.	Carrossel. Os quatro slides ficam lado a lado numa faixa, e o JavaScript desloca a faixa com translateX. Incluí setas, pontos, pausa, teclado e deslize no celular. As imagens são SVG desenhados no próprio código.
10.	Formulários. Contato e login usam o evento submit com preventDefault(). A validação mostra o erro abaixo do campo e leva o foco ao primeiro campo inválido. Nenhum dado é enviado a servidor.
11.	Painel de acessibilidade. Inclui tema, tamanho da fonte (de 80% a 150%, por uma variável de escala), alto contraste, espaçamento maior e redução de animações. As escolhas ficam guardadas no navegador.
12.	Análise de contraste. A tela “Contraste das cores” calcula a luminância relativa de cada par de cores do tema ativo e mostra a razão e o resultado em AA e AAA.
13.	Responsividade. Usei grid com auto-fill, flex-wrap e uma regra para telas de até 760 px, que empilha as colunas.
14.	Publicação. Subi os arquivos ao GitHub em commits por etapa e ativei o GitHub Pages na branch main.
