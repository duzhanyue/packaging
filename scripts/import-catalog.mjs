import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
const exec = promisify(execFile);
const origin = 'https://www.jietingpackage.com';
const cache = '.reference/catalog';
const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
async function pool(items, fn, n=6) { let i=0; await Promise.all(Array.from({length:n},async()=>{while(i<items.length){const item=items[i++];await fn(item);}})); }
async function download(url, path, timeout = 45) {
  for(let attempt=0;attempt<2;attempt++) { try {await exec('curl.exe',['-f','-sSL','--compressed','--max-time',String(timeout),'--connect-timeout','10','-A','Mozilla/5.0',url,'-o',path],{maxBuffer:1024*1024});return;}catch(e){if(attempt===1)throw new Error(`Download failed: ${url}`);} }
}
async function html(path) { const file=`${cache}/${path.replace(/[^\w.-]/g,'_') || 'index'}.html`;try{const cached=await readFile(file,'utf8');if(cached.includes('</html>'))return cached;}catch{} await download(origin+path,file,180);return readFile(file,'utf8'); }
const root=await html('/product/');
const cats=[...root.matchAll(/<a\s+href=["'](\/product\/(\d+)\/)["'][^>]*>\s*<em>(.*?)<\/em>/gs)].map(m=>({id:m[2],name:decode(m[3]),source:origin+m[1]})).filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);
const productMap=new Map(); const checks=[];
function parseProducts(body, category) {let ids=[];for(const m of body.matchAll(/<a\s+href=["']\/product\/(\d+)\.html["'][^>]*title=["']([^"']*)["'][^>]*>\s*<img\s+src=["']([^"']*)["']/gs)){ const id=m[1];ids.push(id);if(!productMap.has(id))productMap.set(id,{id,name:decode(m[2]),sourceUrl:`${origin}/product/${id}.html`,sourceImage:m[3]?new URL(m[3],origin).href:null,categories:[]});if(category&&!productMap.get(id).categories.includes(category))productMap.get(id).categories.push(category); }return ids;}
function remark(body){const m=body.match(/class="pageRemark">\s*\d+\/(\d+).*?\[(\d+)\]/s);return m?{pages:+m[1],total:+m[2]}:{pages:1,total:0};}
const groups=[{id:'all',name:'All packaging',source:origin+'/product/'},...cats];
await pool(groups,async c=>{const path=new URL(c.source).pathname;const first=await html(path);const r=remark(first);const ids=new Set(parseProducts(first,c.id==='all'?null:c.name));await pool(Array.from({length:r.pages-1},(_,i)=>i+2),async p=>{for(const id of parseProducts(await html(`${path}p${p}.html`),c.id==='all'?null:c.name))ids.add(id);},3);checks.push({category:c.name,...r,found:ids.size});console.log('Category:',c.name,ids.size,'/',r.total);},3);
const products=[...productMap.values()];
await writeFile(`${cache}/listing.json`,JSON.stringify({categories:cats,products,checks},null,2));
console.log('LISTINGS COMPLETE:',products.length);
const failures=[];let count=0;
await pool(products,async p=>{try{const body=await html(`/product/${p.id}.html`);const intro=body.split('<section class="product-intro">')[1]?.split('<div class="share-this">')[0]||'';const detail=body.split('<section class="product-detail">')[1]?.split('id="faq"')[0]||'';const imageSources=[...`${intro}${detail}`.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gs)].map(m=>new URL(m[1],origin)).filter(u=>['http:','https:','data:'].includes(u.protocol)).map(u=>{if(u.protocol!=='data:')u.protocol='https:';return u.href;});p.sourceImages=[...new Set([p.sourceImage,...imageSources].filter(Boolean))];p.specifications=[];const table=detail.match(/<table\b[\s\S]*?<\/table>/)?.[0]||'';for(const row of table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)){const cells=[...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/g)].map(m=>decode(m[1]));if(cells.length===2&&cells[0]&&cells[1])p.specifications.push({label:cells[0],value:cells[1]});} }catch(e){failures.push({product:p.id,error:e.message});p.sourceImages=[p.sourceImage].filter(Boolean);p.specifications=[];}if(++count%20===0)console.log('Details:',count,'/',products.length);},6);
await writeFile(`${cache}/details.json`,JSON.stringify({categories:cats,products,checks,failures},null,2));
console.log('DETAILS COMPLETE; downloading images');
const sources=[...new Set(products.flatMap(p=>p.sourceImages))];const imageMap=new Map();count=0;
await pool(sources,async source=>{const name=createHash('sha256').update(source).digest('hex').slice(0,20);const output=`public/images/catalog/${name}.webp`;try{await stat(output);imageMap.set(source,`catalog/${name}.webp`);}catch{try{const raw=`${cache}/${name}.asset`;if(source.startsWith('data:image/')){await writeFile(raw,Buffer.from(source.slice(source.indexOf(',')+1),'base64'));}else{await download(source,raw);}await sharp(raw,{limitInputPixels:100000000}).rotate().resize({width:1400,height:1800,fit:'inside',withoutEnlargement:true}).webp({quality:84}).toFile(output);imageMap.set(source,`catalog/${name}.webp`);}catch(e){failures.push({image:source,error:e.message});}}if(++count%30===0)console.log('Images:',count,'/',sources.length);},8);
const aliases={'175':'bamboo-collection','156':'gold-cream-jars','281':'square-dropper','174':'bamboo-jar','272':'frosted-dropper','269':'violet-dropper','289':'foam-bottle','261':'cosmetic-tubes'};
const final=products.map(({sourceImages,...p})=>({...p,slug:aliases[p.id]||`jt-${p.id}`,category:p.categories[0]||'Packaging',type:(p.categories[0]||'Packaging').toUpperCase(),tag:'THE JIETING COLLECTION',description:`Explore ${p.name.toLowerCase()} from our ${p.categories[0]||'packaging'} collection. Contact our team to discuss specifications, decoration and your project requirements.`,detail:p.specifications.find(s=>/^(size|capacity|volume)$/i.test(s.label))?.value||p.categories[0]||'Packaging',image:imageMap.get(p.sourceImage)||sourceImages.map(u=>imageMap.get(u)).find(Boolean),images:[...new Set(sourceImages.map(u=>imageMap.get(u)).filter(Boolean))]}));
await writeFile('app/catalog.json',JSON.stringify({categories:cats,products:final},null,2));
await writeFile(`${cache}/report.json`,JSON.stringify({date:new Date().toISOString(),products:final.length,categories:cats.length,sourceImages:sources.length,downloaded:imageMap.size,checks,failures},null,2));
console.log('IMPORT COMPLETE',JSON.stringify({products:final.length,categories:cats.length,images:imageMap.size,failures:failures.length}));
if(final.some(p=>!p.image)||checks.some(c=>c.total!==c.found))process.exitCode=1;
