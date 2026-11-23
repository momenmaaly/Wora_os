import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import chromiumBinary, { inflate } from '@sparticuz/chromium';
import { chromium } from 'playwright-core';
import { PerspectiveCamera, Vector3 } from 'three';

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, '..');
const repoRoot = path.resolve(appRoot, '../..');
const out = path.join(repoRoot, 'docs/design/main-workspace/greybox/visual-fidelity/root-cause');
const referencePath = path.join(repoRoot, 'docs/design/main-workspace/reference/wora-main-workspace.png');
const measurementsPath = path.join(repoRoot, 'docs/design/main-workspace/analysis/data/measurements.json');
const baseURL = process.env.WORA_BASE_URL ?? 'http://127.0.0.1:5173';
const width = 1672, height = 941;
await mkdir(out, { recursive: true });
const referenceBytes = await readFile(referencePath);
const reference = PNG.sync.read(referenceBytes);
const measurements = JSON.parse(await readFile(measurementsPath, 'utf8'));
const architecturePath = path.join(repoRoot, 'docs/design/main-workspace/architecture/data/scene-architecture.json');
const architecture = JSON.parse(await readFile(architecturePath, 'utf8'));
if (reference.width !== width || reference.height !== height) throw new Error('Reference is not 1672×941.');
const chromiumBin = path.join(path.dirname(fileURLToPath(import.meta.resolve('@sparticuz/chromium'))), '..', 'bin');
await inflate(path.join(chromiumBin, 'al2023.tar.br'));
process.env.LD_LIBRARY_PATH = `/tmp/al2023/lib:${process.env.LD_LIBRARY_PATH ?? ''}`;
const browser = await chromium.launch({ executablePath: await chromiumBinary.executablePath(), headless: true, args: chromiumBinary.args });
let browserInfo;
let currentBytes;
let repeatBytes;
try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { throw e; });
  const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 60000 });
  if (!response?.ok()) throw new Error(`Application response: ${response?.status()}`);
  await page.waitForSelector('[data-testid="greybox-canvas"] canvas', { timeout: 30000 });
  await page.waitForFunction(() => window.__WORA_CAMERA__ && document.fonts.status === 'loaded', null, { timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  browserInfo = await page.evaluate(() => {
    const canvas = document.querySelector('[data-testid="greybox-canvas"] canvas');
      const rect = canvas.getBoundingClientRect();
      const uiRoot = document.querySelector('[data-testid="ui-shell"]');
      const uiRect = uiRoot?.getBoundingClientRect();
      const camera = window.__WORA_CAMERA__;
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    const attrs = gl?.getContextAttributes();
    const p = camera?.position, q = camera?.quaternion;
    let rendererInfo = null;
    try {
      const fiber = camera?.__r3f ?? canvas.__r3f;
      const state = fiber?.root?.getState?.() ?? fiber?.root?.store?.getState?.();
      const renderer = state?.gl;
      if (renderer) rendererInfo = { pixelRatio: renderer.getPixelRatio(), outputColorSpace: renderer.outputColorSpace, toneMapping: renderer.toneMapping, toneMappingExposure: renderer.toneMappingExposure, clearAlpha: renderer.getClearAlpha(), webglVersion: renderer.getContext().getParameter(renderer.getContext().VERSION) };
    } catch {}
    return {
      userAgent: navigator.userAgent,
      viewport: { innerWidth, innerHeight, outerWidth, outerHeight, devicePixelRatio, visualViewport: { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale, offsetLeft: visualViewport.offsetLeft, offsetTop: visualViewport.offsetTop } },
      document: { clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, backgroundColor: getComputedStyle(document.body).backgroundColor },
      uiShell: uiRect?{x:uiRect.x,y:uiRect.y,width:uiRect.width,height:uiRect.height,top:uiRect.top,left:uiRect.left,right:uiRect.right,bottom:uiRect.bottom}:null,
      canvas: { rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height, top: rect.top, left: rect.left, right: rect.right, bottom: rect.bottom }, cssWidth: getComputedStyle(canvas).width, cssHeight: getComputedStyle(canvas).height, bitmapWidth: canvas.width, bitmapHeight: canvas.height, drawingBufferWidth: gl?.drawingBufferWidth, drawingBufferHeight: gl?.drawingBufferHeight, drawingBufferColorSpace: gl?.drawingBufferColorSpace ?? null, contextAttributes: attrs ? { alpha: attrs.alpha, antialias: attrs.antialias, depth: attrs.depth, stencil: attrs.stencil, premultipliedAlpha: attrs.premultipliedAlpha, preserveDrawingBuffer: attrs.preserveDrawingBuffer } : null },
      camera: camera ? { type: camera.type, fov: camera.fov, aspect: camera.aspect, near: camera.near, far: camera.far, position: [p.x,p.y,p.z], quaternion: [q.x,q.y,q.z,q.w], rotation: [camera.rotation.x,camera.rotation.y,camera.rotation.z], zoom: camera.zoom, matrixWorld: camera.matrixWorld.toArray(), matrixWorldInverse: camera.matrixWorldInverse.toArray(), projectionMatrix: camera.projectionMatrix.toArray() } : null,
      renderer: rendererInfo,
      fonts: { status: document.fonts.status, interRegular: document.fonts.check('400 16px Inter'), interSemibold: document.fonts.check('600 16px Inter') },
      selectedView: [...document.querySelectorAll('[role="button"][aria-pressed="true"]')].map(el=>el.textContent?.trim()).filter(Boolean),
      canvasPngDataUrl: canvas.toDataURL('image/png')
    };
  });
  currentBytes = await page.screenshot({ path: path.join(out, 'current-browser-screenshot.png'), fullPage: false, animations: 'disabled', timeout: 120000 });
  await page.waitForTimeout(750);
  repeatBytes = await page.screenshot({ path: path.join(out, 'repeat-browser-screenshot.png'), fullPage: false, animations: 'disabled', timeout: 120000 });
} finally {}
const canvasBytes = Buffer.from(browserInfo.canvasPngDataUrl.split(',')[1], 'base64');
delete browserInfo.canvasPngDataUrl;
await writeFile(path.join(out, 'current-webgl-canvas.png'), canvasBytes);
await writeFile(path.join(out, 'original-reference.png'), referenceBytes);
const canvasImage = PNG.sync.read(canvasBytes);
const current = PNG.sync.read(currentBytes);
const repeat = PNG.sync.read(repeatBytes);
for (const [name, image] of [['current', current], ['repeat', repeat]]) if (image.width !== width || image.height !== height) throw new Error(`${name} screenshot dimension mismatch: ${image.width}×${image.height}`);

