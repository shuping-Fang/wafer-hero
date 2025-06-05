
let steps = [];
let shuffled = [];

async function startGame() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  const res = await fetch('data/steps.json');
  steps = await res.json();

  shuffled = [...steps].sort(() => Math.random() - 0.5);
  renderCards(shuffled);
}

function renderCards(cardData) {
  const area = document.getElementById('card-area');
  area.innerHTML = '';
  cardData.forEach((step, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = step.id;
    card.innerHTML = `
      <img src="assets/${step.image}" style="width:100%; height:100px; object-fit:contain; border-radius:6px;"><br>
      <strong>${step.name}</strong>
    `;
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragover', e => e.preventDefault());
    card.addEventListener('drop', dropCard);
    area.appendChild(card);
  });
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.currentTarget.dataset.id);
}

function dropCard(event) {
  event.preventDefault();
  const draggedId = event.dataTransfer.getData('text/plain');
  const targetCard = event.currentTarget;
  const container = targetCard.parentNode;
  const draggedCard = container.querySelector(`[data-id='${draggedId}']`);

  if (draggedCard && targetCard && draggedCard !== targetCard) {
    const allCards = Array.from(container.children);
    const draggedIndex = allCards.indexOf(draggedCard);
    const targetIndex = allCards.indexOf(targetCard);
    if (draggedIndex < targetIndex) {
      container.insertBefore(draggedCard, targetCard.nextSibling);
    } else {
      container.insertBefore(draggedCard, targetCard);
    }
  }
}

function submitOrder() {
  const cards = document.querySelectorAll('#card-area .card');
  let correct = 0;
  cards.forEach((card, i) => {
    const step = steps.find(s => s.id === card.dataset.id);
    if (step.order === i + 1) correct++;
  });

  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');

  document.getElementById('result-message').innerText =
    correct === steps.length
      ? "🎉 完全正確！你是製程小達人！"
      : `你答對了 ${correct} / ${steps.length} 個步驟`;

  const seqDiv = document.getElementById('correct-sequence');
  seqDiv.innerHTML = '';
  steps.forEach(step => {
    const resultCard = document.createElement('div');
    resultCard.className = 'card';
    resultCard.innerHTML = `
      <img src="assets/${step.image}" style="width:100%; height:100px; object-fit:contain; border-radius:6px;"><br>
      <strong>${step.name}</strong>
    `;
    seqDiv.appendChild(resultCard);
  });
}

function restartGame() {
  location.reload();
}
