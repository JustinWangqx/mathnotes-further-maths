import test from 'node:test';
import assert from 'node:assert/strict';
const near=(actual,expected,tolerance=1e-9)=>assert.ok(Math.abs(actual-expected)<tolerance,`${actual} != ${expected}`);
const integrate=(f,a,b,n=10000)=>{const h=(b-a)/n;let s=f(a)+f(b);for(let i=1;i<n;i++)s+=(i%2?4:2)*f(a+i*h);return s*h/3;};
test('transformed polynomial examples have every stated root',()=>{
 for(const y of [1,3,5])near(y**3-9*y*y+23*y-15,0);
 for(const y of [3,4,5])near(y**3-12*y*y+47*y-60,0);
 for(const x of [-2,.3,4])near(8*(((x+1)/2)**3-6*((x+1)/2)**2+11*((x+1)/2)-6),x**3-9*x*x+23*x-15);
});
test('all listed roots solve the complex equations',()=>{
 for(const [n,theta,r,target] of [[3,Math.PI,2,-8],[4,Math.PI,2,-16],[3,0,2,8]]){
  for(let k=0;k<n;k++){const angle=(theta+2*k*Math.PI)/n;near(r**n*Math.cos(n*angle),target);near(r**n*Math.sin(n*angle),0);}
 }
 near(Math.sqrt(2)**6*Math.sin(6*Math.PI/4),-8);
});
test('density, moments, variance and interval probability agree',()=>{
 near(integrate(x=>x/2,0,2),1);near(integrate(x=>x*x/2,0,2),4/3);
 near(integrate(x=>x*x*x/2,0,2)-(4/3)**2,2/9);near(integrate(x=>x/2,1,2),3/4);
 near(Math.sqrt(2)**2/4,.5);
});
test('integration examples and finite-series identities agree numerically',()=>{
 near(integrate(x=>Math.sin(x)**4,0,Math.PI/2),3*Math.PI/16);
 near(integrate(x=>(1+Math.cos(x))**2/2,0,2*Math.PI),3*Math.PI/2);
 near(integrate(x=>1/Math.sqrt(1+x*x),0,1),Math.log(1+Math.sqrt(2)));
 for(const n of [1,2,17]){
  let sum=0,telescope=0;for(let r=1;r<=n;r++){sum+=r*(r+1);telescope+=1/(r*(r+2));}
  near(sum,n*(n+1)*(n+2)/3);near(telescope,.75-1/(2*(n+1))-1/(2*(n+2)));
 }
});
test('statistical worked values agree with their defining calculations',()=>{
 near((5.8-5)/(1.2/Math.sqrt(9)),2);near(1.96*3/Math.sqrt(100),.588);
 near([40,60].reduce((s,o)=>s+(o-50)**2/50,0),4);
 near([20,10,10,20].reduce((s,o)=>s+(o-15)**2/15,0),20/3);
 near((10+1)/2**10,11/1024);
 const p=[3/8,1/2,1/8];const mean=p.reduce((s,v,k)=>s+k*v,0);const variance=p.reduce((s,v,k)=>s+k*k*v,0)-mean*mean;
 near(mean,3/4);near(variance,7/16);
});