function pngChunks(bytes) {
  const header={bitDepth:bytes[24],colorType:bytes[25],colorTypeName:({0:'grayscale',2:'RGB',3:'indexed',4:'grayscale+alpha',6:'RGBA'})[bytes[25]]??'unknown'};
  const chunks=[]; let offset=8;
  while(offset+12<=bytes.length){const n=bytes.readUInt32BE(offset), type=bytes.toString('ascii',offset+4,offset+8);chunks.push({type,length:n});offset+=12+n;if(type==='IEND')break;}
  return {header,chunks,colorProfileChunks:chunks.filter(c=>['sRGB','gAMA','iCCP','cHRM'].includes(c.type)).map(c=>c.type)};
}
function countAlpha(img){let transparent=0, nonOpaque=0;for(let p=0;p<img.width*img.height;p++){const a=img.data[p*4+3];if(a!==255)nonOpaque++;if(a===0)transparent++;}return {nonOpaquePixels:nonOpaque,fullyTransparentPixels:transparent};}
function compare(a,b,mask=null){
  let n=0,exact=0,channelEqual=0,channelDifferent=0,channelAbs=0,channelSq=0,above={1:0,8:0,16:0,32:0};
  let lumaAbove={1:0,8:0,16:0,32:0},euclideanAbove={1:0,8:0,16:0,32:0};
  for(let p=0;p<a.width*a.height;p++) if(!mask||mask[p]){
    n++;const i=p*4;let mx=0,sumSq=0,l1=0,l2=0;
    for(let c=0;c<3;c++){const d=Math.abs(a.data[i+c]-b.data[i+c]);mx=Math.max(mx,d);sumSq+=d*d;channelAbs+=d;channelSq+=d*d;if(d===0)channelEqual++;else channelDifferent++;}
    if(mx===0)exact++;
    for(const t of [1,8,16,32])if(mx>=t)above[t]++;
    const ya=.2126*a.data[i]+.7152*a.data[i+1]+.0722*a.data[i+2],yb=.2126*b.data[i]+.7152*b.data[i+1]+.0722*b.data[i+2];
    const ld=Math.abs(ya-yb), eu=Math.sqrt(sumSq);
    for(const t of [1,8,16,32]){if(ld>=t)lumaAbove[t]++;if(eu>=t)euclideanAbove[t]++;}
  }
  return {pixelsCompared:n,pixelsExactlyIdentical:exact,pixelsWithAnyRgbDifference:n-exact,exactPixelMatchPercent:n?100*exact/n:100,changedPixelPercent:n?100*(n-exact)/n:0,channelsCompared:n*3,channelsExactlyIdentical:channelEqual,channelsDifferent:channelDifferent,sumAbsoluteRgbChannelDifference:channelAbs,sumSquaredRgbChannelDifference:channelSq,meanAbsoluteErrorRgb8Bit:n?channelAbs/(n*3):0,rootMeanSquareErrorRgb8Bit:n?Math.sqrt(channelSq/(n*3)):0,thresholds:{maxChannelAbsoluteDifference:Object.fromEntries(Object.entries(above).map(([k,v])=>[`gte${k}`,{pixels:v,percent:n?100*v/n:0}])),linearLumaDifference:Object.fromEntries(Object.entries(lumaAbove).map(([k,v])=>[`gte${k}`,{pixels:v,percent:n?100*v/n:0}])),rgbEuclideanDistance:Object.fromEntries(Object.entries(euclideanAbove).map(([k,v])=>[`gte${k}`,{pixels:v,percent:n?100*v/n:0}]))}};
}
const whole=new Uint8Array(width*height).fill(1);
const diff=new PNG({width,height}), overlay=new PNG({width,height}), side=new PNG({width:width*2,height});
for(let p=0;p<width*height;p++){
  const i=p*4, si=p*4, di=p*4;
  for(let c=0;c<3;c++){
    const x=reference.data[i+c],y=current.data[i+c];diff.data[di+c]=Math.abs(x-y);overlay.data[di+c]=Math.round((x+y)/2);side.data.set([x,y],(Math.floor(p/width)*width*2+(p%width))*4+c); side.data[(Math.floor(p/width)*width*2+(p%width)+width)*4+c]=y;
  }
  diff.data[di+3]=255;overlay.data[di+3]=255;
}
// Rebuild the two-tile exact-size side-by-side image cleanly; each tile is copied without scale/crop.
for(let y=0;y<height;y++)for(let x=0;x<width;x++)for(let c=0;c<4;c++){side.data[(y*side.width+x)*4+c]=reference.data[(y*width+x)*4+c];side.data[(y*side.width+x+width)*4+c]=current.data[(y*width+x)*4+c];}
await writeFile(path.join(out,'absolute-difference.png'),PNG.sync.write(diff));
await writeFile(path.join(out,'50-percent-opacity-overlay.png'),PNG.sync.write(overlay));
await writeFile(path.join(out,'original-and-current-side-by-side.png'),PNG.sync.write(side));
const contrast=new PNG({width,height});for(let i=0;i<diff.data.length;i+=4){for(let c=0;c<3;c++)contrast.data[i+c]=Math.min(255,diff.data[i+c]*4);contrast.data[i+3]=255;}await writeFile(path.join(out,'absolute-difference-contrast-x4.png'),PNG.sync.write(contrast));

