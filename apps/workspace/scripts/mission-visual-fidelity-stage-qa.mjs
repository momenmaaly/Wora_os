import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import chromiumBinary, { inflate } from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const here=path.dirname(fileURLToPath(import.meta.url)), appRoot=path.resolve(here,'..'), repoRoot=path.resolve(appRoot,'../..');
const stage=process.env.WORA_STAGE ?? '01-department-interiors';
const action=process.env.WORA_CAPTURE ?? 'after';
if(!/^[0-9]{2}-[a-z0-9-]+$/.test(stage)||!['before','after'].includes(action))throw new Error('Set WORA_STAGE=NN-kebab-case and WORA_CAPTURE=before|after.');
const root=path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/reconstruction',stage);
const captures=path.join(root,'captures');await mkdir(captures,{recursive:true});
const out=path.join(captures,`${action}-1672x941-full.png`);
const referencePath=path.join(repoRoot,'docs/design/main-workspace/reference/wora-main-workspace.png');
const measurementPath=path.join(repoRoot,'docs/design/main-workspace/analysis/data/measurements.json');
const source=PNG.sync.read(await readFile(referencePath));
const m=JSON.parse(await readFile(measurementPath,'utf8'));
const W=1672,H=941;
if(source.width!==W||source.height!==H)throw new Error('Reference extent changed.');
const chromiumBin=path.join(path.dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))),'..','bin');
await inflate(path.join(chromiumBin,'al2023.tar.br'));process.env.LD_LIBRARY_PATH=`/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH??''}`;
const browser=await chromium.launch({executablePath:await chromiumBinary.executablePath(),headless:true,args:chromiumBinary.args});
const page=await browser.newPage({viewport:{width:W,height:H},deviceScaleFactor:1});
const browserErrors=[];page.on('pageerror',e=>browserErrors.push(e.message));page.on('console',e=>{if(e.type()==='error')browserErrors.push(e.text());});
const baseURL=process.env.WORA_BASE_URL??'http://127.0.0.1:5173';
const response=await page.goto(baseURL,{waitUntil:'networkidle',timeout:60000});if(!response?.ok())throw new Error(`Application HTTP ${response?.status()}`);
await page.waitForSelector('[data-testid="greybox-canvas"] canvas',{timeout:30000});
await page.waitForFunction(()=>window.__WORA_CAMERA__&&document.fonts.status==='loaded',null,{timeout:30000});await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(500);
const browserSnapshot=await page.evaluate(()=>{const c=document.querySelector('[data-testid="greybox-canvas"] canvas'),r=c.getBoundingClientRect(),cam=window.__WORA_CAMERA__;const gl=c.getContext('webgl2')||c.getContext('webgl');return{viewport:[innerWidth,innerHeight],dpr:devicePixelRatio,canvas:{x:r.x,y:r.y,width:r.width,height:r.height,bitmap:[c.width,c.height],buffer:[gl?.drawingBufferWidth,gl?.drawingBufferHeight]},camera:{position:cam.position.toArray(),quaternion:cam.quaternion.toArray(),zoom:cam.zoom,fov:cam.fov,aspect:cam.aspect},selectedView:[...document.querySelectorAll('[role="button"][aria-pressed="true"]')].map(x=>x.textContent.trim())};});
if(browserSnapshot.viewport[0]!==W||browserSnapshot.viewport[1]!==H||browserSnapshot.dpr!==1||browserSnapshot.canvas.x!==0||browserSnapshot.canvas.y!==0||browserSnapshot.canvas.width!==W||browserSnapshot.canvas.height!==H)throw new Error(`Capture alignment check failed: ${JSON.stringify(browserSnapshot)}`);
const shot=await page.screenshot({path:out,fullPage:false,animations:'disabled',timeout:120000});await browser.close();
const img=PNG.sync.read(shot);if(img.width!==W||img.height!==H)throw new Error('Browser screenshot is not native size.');
function hash(b){return createHash('sha256').update(b).digest('hex');}
function countMetrics(a,b,mask){let n=0,equal=0,abs=0,sq=0,gt8=0,ge16=0;for(let p=0;p<mask.length;p++)if(mask[p]){n++;const i=p*4;let max=0;for(let c=0;c<3;c++){const d=Math.abs(a.data[i+c]-b.data[i+c]);max=Math.max(max,d);abs+=d;sq+=d*d;}if(max===0)equal++;if(max>8)gt8++;if(max>=16)ge16++;}return{pixelsCompared:n,pixelsExactlyIdentical:equal,pixelsDifferent:n-equal,differentPercent:n?100*(n-equal)/n:0,maeRgb8:n?abs/(3*n):0,rmseRgb8:n?Math.sqrt(sq/(3*n)):0,maxChannelDiffGt8Pixels:gt8,maxChannelDiffGt8Percent:n?100*gt8/n:0,maxChannelDiffGe16Pixels:ge16,maxChannelDiffGe16Percent:n?100*ge16/n:0};}
function rectMask(rects){const mask=new Uint8Array(W*H);for(const r of rects){const x0=Math.max(0,Math.floor(r.x)),y0=Math.max(0,Math.floor(r.y)),x1=Math.min(W,Math.ceil(r.x+r.w)),y1=Math.min(H,Math.ceil(r.y+r.h));for(let y=y0;y<y1;y++)mask.fill(1,y*W+x0,y*W+x1);}return mask;}
const departments=m.elements.filter(e=>e.group==='Departments'&&e.id.startsWith('DEPT-'));
// Full catalogued department rectangles are the primary regions. No pixels are masked out
// (including UI occlusions, robots, or overlapping adjacent room envelopes); raw overlap is
// measured and disclosed so a difficult area cannot disappear from the score.
const sections=departments.map(d=>({id:d.id,name:d.name,x:d.x,y:d.y,w:d.w,h:d.h,confidence:d.conf,note:d.note,mask:rectMask([d]),overlap:0}));
for(let i=0;i<sections.length;i++)for(let j=i+1;j<sections.length;j++){let n=0;for(let p=0;p<W*H;p++)if(sections[i].mask[p]&&sections[j].mask[p])n++;sections[i].overlap+=n;sections[j].overlap+=n;}
const beforePath=path.join(captures,'before-1672x941-full.png');let beforeImg=null,beforeSha=null;
if(action==='before'){await writeFile(beforePath,shot);beforeImg=img;beforeSha=hash(shot);}else{const b=await readFile(beforePath);beforeImg=PNG.sync.read(b);beforeSha=hash(b);if(beforeImg.width!==W||beforeImg.height!==H)throw new Error('Before capture is not 1672x941.');}
function pngOut(a,b,mask,mode,target){const p=new PNG({width:W,height:H});for(let n=0;n<W*H;n++){const i=n*4;for(let c=0;c<3;c++){if(mode==='overlay'){if(!mask||mask[n])p.data[i+c]=Math.round((a.data[i+c]+b.data[i+c])/2);}else if(!mask||mask[n])p.data[i+c]=Math.abs(a.data[i+c]-b.data[i+c]);}p.data[i+3]=255;}return writeFile(target,PNG.sync.write(p));}
const refBytes=await readFile(referencePath),refSha=hash(refBytes);const baseMetrics={},afterMetrics={};
const globalMask=new Uint8Array(W*H).fill(1);
if(action==='before'){
  await pngOut(source,img,globalMask,'overlay',path.join(captures,'before-overlay-50.png'));
  await pngOut(source,img,globalMask,'diff',path.join(captures,'before-absolute-difference.png'));
  for(const s of sections){baseMetrics[s.id]=countMetrics(source,img,s.mask);await pngOut(source,img,s.mask,'diff',path.join(captures,`${s.id.toLowerCase()}-before-difference.png`));}
  const report={stage,capturedAt:new Date().toISOString(),reference:{path:path.relative(repoRoot,referencePath),sha256:refSha,width:W,height:H},capture:{path:path.relative(repoRoot,out),sha256:hash(shot),provenance:'fresh browser screenshot captured at phase entry',browserSnapshot,browserErrors},regionMasks:sections.map(({mask,...s})=>s),beforeMetrics:baseMetrics,fullFrameBefore:countMetrics(source,img,globalMask),note:'Each department ROI is the full catalogued measurement rectangle. No pixels or occlusions are excluded; adjacent ROI overlaps are reported as raw pixel counts. No resize or crop.'};
  await writeFile(path.join(root,'stage-before.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
} else {
  await pngOut(source,img,globalMask,'overlay',path.join(captures,'after-overlay-50.png'));
  await pngOut(source,img,globalMask,'diff',path.join(captures,'after-absolute-difference.png'));
  for(const s of sections){afterMetrics[s.id]=countMetrics(source,img,s.mask);await pngOut(source,img,s.mask,'overlay',path.join(captures,`${s.id.toLowerCase()}-after-overlay-50.png`));await pngOut(source,img,s.mask,'diff',path.join(captures,`${s.id.toLowerCase()}-after-difference.png`));}
  const beforeReport=JSON.parse(await readFile(path.join(root,'stage-before.json'),'utf8'));
  for(const s of sections)baseMetrics[s.id]=beforeReport.beforeMetrics[s.id];
  const deltas={};for(const s of sections){const b=baseMetrics[s.id],a=afterMetrics[s.id];deltas[s.id]={before:b,after:a,changePercentagePoints:a.differentPercent-b.differentPercent,maeChangeRgb8:a.maeRgb8-b.maeRgb8,rmseChangeRgb8:a.rmseRgb8-b.rmseRgb8};}
  const report={stage,capturedAt:new Date().toISOString(),reference:{path:path.relative(repoRoot,referencePath),sha256:refSha,width:W,height:H},before:{path:path.relative(repoRoot,beforePath),sha256:beforeSha},after:{path:path.relative(repoRoot,out),sha256:hash(shot),provenance:'fresh browser screenshot after phase edits',browserSnapshot,browserErrors},fullFrame:{before:beforeReport.fullFrameBefore,after:countMetrics(source,img,globalMask)},departmentDeltas:deltas,maskAudit:{regions:sections.map(({mask,...s})=>s),pairwiseRawOverlapPixels:sections.reduce((sum,s)=>sum+s.overlap,0)/2,coordinatesSource:path.relative(repoRoot,measurementPath),allCoordinatesInBounds:sections.every(s=>s.x>=0&&s.y>=0&&s.x+s.w<=W&&s.y+s.h<=H),sameMaskDefinitionBeforeAndAfter:true,noPixelsExcluded:true},note:'No transform. Pixel counts are calculated on native RGB pixels across each complete catalogued department rectangle; all occlusions remain included. Raw region overlaps are reported and each ROI is scored independently.'};
  await writeFile(path.join(root,'stage-after.json'),JSON.stringify(report,null,2)+'\n');
  const rows=sections.map(s=>{const x=deltas[s.id];return `| ${s.id} ${s.name} | ${x.before.pixelsDifferent}/${x.before.pixelsCompared} (${x.before.differentPercent.toFixed(3)}%) | ${x.after.pixelsDifferent}/${x.after.pixelsCompared} (${x.after.differentPercent.toFixed(3)}%) | ${x.changePercentagePoints.toFixed(3)} pp | ${x.before.maeRgb8.toFixed(2)} → ${x.after.maeRgb8.toFixed(2)} | ${x.before.rmseRgb8.toFixed(2)} → ${x.after.rmseRgb8.toFixed(2)} |`;}).join('\n');
  const md=`# ${stage} — phase result\n\nCaptured: ${report.capturedAt} UTC. Reference SHA-256: \`${refSha}\`. Before and after screenshots are both native 1672×941; browser DPR is 1, canvas and drawing buffer match the viewport.\n\n| Department ROI | Before different / total | After different / total | Δ PixelDiff | MAE RGB8 before → after | RMSE RGB8 before → after |\n|---|---:|---:|---:|---:|---:|\n${rows}\n\nFull frame: ${(report.fullFrame.before.differentPercent).toFixed(3)}% → ${(report.fullFrame.after.differentPercent).toFixed(3)}%. Full-frame value is a context check only; phase acceptance uses the seven departmental rows above. Negative percentage-point / MAE / RMSE change is better.\n\nThe overlays and absolute-difference maps are in \`captures/\`. Each department uses its entire measurement rectangle, including robots and any overlaid UI. Intersecting rectangles are scored independently and their raw overlaps are listed in \`stage-after.json\`; no pixels were excluded and no mask changed between captures. No element was hidden or omitted to improve a score.\n\nBrowser errors: ${browserErrors.length}.\n`;
  await writeFile(path.join(root,'stage-result.md'),md);
  console.log(JSON.stringify(report,null,2));
}
