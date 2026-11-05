export const progressKey='mathnotes-type-progress-v1';
export const progressLabels={unseen:'Not yet assessed',practice:'Needs practice',confident:'Confident'};
export function readProgress(storage){
  try{
    const data=JSON.parse(storage.getItem(progressKey)||'{}');
    if(!data||Array.isArray(data)||typeof data!=='object')return {};
    return Object.fromEntries(Object.entries(data).filter(([key,state])=>/^[a-z0-9-]+:type-\d+$/.test(key)&&['practice','confident'].includes(state)));
  }catch{return {};}
}
export function updateProgress(progress,key,state){
  const next={...progress};
  if(!/^[a-z0-9-]+:type-\d+$/.test(key)||!Object.hasOwn(progressLabels,state))return next;
  if(state==='unseen')delete next[key];else next[key]=state;
  return next;
}
export function topicProgress(progress,topic,total){
  const states=Array.from({length:total},(_,i)=>progress[`${topic}:type-${i+1}`]);
  return {confident:states.filter(s=>s==='confident').length,practice:states.filter(s=>s==='practice').length,total};
}