const rect = e => ({id:e.id,name:e.name,x:e.x,y:e.y,w:e.w,h:e.h,confidence:e.conf??null,note:e.note??null,normalizedCenter:e.nx!==undefined?{x:e.nx,y:e.ny}:null});
const elements=measurements.elements;
const byIds=ids=>ids.map(id=>elements.find(e=>e.id===id)).filter(Boolean).map(rect);
const uiIds=['REG-01','REG-02','REG-04','REG-05','REG-07','REG-08'];
const definitions=[
  {name:'UI Shell',color:'#ff3b30',rects:byIds(uiIds)},
  {name:'Live Activity',color:'#ffcc00',rects:byIds(['REG-06'])},
  {name:'Robots',color:'#ff40a6',rects:measurements.robots.map(r=>({id:r.id,name:`${r.id} ${r.zone}`,x:r.x,y:r.y,w:r.w,h:r.h,confidence:r.conf,note:r.near,normalizedCenter:r.nhx!==undefined?{x:r.nhx,y:r.nhy}:null}))},
  {name:'Building Geometry',color:'#50e3c2',rects:elements.filter(e=>['ENV-014','ENV-015','ENV-016'].includes(e.id)).map(rect)},
  {name:'Department Interiors',color:'#4188ff',rects:elements.filter(e=>e.group==='Departments'&&e.id.startsWith('DEPT-')).map(rect)},
  {name:'Lighting and Environment',color:'#d878ff',rects:elements.filter(e=>e.group==='3D environment'&&(/^ENV-0(0[1-9]|1[0-3])$/.test(e.id)||e.id==='ENV-017')).map(rect)},
];
function makeRawMask(rects){const m=new Uint8Array(width*height);for(const r of rects){const x0=Math.max(0,Math.floor(r.x)),y0=Math.max(0,Math.floor(r.y)),x1=Math.min(width,Math.ceil(r.x+r.w)),y1=Math.min(height,Math.ceil(r.y+r.h));for(let y=y0;y<y1;y++)m.fill(1,y*width+x0,y*width+x1);}return m;}
const assigned=new Uint8Array(width*height), categoryMasks={}, rawMasks={};
for(let k=0;k<definitions.length;k++){
  const d=definitions[k], raw=makeRawMask(d.rects), exclusive=new Uint8Array(width*height);let eligible=0,overlapPixels=0;
  for(let p=0;p<raw.length;p++)if(raw[p]){eligible++;if(assigned[p])overlapPixels++;else{exclusive[p]=1;assigned[p]=k+1;}}
  categoryMasks[d.name]=exclusive;rawMasks[d.name]=raw;d.rawRectanglePixelUnion=eligible;d.exclusivePixelCount=exclusive.reduce((s,x)=>s+x,0);d.rawMaskOverlapWithEarlierCategories=overlapPixels;d.rectangles=d.rects;delete d.rects;
}
const scenePixels=whole.reduce((s,x,p)=>s+((categoryMasks['UI Shell'][p]||categoryMasks['Live Activity'][p])?0:1),0);
let covered=0;for(let p=0;p<assigned.length;p++)if(assigned[p]&&assigned[p]!==1&&assigned[p]!==2)covered++;
let pairwiseExclusiveOverlap=0;for(let p=0;p<assigned.length;p++){let count=0;for(const m of Object.values(categoryMasks))count+=m[p];if(count>1)pairwiseExclusiveOverlap++;}
const regionResults={};
function writeRegionDiff(mask,name){const masked=new PNG({width,height});for(let p=0;p<width*height;p++)if(mask[p]){const i=p*4;for(let c=0;c<3;c++)masked.data[i+c]=Math.abs(reference.data[i+c]-current.data[i+c]);masked.data[i+3]=255;}return writeFile(path.join(out,`region-difference-${name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}.png`),PNG.sync.write(masked));}
for(const d of definitions){const mask=categoryMasks[d.name], r=compare(reference,current,mask);regionResults[d.name]={...r,rectangles:d.rectangles,rawRectanglePixelUnion:d.rawRectanglePixelUnion,rawMaskOverlapWithEarlierCategories:d.rawMaskOverlapWithEarlierCategories,exclusivePixelCount:d.exclusivePixelCount};await writeRegionDiff(mask,d.name);}
const uiTotalMask=new Uint8Array(width*height),uncategorizedMask=new Uint8Array(width*height);
for(let p=0;p<width*height;p++){uiTotalMask[p]=categoryMasks['UI Shell'][p]||categoryMasks['Live Activity'][p]?1:0;if(!assigned[p]&&!categoryMasks['UI Shell'][p]&&!categoryMasks['Live Activity'][p])uncategorizedMask[p]=1;}
regionResults['UI Shell + Live Activity (combined)']=compare(reference,current,uiTotalMask);
regionResults['Uncategorized Scene (unmapped remainder)']=compare(reference,current,uncategorizedMask);
await writeRegionDiff(uiTotalMask,'UI Shell + Live Activity (combined)');
await writeRegionDiff(uncategorizedMask,'Uncategorized Scene');
const outsideUiMask=new Uint8Array(width*height);for(let p=0;p<outsideUiMask.length;p++)outsideUiMask[p]=uiTotalMask[p]?0:1;
const previousLayersDirectory=path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/after');
const previousUiLayer=PNG.sync.read(await readFile(path.join(previousLayersDirectory,'reference-native-1672x941-ui-only.png')));
const previousSceneLayer=PNG.sync.read(await readFile(path.join(previousLayersDirectory,'reference-native-1672x941-scene-only.png')));
const layerIsolationAudit={uiOnlyLayerAgainstReference:compare(reference,previousUiLayer,uiTotalMask),finalCompositeAgainstReferenceSameUiRoi:compare(reference,current,uiTotalMask),fullCompositeVsUiOnlyLayer:compare(current,previousUiLayer,uiTotalMask),sceneOnlyLayerAgainstReference:compare(reference,previousSceneLayer,outsideUiMask),finalCompositeAgainstReferenceSameSceneRoi:compare(reference,current,outsideUiMask),fullCompositeVsSceneOnlyLayer:compare(current,previousSceneLayer,outsideUiMask)};
const fullAbsoluteError=compare(reference,current).sumAbsoluteRgbChannelDifference;
const errorRanking=Object.entries(regionResults).filter(([name])=>!name.startsWith('Uncategorized')&&!name.startsWith('UI Shell +')).map(([name,m])=>({name,sumAbsoluteRgbChannelDifference:m.sumAbsoluteRgbChannelDifference,shareOfFullFrameAbsoluteRgbErrorPercent:fullAbsoluteError?100*m.sumAbsoluteRgbChannelDifference/fullAbsoluteError:0,pixels:m.pixelsCompared,meanAbsoluteErrorRgb8Bit:m.meanAbsoluteErrorRgb8Bit})).sort((a,b)=>b.sumAbsoluteRgbChannelDifference-a.sumAbsoluteRgbChannelDifference);
const outOfBoundsRects=definitions.flatMap(d=>d.rectangles.filter(r=>r.x<0||r.y<0||r.w<0||r.h<0||r.x+r.w>width||r.y+r.h>height).map(r=>({category:d.name,...r})));

