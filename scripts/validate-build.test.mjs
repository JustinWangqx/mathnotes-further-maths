import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync,statSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('dist');
const base=process.env.BASE_PATH||'/';
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const files=walk(root);
const pages=files.filter(p=>p.endsWith('.html'));

test('all 14 current-note guides are built, with no unrelated topic pages',()=>{
 const lessons=pages.filter(p=>/\/9231\/[^/]+\/[^/]+\/index\.html$/.test(p));
 assert.equal(lessons.length,14);
 assert.equal(lessons.filter(p=>p.includes('/fp1/')).length,5);
 assert.equal(lessons.filter(p=>p.includes('/fp2/')).length,4);
 assert.equal(lessons.filter(p=>p.includes('/statistics/')).length,5);
 for(const page of pages){const html=readFileSync(page,'utf8');assert.ok(!html.includes('/mechanics/'),page);assert.ok(!html.includes('data-id="polar"'),page);}
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
test('48 practice questions are present, unique and supplied with solutions',()=>{
 const html=readFileSync(join(root,'practice/index.html'),'utf8');
 const cards=[...html.matchAll(/<article[^>]*class="practice-card"[^>]*id="([^"]+)"/g)];
 assert.equal(cards.length,48);assert.equal(new Set(cards.map(c=>c[1])).size,48);
 assert.equal((html.match(/class="solution"/g)||[]).length,48);
 assert.equal((html.match(/class="hint"/g)||[]).length,48);
 assert.ok(!html.includes('katex-error'));
});
test('math is typeset accessibly and source PDFs or local paths are never deployed',()=>{
 assert.ok(files.every(f=>!f.endsWith('.pdf')));
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
