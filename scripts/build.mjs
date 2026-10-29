import { spawnSync } from 'node:child_process';
const env={...process.env,ASTRO_TELEMETRY_DISABLED:'1'};
for(const [command,args] of [['astro',['build']],['pagefind',['--site','dist']]]){
  const result=spawnSync(`node_modules/.bin/${command}`,args,{stdio:'inherit',env});
  if(result.status!==0)process.exit(result.status||1);
}