function boxSvg(imgBytes,label){const image64=imgBytes.toString('base64');let shapes='';for(const d of definitions)for(const r of d.rectangles){const stroke=d.color, rw=Math.max(r.w,0),rh=Math.max(r.h,0);shapes+=`<rect x="${r.x+.5}" y="${r.y+.5}" width="${Math.max(0,rw-1)}" height="${Math.max(0,rh-1)}" fill="none" stroke="${stroke}" stroke-width="1.2"/>`;if(d.name==='Robots')shapes+=`<text x="${r.x+1}" y="${r.y+8}" font-family="monospace" font-size="7" fill="${stroke}" stroke="#111" stroke-width="1.8" paint-order="stroke">${r.id.replace('ROBOT-','')}</text>`;}
  const legend=definitions.map((d,i)=>`<g transform="translate(8 ${18+i*16})"><rect width="10" height="10" fill="${d.color}"/><text x="15" y="9" fill="white" font-family="sans-serif" font-size="11" stroke="#111" stroke-width="2" paint-order="stroke">${d.name}</text></g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><image href="data:image/png;base64,${image64}" width="${width}" height="${height}"/><g opacity=".92">${shapes}</g><g>${legend}<text x="8" y="${height-8}" fill="white" font-family="sans-serif" font-size="11" stroke="#111" stroke-width="2" paint-order="stroke">${label} · native 1672×941 · boxes use reference pixel coordinates</text></g></svg>`;
}
const overlayPage=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
for(const [label,bytes,name] of [['Original Reference',referenceBytes,'roi-boxes-original-reference.png'],['Current Browser Screenshot',currentBytes,'roi-boxes-current-screenshot.png']]){await overlayPage.setContent(boxSvg(bytes,label),{waitUntil:'load'});await overlayPage.screenshot({path:path.join(out,name),fullPage:false});}
await browser.close();

const repeatMetrics=compare(current,repeat);
const sourceAlpha=countAlpha(reference),currentAlpha=countAlpha(current),webglCanvasAlpha=countAlpha(canvasImage);
const leftTop={x:0,y:0},rightBottom={x:width,y:height};
const px=reference.data.length/4;
const cameraExpected=architecture.camera;
const cameraActual=browserInfo.camera;
const expectedThreeCamera=new PerspectiveCamera(cameraExpected.fov_vertical_deg,cameraExpected.aspect,cameraExpected.near,cameraExpected.far);
expectedThreeCamera.position.fromArray(cameraExpected.position);
expectedThreeCamera.up.fromArray(cameraExpected.up);
expectedThreeCamera.lookAt(new Vector3(...cameraExpected.target));
expectedThreeCamera.updateProjectionMatrix();expectedThreeCamera.updateMatrixWorld(true);
const expectedQuaternion=expectedThreeCamera.quaternion.toArray();
const quaternionDelta=cameraActual?Math.max(...cameraActual.quaternion.map((v,i)=>Math.abs(v-expectedQuaternion[i]))):Infinity;
const cameraFields={position:{actual:cameraActual?.position,expected:cameraExpected.position},orientationQuaternion:{actual:cameraActual?.quaternion,expected:expectedQuaternion,absoluteDelta:quaternionDelta},verticalFov:{actual:cameraActual?.fov,expected:cameraExpected.fov_vertical_deg},aspect:{actual:cameraActual?.aspect,expected:cameraExpected.aspect},near:{actual:cameraActual?.near,expected:cameraExpected.near},far:{actual:cameraActual?.far,expected:cameraExpected.far},zoom:{actual:cameraActual?.zoom,expected:1}};
const cameraChecks=Object.fromEntries(Object.entries(cameraFields).map(([k,v])=>[k,{...v,absoluteDelta:Array.isArray(v.actual)?Math.max(...v.actual.map((x,i)=>Math.abs(x-v.expected[i]))):Math.abs(v.actual-v.expected),within1e6:Array.isArray(v.actual)?Math.max(...v.actual.map((x,i)=>Math.abs(x-v.expected[i])))<1e-6:Math.abs(v.actual-v.expected)<1e-6}]));
const {createHash}=await import('node:crypto');
const previousFullBytes=await readFile(path.join(repoRoot,'docs/design/main-workspace/greybox/visual-fidelity/after/reference-native-1672x941-full.png'));
const currentSha=createHash('sha256').update(currentBytes).digest('hex');
const previousFullSha=createHash('sha256').update(previousFullBytes).digest('hex');
const forensic={generatedAt:new Date().toISOString(),reference:{path:path.relative(repoRoot,referencePath),sha256:createHash('sha256').update(referenceBytes).digest('hex'),width:reference.width,height:reference.height,pngChunks:pngChunks(referenceBytes),alpha:sourceAlpha},currentCapture:{path:path.relative(repoRoot,path.join(out,'current-browser-screenshot.png')),sha256:currentSha,byteIdenticalToPreviousAfterCapture:currentSha===previousFullSha,previousAfterCaptureSha256:previousFullSha,width:current.width,height:current.height,pngChunks:pngChunks(currentBytes),alpha:currentAlpha,webglCanvas:{path:path.relative(repoRoot,path.join(out,'current-webgl-canvas.png')),width:canvasImage.width,height:canvasImage.height,alpha:webglCanvasAlpha,pngChunks:pngChunks(canvasBytes)},browserInfo},alignment:{exactNativeDimensions:true,referenceExtent:{leftTop,rightBottom},currentExtent:{leftTop,rightBottom},resize:'none',crop:'none',deviceScaleFactor:browserInfo.viewport.devicePixelRatio,viewport:[browserInfo.viewport.innerWidth,browserInfo.viewport.innerHeight],cssCanvasRect:browserInfo.canvas.rect,canvasBitmap:[browserInfo.canvas.bitmapWidth,browserInfo.canvas.bitmapHeight],drawingBuffer:[browserInfo.canvas.drawingBufferWidth,browserInfo.canvas.drawingBufferHeight],uiShellCssRect:browserInfo.uiShell,cameraPose:browserInfo.camera?{position:browserInfo.camera.position,rotation:browserInfo.camera.rotation,quaternion:browserInfo.camera.quaternion,zoom:browserInfo.camera.zoom,fov:browserInfo.camera.fov,aspect:browserInfo.camera.aspect,near:browserInfo.camera.near,far:browserInfo.camera.far,matrixWorld:browserInfo.camera.matrixWorld,projectionMatrix:browserInfo.camera.projectionMatrix}:null,cameraConfigurationCheck:{source:path.relative(repoRoot,architecturePath),expected:cameraExpected,fieldChecks:cameraChecks,approvedCameraMatches:cameraChecks.position.within1e6&&cameraChecks.orientationQuaternion.within1e6&&cameraChecks.verticalFov.within1e6&&cameraChecks.aspect.within1e6&&cameraChecks.near.within1e6&&cameraChecks.far.within1e6&&cameraChecks.zoom.within1e6}},fullFrameMetrics:compare(reference,current),repeatCaptureStability:repeatMetrics,regionMaskAudit:{coordinateSource:path.relative(repoRoot,measurementsPath),coordinateSystem:measurements.coordinate_system,rawBoxes:definitions.map(d=>({name:d.name,color:d.color,rectangles:d.rectangles,rawRectanglePixelUnion:d.rawRectanglePixelUnion,rawMaskOverlapWithEarlierCategories:d.rawMaskOverlapWithEarlierCategories,exclusivePixelCount:d.exclusivePixelCount})),exclusivePartition:true,pairwiseExclusiveOverlapPixels:pairwiseExclusiveOverlap,rawBoxesOutsideCanvas:outOfBoundsRects,scenePixelsOutsideUI:scenePixels,categorizedNonUIPixels:covered,uncategorizedNonUIPixels:scenePixels-covered,uncategorizedPercentOfScene:scenePixels?100*(scenePixels-covered)/scenePixels:0,rawMaskOverlapsAreAssignedByPrecedenceNotDiscarded:true,priorityOrder:definitions.map(d=>d.name),exclusiveRegionErrorRanking:errorRanking,layerIsolationAudit,regions:regionResults},colorAndAlpha:{referenceAlpha:sourceAlpha,currentAlpha,webglCanvasAlpha,currentAndReferenceAreOpaque:sourceAlpha.nonOpaquePixels===0&&currentAlpha.nonOpaquePixels===0,referencePngColorProfileChunks:pngChunks(referenceBytes).colorProfileChunks,currentScreenshotColorProfileChunks:pngChunks(currentBytes).colorProfileChunks,renderer:browserInfo.renderer,rendererConfigurationEvidence:{runtimeRendererProbeAvailable:browserInfo.renderer!==null,outputColorSpace:'SRGBColorSpace inferred from the R3F default branch when gl.outputColorSpace is unspecified; Canvas does not override it',toneMapping:'ACESFilmicToneMapping inferred from the R3F default branch because WorkspaceCanvas flat defaults false and Canvas has no toneMapping override',sourceFiles:['apps/workspace/src/scene/WorkspaceCanvas.tsx','apps/workspace/node_modules/@react-three/fiber/dist/events-e51d7528.esm.js','apps/workspace/node_modules/three/src/renderers/WebGLRenderer.js']},webglContext:browserInfo.canvas.contextAttributes,drawingBufferColorSpace:browserInfo.canvas.drawingBufferColorSpace,workingValues:'Stored PNG RGB byte values compared directly, without resizing, crop, or color conversion. The original and screenshot contain no standard sRGB/gAMA/iCCP/cHRM profile chunk; the reference has a private caBX ancillary chunk. Thus these are encoded-byte comparisons, not proof of a shared source color profile. Both full-frame PNGs are fully opaque, so screenshot-level alpha compositing is not causing transparent-pixel mismatches. The 50% overlay is an arithmetic mean in encoded RGB byte space.'},files:['original-reference.png','current-browser-screenshot.png','original-and-current-side-by-side.png','50-percent-opacity-overlay.png','absolute-difference.png','absolute-difference-contrast-x4.png','current-webgl-canvas.png','roi-boxes-original-reference.png','roi-boxes-current-screenshot.png','region-difference-ui-shell.png','region-difference-live-activity.png','region-difference-robots.png','region-difference-building-geometry.png','region-difference-department-interiors.png','region-difference-lighting-and-environment.png']};
await writeFile(path.join(out,'investigation.json'),JSON.stringify(forensic,null,2)+'\n');
console.log(JSON.stringify({out:path.relative(repoRoot,out),pixels:px,fullFrame:forensic.fullFrameMetrics,repeatCaptureStability:repeatMetrics,alignment:forensic.alignment,regionMetrics:Object.fromEntries(Object.entries(regionResults).map(([k,v])=>[k,{pixelsCompared:v.pixelsCompared,exact:v.pixelsExactlyIdentical,different:v.pixelsWithAnyRgbDifference,changedPercent:v.changedPixelPercent,mae8:v.meanAbsoluteErrorRgb8Bit,overlap:v.rawMaskOverlapWithEarlierCategories}])),maskOverlap:pairwiseExclusiveOverlap,uncategorizedScene:forensic.regionMaskAudit.uncategorizedNonUIPixels,renderer:browserInfo.renderer,context:browserInfo.canvas.contextAttributes},null,2));
