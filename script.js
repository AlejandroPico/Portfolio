const searchInput = document.querySelector('#search');
const cards = Array.from(document.querySelectorAll('.card'));
const filterButtons = Array.from(document.querySelectorAll('.filters button'));
const emptyState = document.querySelector('#empty');
const menuButton = document.querySelector('.menu');
const navLinks = document.querySelector('.nav-links');
const year = document.querySelector('#year');

let activeFilter = 'all';

year.textContent = new Date().getFullYear();

function normalise(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function applyFilters() {
  const query = normalise(searchInput.value.trim());
  let visible = 0;

  cards.forEach((card) => {
    const text = normalise(`${card.textContent} ${card.dataset.tags || ''}`);
    const tags = normalise(card.dataset.tags || '');
    const matchesQuery = !query || text.includes(query);
    const matchesFilter = activeFilter === 'all' || tags.includes(activeFilter);
    const show = matchesQuery && matchesFilter;

    card.classList.toggle('hidden', !show);
    if (show) visible += 1;
  });

  emptyState.hidden = visible !== 0;
}

searchInput.addEventListener('input', applyFilters);

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    activeFilter = button.dataset.filter;
    applyFilters();
  });
});

menuButton.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});
