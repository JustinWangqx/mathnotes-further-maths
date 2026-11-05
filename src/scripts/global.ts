const toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
const sidebar = document.querySelector<HTMLElement>('.sidebar');
const mobileLayout = window.matchMedia('(max-width: 760px)');
function syncNavigation() {
  const hidden = mobileLayout.matches && toggle?.getAttribute('aria-expanded') !== 'true';
  if (sidebar) { sidebar.inert = hidden; sidebar.setAttribute('aria-hidden', String(hidden)); }
}
syncNavigation();
mobileLayout.addEventListener('change', syncNavigation);
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  sidebar?.classList.toggle('is-open', !expanded);
  syncNavigation();
  if (expanded) toggle.focus();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') toggle.click();
  const editable = event.target instanceof HTMLElement && (event.target.matches('input,textarea,select') || event.target.isContentEditable);
  if (event.key === '/' && !editable) { event.preventDefault(); window.location.href = `${document.body.dataset.base}search/`; }
});
const filters = [...document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-filter]')];
function filterCards() {
  const cards = [...document.querySelectorAll<HTMLElement>('[data-filter-card]')];
  const state: Record<string,string> = Object.fromEntries(filters.map(f=>[f.dataset.filter||'', f.value.trim().toLowerCase()]));
  let count=0;
  cards.forEach(card=>{
    const visible=Object.entries(state).every(([key,value])=>!value || value==='all' || (key==='query' ? (card.dataset.search||'').toLowerCase().includes(value) : card.dataset[key]===value));
    card.hidden=!visible; if(visible)count++;
  });
  document.querySelectorAll<HTMLElement>('[data-filter-section]').forEach(section=>{section.hidden=![...section.querySelectorAll<HTMLElement>('[data-filter-card]')].some(card=>!card.hidden);});
  const countEl=document.querySelector('[data-result-count]'); if(countEl)countEl.textContent=String(count);
  const empty=document.querySelector<HTMLElement>('[data-empty]'); if(empty)empty.hidden=count!==0;
}
filters.forEach(f=>f.addEventListener('input',filterCards));
const params=new URLSearchParams(window.location.search);
filters.forEach(f=>{const initial=params.get(f.dataset.filter||'');if(initial && [...(f instanceof HTMLSelectElement ? f.options : [])].some(o=>o.value===initial))f.value=initial;});
if(filters.length)filterCards();

// Compact mobile contents closes after an anchor is selected.
document.querySelectorAll<HTMLDetailsElement>('.lesson-jump').forEach(menu=>menu.addEventListener('click',event=>{
  if((event.target as HTMLElement).closest('a'))menu.open=false;
}));
