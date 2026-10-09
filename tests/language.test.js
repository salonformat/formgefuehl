import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { JSDOM } from 'jsdom';
import * as i18n from '../src/i18n.js';
import * as pattern from '../src/pattern.js';
import { french } from '../src/fr.js';

test('French covers the full source dictionary and generated cell labels',()=>{
  assert.deepEqual(i18n.untranslatedFrenchKeys(),[]);
  i18n.setLanguage('fr');
  assert.equal(i18n.t('Das Muster betreten'),'Entrer dans la pièce');
  assert.match(i18n.cellLabel(24,pattern.encodeCell(3,1)),/Ligne 5, colonne 5 : triangle, rouge/);
  assert.match(i18n.cellLabel(0,0),/vide/);
  i18n.setLanguage('de');
  assert.equal(i18n.t('Entrer dans la pièce'),'Das Muster betreten');
});

test('French journey, live content, export and browser back/forward preserve the motif',async()=>{
  const dom=new JSDOM('<html><head><meta name="description"></head><body><div id="app"></div></body></html>',{url:'https://form.salonformat.com/?lang=fr#anfang',runScripts:'outside-only',pretendToBeVisual:true});
  const {window}=dom;
  const previous={document:globalThis.document,NodeFilter:globalThis.NodeFilter};
  globalThis.document=window.document;globalThis.NodeFilter=window.NodeFilter;
  const renderedText=[];
  const ctx=new Proxy({fillText:text=>renderedText.push(text),createPattern:()=>({})},{get:(o,k)=>k in o?o[k]:()=>{}});
  window.HTMLCanvasElement.prototype.getContext=()=>ctx;
  window.HTMLCanvasElement.prototype.toBlob=fn=>fn({});
  window.HTMLAnchorElement.prototype.click=()=>{};
  window.URL.createObjectURL=()=> 'blob:test';window.URL.revokeObjectURL=()=>{};
  window.setTimeout=()=>0;
  window.scrollTo=()=>{};
  window.matchMedia=()=>({matches:true,addEventListener(){}});
  window.ResizeObserver=class {observe(){}};
  window.HTMLElement.prototype.animate=()=>({});
  window.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');};
  window.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  Object.defineProperty(window.document,'fonts',{value:{ready:Promise.resolve()}});
  Object.assign(window,pattern,i18n,{
    createMaterialSound:()=>({}),
    createScene:()=>({isFallback:false,setPhase(){},update(){},pulse(){},setReduced(){},setScale(){},setPointer(){}}),
  });
  const source=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8').replace(/^import .*;\n/gm,'').replaceAll('import.meta.env.BASE_URL',"'/'");
  const $=s=>window.document.querySelector(s);
  const click=async s=>{$(s).click();await Promise.resolve();};
  const traverse=direction=>new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('History did not navigate')),1500);
    window.addEventListener('popstate',()=>{clearTimeout(timer);resolve();},{once:true});
    window.history[direction]();
  });
  const state=(hash,lang)=>{assert.equal(window.location.hash,hash);assert.equal(window.document.documentElement.lang,lang);assert.equal(new URL(window.location.href).searchParams.get('lang'),lang);};
  const noGerman=()=>{
    const walker=window.document.createTreeWalker(window.document.body,window.NodeFilter.SHOW_TEXT);
    const leftovers=[];while(walker.nextNode()){const text=walker.currentNode.textContent.trim();if(french[text]&&french[text]!==text)leftovers.push(text);}
    assert.deepEqual(leftovers,[]);
  };
  try{
    vm.runInContext(source,dom.getInternalVMContext());
    assert.equal(window.document.title,'Le sens des formes — Salon Format');
    noGerman();
    await click('#start');state('#zeichen','fr');
    await click('#motif button[data-index="12"]');
    const motif=()=>[...$('#motif').children].map(b=>b.dataset.value).join(',');
    const drawn=motif();assert.equal($('#motif button[data-index="12"]').dataset.value,'1');
    await click('[data-lang="en"]');state('#zeichen','en');
    await traverse('back');state('#zeichen','fr');assert.equal(motif(),drawn);
    await click('#eraser');assert.match($('.tap-guide').textContent,/effacer/);
    await click('#motif button[data-index="12"]');assert.equal($('#motif button[data-index="12"]').dataset.value,'0');
    await click('#undo');assert.equal(motif(),drawn);
    await click('#enter');state('#raum','fr');
    await click('[data-material="textile"]');assert.match($('#material-copy').textContent,/plis du tissu/);
    await click('[data-material="metal"]');assert.match($('#material-copy').textContent,/accroche/);
    $('#scale').value='6';$('#scale').dispatchEvent(new window.Event('input',{bubbles:true}));await Promise.resolve();
    assert.equal($('#scale').getAttribute('aria-valuetext'),'Grand motif espacé');
    await click('#finish');state('#gedanke','fr');
    for(const name of ['rix','wieselthier','floegl'])await click(`[data-woman="${name}"]`);
    for(const b of window.document.querySelectorAll('[data-reflect]')){b.click();await Promise.resolve();}
    await click('#about');assert.equal($('#about-dialog').open,true);noGerman();
    await click('#close-about');
    await click('#download');await Promise.resolve();
    assert.ok(renderedText.includes('TA CRÉATION · SALON FORMAT'));
    assert.ok(renderedText.includes('Le sens des formes.'));
    await traverse('back');state('#raum','fr');
    await traverse('back');state('#zeichen','fr');assert.equal(motif(),drawn);
    await traverse('back');state('#anfang','fr');
    await traverse('forward');state('#zeichen','fr');assert.equal(motif(),drawn);
    await click('[data-lang="de"]');assert.equal($('#enter').textContent.trim(),'Das Muster betreten');
    await click('[data-lang="en"]');assert.equal($('#enter').textContent.trim(),'Step inside');
    await click('[data-lang="fr"]');noGerman();assert.equal($('#enter').textContent.trim(),'Entrer dans la pièce');
  }finally{dom.window.close();Object.assign(globalThis,previous);}
});
