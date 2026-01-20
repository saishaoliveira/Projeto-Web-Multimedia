
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

// 1. Função para iniciar o jogo (Criar HTML e Embaralhar)
function initGame() {
    // Embaralhar (Método simples usando sort randômico)
    cards.sort(() => 0.5 - Math.random());

    // Gerar o HTML das cartas
    cards.forEach(cardImg => {
        let cardElement = document.createElement('div');
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

// 3. Checar se combinam
function checkForMatch() {
    // Acessa o data-card que definimos no HTML
    let isMatch = firstCard.dataset.card === secondCard.dataset.card;

    isMatch ? disableCards() : unflipCards();
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
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500); // Espera 1.5s antes de desvirar
}

// 6. Reseta as variáveis de controle
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

// Inicia o jogo
initGame();