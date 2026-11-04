import {recordPageView} from '../utils/visits.mjs';

const totalElements = [...document.querySelectorAll<HTMLElement>('[data-total-views]')];
const todayElements = [...document.querySelectorAll<HTMLElement>('[data-today-views]')];
const status = document.querySelector<HTMLElement>('[data-visit-status]');
const format = new Intl.NumberFormat('en-GB');

async function showVisits() {
  if (!totalElements.length) return;
  try {
    const counts = await recordPageView(window.location.href);
    if (!counts) {
      [...totalElements, ...todayElements].forEach(el => {el.textContent = '—';});
      if (status) status.textContent = 'Visit counts are available on the live website. Local previews are excluded.';
      return;
    }
    totalElements.forEach(el => {el.textContent = format.format(counts.total);});
    todayElements.forEach(el => {el.textContent = format.format(counts.today);});
    if (status) status.textContent = 'Updated for this page view. Today uses UTC+8.';
  } catch {
    [...totalElements, ...todayElements].forEach(el => {el.textContent = 'Unavailable';});
    if (status) status.textContent = 'The counter could not be reached. You can continue using the notes and check again later.';
  }
}
void showVisits();
