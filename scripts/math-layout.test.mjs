import test from 'node:test';
import assert from 'node:assert/strict';
import katex from 'katex';
import {readFileSync} from 'node:fs';
import {layoutMath} from '../src/utils/math-layout.mjs';

test('successive equalities and approximations occupy separate calculation rows',()=>{
 const tex=String.raw`E(X)=\int_2^8\frac{x^2}{30}\,dx=\frac{28}{5}\approx5.6`;
 const formatted=layoutMath(tex);
 assert.ok(formatted.includes(String.raw`\\[0.5em] &=`));
 assert.ok(formatted.includes(String.raw`\\[0.5em] &\approx`));
 const html=katex.renderToString(formatted,{displayMode:true,throwOnError:true});
 assert.equal((html.match(/<mtr>/g)||[]).length,3);
 // Layout may insert alignments and row gaps, but cannot alter the expression.
 const flatten=s=>s.replace(/\\(?:begin|end)\{aligned\}|\\\\\[0\.5em\]|&|\s/g,'');
 assert.equal(flatten(formatted),flatten(tex));
});

test('cases, matrices and author-supplied aligned working preserve their internal structure',()=>{
 for(const tex of [String.raw`F(x)=\begin{cases}0&x<2\\\frac{x^2}{60}-\frac1{15}&2\le x\le8\\1&x>8\end{cases}`,String.raw`A=\begin{pmatrix}1&2\\3&4\end{pmatrix}`,String.raw`\begin{aligned}E(X)&=\int_2^8\frac{x^2}{30}\,dx\\&=\frac{28}{5}\end{aligned}`]){
  assert.equal(layoutMath(tex),tex);
  assert.doesNotThrow(()=>katex.renderToString(layoutMath(tex),{throwOnError:true}));
 }
});

test('all note formulas render after vertical formatting',()=>{
 for(const file of ['question-types.json']){
  const source=JSON.parse(readFileSync('src/data/'+file,'utf8'));
  const walk=value=>{
   if(typeof value==='string')for(const m of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g)){
    const tex=m[1]??m[2];assert.doesNotThrow(()=>katex.renderToString(layoutMath(tex),{throwOnError:true}),tex);
   }
   else if(value&&typeof value==='object')Object.values(value).forEach(walk);
  };
  walk(source);
 }
});
