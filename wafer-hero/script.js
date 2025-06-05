
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
    card.innerHTML = `<div>${step.name}</div>`;
    card.addEventListener('dragstart', dragStart);
    area.appendChild(card);
  });
  enableDragDrop(area);
}

function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.dataset.id);
}

function enableDragDrop(container) {
  container.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragover', e => e.preventDefault());
    card.addEventListener('drop', e => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData('text/plain');
      const target = e.target.closest('.card');
      if (target && draggedId !== target.dataset.id) {
        const dragged = container.querySelector(`[data-id="${draggedId}"]`);
        container.insertBefore(dragged, target);
      }
    });
  });
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
  seqDiv.innerHTML = steps.map(s =>
    `<div class="card">${s.name}</div>`).join('');
}

function restartGame() {
  location.reload();
}
