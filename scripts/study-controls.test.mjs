import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
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
test('all 90 indexed method anchors lead to a directly readable example and solution',()=>{
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
  assert.equal((html.match(/class="worked-solution"/g)||[]).length,entry.sections.length);
  assert.doesNotMatch(html, /type-hint|type-solution|type-cues|example-source|data-type-progress|data-topic-progress/);
 }
 assert.equal(count,90);
});
test('paper readers retain direct links to related note methods', () => {
  const collections = JSON.parse(readFileSync('src/data/paper-collections.json', 'utf8'));
  for (const collection of collections) {
    const reader = htmlFor(`${base}papers/${collection.id}/`);
    for (const match of reader.matchAll(/href="([^"]+\/9231\/[^"]+)#(type-\d+)"/g)) {
      assert.ok(htmlFor(match[1]).includes(`id="${match[2]}"`));
    }
  }
});
