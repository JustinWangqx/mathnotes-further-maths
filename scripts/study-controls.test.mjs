import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readProgress,updateProgress,topicProgress,progressKey} from '../src/utils/progress.mjs';
import {searchCatalog} from '../src/utils/search.mjs';
const catalog=JSON.parse(readFileSync('dist/search-index.json','utf8'));
const base=process.env.BASE_PATH||'/';
const htmlFor=href=>readFileSync(`dist/${new URL(href,'https://example.org').pathname.slice(base.length)}index.html`,'utf8');

test('specific method searches link to the matching type with clean readable descriptions',()=>{
 const results=searchCatalog(catalog,'reciprocal').results;
 assert.ok(results[0].href.endsWith('/roots-of-polynomials/#type-2'));
 assert.match(results[0].title,/Type 02:.*reciprocal roots/);
 assert.ok(results.some(r=>r.href.endsWith('/rational-functions/#type-1')));
 for(const result of results)assert.doesNotMatch(result.description,/katex|<[^>]+>|\\[a-z]+|\$|application\/x-tex/);
 const reduction=searchCatalog(catalog,'integration reduction').results;
 assert.ok(reduction.some(r=>r.href.endsWith('/integration/#type-4')));
});
test('all 78 indexed method anchors exist and lead to independent closed hints and working',()=>{
 let count=0;
 for(const entry of catalog.records.filter(r=>r.kind==='notes')){
  const html=htmlFor(entry.href);
  assert.ok(html.includes('aria-label="Jump to question type"'));
  for(const section of entry.sections){
   const id=new URL(section.href,'https://example.org').hash.slice(1);
   assert.ok(html.includes(`id="${id}"`));
   assert.doesNotMatch(section.description,/\\[a-z]+|\$|<[^>]+>/);
   count++;
  }
  assert.equal((html.match(/<details class="type-hint">/g)||[]).length,entry.sections.length);
  assert.equal((html.match(/<details class="type-solution">/g)||[]).length,entry.sections.length);
  assert.equal((html.match(/data-type-progress=/g)||[]).length,entry.sections.length);
 }
 assert.equal(count,78);
});
test('confidence transitions persist independently and summaries count only the selected topic',()=>{
 let progress=updateProgress({},'roots:type-2','practice');
 progress=updateProgress(progress,'roots:type-1','confident');
 progress=updateProgress(progress,'integration:type-1','confident');
 assert.deepEqual(topicProgress(progress,'roots',5),{confident:1,practice:1,total:5});
 const stored=JSON.stringify(progress);
 const restored=readProgress({getItem:key=>key===progressKey?stored:null});
 assert.deepEqual(restored,progress);
 const changed=updateProgress(restored,'roots:type-2','confident');
 assert.equal(restored['roots:type-2'],'practice');
 assert.deepEqual(topicProgress(changed,'roots',5),{confident:2,practice:0,total:5});
 const cleared=updateProgress(changed,'roots:type-2','unseen');
 assert.equal(cleared['roots:type-2'],undefined);
 assert.equal(cleared['integration:type-1'],'confident');
});
test('invalid or unavailable browser storage cannot break progress controls',()=>{
 for(const value of ['invalid','null','[]','42'])assert.deepEqual(readProgress({getItem:()=>value}),{});
 assert.deepEqual(readProgress({getItem:()=>{throw new Error('blocked');}}),{});
 assert.deepEqual(readProgress(undefined),{});
 assert.deepEqual(readProgress({getItem:()=>JSON.stringify({'roots:type-1':'confident','bad':'practice','roots:type-2':'arbitrary'})}),{'roots:type-1':'confident'});
 assert.deepEqual(updateProgress({},'bad','confident'),{});
 assert.deepEqual(updateProgress({},'roots:type-1','bad'),{});
});
test('topic map exposes per-type destinations and saved-state summaries',()=>{
 const map=readFileSync('dist/notes/index.html','utf8');
 assert.equal((map.match(/data-topic-progress=/g)||[]).length,14);
 assert.equal((map.match(/data-progress-key=/g)||[]).length,78);
 for(const entry of catalog.records.filter(r=>r.kind==='notes'))for(const section of entry.sections)assert.ok(map.includes(`href="${section.href}"`));
});

test('method practice links open original pages with a link back to the same type', () => {
  let links = 0;
  for (const entry of catalog.records.filter(record => record.kind === 'notes')) {
    for (const match of htmlFor(entry.href).matchAll(/href="([^"]+\/papers\/[^"]+\/)\?method=[\w-]+:(type-\d+)#(page-\d+)"/g)) {
      const [, collection, type, page] = match;
      const reader = htmlFor(collection);
      const figure = reader.split(`id="${page}"`)[1]?.split('</figure>')[0];
      assert.ok(figure?.includes(`href="${entry.href}#${type}"`), `${collection}#${page} links back to ${type}`);
      links++;
    }
  }
  assert.ok(links > 30);
});
