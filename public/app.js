/* ─── State ──────────────────────────────────────────────────── */
const state = {
  games: [],
  menu: { appetizer: [], main: [], dessert: [] },
  playerCount: 4,
  filter: 'all',
  search: '',
  playerFilter: 0,
  timeFilter: 0,
  weightFilter: 0,
};

const courseConfig = {
  appetizer: { label: 'Antipasto', limit: Infinity, badge: 'Antipasto' },
  main: { label: 'Portata Principale', limit: 5, badge: 'Portata Principale' },
  dessert: { label: 'Dolce', limit: Infinity, badge: 'Dolce' },
};

/* ─── DOM refs ──────────────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const importForm = $('#import-form');
const usernameInput = $('#username-input');
const importBtn = $('#import-btn');
const importError = $('#import-error');
const importResult = $('#import-result');
const importCount = $('#import-count');
const stepBuilder = $('#step-builder');
const searchInput = $('#search-input');
const filterTags = $('#filter-tags');
const gameGrid = $('#game-grid');
const slots = {
  appetizer: $('#slot-appetizer'),
  main: $('#slot-main'),
  dessert: $('#slot-dessert'),
};
const counts = {
  appetizer: $('#count-appetizer'),
  main: $('#count-main'),
  dessert: $('#count-dessert'),
};
const playerCount = $('#player-count');
playerCount.textContent = state.playerCount;
const playerDec = $('#player-dec');
const playerInc = $('#player-inc');
const previewBtn = $('#preview-btn');
const menuModal = $('#menu-modal');
const menuContent = $('#menu-content');
const menuPreview = $('#menu-preview');
const printBtn = $('#print-btn');
const closeModalBtn = $('#close-modal-btn');

/* ─── BGG Import ────────────────────────────────────────────── */
importForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (!username) return;

  importBtn.disabled = true;
  importBtn.querySelector('.btn__text').textContent = 'Importing…';
  importBtn.querySelector('.btn__spinner').classList.remove('hidden');
  importError.classList.add('hidden');
  importResult.classList.add('hidden');

  try {
    const res = await fetch(`/api/collection?username=${encodeURIComponent(username)}`);

    if (res.status === 202) {
      const data = await res.json();
      showError(data.message || 'BGG is preparing data. Please retry in a few seconds.');
      return;
    }

    if (!res.ok) {
      const data = await res.json();
      showError(data.error || `Error ${res.status}`);
      return;
    }

    const data = await res.json();
    state.games = data.games || [];

    importCount.textContent = state.games.length;
    importResult.classList.remove('hidden');
    stepBuilder.classList.remove('hidden');
    stepBuilder.scrollIntoView({ behavior: 'smooth' });

    resetMenu();
    renderGrid();
    renderSlots();
    updatePreviewBtn();

  } finally {
    importBtn.disabled = false;
    importBtn.querySelector('.btn__text').textContent = 'Import';
    importBtn.querySelector('.btn__spinner').classList.add('hidden');
  }
});

function showError(msg) {
  importError.textContent = msg;
  importError.classList.remove('hidden');
}

/* ─── Search & Filter ───────────────────────────────────────── */
searchInput.addEventListener('input', (e) => {
  state.search = e.target.value.toLowerCase();
  renderGrid();
});

filterTags.addEventListener('click', (e) => {
  const tag = e.target.closest('.tag');
  if (!tag) return;
  filterTags.querySelectorAll('.tag').forEach((t) => t.classList.remove('tag--active'));
  tag.classList.add('tag--active');
  state.filter = tag.dataset.filter;
  renderGrid();
});

const filterPlayers = $('#filter-players');
const filterDuration = $('#filter-duration');
const filterWeight = $('#filter-weight');

filterPlayers.addEventListener('change', () => {
  state.playerFilter = parseInt(filterPlayers.value, 10);
  renderGrid();
});
filterDuration.addEventListener('change', () => {
  state.timeFilter = parseInt(filterDuration.value, 10);
  renderGrid();
});
filterWeight.addEventListener('change', () => {
  state.weightFilter = parseInt(filterWeight.value, 10);
  renderGrid();
});

