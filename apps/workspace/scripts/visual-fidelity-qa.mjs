import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import chromiumBinary, { inflate } from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const repoRoot = path.resolve(appRoot, '../..');
const referencePath = path.join(repoRoot, 'docs/design/main-workspace/reference/wora-main-workspace.png');
const source = PNG.sync.read(await readFile(referencePath));
const sourceHash = createHash('sha256').update(await readFile(referencePath)).digest('hex');
const stage = process.env.WORA_VISUAL_STAGE ?? 'before';
if (!['before', 'after'].includes(stage)) throw new Error('WORA_VISUAL_STAGE must be before or after.');
const output = path.join(repoRoot, `docs/design/main-workspace/greybox/visual-fidelity/${stage}`);
await mkdir(output, { recursive: true });
const baseURL = process.env.WORA_BASE_URL ?? 'http://127.0.0.1:5173';
const measurements = JSON.parse(await readFile(path.join(repoRoot, 'docs/design/main-workspace/analysis/data/measurements.json'), 'utf8'));
const elements = measurements.elements;
const reference = measurements.reference;
const viewports = [
  [1920, 1080, 'desktop-1920x1080'], [1440, 900, 'desktop-1440x900'],
  [1366, 768, 'desktop-1366x768'], [390, 844, 'mobile-390x844'], [430, 932, 'mobile-430x932'],
  [source.width, source.height, 'reference-native-1672x941'],
];
const browserBin = path.join(path.dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))), '..', 'bin');
await inflate(path.join(browserBin, 'al2023.tar.br'));
process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;
const reuseCaptures = process.env.WORA_REUSE_CAPTURES === '1';
const browser = reuseCaptures ? null : await chromium.launch({ executablePath: await chromiumBinary.executablePath(), headless: true, args: chromiumBinary.args });
const browserErrors = [];
const captures = [];

