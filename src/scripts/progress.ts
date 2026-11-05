import {readProgress,updateProgress,topicProgress,progressKey,progressLabels} from '../utils/progress.mjs';
let storage:Storage|undefined;
try{storage=window.localStorage;}catch{/* Reading remains available without storage. */}
let progress:Record<string,string>=readProgress(storage);
let persistent=!!storage;
function paint(){
  document.querySelectorAll<HTMLSelectElement>('[data-type-progress]').forEach(input=>{input.value=progress[input.dataset.typeProgress!]||'unseen';});
  document.querySelectorAll<HTMLElement>('[data-progress-key]').forEach(el=>{
    const state=progress[el.dataset.progressKey!]||'unseen';el.dataset.state=state;
    const title=`${el.dataset.progressTitle||''} · ${progressLabels[state as keyof typeof progressLabels]}`;
    el.setAttribute('aria-label',title);el.title=title;
  });
  document.querySelectorAll<HTMLElement>('[data-topic-progress]').forEach(el=>{
    const {confident,practice,total}=topicProgress(progress,el.dataset.topicProgress!,Number(el.dataset.total));
    el.textContent=`${confident}/${total} confident${practice?` · ${practice} need${practice===1?'s':''} practice`:''}`;
  });
  document.querySelectorAll<HTMLElement>('[data-progress-storage]').forEach(el=>{el.textContent=persistent?'Saved on this device.':'Progress is available for this visit; browser storage is unavailable.';});
}
paint();
document.querySelectorAll<HTMLSelectElement>('[data-type-progress]').forEach(input=>input.addEventListener('change',()=>{
  progress=updateProgress(progress,input.dataset.typeProgress!,input.value);
  try{storage?.setItem(progressKey,JSON.stringify(progress));}catch{persistent=false;}
  paint();
}));
window.addEventListener('storage',event=>{if(event.key===progressKey){progress=readProgress(storage);paint();}});
