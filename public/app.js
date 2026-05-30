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

const menuFonts = [
  { name: 'Playfair Display', value: "'Playfair Display', serif", google: 'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600', caps: 'all' },
  { name: 'EB Garamond', value: "'EB Garamond', serif", google: 'EB+Garamond:ital,wght@0,400;0,600;0,700;1,400', caps: 'title' },
  { name: 'Cormorant Garamond', value: "'Cormorant Garamond', serif", google: 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400', caps: 'title' },
  { name: 'Bodoni Moda', value: "'Bodoni Moda', serif", google: 'Bodoni+Moda:opsz,wght@6..12,400;6..12,600;6..12,700', caps: 'all' },
  { name: 'Lora', value: "'Lora', serif", google: 'Lora:ital,wght@0,400;0,600;0,700;1,400', caps: 'title' },
  { name: 'Merriweather', value: "'Merriweather', serif", google: 'Merriweather:wght@300;400;700;900', caps: 'title' },
  { name: 'Monsieur La Doulaise', value: "'Monsieur La Doulaise', serif", google: 'Monsieur+La+Doulaise', caps: 'title' },
  { name: 'Cinzel', value: "'Cinzel', serif", google: 'Cinzel:wght@400;600;700', caps: 'all' },
  { name: 'Prata', value: "'Prata', serif", google: 'Prata', caps: 'title' },
  { name: 'Libre Baskerville', value: "'Libre Baskerville', serif", google: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400', caps: 'title' },
  { name: 'Old Standard TT', value: "'Old Standard TT', serif", google: 'Old+Standard+TT:ital,wght@0,400;0,700;1,400', caps: 'title' },
  { name: 'Unna', value: "'Unna', serif", google: 'Unna:ital,wght@0,400;0,700;1,400', caps: 'title' },
  { name: 'Cardo', value: "'Cardo', serif", google: 'Cardo:ital,wght@0,400;0,700;1,400', caps: 'title' },
  { name: 'Vollkorn', value: "'Vollkorn', serif", google: 'Vollkorn:ital,wght@0,400;0,600;0,700;1,400', caps: 'title' },
  { name: 'Lato', value: "'Lato', sans-serif", google: 'Lato:wght@300;400;700', caps: 'all' },
  { name: 'Montserrat', value: "'Montserrat', sans-serif", google: 'Montserrat:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400', caps: 'all' },
  { name: 'Raleway', value: "'Raleway', sans-serif", google: 'Raleway:ital,wght@0,300;0,400;0,600;0,700;1,300', caps: 'all' },
  { name: 'Oswald', value: "'Oswald', sans-serif", google: 'Oswald:wght@300;400;600;700', caps: 'all' },
  { name: 'Work Sans', value: "'Work Sans', sans-serif", google: 'Work+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300', caps: 'all' },
];

function loadGoogleFont(font) {
  const id = `gf-${font.name.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
  document.head.appendChild(link);
}

/* ─── DOM refs ──────────────────────────────────────────────── */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const importForm = $('#import-form');
const usernameInput = $('#username-input');
const importBtn = $('#import-btn');
const skipBtn = $('#skip-btn');
const importError = $('#import-error');
const importResult = $('#import-result');
const importCount = $('#import-count');
const stepBuilder = $('#step-builder');
const stepFont = $('#step-font');
const fontOptions = $('#font-options');
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

/* ─── Generator refs ─────────────────────────────────────────── */
const genBtn = $('#generate-btn');
const genModal = $('#gen-modal');
const closeGenBtn = $('#close-gen-btn');
const genGoBtn = $('#gen-go-btn');
const genError = $('#gen-error');
const genPlayers = $('#gen-players');

/* ─── Custom game refs ───────────────────────────────────────── */
const customBtn = $('#custom-btn');
const customModal = $('#custom-modal');
const closeCustomBtn = $('#close-custom-btn');
const customForm = $('#custom-form');
const customName = $('#custom-name');
const customMin = $('#custom-min');
const customMax = $('#custom-max');
const customTime = $('#custom-time');
const customDesc = $('#custom-desc');
const customImg = $('#custom-img');
const customImgFile = $('#custom-img-file');
const customDropzone = $('#custom-dropzone');
const customPreviewImg = $('#custom-preview-img');
const customImgRemove = $('#custom-img-remove');
const customWeight = $('#custom-weight');
const customError = $('#custom-error');
const customFormTitle = $('#custom-form-title');

/* ─── Description modal refs ──────────────────────────────────── */
const descModal = $('#desc-modal');
const descText = $('#desc-text');
const descSaveBtn = $('#desc-save-btn');
const closeDescBtn = $('#close-desc-btn');

let customIdCounter = -1;
let editingCustomId = null;
let descTargetId = null;

/* ─── BGG Import ────────────────────────────────────────────── */
importForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  await doImport(usernameInput.value.trim());
});

skipBtn.addEventListener('click', () => {
  stepBuilder.classList.remove('hidden');
  stepBuilder.scrollIntoView({ behavior: 'smooth' });
  resetMenu();
  renderAll();
  renderFontOptions();
  updatePreviewBtn();
});

async function doImport(username) {
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
    rehydrateCustomGames();
    loadDescriptions();

    history.replaceState(null, '', `?username=${encodeURIComponent(username)}`);

    importCount.textContent = state.games.length;
    importResult.classList.remove('hidden');
    stepBuilder.classList.remove('hidden');
    stepBuilder.scrollIntoView({ behavior: 'smooth' });

    resetMenu();
    renderGrid();
    renderSlots();
    renderFontOptions();
    updatePreviewBtn();

  } finally {
    importBtn.disabled = false;
    importBtn.querySelector('.btn__text').textContent = 'Import';
    importBtn.querySelector('.btn__spinner').classList.add('hidden');
  }
}

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

/* ─── Font Options (Step 3) ─────────────────────────────────── */
function renderFontOptions() {
  stepFont.classList.remove('hidden');

  // Preload all fonts so the preview cards render immediately
  menuFonts.forEach(loadGoogleFont);

  fontOptions.innerHTML = menuFonts
    .map((f, i) => {
      const checked = i === 0 ? ' checked' : '';
      return `
        <div class="font-option">
          <input type="radio" name="menu-font" id="font-${i}" value="${f.value}"${checked}>
          <label for="font-${i}">
            <div class="font-option__preview" style="font-family:${f.value}">${escHtml(f.name)}</div>
            <div class="font-option__name">${escHtml(f.name)}</div>
          </label>
        </div>
      `;
    })
    .join('');

  const menuTitle = document.querySelector('.menu-card__restaurant');
  const courseTitles = document.querySelectorAll('.menu-card__course-title');

  function applyFont(font) {
    menuPreview.style.fontFamily = font.value;
    menuTitle.style.fontFamily = font.value;
    menuTitle.style.textTransform = font.caps === 'all' ? 'uppercase' : 'capitalize';
    courseTitles.forEach((t) => {
      t.style.fontFamily = font.value;
      t.style.textTransform = font.caps === 'all' ? 'uppercase' : 'capitalize';
    });
  }

  applyFont(menuFonts[0]);
  loadGoogleFont(menuFonts[0]);

  fontOptions.addEventListener('change', (e) => {
    if (e.target.name === 'menu-font') {
      const font = menuFonts.find((f) => f.value === e.target.value);
      if (font) {
        loadGoogleFont(font);
        applyFont(font);
      }
    }
  });
}

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

  if (playtime === 0) return null;
  if (playtime <= 30) return 'appetizer';
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
          <div class="game-card__heading">
            <div class="game-card__name">${escHtml(g.name)}</div>
            <div class="game-card__heading-actions">
              <button class="game-card__action-btn" data-desc="${g.id}" title="${g.desc ? 'Edit description' : 'Add description'}">📝</button>
              ${g._custom ? `
              <button class="game-card__action-btn game-card__action-btn--edit" data-custom-edit="${g.id}" title="Edit">✏️</button>
              <button class="game-card__action-btn game-card__action-btn--delete" data-custom-delete="${g.id}" title="Delete">🗑️</button>
              ` : ''}
            </div>
          </div>
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
            ${g._custom ? `<span class="game-card__badge badge--custom">Custom</span>` : ''}
            ${showSuggestion ? `<span class="game-card__suggestion ${suggestion}">recommended as ${suggestion}</span>` : ''}
          </div>
        </div>
      `;
    })
    .join('');

  gameGrid.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.game-card__action-btn')) return;
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

  gameGrid.querySelectorAll('[data-custom-edit]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      editCustomGame(parseInt(btn.dataset.customEdit, 10));
    });
  });

  gameGrid.querySelectorAll('[data-custom-delete]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Delete this custom game?')) {
        deleteCustomGame(parseInt(btn.dataset.customDelete, 10));
      }
    });
  });

  gameGrid.querySelectorAll('[data-desc]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.desc, 10);
      const game = state.games.find((g) => g.id === id);
      if (!game) return;
      descTargetId = id;
      descText.value = game.desc || '';
      descModal.classList.remove('hidden');
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
            <div class="course-card__item-body">
              <span class="course-card__item-name">${escHtml(g.name)}</span>
              ${g.desc ? `<span class="course-card__item-desc">${escHtml(g.desc)}</span>` : ''}
            </div>
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
    const section = document.getElementById(`section-${course}`);
    const list = document.getElementById(`menu-${course}`);
    const items = state.menu[course];

    section.classList.toggle('hidden', items.length === 0);
    if (items.length === 0) continue;

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
              ${g.desc ? `<div class="menu-card__item-desc">${escHtml(g.desc)}</div>` : ''}
              <div class="menu-card__item-stats">${g.year || ''} ${g.year ? '·' : ''} ${g.minPlayers}–${g.maxPlayers} players · ${g.playingTime || g.maxPlayTime || '?'} min${rating ? ' · BGG ' + rating : ''}${g.weight ? ' · C' + g.weight.toFixed(1) : ''}</div>
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

/* ─── Menu Generator ────────────────────────────────────────── */
genBtn.addEventListener('click', () => {
  genModal.classList.remove('hidden');
  genError.classList.add('hidden');
});

closeGenBtn.addEventListener('click', () => genModal.classList.add('hidden'));
genModal.querySelector('.modal__backdrop').addEventListener('click', () => genModal.classList.add('hidden'));

genGoBtn.addEventListener('click', () => {
  genError.classList.add('hidden');

  if (state.games.length === 0) {
    genError.textContent = 'Import your BGG collection first!';
    genError.classList.remove('hidden');
    return;
  }

  const vibe = document.querySelector('input[name="gen-vibe"]:checked');
  if (!vibe) return;
  const vibeVal = vibe.value;
  const playerCount = parseInt(genPlayers.value, 10) || 4;

  const result = generateMenu(state.games, vibeVal, playerCount);
  if (result.error) {
    genError.textContent = result.error;
    genError.classList.remove('hidden');
    return;
  }

  state.menu = result.menu;
  state.playerCount = playerCount;
  genModal.classList.add('hidden');
  renderAll();
});

function generateMenu(games, vibe, playerCount) {
  const rangeMap = {
    easy:   { min: 0,   max: 2.0 },
    mid:    { min: 1.5, max: 3.2 },
    wild:   { min: 2.5, max: 5.0 },
  };
  const range = rangeMap[vibe];

  const valid = games.filter((g) => {
    if (!g.weight || g.weight === 0) return false;
    if (!g.playingTime || g.playingTime === 0) return false;
    if ((g.minPlayers || 0) > playerCount) return false;
    if ((g.maxPlayers || 99) < playerCount) return false;
    return true;
  });

  if (valid.length < 5) {
    return { error: 'Not enough compatible games for this player count. Try a different vibe or import more games.' };
  }

  const maxPlays = Math.max(...valid.map((g) => g.numPlays || 0), 1);
  const maxRating = Math.max(...valid.map((g) => g.bggRating || 0), 1);
  const minYear = Math.min(...valid.map((g) => g.year || 9999));
  const maxYear = Math.max(...valid.map((g) => g.year || 0));
  const yearSpan = maxYear - minYear || 1;

  const scored = valid.map((g) => {
    const plays = g.numPlays || 0;
    const loveScore = plays / maxPlays;
    const rarity = 1 - (plays / maxPlays);
    const communityScore = rarity * ((g.bggRating || 0) / maxRating);
    const noveltyScore = ((g.year || minYear) - minYear) / yearSpan;
    const idealWeight = (range.min + range.max) / 2;
    const fitScore = 1 - Math.min(Math.abs(g.weight - idealWeight) / 2.5, 1);
    const isLight = g.playingTime <= 30;
    return { ...g, plays, loveScore, communityScore, noveltyScore, fitScore, isLight };
  });

  scored.forEach((g) => {
    if (g.weight < range.min || g.weight > range.max) {
      g.fitScore *= 0.3;
    }
  });

  function weightedRandom(candidates, weightKey) {
    const total = candidates.reduce((s, g) => s + g[weightKey] + 0.01, 0);
    let r = Math.random() * total;
    for (const g of candidates) {
      r -= g[weightKey] + 0.01;
      if (r <= 0) return g;
    }
    return candidates[candidates.length - 1];
  }

  function pickDiverse(candidates, weightKey, count) {
    const picked = [];
    const pool = [...candidates];
    for (let i = 0; i < count && pool.length > 0; i++) {
      const g = weightedRandom(pool, weightKey);
      picked.push(g);
      const idx = pool.indexOf(g);
      if (idx !== -1) pool.splice(idx, 1);
    }
    return picked;
  }

  const usedIds = new Set();
  const use = (g) => { usedIds.add(g.id); return g; };
  const unused = () => scored.filter((g) => !usedIds.has(g.id));

  let appetizers = [];
  const lightPool = unused().filter((g) => g.isLight);
  const lovedLight = pickDiverse(lightPool, 'loveScore', 1);
  lovedLight.forEach((g) => appetizers.push(use(g)));
  const communityLight = pickDiverse(unused().filter((g) => g.isLight), 'communityScore', 3);
  communityLight.forEach((g) => appetizers.push(use(g)));
  if (appetizers.length < 4) {
    const extra = pickDiverse(unused().filter((g) => g.isLight), 'loveScore', 4 - appetizers.length);
    extra.forEach((g) => appetizers.push(use(g)));
  }
  appetizers = appetizers.slice(0, 4);

  let desserts = [];
  const dessertPick = pickDiverse(unused().filter((g) => g.isLight), 'communityScore', 1);
  if (dessertPick.length > 0) desserts.push(use(dessertPick[0]));
  const dessertNovel = pickDiverse(unused().filter((g) => g.isLight), 'noveltyScore', 1);
  if (dessertNovel.length > 0) desserts.push(use(dessertNovel[0]));
  desserts = desserts.slice(0, 2);

  const mains = [];
  const loved = pickDiverse(unused(), 'loveScore', 1);
  loved.forEach((g) => mains.push(use(g)));
  const community = pickDiverse(unused(), 'communityScore', 1);
  community.forEach((g) => mains.push(use(g)));
  const novel = pickDiverse(unused(), 'noveltyScore', 1);
  novel.forEach((g) => mains.push(use(g)));
  const remainingMain = pickDiverse(unused(), 'fitScore', 3);
  remainingMain.forEach((g) => mains.push(use(g)));
  mains.splice(5);

  if (appetizers.length === 0 && mains.length === 0) {
    return { error: 'Could not build a balanced menu. Try a different vibe or import more games.' };
  }

  return {
    menu: {
      appetizer: appetizers,
      main: mains,
      dessert: desserts,
    }
  };
}

/* ─── Custom Game ───────────────────────────────────────────── */
customBtn.addEventListener('click', () => {
  editingCustomId = null;
  customFormTitle.textContent = '➕ Custom Game';
  customForm.reset();
  customImg.value = '';
  customPreviewImg.src = '';
  customDropzone.querySelector('.dropzone__placeholder').classList.remove('hidden');
  customDropzone.querySelector('.dropzone__preview').classList.add('hidden');
  customWeight.value = '2.0';
  customDesc.value = '';
  customError.classList.add('hidden');
  customModal.classList.remove('hidden');
});

closeCustomBtn.addEventListener('click', () => customModal.classList.add('hidden'));
customModal.querySelector('.modal__backdrop').addEventListener('click', () => customModal.classList.add('hidden'));

/* ─── Drag & Drop Upload ────────────────────────────────── */
customDropzone.addEventListener('click', (e) => {
  if (e.target.closest('.dropzone__remove')) return;
  customImgFile.click();
});

customDropzone.addEventListener('dragover', (e) => {
  e.preventDefault();
  customDropzone.classList.add('dropzone--over');
});

customDropzone.addEventListener('dragleave', () => {
  customDropzone.classList.remove('dropzone--over');
});

customDropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  customDropzone.classList.remove('dropzone--over');
  const files = e.dataTransfer.files;
  if (files.length > 0) uploadImage(files[0]);
});