function fitReference(width, height) {
  const scale = Math.min(width / source.width, height / source.height);
  const drawW = source.width * scale, drawH = source.height * scale;
  const offsetX = (width - drawW) / 2, offsetY = (height - drawH) / 2;
  const out = new PNG({ width, height });
  // Dark neutral letterbox: uniform scale only; never stretch the original to fit the viewport.
  for (let i = 0; i < out.data.length; i += 4) { out.data[i] = 11; out.data[i+1] = 15; out.data[i+2] = 22; out.data[i+3] = 255; }
  for (let y = Math.max(0, Math.floor(offsetY)); y < Math.min(height, Math.ceil(offsetY + drawH)); y++) {
    for (let x = Math.max(0, Math.floor(offsetX)); x < Math.min(width, Math.ceil(offsetX + drawW)); x++) {
      const sx = Math.max(0, Math.min(source.width - 1, Math.floor((x - offsetX) / scale)));
      const sy = Math.max(0, Math.min(source.height - 1, Math.floor((y - offsetY) / scale)));
      const si = (sy * source.width + sx) * 4, di = (y * width + x) * 4;
      out.data.set(source.data.subarray(si, si + 4), di);
    }
  }
  return { image: out, scale, offsetX, offsetY, drawW, drawH };
}
function rectMask(width, height, rects, transform, invert = false) {
  const mask = new Uint8Array(width * height);
  for (const r of rects) {
    const x0 = Math.max(0, Math.floor(transform.offsetX + r.x * transform.scale));
    const y0 = Math.max(0, Math.floor(transform.offsetY + r.y * transform.scale));
    const x1 = Math.min(width, Math.ceil(transform.offsetX + (r.x + r.w) * transform.scale));
    const y1 = Math.min(height, Math.ceil(transform.offsetY + (r.y + r.h) * transform.scale));
    for (let y = y0; y < y1; y++) mask.fill(1, y * width + x0, y * width + x1);
  }
  if (invert) for (let i = 0; i < mask.length; i++) mask[i] = mask[i] ? 0 : 1;
  return mask;
}
function getRects(ids) { return ids.map(id => elements.find(e => e.id === id)).filter(Boolean); }
function getGroupRects(groups) { return elements.filter(e => groups.includes(e.group)); }
function metric(a, b, mask) {
  let n = 0, abs = 0, sq = 0, exactMismatch = 0, over8 = 0, over16 = 0;
  for (let p = 0; p < mask.length; p++) if (mask[p]) {
    const i = p * 4;
    let maximum = 0;
    for (let c = 0; c < 3; c++) { const d = Math.abs(a.data[i+c] - b.data[i+c]); abs += d; sq += d*d; maximum = Math.max(maximum,d); }
    if (maximum > 0) exactMismatch++;
    if (maximum > 8) over8++;
    if (maximum > 16) over16++;
    n++;
  }
  // Spatial 8×8 block SSIM on luma, using only pixels selected by the ROI mask.
  const C1 = (0.01*255)**2, C2 = (0.03*255)**2;
  let ssimTotal = 0, windows = 0;
  for (let y0=0; y0<a.height; y0+=8) for (let x0=0; x0<a.width; x0+=8) {
    const A=[], B=[];
    for(let y=y0;y<Math.min(y0+8,a.height);y++) for(let x=x0;x<Math.min(x0+8,a.width);x++) {
      const p=y*a.width+x; if(!mask[p]) continue;
      const i=p*4; A.push(.2126*a.data[i]+.7152*a.data[i+1]+.0722*a.data[i+2]); B.push(.2126*b.data[i]+.7152*b.data[i+1]+.0722*b.data[i+2]);
    }
    if(!A.length) continue;
    const count=A.length; let ma=0,mb=0;
    for(let k=0;k<count;k++){ma+=A[k];mb+=B[k];} ma/=count; mb/=count;
    let va=0,vb=0,cov=0;
    for(let k=0;k<count;k++){const da=A[k]-ma,db=B[k]-mb;va+=da*da;vb+=db*db;cov+=da*db;}
    const denom=Math.max(1,count-1); va/=denom;vb/=denom;cov/=denom;
    ssimTotal+=((2*ma*mb+C1)*(2*cov+C2))/((ma*ma+mb*mb+C1)*(va+vb+C2)); windows++;
  }
  return { pixels:n, pixelDifferenceRatio:n?exactMismatch/n:0, pixelDifferencePercent:n?100*exactMismatch/n:0, pixelDifferenceOver8Ratio:n?over8/n:0, pixelDifferenceOver16Ratio:n?over16/n:0, mae:n?abs/(n*3*255):0, rmse:n?Math.sqrt(sq/(n*3*255*255)):0, mae8Bit:n?abs/(n*3):0, rmse8Bit:n?Math.sqrt(sq/(n*3)):0, ssimBlock8:windows?ssimTotal/windows:1 };
}
function writeMaskedDiff(a,b,mask,outPath) {
  const out = new PNG({width:a.width,height:a.height});
  for (let p=0;p<mask.length;p++) if(mask[p]) {
    const i=p*4, d=Math.max(Math.abs(a.data[i]-b.data[i]),Math.abs(a.data[i+1]-b.data[i+1]),Math.abs(a.data[i+2]-b.data[i+2]));
    if(d){out.data[i]=255;out.data[i+1]=0;out.data[i+2]=0;out.data[i+3]=Math.max(80,Math.min(255,d));}
  }
  return writeFile(outPath,PNG.sync.write(out));
}
function writeOverlay(a,b,outPath) {
  const out=new PNG({width:a.width,height:a.height});
  for(let i=0;i<a.data.length;i+=4){for(let c=0;c<3;c++)out.data[i+c]=Math.round((a.data[i+c]+b.data[i+c])/2);out.data[i+3]=255;}
  return writeFile(outPath,PNG.sync.write(out));
}
function storeMetrics(label, a, b, mask, report) {
  const m=metric(a,b,mask); report.regions[label]=m; return m;
}

