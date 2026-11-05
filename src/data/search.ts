import {topics,modules,topicUrl,url,formulaSheetUrl} from './curriculum';
import {paperCollections,collectionUrl} from './paper-collections';
import questionTypes from './question-types.json';
import paperText from './paper-search.json';
import insightData from './type-insights.json';
const insights=insightData as Record<string,Record<string,{when:string;hint:string;why?:string;mistake?:string}>>;
const types=questionTypes as Record<string,{id:string;title:string;method:string;question:string;steps:string[]}[]>;
const texts=paperText as Record<string,string>;
export const searchCatalog={
  topics:topics.map(t=>({id:t.id,title:t.title,aliases:t.aliases})),
  records:[
    ...topics.map(t=>({id:`notes-${t.id}`,kind:'notes',module:t.module,topic:t.id,title:t.title,href:topicUrl(t),
      description:`${modules.find(m=>m.id===t.module)!.title} · ${types[t.id].length} question types, methods, formulas and worked examples.`,
      text:[t.description,...types[t.id].flatMap(q=>[q.title,q.method,q.question,...q.steps])].join(' '),
      sections:types[t.id].map((q,i)=>({id:q.id,title:`Type ${String(i+1).padStart(2,'0')}: ${q.title}`,href:`${topicUrl(t)}#${q.id}`,description:`${t.title} · ${insights[t.id][q.id].when} ${insights[t.id][q.id].hint}`,text:[q.title,q.method,q.question,...q.steps,...Object.values(insights[t.id][q.id])].join(' ')}))})),
    ...paperCollections.map(p=>({id:p.id,kind:'papers',module:p.module,topic:p.topic,title:p.title,href:collectionUrl(p),answers:!!p.answers,
      description:`${p.questionCount} complete past-paper questions · ${p.questions.pages} original pages${p.answers?' · Answers included':''}. Open the whole collection.`,
      text:[p.questions.source,p.answers?.source||'',texts[p.id]].join(' ')})),
    {id:'mf19',kind:'resources',module:'',topic:'',title:'MF19 formula sheet & statistical tables',href:formulaSheetUrl,
      description:'Official Cambridge formula sheet PDF for A Level Mathematics (9709) and Further Mathematics (9231).',text:'MF19 formula booklet list of formulae statistical tables 9709 9231 数学 公式表 公式 统计表'},
    {id:'syllabus',kind:'resources',module:'',topic:'',title:'Cambridge syllabus & revision resources',href:url('resources/'),
      description:'Official 2026–2027 CIE Further Mathematics 9231 syllabus and study references.',text:'syllabus specification curriculum 2026 2027 考纲 大纲'},
  ]
};