function getFilteredGames() {
  return state.games.filter((g) => {
    if (state.search && !g.name.toLowerCase().includes(state.search)) return false;

    const assigned = getGameCourse(g.id);
    if (state.filter === 'unassigned' && assigned) return false;
    if (state.filter !== 'all' && state.filter !== 'unassigned' && assigned !== state.filter) return false;

    if (state.playerFilter > 0) {
      const pf = state.playerFilter;
      if (pf === 7) {
        if ((g.maxPlayers || 99) < 7) return false;
      } else {
        if (pf < (g.minPlayers || 0) || pf > (g.maxPlayers || 99)) return false;
      }
    }

    const pt = g.playingTime || 0;
    if (state.timeFilter > 0 && pt > state.timeFilter) return false;

    const w = g.weight || 0;
    if (state.weightFilter > 0) {
      if (state.weightFilter === 4) {
        if (w <= 3.5) return false;
      } else if (w > state.weightFilter + 0.5 || w === 0) {
        return false;
      }
    }

    return true;
  });
}

function suggestCourse(game) {
  const playtime = game.playingTime || 0;
  const weight = game.weight || 0;

  if (playtime === 0 && weight === 0) return null;
  if (playtime <= 30) return 'appetizer';
  if (weight > 0 && weight < 2.0) return 'appetizer';
  return 'main';
}

function getGameCourse(gameId) {
  for (const course of ['appetizer', 'main', 'dessert']) {
    if (state.menu[course].some((g) => g.id === gameId)) return course;
  }
  return null;
}

/* ─── Game Grid ──────────────────────────────────────────────── */
function renderGrid() {
  const filtered = getFilteredGames();

  if (filtered.length === 0) {
    gameGrid.innerHTML = '<p style="color:var(--text-muted);grid-column:1/-1;padding:20px;text-align:center;">No games match your filters.</p>';
    return;
  }

  gameGrid.innerHTML = filtered
    .map((g) => {
      const assigned = getGameCourse(g.id);
      const suggestion = suggestCourse(g);
      const badge = assigned ? courseConfig[assigned].badge : '';
      const showSuggestion = !assigned && suggestion;
      const rating = g.bggRating ? g.bggRating.toFixed(1) : null;
      const playsHtml = playBadge(g);
      return `
        <div class="game-card${assigned ? ' game-card__assigned' : ''}" data-id="${g.id}">
          <div class="game-card__name">${escHtml(g.name)}</div>
          <div class="game-card__row">
            <div class="game-card__thumb">
              ${g.thumbnail ? `<img src="${g.thumbnail}" alt="" loading="lazy" />` : '<div class="game-card__thumb-placeholder"></div>'}
            </div>
            <div class="game-card__info">
              <div class="game-card__info-row"><span class="game-card__info-label">Players</span><span>${g.minPlayers}–${g.maxPlayers}</span></div>
              <div class="game-card__info-row"><span class="game-card__info-label">Duration</span><span>${g.playingTime || '?'} min</span></div>
              <div class="game-card__info-row"><span class="game-card__info-label">Complexity</span><span>${g.weight ? g.weight.toFixed(1) : '?'}</span></div>
              ${rating ? `<div class="game-card__info-row"><span class="game-card__info-label">BGG Rating</span><span>${rating}</span></div>` : ''}
              ${playsHtml ? `<div class="game-card__info-row"><span class="game-card__info-label">Plays</span><span class="stars">${playsHtml}</span></div>` : ''}
            </div>
          </div>
          <div class="game-card__footer-row">
            ${badge ? `<span class="game-card__badge badge--${assigned}">${badge}</span>` : ''}
            ${showSuggestion ? `<span class="game-card__suggestion ${suggestion}">recommended as ${suggestion}</span>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  gameGrid.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
      const id = parseInt(card.dataset.id, 10);
      const game = state.games.find((g) => g.id === id);
      if (!game) return;

      const assigned = getGameCourse(game.id);

      if (!assigned) {
        let target = suggestCourse(game) || 'appetizer';
        if (target === 'main' && state.menu.main.length >= 5) target = 'appetizer';
        state.menu[target].push(game);
      } else {
        const order = ['appetizer', 'main', 'dessert'];
        const idx = order.indexOf(assigned);
        const next = idx < 2 ? order[idx + 1] : null;

        state.menu[assigned] = state.menu[assigned].filter((g) => g.id !== game.id);

        if (next && !(next === 'main' && state.menu.main.length >= 5)) {
          state.menu[next].push(game);
        }
      }

      renderAll();
    });
  });
}