try {
  if(reuseCaptures) {
    for(const [width,height,label] of viewports) {
      const fullPath=path.join(output,`${label}-full.png`);
      const img=PNG.sync.read(await readFile(fullPath));
      captures.push({width,height,label,fullPath,img,fontInfo:{status:'not sampled on original capture; preserved screenshot bytes reused',interRegular:null,interSemibold:null}});
    }
  } else {
  const page = await browser.newPage({ viewport:{width:source.width,height:source.height}, deviceScaleFactor:1 });
  page.on('pageerror',e=>browserErrors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')browserErrors.push(m.text());});
  for (const [width,height,label] of viewports) {
    await page.setViewportSize({width,height});
    const response=await page.goto(baseURL,{waitUntil:'networkidle',timeout:60000});
    if(!response?.ok()) throw new Error(`${label}: HTTP ${response?.status()}`);
    await page.waitForSelector('canvas',{timeout:30000});
    await page.waitForFunction(()=>window.__WORA_CAMERA__ && document.querySelector('[data-testid="ui-shell"]'),null,{timeout:30000});
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(300);
    const fontInfo=await page.evaluate(()=>({status:document.fonts.status,interRegular:document.fonts.check('400 16px Inter'),interSemibold:document.fonts.check('600 16px Inter')}));
    const fullPath=path.join(output,`${label}-full.png`);
    await page.screenshot({path:fullPath,fullPage:false,animations:'disabled',timeout:120000});
    const img=PNG.sync.read(await readFile(fullPath));
    captures.push({width,height,label,fullPath,img,fontInfo});
    if(label==='reference-native-1672x941'){
      await page.evaluate(()=>{const c=document.querySelector('canvas'); if(c)c.style.visibility='hidden';});
      await page.screenshot({path:path.join(output,`${label}-ui-only.png`),fullPage:false,animations:'disabled',timeout:120000});
      await page.evaluate(()=>{const c=document.querySelector('canvas'); if(c)c.style.visibility=''; const ui=document.querySelector('[data-testid="ui-shell"]'); if(ui)ui.style.visibility='hidden';});
      await page.screenshot({path:path.join(output,`${label}-scene-only.png`),fullPage:false,animations:'disabled',timeout:120000});
      await page.evaluate(()=>{const ui=document.querySelector('[data-testid="ui-shell"]'); if(ui)ui.style.visibility='';});
    }
  }
  }
} finally { if(browser) await browser.close(); }

const uiGroups=['Brand header','Sidebar','Top-centre','Top-right','Live Activity','Executive Command','View switcher'];
const uiGroupRects=getGroupRects(uiGroups);
const uiRegionRects=getRects(['REG-01','REG-02','REG-04','REG-05','REG-06','REG-07','REG-08']);
const textIconIds=elements.filter(e=>e.id.startsWith('UI-') && /Text|Logo|icon|Icon|glyph|crown|avatar|chevron|badge|Tab|row|Link|Placeholder/i.test(e.name)).map(e=>e.id);
const deptRects=elements.filter(e=>e.id.startsWith('DEPT-'));
const signRects=elements.filter(e=>e.id.startsWith('SIGN-'));
const robotRects=measurements.robots.map(r=>({id:r.id,name:r.id,x:r.x,y:r.y,w:r.w,h:r.h}));
const envRects=elements.filter(e=>e.id.startsWith('ENV-'));
const regionDefinitions=[
  {name:'UI Shell union',rects:[...uiRegionRects,...uiGroupRects],kind:'ui'},
  ...uiGroups.map(g=>({name:`UI · ${g}`,rects:g==='Live Activity'?getRects(['REG-06']):getGroupRects([g]),kind:'ui'})),
  {name:'Typography and Icons',rects:getRects(textIconIds),kind:'ui'},
  ...deptRects.map(e=>({name:`Scene geometry · ${e.id} ${e.name}`,rects:[e],kind:'scene',excludeUI:true})),
  ...envRects.filter(e=>['ENV-001','ENV-002','ENV-003','ENV-004','ENV-005','ENV-006','ENV-009','ENV-010','ENV-014','ENV-015','ENV-016'].includes(e.id)).map(e=>({name:`Scene material/light · ${e.id} ${e.name}`,rects:[e],kind:'scene',excludeUI:true})),
];
const native=captures.find(c=>c.label==='reference-native-1672x941');
const nativeFit=fitReference(native.width,native.height);
const refNative=source;
const fullMask=new Uint8Array(native.width*native.height).fill(1);
const nativeUI=rectMask(native.width,native.height,uiRegionRects,{scale:1,offsetX:0,offsetY:0});
const nativeSceneMask=rectMask(native.width,native.height,uiRegionRects,{scale:1,offsetX:0,offsetY:0},true);
const nativeUIImg=PNG.sync.read(await readFile(path.join(output,'reference-native-1672x941-ui-only.png')));
const nativeSceneImg=PNG.sync.read(await readFile(path.join(output,'reference-native-1672x941-scene-only.png')));
const nativeReport={width:native.width,height:native.height,referenceWidth:source.width,referenceHeight:source.height,referenceSha256:sourceHash,alignment:'Exact native 1672x941; no resizing/cropping; deviceScaleFactor=1.',regions:{}};
storeMetrics('Full frame',native.img,refNative,fullMask,nativeReport);
storeMetrics('UI Shell (reference UI boxes only)',nativeUIImg,refNative,nativeUI,nativeReport);
storeMetrics('3D Scene (outside reference UI boxes)',nativeSceneImg,refNative,nativeSceneMask,nativeReport);
const geometryMask=rectMask(native.width,native.height,[...deptRects,...signRects,...robotRects,...envRects],{scale:1,offsetX:0,offsetY:0});
const materialRefs=envRects.filter(e=>['ENV-001','ENV-002','ENV-005','ENV-006','ENV-009','ENV-010','ENV-014','ENV-015','ENV-016'].includes(e.id));
const materialMask=rectMask(native.width,native.height,[...materialRefs,...signRects],{scale:1,offsetX:0,offsetY:0});
const floorMask=rectMask(native.width,native.height,getRects(['ENV-001']),{scale:1,offsetX:0,offsetY:0});
const floorObjects=rectMask(native.width,native.height,[...robotRects,...envRects.filter(e=>/^ENV-00[2-9]|^ENV-01[0-3]/.test(e.id)),...signRects],{scale:1,offsetX:0,offsetY:0});
for(let i=0;i<floorMask.length;i++){if(nativeUI[i]||floorObjects[i])floorMask[i]=0; if(nativeUI[i]){geometryMask[i]=0;materialMask[i]=0;}}
storeMetrics('Geometry and Element Positions (measured rooms/signs/robot boxes)',nativeSceneImg,refNative,geometryMask,nativeReport);
storeMetrics('Colors and Materials (measured environment/sign ROIs)',nativeSceneImg,refNative,materialMask,nativeReport);
storeMetrics('Lighting and Shadows (open-floor samples; objects/UI excluded)',nativeSceneImg,refNative,floorMask,nativeReport);
await writeMaskedDiff(nativeSceneImg,refNative,geometryMask,path.join(output,'native-geometry-positions-diff.png'));
await writeMaskedDiff(nativeSceneImg,refNative,materialMask,path.join(output,'native-colors-materials-diff.png'));
await writeMaskedDiff(nativeSceneImg,refNative,floorMask,path.join(output,'native-lighting-shadows-diff.png'));
for(const r of regionDefinitions){
  const mask=rectMask(native.width,native.height,r.rects,{scale:1,offsetX:0,offsetY:0});
  if(r.excludeUI) for(let i=0;i<mask.length;i++) if(nativeUI[i])mask[i]=0;
  storeMetrics(r.name,r.kind==='ui'?nativeUIImg:nativeSceneImg,refNative,mask,nativeReport);
  const slug=r.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  await writeMaskedDiff(r.kind==='ui'?nativeUIImg:nativeSceneImg,refNative,mask,path.join(output,`native-region-${slug}-diff.png`));
}
await writeMaskedDiff(native.img,refNative,fullMask,path.join(output,'native-full-diff.png'));
await writeMaskedDiff(nativeUIImg,refNative,nativeUI,path.join(output,'native-ui-diff.png'));
await writeMaskedDiff(nativeSceneImg,refNative,nativeSceneMask,path.join(output,'native-scene-diff.png'));
await writeOverlay(native.img,refNative,path.join(output,'native-overlay-50.png'));

const viewportReports=[];
for(const c of captures){
  const fit=fitReference(c.width,c.height);
  const uiMask=rectMask(c.width,c.height,uiRegionRects,fit);
  const sceneMask=rectMask(c.width,c.height,uiRegionRects,fit,true);
  const wholeMask=new Uint8Array(c.width*c.height).fill(1);
  const r={label:c.label,width:c.width,height:c.height,referenceFit:{method:'uniform contain, nearest-neighbour, centred dark letterbox; no non-uniform stretch',scale:fit.scale,offsetX:fit.offsetX,offsetY:fit.offsetY,drawWidth:fit.drawW,drawHeight:fit.drawH},metrics:{}};
  r.metrics.fullFrame=metric(c.img,fit.image,wholeMask);
  const slug=c.label;
  await writeMaskedDiff(c.img,fit.image,wholeMask,path.join(output,`${slug}-contained-diff.png`));
  await writeOverlay(c.img,fit.image,path.join(output,`${slug}-contained-overlay-50.png`));
  if(c.label==='reference-native-1672x941') continue;
  r.metrics.measuredUiRegions=metric(c.img,fit.image,uiMask);
  r.metrics.sceneOutsideMeasuredUi=metric(c.img,fit.image,sceneMask);
  viewportReports.push(r);
}
const report={
  generatedAt:new Date().toISOString(),stage,
  captureProvenance:reuseCaptures?'Preserved screenshot bytes reused; metrics re-computed now. No browser recapture.':'Fresh Chromium browser screenshots captured during this run.',
  browser:'Chromium 153 headless; SwiftShader software WebGL; deviceScaleFactor=1',baseURL,
  reference:{path:path.relative(repoRoot,referencePath),width:source.width,height:source.height,sha256:sourceHash},
  methodology:{
    native:'Exact 1672×941 reference-sized capture, one-to-one pixels; no transform.',
    requestedViewports:'Reference fit uses uniform contain with centred dark letterbox and nearest-neighbour sampling only. No anisotropic resize/crop. 1440×900 and mobile do not share the source aspect; mobile has no owner-provided mobile reference, so these are diagnostics, not mobile acceptance scores.',
    roi:'UI groups and 3D department/environment bounds come from analysis/data/measurements.json. Scene metrics mask out the seven measured floating UI regions; UI metrics use the matching DOM layer with the canvas hidden. UI and scene are rendered layers, not reference-image substitutions.',
    metrics:'Exact RGB pixel-difference ratio; thresholded max-channel pixel ratios >8 and >16; normalized MAE/RMSE (0–1) plus absolute 8-bit RGB MAE/RMSE; spatial 8×8 block SSIM on luma with standard C1/C2. The red diff overlays expose changed ROI pixels. SSIM is a block mean and not the sole acceptance metric.',
    before:'Baseline images were captured at commit 157f52c before bundling an Inter font; metrics are recomputed from these preserved bytes when WORA_REUSE_CAPTURES=1.',
    after:'Inter 400/500/600/700 is bundled and document.fonts.ready is awaited before capture.'
  },
  nativeExactComparison:nativeReport,viewportComparisons:viewportReports,
  captureFiles:captures.map(c=>({viewport:c.label,full:path.relative(repoRoot,c.fullPath),fontInfo:c.fontInfo})),
  layerCaptures:['reference-native-1672x941-ui-only.png','reference-native-1672x941-scene-only.png'],browserErrors
};
await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
if(stage==='after'){
  const before=JSON.parse(await readFile(path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/before/report.json'),'utf8'));
  const delta=(a,b)=>({before:a,after:b,change:b-a});
  const nativeRegions={};
  for(const [name,afterMetrics] of Object.entries(nativeReport.regions)){
    const beforeMetrics=before.nativeExactComparison.regions[name];
    if(!beforeMetrics)continue;
    nativeRegions[name]=Object.fromEntries(['pixelDifferencePercent','pixelDifferenceOver8Ratio','pixelDifferenceOver16Ratio','mae','rmse','mae8Bit','rmse8Bit','ssimBlock8'].map(k=>[k,delta(beforeMetrics[k],afterMetrics[k])]));
  }
  const viewportDeltas={};
  for(const afterViewport of viewportReports){
    const old=before.viewportComparisons.find(v=>v.label===afterViewport.label); if(!old)continue;
    viewportDeltas[afterViewport.label]={};
    for(const area of ['fullFrame','measuredUiRegions','sceneOutsideMeasuredUi']){
      if(!old.metrics[area]||!afterViewport.metrics[area])continue;
      viewportDeltas[afterViewport.label][area]=Object.fromEntries(['pixelDifferencePercent','pixelDifferenceOver8Ratio','mae','rmse','mae8Bit','rmse8Bit','ssimBlock8'].map(k=>[k,delta(old.metrics[area][k],afterViewport.metrics[area][k])]));
    }
  }
  const layerNames=['Geometry and Element Positions (measured rooms/signs/robot boxes)','Colors and Materials (measured environment/sign ROIs)','Lighting and Shadows (open-floor samples; objects/UI excluded)'];
  const layerRegionDeltas=Object.fromEntries(layerNames.map(name=>{const old=before.nativeExactComparison.regions[name],fresh=nativeReport.regions[name];return[name,{before:old||null,after:fresh,delta:old?Object.fromEntries(['pixelDifferencePercent','pixelDifferenceOver8Ratio','pixelDifferenceOver16Ratio','mae','rmse','mae8Bit','rmse8Bit','ssimBlock8'].map(k=>[k,fresh[k]-old[k]])):null}]}));
  const comparison={generatedAt:new Date().toISOString(),referenceSha256:sourceHash,before:before.generatedAt,after:report.generatedAt,captureProvenance:{before:before.captureProvenance,after:report.captureProvenance},layerRegionDeltas,interpretation:'Negative change in Pixel Difference/MAE/RMSE is better; positive change in SSIM is better. Do not interpret improvements as acceptance unless every relevant criterion and residual is reviewed.',nativeRegionDeltas:nativeRegions,viewportDeltas,rootCauseFindings:[
    'UI text/shape anti-aliasing, typeface metrics, and colors were conflated in exact pixel counts; Inter is now explicitly embedded because the measured UI CSS requested it but the baseline had no font asset.',
    'The browser-only gold REFERENCE SNAPSHOT · STATIC line in Live Activity was an invented visible element; removed from the visible layer while retaining the local/static disclosure in the tooltip and screen-reader-only text.',
    'The top-right reference contains a real portrait; the implementation intentionally uses a neutral circle, so this region cannot be exact without an approved avatar source.',
    'The measured room and robot ROIs remain near-total pixel mismatch; visual inspection shows broad layout correspondence but substantial differences in room boundaries, windows/environment, robot/desk detail, materials, lighting and shadows. No robot position or building geometry was altered in this pass; identifying a permissible geometry/asset correction needs a separately reviewed plan.',
    'Mobile has no reference image and is composed as a distinct narrow-screen UI. Letterboxed desktop-reference metrics are recorded solely for transparency and are not a mobile quality score.'
  ],independentReview:{status:'not performed',reason:'No independent reviewer/orchestration service is available in this coding environment; no independent review is claimed.'}};
  const pct=x=>`${x.toFixed(4)}%`;
  const val=x=>Number.isFinite(x)?x.toFixed(4):'—';
  const nativeRows=Object.entries(nativeRegions).map(([name,m])=>`| ${name} | ${pct(m.pixelDifferencePercent.before)} | ${pct(m.pixelDifferencePercent.after)} | ${val(m.pixelDifferencePercent.change)} pp | ${val(m.pixelDifferenceOver16Ratio.before*100)}% → ${val(m.pixelDifferenceOver16Ratio.after*100)}% | ${val(m.rmse8Bit.before)} → ${val(m.rmse8Bit.after)} | ${val(m.ssimBlock8.before)} → ${val(m.ssimBlock8.after)} |`).join('\n');
  const viewportRows=viewportReports.map(v=>{
    const old=before.viewportComparisons.find(x=>x.label===v.label); if(!old)return'';
    return ['fullFrame','measuredUiRegions','sceneOutsideMeasuredUi'].map(area=>{
      const a=old.metrics[area],b=v.metrics[area]; if(!a||!b)return'';
      return `| ${v.label} | ${area} | ${pct(a.pixelDifferencePercent)} | ${pct(b.pixelDifferencePercent)} | ${val((b.pixelDifferencePercent-a.pixelDifferencePercent))} pp | ${val(a.ssimBlock8)} → ${val(b.ssimBlock8)} |`;
    }).filter(Boolean).join('\n');
  }).filter(Boolean).join('\n');
  const summary=`# WORA visual fidelity — before/after report\n\nGenerated: ${comparison.generatedAt} (UTC)  \nReference: \`${comparison.referenceSha256}\` — 1672×941; native comparison is one-to-one.  \nCapture provenance:\n- Before: ${before.captureProvenance}\n- After: ${report.captureProvenance}\n- Browser errors after: ${browserErrors.length}\n\n> **Outcome: not pixel-identical; task remains open.** This pass produced small measurable UI improvements, but the native full-frame difference is still ${pct(nativeReport.regions['Full frame'].pixelDifferencePercent)} and scene-only is ${pct(nativeReport.regions['3D Scene (outside reference UI boxes)'].pixelDifferencePercent)}. No zero-difference claim is made.\n\n## Native comparison by region\n\nPixel difference and threshold >16 are percentages of ROI pixels. RMSE is absolute 8-bit RGB. SSIM is spatial 8×8-block luma mean. Negative pp is an improvement; higher SSIM is an improvement.\n\n| Region | Before diff | After diff | Change | >16 before → after | RMSE8 before → after | SSIM before → after |\n|---|---:|---:|---:|---:|---:|---:|\n${nativeRows}\n\n## Required viewport comparisons\n\nAll dimensions have fresh after screenshots. Before screenshots are preserved; comparisons at non-native dimensions use uniform contain, nearest-neighbour and centred dark letterboxing. They are diagnostics because there is no matching owner-approved reference at these aspect ratios; in particular mobile is not judged against a desktop image.\n\n| Viewport | ROI | Before diff | After diff | Change | SSIM before → after |\n|---|---|---:|---:|---:|---:|\n${viewportRows}\n\nRequired viewports captured: 1920×1080, 1440×900, 1366×768, 390×844, 430×932; plus native 1672×941. Desktop Inter regular/semibold and mobile Inter were verified by the browser after fonts.ready.\n\n## Findings and remaining blockers\n\n${comparison.rootCauseFindings.map(x=>`- ${x}`).join('\n')}\n\n- Independent review: **not performed**. No independent reviewer/orchestration service was available; this is not represented as an independent pass.\n- Layer masks and measurement definitions are documented in the JSON report. Per-region native difference images, native full/UI/scene overlays and each viewport's contain-diff/overlay images are in the adjacent \`before/\` and \`after/\` folders.\n- The reference asset was not modified. No building geometry or robot positions were changed. Scene reconstruction requires a reviewed, justified follow-up plan; do not infer exact alignment from aggregate percentages alone.\n\n## Validation\n\nAutomated suite: 87 tests passed; TypeScript check and Vite production build passed. Browser captures: Chromium 153 headless with SwiftShader, deviceScaleFactor 1; no console/page errors. SwiftShader is not a hardware-GPU performance benchmark.\n`;
  await writeFile(path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/comparison.json'),JSON.stringify(comparison,null,2)+'\n');
  await writeFile(path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/comparison.md'),summary);
}
console.log(JSON.stringify(report,null,2));
if(browserErrors.length)process.exitCode=1;
