/** PDF matches always return the intact collection, never a question fragment. */
export const normalise=text=>text.normalize('NFKC').toLowerCase()
  .replace(/a[\s-]*levels?\b/g,'alevel').replace(/\bmathematics\b/g,'maths').replace(/\bcaie\b/g,'cie')
  .replace(/chi[\s-]*square[d]?/g,'chi squared').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();
const escaped=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const phrasePattern=phrase=>new RegExp(`${/^[a-z0-9]/.test(phrase)?'(?<![a-z0-9])':''}${escaped(phrase)}${/[a-z0-9]$/.test(phrase)?'(?![a-z0-9])':''}`,'gu');
const kinds={notes:/\b(?:notes?|methods?|worked examples?|revision notes?)\b|笔记/gu,papers:/\b(?:papers?|questions?|worksheets?|homework|qp|answers?|mark schemes?)\b|真题|试卷|答案/gu,resources:/\b(?:mf19|formula (?:sheet|booklet)|syllabus|resources?)\b|公式表|考纲|大纲/gu};
const modulePatterns=[['fp1',/\b(?:fp\s*1|(?:further )?pure\s*1|paper\s*1)\b/gu],['fp2',/\b(?:fp\s*2|(?:further )?pure\s*2|paper\s*2)\b/gu],['mechanics',/\b(?:fm|(?:further )?mechanics|paper\s*3)\b|力学/gu],['statistics',/\b(?:fs|(?:further )?statistics|paper\s*4)\b/gu]];
const stopWords=new Set('cie cambridge international assessment examinations education alevel a as level maths further 9231 free revision study exam board past topic collection collections the of and for in to with'.split(' '));
export function planSearch(catalog,query,filters={}){
  let remaining=normalise(query).replace(/\bquestion types?\b/gu,' ');
  const needsAnswers=/\b(?:answers?|mark schemes?)\b|答案/u.test(remaining);
  let inferredKind='all';
  for(const kind of ['resources','notes','papers'])if(remaining.match(kinds[kind])){inferredKind=kind;break;}
  let inferredModule='all';
  for(const [id,pattern] of modulePatterns)if(remaining.match(pattern)){inferredModule=id;remaining=remaining.replace(pattern,' ');}
  const matchedTopics=[];
  const aliases=catalog.topics.flatMap(t=>[t.title,...t.aliases].map(alias=>({id:t.id,alias:normalise(alias)}))).sort((a,b)=>b.alias.length-a.alias.length);
  for(const {id,alias} of aliases){const pattern=phrasePattern(alias);if(remaining.match(pattern)){matchedTopics.push(id);remaining=remaining.replace(pattern,' ');}}
  for(const pattern of Object.values(kinds))remaining=remaining.replace(pattern,m=>/mf19|formula|公式表/.test(m)?'mf19':/syllabus|考纲|大纲/.test(m)?'syllabus':' ');
  const terms=remaining.split(/[^\p{L}\p{N}]+/u).filter(t=>t&&!stopWords.has(t)).map(t=>t.length>4&&t.endsWith('s')?t.slice(0,-1):t);
  return {kind:filters.kind&&filters.kind!=='all'?filters.kind:inferredKind,module:filters.module&&filters.module!=='all'?filters.module:inferredModule,needsAnswers,topics:[...new Set(matchedTopics)],terms};
}
export function searchCatalog(catalog,query,filters={}){
  const plan=planSearch(catalog,query,filters);
  if(!query.trim()&&plan.kind==='all'&&plan.module==='all')return {plan,results:[]};
  const results=catalog.records.flatMap(record=>{
    if(plan.kind!=='all'&&record.kind!==plan.kind)return [];
    if(plan.module!=='all'&&record.module!==plan.module)return [];
    if(plan.needsAnswers&&record.kind==='papers'&&!record.answers)return [];
    if(plan.topics.length&&!plan.topics.includes(record.topic))return [];
    const title=normalise(record.title),body=normalise(`${record.title} ${record.description} ${record.text} ${(record.sections||[]).map(section=>section.text).join(' ')}`);
    if(!plan.terms.every(term=>body.includes(term)))return [];
    const score=(plan.topics.includes(record.topic)?50:0)+(record.kind==='notes'?3:0)+plan.terms.reduce((n,term)=>n+(title.includes(term)?20:2),0);
    if(record.kind==='notes'&&plan.terms.length&&record.sections){
      const matches=record.sections.filter(section=>{
        const text=normalise(`${section.title} ${section.text}`);
        return plan.terms.every(term=>text.includes(term));
      });
      if(matches.length)return matches.map(section=>({...record,...section,id:`${record.id}-${section.id}`,section:true,score:score+10+plan.terms.reduce((n,term)=>n+(normalise(section.title).includes(term)?30:0),0)}));
    }
    return [{...record,score}];
  }).sort((a,b)=>b.score-a.score);
  return {plan,results};
}