/* ─── Slots (Course Cards) ──────────────────────────────────── */
function renderSlots() {
  for (const course of ['appetizer', 'main', 'dessert']) {
    const items = state.menu[course];
    const slot = slots[course];
    const count = counts[course];

    count.textContent = items.length;

    if (items.length === 0) {
      slot.innerHTML = `<p class="course-card__placeholder">Click a game → add as ${courseConfig[course].label}</p>`;
      continue;
    }

    slot.innerHTML = items
      .map(
        (g) => `
          <div class="course-card__item">
            <div class="course-card__item-thumb">
              ${g.thumbnail ? `<img src="${g.thumbnail}" alt="" />` : ''}
            </div>
            <span class="course-card__item-name">${escHtml(g.name)}</span>
            <button class="course-card__item-remove" data-id="${g.id}" data-course="${course}">✕</button>
          </div>
        `
      )
      .join('');
  }

  document.querySelectorAll('.course-card__item-remove').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id, 10);
      const course = btn.dataset.course;
      state.menu[course] = state.menu[course].filter((g) => g.id !== id);
      renderAll();
    });
  });
}

/* ─── Player Count ──────────────────────────────────────────── */
playerDec.addEventListener('click', () => {
  if (state.playerCount > 0) {
    state.playerCount--;
    playerCount.textContent = state.playerCount || '?';
  }
  updatePreviewBtn();
});

playerInc.addEventListener('click', () => {
  if (state.playerCount < 20) {
    state.playerCount++;
    playerCount.textContent = state.playerCount;
  }
  updatePreviewBtn();
});

/* ─── Preview Menu ──────────────────────────────────────────── */
previewBtn.addEventListener('click', () => {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  document.getElementById('menu-stars-legend').classList.toggle('hidden', !hasStars());
  document.getElementById('menu-date').textContent = dateStr;
  document.getElementById('menu-guests').textContent =
    `${state.playerCount} player${state.playerCount > 1 ? 's' : ''}`;

  for (const course of ['appetizer', 'main', 'dessert']) {
    const list = document.getElementById(`menu-${course}`);
    const items = state.menu[course];
    list.innerHTML = items
      .map(
        (g) => {
          const rating = g.bggRating ? g.bggRating.toFixed(1) : null;
          return `
          <li class="menu-card__item">
            <div class="menu-card__item-thumb">
              ${g.thumbnail ? `<img src="${g.thumbnail}" alt="" />` : ''}
            </div>
            <div class="menu-card__item-body">
              <div class="menu-card__item-name">${escHtml(g.name)}</div>
              <div class="menu-card__item-desc">${g.year || ''} · ${g.minPlayers}–${g.maxPlayers} players · ${g.playingTime || g.maxPlayTime || '?'} min${rating ? ' · BGG ' + rating : ''}${g.weight ? ' · C' + g.weight.toFixed(1) : ''}</div>
            </div>
            <div class="menu-card__item-details">${playBadge(g)}</div>
          </li>
          `;
        }
      )
      .join('');
  }

  menuModal.classList.remove('hidden');
  menuContent.scrollTop = 0;
});

/* ─── Modal Controls ────────────────────────────────────────── */
function closeModal() {
  menuModal.classList.add('hidden');
}

closeModalBtn.addEventListener('click', closeModal);
menuModal.querySelector('.modal__backdrop').addEventListener('click', closeModal);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

printBtn.addEventListener('click', () => window.print());

/* ─── Render Utilities ──────────────────────────────────────── */
function renderAll() {
  renderGrid();
  renderSlots();
  updatePreviewBtn();
}

function resetMenu() {
  state.menu = { appetizer: [], main: [], dessert: [] };
}

function updatePreviewBtn() {
  const hasItems = state.menu.appetizer.length > 0 || state.menu.main.length > 0;
  const hasPlayers = state.playerCount > 0;
  previewBtn.disabled = !(hasItems && hasPlayers);
  previewBtn.title = !hasItems ? 'Add at least one game first' : !hasPlayers ? 'Set the number of players above' : 'Preview menu';
}

function hasStars() {
  return state.games.some((g) => (g.numPlays || 0) > 0);
}

function playBadge(g) {
  const plays = g.numPlays || 0;
  if (plays === 0) return '';
  if (plays >= 20) return '★★★★★';
  if (plays >= 10) return '★★★★';
  if (plays >= 5) return '★★★';
  if (plays >= 2) return '★★';
  return '★';
}

function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
