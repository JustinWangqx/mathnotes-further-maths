import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve,join,extname} from 'node:path';
const root=resolve('dist');
const base=process.env.BASE_PATH||'/';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const files=walk(root);
const pages=files.filter(p=>p.endsWith('.html'));

test('all 15 current-note guides are built, with no unrelated topic pages',()=>{
 const lessons=pages.filter(p=>/\/9231\/[^/]+\/[^/]+\/index\.html$/.test(p));
 assert.equal(lessons.length,15);
 assert.equal(lessons.filter(p=>p.includes('/fp1/')).length,5);
 assert.equal(lessons.filter(p=>p.includes('/fp2/')).length,4);
 assert.equal(lessons.filter(p=>p.includes('/statistics/')).length,5);
 assert.equal(lessons.filter(p=>p.includes('/mechanics/')).length,1);
 for(const page of pages)assert.ok(!readFileSync(page,'utf8').includes('data-id="polar"'),page);
});
test('every internal link, fragment, script and stylesheet resolves under the deployment base',()=>{
 let checked=0;
 for(const page of pages){
  const html=readFileSync(page,'utf8');
  for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const raw=match[1].replaceAll('&amp;','&');if(/^(?:https?:|mailto:|data:)/.test(raw))continue;
   const relative=page.slice(root.length).replace(/index\.html$/,'');
   const current=`https://mathnotes.invalid${base.replace(/\/$/,'')}${relative}`;
   const address=new URL(raw,current);
   assert.ok(address.pathname.startsWith(base),`${page}: outside base: ${raw}`);
   let dest=join(root,decodeURIComponent(address.pathname.slice(base.length)));
   if(existsSync(dest)&&statSync(dest).isDirectory())dest=join(dest,'index.html');
   assert.ok(existsSync(dest),`${page}: missing ${raw}`);
   if(address.hash&&extname(dest)==='.html'){
    const id=decodeURIComponent(address.hash.slice(1));const target=readFileSync(dest,'utf8');
    assert.ok(target.includes(`id="${id}"`),`${page}: missing anchor ${raw}`);
   }
   checked++;
  }
 }
 assert.ok(checked>500);
});
test('every published question and answer PDF matches the intact source manifest',()=>{
 const collections=JSON.parse(readFileSync('src/data/paper-collections.json','utf8'));
 assert.equal(collections.length,15);
 assert.equal(collections.reduce((n,p)=>n+p.questionCount,0),121);
 assert.equal(collections.filter(p=>p.answers).length,13);
 const expected=[];
 for(const paper of collections){
  const reader=readFileSync(join(root,'papers',paper.id,'index.html'),'utf8');
  assert.equal((reader.match(/data-source-page=/g)||[]).length,paper.questions.pages);
  assert.equal(paper.previews.length,paper.questions.pages);
  for(const preview of paper.previews)assert.ok(existsSync(join(root,preview.file)));
  assert.ok(reader.includes(paper.questions.file+'#page=1'));
  assert.ok(reader.includes(paper.questions.source));
  for(const asset of [paper.questions,paper.answers].filter(Boolean)){
   const bytes=readFileSync(join(root,asset.file));
   assert.equal(bytes.subarray(0,5).toString(),'%PDF-');
   assert.equal(bytes.length,asset.bytes);
   assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256,asset.source);
   expected.push(join(root,asset.file));
  }
 }
 assert.deepEqual(files.filter(p=>p.endsWith('.pdf')).sort(),expected.sort());
});
test('one ordered topic map and one paper library replace the redundant sections',()=>{
 const map=readFileSync(join(root,'notes/index.html'),'utf8');
 assert.equal((map.match(/class="topic-row"/g)||[]).length,15);
 assert.equal((map.match(/<section[^>]*data-filter-section/g)||[]).length,4);
 let previous=-1;
 for(const id of ['roots','rational','series','matrices1','vectors','hyperbolic','differentiation','integration','complex','equilibrium','pdf-cdf','inference','chi-squared','non-parametric','pgf']){
  const at=map.indexOf(`id="${id}"`);assert.ok(at>previous,id);previous=at;
 }
 assert.ok(!existsSync(join(root,'formulae/index.html')));
 for(const route of ['practice','past-papers','syllabus']){
  const alias=readFileSync(join(root,route,'index.html'),'utf8');assert.ok(alias.includes('http-equiv="refresh"'),route);
 }
 for(const page of pages){
  const html=readFileSync(page,'utf8');
  assert.ok(!html.includes('One question type at a time.'),page);
  assert.ok(!html.includes('class="practice-card"'),page);
  assert.ok(!html.includes('48 original practice questions'),page);
  assert.ok(!html.includes('Formula index'),page);
 }
 assert.ok(map.includes('417318-list-of-formulae-and-statistical-tables.pdf'));
});
test('math is typeset accessibly and private local paths are never deployed',()=>{
 for(const page of pages){
  const html=readFileSync(page,'utf8');assert.ok(!html.includes('/Users/'),page);assert.ok(!html.includes('katex-error'),page);
  if(page.includes('/9231/')&&html.includes('class="lesson"')){assert.ok(html.includes('<math'),page);assert.ok(html.includes('application/x-tex'),page);}
 }
});
test('search bundle and English/Chinese aliases are included',()=>{
 assert.ok(existsSync(join(root,'pagefind/pagefind.js')));
 const search=readFileSync(join(root,'search/index.html'),'utf8');
 for(const alias of ['复数','积分','矩阵','概率生成函数'])assert.ok(search.includes(alias));
 const css=files.filter(f=>f.endsWith('.css')).map(f=>readFileSync(f,'utf8')).join('');
 assert.ok(!css.includes('fonts.googleapis.com'));assert.ok(css.includes('.woff2'));
});

