import {searchCatalog} from '../data/search';
export const prerender=true;
export function GET(){return new Response(JSON.stringify(searchCatalog),{headers:{'Content-Type':'application/json; charset=utf-8'}});}
