import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {trackedSite,isTrackedPage,parseVisitCounts,recordPageView} from '../src/utils/visits.mjs';

test('only the live MathNotes project can increment its visit total',async()=>{
 for(const page of ['http://localhost:4350/mathnotes-further-maths/','http://127.0.0.1:4350/mathnotes-further-maths/','https://example.com/mathnotes-further-maths/','https://justinwangqx.github.io/another-project/','https://justinwangqx.github.io/mathnotes-further-maths-other/']){
  assert.equal(isTrackedPage(page),false);
  assert.equal(await recordPageView(page,()=>{throw new Error('Preview attempted to count');}),null);
 }
 assert.equal(isTrackedPage(trackedSite),true);
 assert.equal(isTrackedPage(trackedSite+'9231/fp1/matrices/?query=private#type-1'),true);
});

test('a page view uses one shared counter key and omits browsing details and cookies',async()=>{
 let requests=0;
 const counts=await recordPageView(trackedSite+'search/?q=private-maths-query#result',async(raw,options)=>{
  requests++;
  const url=new URL(raw);
  assert.equal(url.origin,'https://hitscounter.dev');
  assert.equal(url.pathname,'/api/hit');
  assert.equal(url.searchParams.get('url'),trackedSite);
  assert.equal(url.searchParams.get('tz'),'Asia/Shanghai');
  assert.equal(url.searchParams.get('output'),'json');
  assert.ok(!raw.includes('private-maths-query'));
  assert.equal(options.credentials,'omit');
  assert.equal(options.referrerPolicy,'no-referrer');
  assert.equal(options.cache,'no-store');
  assert.ok(options.signal instanceof AbortSignal);
  return {ok:true,json:async()=>({today_hits:3,total_hits:128})};
 });
 assert.equal(requests,1);
 assert.deepEqual(counts,{today:3,total:128});
});

test('counter failures do not cause duplicate increments or invent a zero total',async()=>{
 for(const fetcher of [async()=>{throw new TypeError('Network failed');},async()=>({ok:false}),async()=>({ok:true,json:async()=>({total_hits:'1',today_hits:1})})]){
  let requests=0;
  await assert.rejects(recordPageView(trackedSite,async(...args)=>{requests++;return fetcher(...args);}));
  assert.equal(requests,1);
 }
 for(const value of [null,{}, {total_hits:5,today_hits:6},{total_hits:-1,today_hits:0},{total_hits:Infinity,today_hits:1}])assert.throws(()=>parseVisitCounts(value));
 assert.deepEqual(parseVisitCounts({total_hits:0,today_hits:0}),{total:0,today:0});
});

test('the deployed footer and statistics page expose the same accessible count',()=>{
 const home=readFileSync('dist/index.html','utf8');
 const page=readFileSync('dist/visits/index.html','utf8');
 const missing=readFileSync('dist/404.html','utf8');
 assert.ok(home.includes('data-total-views'));
 assert.ok(page.includes('TOTAL PAGE VIEWS')&&page.includes('data-today-views'));
 assert.ok(page.includes('aria-live="polite"'));
 assert.ok(!/<strong[^>]*data-total-views/.test(missing));
 for(const html of [home,page])assert.ok(!html.includes('justin.wangqx@gmail.com'));
 const about=readFileSync('dist/about/index.html','utf8');
 assert.ok(!about.includes('has no analytics'));
 assert.ok(about.includes('hitscounter.dev'));
});
