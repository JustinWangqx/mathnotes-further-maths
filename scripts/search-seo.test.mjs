import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {join} from 'node:path';
import {searchCatalog} from '../src/utils/search.mjs';
const catalog=JSON.parse(readFileSync('dist/search-index.json','utf8'));
const base=process.env.BASE_PATH||'/';
const origin=process.env.SITE_URL||'https://justinwangqx.github.io';
const search=(q,filters)=>searchCatalog(catalog,q,filters).results;
const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):[join(dir,e.name)]);
const htmlPages=walk('dist').filter(p=>p.endsWith('.html')).map(path=>({path,html:readFileSync(path,'utf8')}));
const indexable=htmlPages.filter(p=>p.html.includes('<html')&&!p.html.includes('content="noindex"'));

test('board, course and spelling variants return the current notes without inventing a 9709 course',()=>{
 for(const query of ['CIE A Level Mathematics notes','CAIE A-level maths notes','Cambridge International Alevel Further Mathematics 9231 notes']){
  const results=search(query);assert.equal(results.length,15,query);assert.ok(results.every(r=>r.kind==='notes'));
 }
 assert.deepEqual(search('9709').map(r=>r.id),['mf19']);
 assert.equal(search('9709 notes').length,0);
 assert.deepEqual(search('mechanics notes').map(r=>r.id),['notes-equilibrium']);
 assert.deepEqual(search('刚体平衡笔记').map(r=>r.id),['notes-equilibrium']);
 assert.equal(search('paper 3 questions').length,2);
 assert.ok(search('toppling').some(r=>r.href.endsWith('/equilibrium-of-a-rigid-body/#type-9')));
 assert.equal(search('连续随机变量试卷').length,1);
});
test('English and Chinese paper intent preserves complete collections; note intent stays separate',()=>{
 for(const query of ['integration papers','积分真题','积分试卷'])assert.deepEqual(search(query).map(r=>r.id),['fp2-integration-1','fp2-integration-2']);
 assert.deepEqual(search('复数笔记').map(r=>r.id),['notes-complex']);
 assert.deepEqual(search('roots of unity notes').map(r=>r.id),['notes-complex']);
 assert.deepEqual(search('method of differences').map(r=>r.id),['notes-series']);
 assert.equal(search('paper 1 questions').length,6);
 assert.equal(search('FP2 notes').length,4);
 assert.equal(search('statistics notes').length,5);
 assert.equal(search('',{kind:'papers',module:'fp2'}).length,6);
 assert.equal(search('integration',{kind:'notes',module:'fp1'}).length,0);
 for(const result of search('cubic equation papers')){
  assert.equal(result.kind,'papers');assert.match(result.href,/\/papers\/[^/]+\/$/);assert.ok(!result.href.includes('#'));
 }
 assert.ok(search('cubic equation papers').length>0);
});
test('formula sheet, syllabus, available answers and original printed paper references are searchable',()=>{
 assert.deepEqual(search('formula sheet').map(r=>r.id),['mf19']);
 assert.deepEqual(search('MF19').map(r=>r.id),['mf19']);
 assert.deepEqual(search('syllabus').map(r=>r.id),['syllabus']);
 assert.equal(search('answers').length,13);
 assert.ok(search('2025 winter').length>0);
 assert.ok(search('2025 winter').every(r=>r.kind==='papers'));
 assert.equal(catalog.records.length,32);
 assert.ok(!JSON.stringify(catalog).includes('/Users/'));
});
test('indexable pages have unique subject-specific metadata, canonical URLs and social previews',()=>{
 assert.equal(indexable.length,39);
 const titles=new Set(),descriptions=new Set();
 for(const {path,html} of indexable){
  const title=html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  assert.ok(title&&/CIE|Cambridge/.test(title),path);assert.ok(!titles.has(title),path);titles.add(title);
  assert.ok(description&&/CIE|Cambridge/.test(description),path);assert.ok(!descriptions.has(description),path);descriptions.add(description);
  const canonical=new URL(html.match(/rel="canonical" href="([^"]+)"/)[1]);
  assert.equal(canonical.origin,origin);assert.ok(canonical.pathname.startsWith(base));assert.equal(canonical.search,'');
  assert.ok(html.includes(`content="${origin}${base}social-preview.png"`),path);
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'),path);
 }
});
test('structured educational metadata and breadcrumbs match the visible page hierarchy',()=>{
 for(const {path,html} of indexable){
  const data=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  assert.equal(data['@context'],'https://schema.org');
  const page=data['@graph'].find(item=>item['@id'].endsWith('#webpage'));
  assert.equal(page.isAccessibleForFree,true);
  const breadcrumbs=data['@graph'].find(item=>item['@type']==='BreadcrumbList');
  if(breadcrumbs){
   assert.ok(html.includes('aria-label="Breadcrumb"'),path);
   for(const [i,item] of breadcrumbs.itemListElement.entries()){
    assert.equal(item.position,i+1);assert.ok(item.item.startsWith(origin+base));assert.ok(html.includes(item.name.replaceAll('&','&amp;'))||html.includes(item.name),path);
   }
  }
  if(path.includes('/papers/')&&!path.endsWith('papers/index.html')){
   assert.ok(page['@type'].includes('LearningResource'));assert.ok(page.associatedMedia.every(m=>m.contentUrl.endsWith('.pdf')));
  }
 }
});
test('sitemap lists useful pages and all intact PDFs, excluding search, errors and redirects',()=>{
 const xml=readFileSync('dist/sitemap-0.xml','utf8');
 const urls=[...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 assert.equal(new Set(urls).size,67);
 assert.equal(urls.filter(u=>u.endsWith('.pdf')).length,28);
 assert.ok(urls.every(u=>u.startsWith(origin+base)));
 assert.ok(urls.every(u=>!/(?:\/(?:search|practice|past-papers|syllabus)\/?$|\/404|\.json$)/.test(u)));
 const papers=JSON.parse(readFileSync('src/data/paper-collections.json','utf8'));
 for(const p of papers)for(const asset of [p.questions,p.answers].filter(Boolean))assert.ok(urls.includes(origin+base+asset.file));
});
