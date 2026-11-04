import {recordPageView} from '../utils/visits.mjs';

const totalElements = [...document.querySelectorAll<HTMLElement>('[data-total-views]')];
const format = new Intl.NumberFormat('en-GB');

async function showVisits() {
  if (!totalElements.length) return;
  try {
    const counts = await recordPageView(window.location.href);
    if (!counts) {
      totalElements.forEach(el => {el.textContent = '—';});
      return;
    }
    totalElements.forEach(el => {el.textContent = format.format(counts.total);});
  } catch {
    totalElements.forEach(el => {el.textContent = '—';el.title = 'Counter temporarily unavailable';});
  }
}
void showVisits();
