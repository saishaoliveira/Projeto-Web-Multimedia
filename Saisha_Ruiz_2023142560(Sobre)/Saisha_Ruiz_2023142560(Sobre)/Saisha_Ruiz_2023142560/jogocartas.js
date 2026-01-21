
// Caminho relativo para as imagens das cartas (ajuste conforme necessário)
const imgPath = 'img/';

// Lista de cartas (pares)
const cards = [];
for (let i = 1; i <= 12; i++) {
    cards.push(`carta_${i}.png`);
    cards.push(`carta_${i}.png`); // Adiciona o par
}

const gameBoard = document.querySelector('.memory-game');
let hasFlippedCard = false;
let lockBoard = false; // Impede clicar em mais cartas enquanto a animação ocorre
let firstCard, secondCard;
const maximoJogadas = 10;

// Contador de jogadas
let numeroJogadas = 0; 
const displayContador = document.getElementById('contador');

// Botão de recomeçar
const btnRecomecar = document.getElementById('btn-recomecar'); 

// 1. Função para iniciar o jogo (Criar HTML e Embaralhar)
function initGame() {
    // Embaralhar (Método simples usando sort randômico)

    gameBoard.innerHTML = '';
    cards.sort(() => 0.5 - Math.random());

    // Resetar variáveis
    numeroJogadas = 0;
    displayContador.innerHTML = `Jogadas: 0 / ${maximoJogadas}`;

    // Gerar o HTML das cartas
    cards.forEach(cardImg => {
        let cardElement = document.createElement('div');
        // REMOVIDO: Declarações redundantes de 'contador' e 'jogadas' que estavam aqui

        cardElement.classList.add('memory-card');
        cardElement.dataset.card = cardImg; // ID da carta para comparação

        cardElement.innerHTML = `
            <img class="front-face" src="${imgPath + cardImg}" alt="Carta" draggable="false" />
            <img class="back-face" src="${imgPath}carta_parte_traz.png" alt="Verso" draggable="false" />
        `;

        // Adiciona o evento de clique
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

}

if (btnRecomecar) {
    btnRecomecar.addEventListener('click', unflipAllCards);
}

// 2. Lógica de Virar a Carta
function flipCard() {
    // Se o tabuleiro estiver trancado (animação rolando), sai da função
    if (lockBoard) return;

    // Se clicou na mesma carta duas vezes, sai da função
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        // Primeiro clique
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // Segundo clique
    secondCard = this;
    checkForMatch();
}

// Contador de jogadas
function contador() { 
    numeroJogadas++;
    console.log(numeroJogadas);
        displayContador.innerHTML = `Jogadas: ${numeroJogadas} / ${maximoJogadas}`;
    // A verificação de fim de jogo será chamada dentro do fluxo do match
}

// Verificar fim de jogo
function verificarFimDeJogo() {
    if (numeroJogadas >= maximoJogadas) { 
        // Bloqueia o tabuleiro para impedir novos cliques
        lockBoard = true;

        // Aguarda um pouco para finalizar a animação da última carta virada (800ms)
        setTimeout(() => {
            // Mostra todas as cartas (Frente)
            revealAllCards();

            // Aguarda o usuário visualizar as cartas reveladas (ex: 1 segundo) antes de perguntar
            setTimeout(() => {
                let jogarNovamente = confirm('Fim de jogo! Você atingiu o número máximo de jogadas.\n\nQuer jogar novamente?');
                
                if (jogarNovamente) {
                    initGame();
                }
                // Se cancelar, o jogo permanece parado com as cartas à mostra
            }, 1000);

        }, 800);
    }
}

// 3. Checar se combinam
function checkForMatch() {
    // Incrementa jogada ao tentar um par
    contador();

    // Acessa o data-card que definimos no HTML
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;

    if (isMatch) {
        disableCards();
        // Verifica fim de jogo após acertar (caso queira limitar movimentos mesmo acertando)
        verificarFimDeJogo();
    } else {
        unflipCards(); 
        // Verifica fim de jogo após errar. Note: unflipCards tem delay de 1.5s, 
        // mas verificarFimDeJogo tem seu próprio delay. 
        // Se o jogo acabar, o reset global (unflipAllCards) vai sobrescrever o unflipCards parcial.
        verificarFimDeJogo();
    }
}

// 4. Desabilitar cartas (Match correto)
function disableCards() {
    // Remove o listener para não serem clicadas novamente
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

// 5. Desvirar cartas (Match errado)
function unflipCards() {
    lockBoard = true; // Bloqueia o tabuleiro

    setTimeout(() => {
        // CORREÇÃO: Verifica se as cartas ainda existem/estão definidas antes de tentar remover a classe
        if (firstCard && secondCard) {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }
    }, 1500); // Espera 1.5s antes de desvirar
}

// Revelar todas as cartas
function revealAllCards() {
    const allCards = document.querySelectorAll('.memory-card');
    allCards.forEach(card => {
        card.classList.add('flip'); // Adiciona a classe que mostra a frente
    });
    // Reseta as variáveis para garantir que nenhuma função pendente (como unflipCards) desvire as cartas depois
    resetBoard();
}

//Desvirar todas as cartas
function unflipAllCards() {
    // CORREÇÃO: Em vez de manipular classes manualmente, reiniciamos o jogo completamente.
    // Isso garante que todas as cartas voltem ao estado inicial, embaralhadas e clicáveis.
    
    // Reseta as variáveis de controle
    resetBoard();
    
    // Reinicia o visual e a lógica
    initGame();
}

// 6. Reseta as variáveis de controle
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Inicia o jogo
initGame();