const toggle = document.querySelector<HTMLButtonElement>('.mobile-toggle');
const sidebar = document.querySelector<HTMLElement>('.sidebar');
toggle?.addEventListener('click', () => {
  const expanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!expanded));
  toggle.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  sidebar?.classList.toggle('is-open', !expanded);
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
  const countEl=document.querySelector('[data-result-count]'); if(countEl)countEl.textContent=String(count);
  const empty=document.querySelector<HTMLElement>('[data-empty]'); if(empty)empty.hidden=count!==0;
}
filters.forEach(f=>f.addEventListener('input',filterCards));
const params=new URLSearchParams(window.location.search);
filters.forEach(f=>{const initial=params.get(f.dataset.filter||'');if(initial && [...(f instanceof HTMLSelectElement ? f.options : [])].some(o=>o.value===initial))f.value=initial;});
if(filters.length)filterCards();

const completionButtons=[...document.querySelectorAll<HTMLButtonElement>('[data-complete]')];
completionButtons.forEach(button=>{
  const key=`mathnotes-complete-${button.dataset.complete}`;
  function paint(done:boolean){button.setAttribute('aria-pressed',String(done));button.textContent=done?'✓ Topic marked as studied':'Mark topic as studied';}
  try {paint(localStorage.getItem(key)==='true');} catch {paint(false);}
  button.addEventListener('click',()=>{const done=button.getAttribute('aria-pressed')!=='true';paint(done);try{localStorage.setItem(key,String(done));}catch{/* Device storage is optional. */}});
});