test('all 90 question types render a method, formula and visible worked example with source data',()=>{
 const data=JSON.parse(readFileSync('src/data/question-types.json','utf8'));
 assert.equal(Object.keys(data).length,15);
 assert.equal(Object.values(data).reduce((n,types)=>n+types.length,0),90);
 let rendered=0;
 for(const page of pages.filter(p=>/\/9231\/[^/]+\/[^/]+\/index\.html$/.test(p))){
  const html=readFileSync(page,'utf8');
  const count=(html.match(/class="exam-type"/g)||[]).length;
  assert.ok(count>=3,page);
  assert.equal((html.match(/class="type-method"/g)||[]).length,count,page);
  assert.equal((html.match(/class="type-formula"/g)||[]).length,count,page);
  assert.equal((html.match(/class="type-example"/g)||[]).length,count,page);
  assert.equal((html.match(/class="worked-solution"/g)||[]).length,count,page);
  assert.ok(!html.includes('id="the-idea"'),page);
  for(let i=1;i<=count;i++)assert.ok(html.includes(`id="type-${i}"`),page);
  rendered+=count;
 }
 assert.equal(rendered,90);
 for(const types of Object.values(data))for(const [i,type] of types.entries()){
  assert.equal(type.number,i+1);assert.ok(type.method.length<400);
  assert.ok(type.formula.includes('$'));assert.ok(type.question.trim().length>0);
  assert.ok(type.steps.length>=1&&type.steps.length<=6);
  assert.ok(type.answer&&type.source.file&&type.source.pages&&type.source.label);
 }
});

test('Chinese worked examples preserve the math and step counts of all source examples',()=>{
 const original=JSON.parse(readFileSync('src/data/question-types.json','utf8'));
 const translated=JSON.parse(readFileSync('src/data/question-types.zh.json','utf8'));
 const tex=text=>text.match(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g)||[];
 for(const [topic,types] of Object.entries(original)){
  assert.equal(translated[topic].length,types.length,topic);
  for(const [i,example] of types.entries()){
   const zh=translated[topic][i];
   assert.match(zh.title,/\p{Script=Han}/u,topic);
   for(const field of ['method','question','answer'])assert.deepEqual(tex(zh[field]),tex(example[field]),topic+' '+example.id+' '+field);
   assert.deepEqual(zh.steps.map(tex),example.steps.map(tex),topic+' '+example.id);
  }
 }
});
