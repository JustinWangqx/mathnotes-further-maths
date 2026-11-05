import test from 'node:test';
import assert from 'node:assert/strict';
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
const integrate=(f,a,b,n=10000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;};
test('source textbook PDF/CDF moments and transformation are consistent',()=>{
 near(integrate(x=>x/12,1,5),1);
 near(integrate(x=>Math.sqrt(x)*x/30,2,8),124*Math.sqrt(2)/75);
 const mean=integrate(x=>x*x/30,2,8);
 near(integrate(x=>x*x*x/30,2,8)-mean*mean,66/25);
 near(integrate(y=>8*y/3,.5,1),1);
});
test('source matrix inverse, complex polynomial roots and surface area agree',()=>{
 const A=[[1,2,1],[0,-1,2],[2,3,1]],B=[[-7,1,5],[4,-1,-2],[2,1,-1]];
 for(let i=0;i<3;i++)for(let j=0;j<3;j++)near(A[i].reduce((s,a,k)=>s+a*B[k][j]/3,0),i===j?1:0);
 for(let k=0;k<4;k++){const x=Math.tan(Math.PI/16+k*Math.PI/4);near(x**4+4*x**3-6*x*x-4*x+1,0);}
 near(2*Math.PI*integrate(x=>x*Math.sqrt(1+4*x*x),2,3),Math.PI/6*(37*Math.sqrt(37)-17*Math.sqrt(17)));
});
test('source statistical answers use full-precision calculations and correct signed ranks',()=>{
 const butterfly=[8.8,9.6,9.2,9.1,9.9,8.7],mean=butterfly.reduce((a,b)=>a+b)/6;
 const variance=butterfly.reduce((s,x)=>s+(x-mean)**2,0)/5;
 near((mean-9.4)/Math.sqrt(variance/6),-.9715131257528858);
 const survival=[37,54,73,89,94,110,112,123,129,132,148,151,173,189,201,204,213,276,281];
 const differences=survival.map(x=>x-150),absolute=differences.map(Math.abs).sort((a,b)=>a-b);
 const positive=differences.filter(x=>x>0).reduce((s,x)=>s+absolute.indexOf(x)+1,0);
 assert.equal(positive,86);assert.equal(190-positive,104);
 const O=[[63,31,6],[26,20,14],[11,19,10]],R=O.map(row=>row.reduce((a,b)=>a+b)),C=[0,1,2].map(j=>O.reduce((s,row)=>s+row[j],0));
 let chi=0;for(let i=0;i<3;i++)for(let j=0;j<3;j++){const E=R[i]*C[j]/200;chi+=(O[i][j]-E)**2/E;}
 near(chi,21.098253968253967);
});

test('new rigid-body examples use mass-weighted moments and the correct failure limits',()=>{
 near((4*5+7*5)/15.5,110/31);
 near((7*3+2.5*3)/15.5,57/31);
 near(-(16*(-6)+4*10+25*(-3))/180,131/180);
 near(-(16*7+4*3+25*(-6))/180,13/90);
 near((27*9/4-3/4)/26-1,17/13);
 near((6*3/4-3/8)/7,33/56);
 near((2*.5+5*.25)*Math.tan(Math.PI/6)/7,3*Math.sqrt(3)/28);
 // Moment balance about the base edge sets the toppling limit.
 near((2/3)/2,1/3);
 assert.ok(1/4>1/5&&1/4<1/3);
});