customImgFile.addEventListener('change', () => {
  if (customImgFile.files.length > 0) uploadImage(customImgFile.files[0]);
});

customImgRemove.addEventListener('click', (e) => {
  e.stopPropagation();
  customImg.value = '';
  customPreviewImg.src = '';
  customImgFile.value = '';
  customDropzone.querySelector('.dropzone__placeholder').classList.remove('hidden');
  customDropzone.querySelector('.dropzone__preview').classList.add('hidden');
});

function uploadImage(file) {
  if (!file.type.startsWith('image/')) {
    customError.textContent = 'Only image files are allowed.';
    customError.classList.remove('hidden');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    customError.textContent = 'Image must be 5 MB or smaller.';
    customError.classList.remove('hidden');
    return;
  }

  customDropzone.querySelector('.dropzone__placeholder').innerHTML = '<span>Reading image…</span>';
  const reader = new FileReader();
  reader.onerror = () => {
    customError.textContent = 'Failed to read image file.';
    customError.classList.remove('hidden');
    customDropzone.querySelector('.dropzone__placeholder').innerHTML = `
      <span class="dropzone__icon">📁</span>
      <span>Drop an image here or click to browse</span>
      <span class="dropzone__hint">JPG, PNG, GIF, WebP · max 5 MB</span>
    `;
  };
  reader.onload = () => {
    const dataUrl = reader.result;
    customImg.value = dataUrl;
    customPreviewImg.src = dataUrl;
    customDropzone.querySelector('.dropzone__placeholder').classList.add('hidden');
    customDropzone.querySelector('.dropzone__preview').classList.remove('hidden');
    customError.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

/* ─── Submit Custom Game ─────────────────────────────────── */
customForm.addEventListener('submit', (e) => {
  e.preventDefault();
  customError.classList.add('hidden');

  const name = customName.value.trim();
  if (!name) {
    customError.textContent = 'Game name is required.';
    customError.classList.remove('hidden');
    return;
  }

  const weight = parseFloat(customWeight.value) || 2.0;
  const minP = parseInt(customMin.value, 10) || 2;
  const maxP = parseInt(customMax.value, 10) || 6;
  const time = parseInt(customTime.value, 10) || 30;
  const desc = customDesc.value.trim();
  const imgUrl = customImg.value.trim() || null;

  if (editingCustomId !== null) {
    const existing = state.games.find((g) => g.id === editingCustomId);
    if (existing) {
      existing.name = name;
      existing.minPlayers = minP;
      existing.maxPlayers = maxP;
      existing.playingTime = time;
      existing.desc = desc;
      existing.weight = weight;
      existing.thumbnail = imgUrl;
      existing.image = imgUrl;
    }
  } else {
    const game = {
      id: customIdCounter,
      name,
      year: new Date().getFullYear(),
      thumbnail: imgUrl,
      image: imgUrl,
      minPlayers: minP,
      maxPlayers: maxP,
      playingTime: time,
      weight,
      bggRating: null,
      numPlays: 0,
      desc,
      _custom: true,
    };
    customIdCounter--;
    state.games.push(game);
  }

  saveCustomGames();
  customModal.classList.add('hidden');
  resetMenu();
  renderAll();
  renderFontOptions();
});

function deleteCustomGame(id) {
  state.games = state.games.filter((g) => g.id !== id);
  for (const course of ['appetizer', 'main', 'dessert']) {
    state.menu[course] = state.menu[course].filter((g) => g.id !== id);
  }
  saveCustomGames();
  renderAll();
}

function editCustomGame(id) {
  const game = state.games.find((g) => g.id === id);
  if (!game) return;
  editingCustomId = id;
  customFormTitle.textContent = '✏️ Edit Custom Game';
  customName.value = game.name;
  customMin.value = game.minPlayers || 2;
  customMax.value = game.maxPlayers || 6;
  customTime.value = game.playingTime || 30;
  customDesc.value = game.desc || '';
  customWeight.value = (game.weight || 2.0).toString();

  if (game.thumbnail) {
    customImg.value = game.thumbnail;
    customPreviewImg.src = game.thumbnail;
    customDropzone.querySelector('.dropzone__placeholder').classList.add('hidden');
    customDropzone.querySelector('.dropzone__preview').classList.remove('hidden');
  } else {
    customImg.value = '';
    customPreviewImg.src = '';
    customDropzone.querySelector('.dropzone__placeholder').classList.remove('hidden');
    customDropzone.querySelector('.dropzone__preview').classList.add('hidden');
  }

  customModal.classList.remove('hidden');
  customError.classList.add('hidden');
}

function saveCustomGames() {
  const customs = state.games.filter((g) => g._custom);
  try {
    localStorage.setItem('boardgames-menu-custom', JSON.stringify(customs));
  } catch (_) {}
}

function loadCustomGames() {
  try {
    const raw = localStorage.getItem('boardgames-menu-custom');
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (_) {
    return [];
  }
}

function rehydrateCustomGames() {
  const customs = loadCustomGames();
  customs.forEach((g) => {
    if (g.id < customIdCounter) customIdCounter = g.id;
    if (!state.games.some((x) => x.id === g.id)) {
      state.games.push(g);
    }
  });
}

rehydrateCustomGames();

/* ─── Description Modal ────────────────────────────────────── */
closeDescBtn.addEventListener('click', () => descModal.classList.add('hidden'));
descModal.querySelector('.modal__backdrop').addEventListener('click', () => descModal.classList.add('hidden'));

descSaveBtn.addEventListener('click', () => {
  const game = state.games.find((g) => g.id === descTargetId);
  if (!game) return;
  game.desc = descText.value.trim() || undefined;
  saveDescriptions();
  descModal.classList.add('hidden');
  renderAll();
});

function saveDescriptions() {
  const descriptions = {};
  state.games.forEach((g) => {
    if (g.desc) descriptions[g.id] = g.desc;
  });
  try {
    localStorage.setItem('boardgames-menu-descriptions', JSON.stringify(descriptions));
  } catch (_) {}
}

function loadDescriptions() {
  try {
    const raw = localStorage.getItem('boardgames-menu-descriptions');
    if (!raw) return;
    const descriptions = JSON.parse(raw);
    state.games.forEach((g) => {
      if (descriptions[g.id]) g.desc = descriptions[g.id];
    });
  } catch (_) {}
}

/* ─── Auto-load from URL ────────────────────────────────────── */
const urlParams = new URLSearchParams(window.location.search);
const urlUsername = urlParams.get('username');
if (urlUsername) {
  usernameInput.value = urlUsername;
  doImport(urlUsername);
}
