import './style.css';
import { createMaterialSound } from './sound.js';
import { createScene } from './scene.js';
import { INITIAL, ACCENTS, PAPER, INK, createPattern, encodeCell, decodeCell, cellColor } from './pattern.js';
import { t, getLanguage, setLanguage, translateDOM, cellLabel } from './i18n.js';

const arrow = '<svg viewBox="0 0 32 20" aria-hidden="true"><path d="M1 10h28M21 2l8 8-8 8"/></svg>';
const shapePaths=['<rect x="4" y="4" width="16" height="16"/>','<circle cx="12" cy="12" r="8"/>','<path d="M20 4A16 16 0 0 1 4 20V12A8 8 0 0 0 12 4Z"/>','<path d="M4 4v16h16Z"/>'];
const app = document.querySelector('#app');
app.innerHTML = `
  <div id="world"></div>
  <header><div class="brand-links"><a class="brand" href="https://salonformat.com" aria-label="Salon Format – zur Website">salon<span>format</span></a><a class="all-projects" href="https://salonformat.com/#projects">Alle Projekte <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></div>
    <div class="header-actions"><button id="motion" aria-pressed="false" aria-label="Bewegung reduzieren">Bewegung reduzieren</button><button id="sound" aria-pressed="false">Ton aus<span class="sound-mark" aria-hidden="true"></span></button><div class="languages" role="group" aria-label="Language / Sprache"><button data-lang="de" lang="de" aria-label="Deutsch" aria-pressed="true">DE</button><button data-lang="en" lang="en" aria-label="English" aria-pressed="false">EN</button></div></div>
  </header>
  <main>
    <section id="intro" class="screen intro" aria-labelledby="title">
      <div class="intro-copy"><h1 id="title" aria-label="Formgefühl">Form<br><span>gefühl.</span></h1>
      <p class="lede">Wiener Werkstätte.<br>Kunst für den Alltag.</p>
      <p class="intro-context">In Wien entstand 1903 eine Gemeinschaft von Künstler:innen und Handwerker:innen. Sie gestalteten Möbel, Stoffe, Geschirr und ganze Räume. Die aufwendig gefertigten Stücke waren meist nur für Wohlhabende erschwinglich.</p>
      <button class="primary" id="start">Mein Muster gestalten ${arrow}</button>
      <p class="quiet">Vom ersten Kästchen bis zum ganzen Raum.</p></div>
      <button id="intro-art" class="intro-art" aria-label="Dieses Muster selbst gestalten"></button>
      <div class="intro-bottom"><p>Eine kleine Liebeserklärung<br>an die Wiener Werkstätte.</p><span>Eine Experience von<br>Salon Format.</span></div>
    </section>
    <section id="compose" class="screen compose" aria-labelledby="compose-title" hidden>
      <div class="workbench"><button class="back" id="back-intro">Zurück</button><h2 id="compose-title" tabindex="-1">Fange klein an.</h2>
      <p>Wähle Form und Farbe.<br>Tippe oder zeichne in die Kästchen.</p>
      <div class="shape-tools" role="group" aria-label="Form wählen"><button data-shape="0" aria-label="Quadrat" aria-pressed="true"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16"/></svg></button><button data-shape="1" aria-label="Kreis" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg></button><button data-shape="2" aria-label="Bogen" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4A16 16 0 0 1 20 20H12A8 8 0 0 0 4 12Z"/></svg></button><button data-shape="3" aria-label="Dreieck" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4v16h16Z"/></svg></button><button id="rotate" class="text-button">Drehen</button></div>
      <div class="motif-wrap"><span class="tap-hint" id="tap-hint">Hier tippen</span>
      <div id="motif" class="motif" role="group" aria-label="Dein Zeichen, 5 mal 5 Felder"></div>
      </div><p class="tap-guide">Dein Zeichen wiederholt sich im Muster.</p>
      <div class="editor-tools"><div class="swatches" role="group" aria-label="Farbe wählen">${[INK,...ACCENTS].map((a,i)=>`<button class="swatch" style="--swatch:${a}" data-color="${i}" aria-label="${['Tintenschwarz','Zinnoberrot','Messinggelb','Rauchblau'][i]}" aria-pressed="${i===0}"></button>`).join('')}</div><button class="text-button" id="eraser" aria-pressed="false">Radieren</button></div><div class="edit-actions"><button class="text-button" id="clear">Leeren</button><button class="text-button" id="undo" disabled>Rückgängig</button></div>
      <canvas id="mobile-repeat" width="930" height="240" aria-hidden="true"></canvas>
      <div class="compose-actions"><button class="primary" id="enter">Das Muster betreten ${arrow}</button>
      <p id="empty-hint" class="quiet" hidden>Setze zuerst mindestens ein Zeichen.</p></div></div>
      <div id="compose-preview" aria-hidden="true"></div>
      <aside class="compose-notes">      <p class="learning" id="repeat-learning">Ein Zeichen wird zum <em>Rapport</em> – der Einheit, die sich wiederholt. Aus solchen Wiederholungen entstehen zum Beispiel Stoff- und Tapetenmuster.</p>
      <p class="learning pattern-context">Hier spielst du mit Geometrie. Zur Wiener Werkstätte gehörten auch Blumenmuster, geschwungene Linien und verspielte Formen.</p><details class="workshop-story"><summary>Was war die Wiener Werkstätte?</summary><p>Eine Gemeinschaft von Gestalter:innen und Handwerker:innen in Wien. Josef Hoffmann, Koloman Moser und Fritz Waerndorfer gründeten sie 1903.</p><p>Sie entwarfen Möbel, Geschirr, Schmuck und Stoffe. Ihr Wunsch: Dinge des Alltags mit derselben Sorgfalt gestalten wie ein Kunstwerk.</p><p>Frauen prägten die Werkstätte entscheidend mit. Mathilde Flögl und Felice Rix-Ueno entwarfen unter anderem Stoffmuster; Vally Wieselthier wurde besonders für ihre Keramik bekannt.</p><p>Die Wiener Werkstätte bestand bis 1932. Klare geometrische Muster gehörten dazu – aber auch Blumen, geschwungene Linien und verspielte Formen.</p></details>
</aside>
      <p class="preview-caption">Dein Zeichen verändert das Ganze.</p>
    </section>
    <section id="room" class="screen room" aria-labelledby="room-title" hidden>
      <div id="room-view" class="room-view">
      <div class="room-heading"><button class="back" id="back-compose">Muster bearbeiten</button><h2 id="room-title" tabindex="-1">Dein Muster<br>wird zum Raum.</h2><p id="room-instruction">Bewege den Zeiger. Schau dich um.</p></div>
      </div>
      <div class="room-controls"><div class="material-options" role="group" aria-label="Material erleben"><button data-material="paper" aria-pressed="true">Papier</button><button data-material="textile" aria-pressed="false">Textil</button><button data-material="metal" aria-pressed="false">Metall</button></div>
      <p id="material-copy" class="material-copy">Ein Muster für Papier oder Tapete. Die Wiener Werkstätte gestaltete beides.</p>
      <label class="scale-control" for="scale">Maßstab <input id="scale" type="range" min="1" max="7" value="3" step="0.1" aria-valuetext="Mittleres Muster"><span>Klein ↔ groß</span></label>
      <button class="primary" id="finish">Was steckt dahinter? ${arrow}</button></div>
    </section>
    <section id="end" class="screen end" aria-labelledby="end-title" hidden>
      <div class="end-copy"><div class="end-story"><h2 id="end-title" tabindex="-1">Alles hängt<br>zusammen.</h2>
      <p class="end-lead">Vom Stoff bis zum Sessel.</p>
      <p>Die Wiener Werkstätte entwarf nicht nur einzelne Dinge, sondern auch ganze Einrichtungen. Möbel, Stoffe und Geschirr wurden dabei aufeinander abgestimmt.</p>
      <p>Auch das gehört zur Idee vom <em>Gesamtkunstwerk:</em> Kunst, Handwerk und Architektur werden gemeinsam gedacht.</p>
      <figure class="making-ink"><img src="${import.meta.env.BASE_URL}illustrations/handwerk-tusche.png" width="1536" height="1024" loading="lazy" alt="Freie Tuscheillustration: Hände zeichnen ein Muster, drapieren Stoff und formen Keramik."><figcaption>Eine freie Illustration zu Entwurf und Handwerk.</figcaption></figure>
      <details><summary>Die Geschichte dahinter</summary><p>1903 gründeten Josef Hoffmann, Koloman Moser und Fritz Waerndorfer die Wiener Werkstätte. Kunst und Handwerk sollten den Alltag prägen. Geometrie war eine ihrer Ausdrucksformen – neben vielen anderen.</p><p>Entwerfen bedeutete hier auch: über Material und Ausführung nachdenken. Dieselbe Idee kann als Druck, Gewebe oder Metallarbeit eine andere Wirkung entfalten. Genau das hast du gerade ausprobiert.</p><p>Dein Entwurf ist eine heutige, freie Interpretation. Er bildet kein historisches Muster und keinen historischen Raum nach.</p><a href="https://www.mak.at/ausstellung/wien1900" target="_blank" rel="noopener noreferrer">Weiterentdecken: Wien 1900 im MAK ${arrow}</a><a href="https://www.mak.at/artikel/sammlung_metall_und_wiener_werkstaette_archiv" target="_blank" rel="noopener noreferrer">Über das Wiener-Werkstätte-Archiv ${arrow}</a></details>
      </div><section class="women" aria-labelledby="women-title"><h3 id="women-title">Die Frauen dahinter.</h3><p>Viele Frauen gaben der Wiener Werkstätte ihre Vielfalt. Ihre Namen waren lange weniger bekannt. Drei davon solltest du kennenlernen.</p><figure class="designer-ink"><img loading="lazy" src="${import.meta.env.BASE_URL}illustrations/gestalterin-tusche.png" width="1536" height="1024" alt="Freie Tuscheillustration: eine Frau zeichnet ein Muster am Arbeitstisch."><figcaption>Eine freie Illustration, kein historisches Porträt.</figcaption></figure><div class="women-names" role="group" aria-label="Gestalterinnen entdecken"><button data-woman="floegl" aria-pressed="true">Mathilde Flögl</button><button data-woman="rix" aria-pressed="false">Felice Rix-Ueno</button><button data-woman="wieselthier" aria-pressed="false">Vally Wieselthier</button></div><p id="woman-copy" aria-live="polite">Mathilde Flögl gestaltete Stoffe, Tapeten, Keramik, Taschen und vieles mehr. Ihre Arbeit zeigt, wie offen die Grenzen zwischen den einzelnen Bereichen waren.</p><a href="https://www.mak.at/artikel/ausstellungsfuehrung_die_frauen_der_wiener_werkstaette" target="_blank" rel="noopener noreferrer">Mehr über die Frauen der Wiener Werkstätte ${arrow}</a></section>
      <div class="end-personal"><div class="reflection"><p>Was hat deinen Raum stärker verändert?</p><div><button data-reflect="scale">Der Maßstab</button><button data-reflect="material">Das Material</button></div><p id="reflection-answer" aria-live="polite"></p></div>
      <button class="primary" id="download">Dein Muster mitnehmen ${arrow}</button><button class="text-button restart" id="restart">Noch einmal spielen</button>

      <p class="love-note">Ich liebe die Wiener Werkstätte für ihre Muster, ihren Mut zur Farbe und die Sorgfalt, mit der selbst kleine Dinge gestaltet wurden. Diese Freude möchte ich mit dir teilen.<br><span>Salon Format</span></p>
      </div><p class="independent">Ein unabhängiges Projekt von Salon Format, entstanden ohne Zusammenarbeit mit einem Museum.</p></div>
    </section>
  </main>
  <footer><nav aria-label="Deine Reise"><span data-step="intro" aria-current="step">Anfang</span><span data-step="compose">Zeichen</span><span data-step="room">Raum</span><span data-step="end">Gedanke</span></nav><button id="about">Über diese Erfahrung</button></footer>
  <dialog id="about-dialog" aria-labelledby="about-title"><button id="close-about" class="text-button">Schließen</button><h2 id="about-title">Formgefühl.</h2><p>Eine kleine Liebeserklärung von Salon Format an die Wiener Werkstätte: an das genaue Hinsehen, an die Verbindung von Kunst und Handwerk, an die Sorgfalt selbst im kleinsten Detail.</p><p>Du gestaltest ein eigenes Zeichen, erkundest Wiederholung, Maßstab und Material – und erlebst die Idee des Gesamtkunstwerks.</p><p>Formgefühl ist ein unabhängiges Projekt von Salon Format, entstanden ohne Zusammenarbeit mit einem Museum. Alle Muster, Räume und Klänge wurden eigens dafür entwickelt.</p><a href="https://salonformat.com">Mehr von Salon Format</a><p class="quiet">Ohne Anmeldung. Ohne Tracking. Dein Entwurf bleibt während der Sitzung in deinem Browser.</p></dialog>
  <p class="sr-only" id="announcement" role="status" aria-live="polite"></p>
`;
const $ = s => document.querySelector(s);
let cells = [...INITIAL], accent = ACCENTS[0], phase = 'intro', material = 'paper', history = [], hasEdited = false;
let brushShape=0,brushColor=0,brushRotation=0,erasing=false,painting=false,lastPainted=-1;
const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
let reduced = motionQuery.matches;
const scene = createScene($('#world'), cells, accent, reduced);
function syncRoomView(){const mobileIntro=phase==='intro'&&matchMedia('(max-width:760px)').matches;const compose=phase==='compose'&&innerWidth>760;if(phase!=='room'&&!mobileIntro&&!compose)return;const r=$(compose?'#compose-preview':mobileIntro?'#intro-art':'#room-view').getBoundingClientRect();const world=$('#world'),prefix=compose?'compose':mobileIntro?'intro':'room';for(const key of ['top','left','width','height'])world.style.setProperty(`--${prefix}-${key}`,`${r[key]}px`);}
const viewObserver=new ResizeObserver(syncRoomView);viewObserver.observe($('#room-view'));viewObserver.observe($('#intro'));viewObserver.observe($('#intro-art'));viewObserver.observe($('#compose-preview'));
document.fonts.ready.then(syncRoomView);
window.addEventListener('scroll',syncRoomView,{passive:true});window.addEventListener('resize',syncRoomView);
if (scene.isFallback) $('#room-instruction').textContent = 'Dein Browser zeigt eine flächige Ansicht. Material und Maßstab kannst du trotzdem erkunden.';
else if (matchMedia('(pointer: coarse)').matches) $('#room-instruction').textContent = 'Ziehe über den Raum. Schau dich um.';
let audioContext, materialSound, sound = false;
function setSound(enabled) {
  if(enabled&&!audioContext){
    try{audioContext=new(window.AudioContext||window.webkitAudioContext)();materialSound=createMaterialSound(audioContext);}
    catch{$('#sound').textContent=t('Ton nicht verfügbar');$('#sound').disabled=true;return;}
  }
  sound=enabled;
  if(audioContext){materialSound.mute(!enabled);if(enabled){audioContext.resume().then(()=>{if(sound)materialSound.material(material);}).catch(()=>{sound=false;materialSound.mute(true);$('#sound').setAttribute('aria-pressed','false');$('#sound').firstChild.textContent=t('Ton aus');});}else materialSound.stop();}
  $('#sound').setAttribute('aria-pressed',String(sound));$('#sound').firstChild.textContent=t(sound?'Ton an':'Ton aus');
}
function announce(text) { $('#announcement').textContent=t(text); }
const routes={intro:'anfang',compose:'zeichen',room:'raum',end:'gedanke'};
function routeFromURL(){return Object.keys(routes).find(k=>routes[k]===location.hash.slice(1))||'intro';}
function writeURL(next,replace=false){const url=new URL(location.href);url.hash=routes[next];url.searchParams.set('lang',getLanguage());window.history[replace?'replaceState':'pushState']({phase:next},'',url);}
function setPhase(next, record=true) {
  if(record && next!==phase)writeURL(next);
  phase = next; document.body.dataset.phase=next;
  document.querySelectorAll('.screen').forEach(s => { s.hidden=s.id!==next; });
  document.querySelectorAll('[data-step]').forEach(s => s.setAttribute('aria-current',s.dataset.step===next?'step':'false'));
  scene.setPhase(next);
  window.scrollTo(0,0);
  syncRoomView();
  const heading = $(`#${next} h1, #${next} h2`); heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true});
  materialSound?.stop();if(sound&&next==='room')materialSound.unfold(material,reduced);
  translateDOM();
}
function renderGrid() {
  const grid=$('#motif');
  if (!grid.children.length) cells.forEach((_,i)=>{const b=document.createElement('button');b.dataset.index=i;b.addEventListener('click',e=>{if(e.detail===0){remember();edit(i);}});grid.append(b);});
  [...grid.children].forEach((b,i)=>{const v=decodeCell(cells[i]);b.dataset.value=cells[i];b.dataset.shape=v.shape;b.style.setProperty('--cell-color',cellColor(cells[i],accent));b.style.setProperty('--rotation',`${v.rotation*90}deg`);b.innerHTML=cells[i]?`<svg viewBox="0 0 24 24" aria-hidden="true">${shapePaths[v.shape]}</svg>`:'';b.setAttribute('aria-label',cellLabel(i,cells[i]));b.classList.toggle('try-me',!hasEdited&&i===12);});
  $('#tap-hint').hidden=hasEdited;
  const empty = !cells.some(Boolean); $('#enter').disabled=empty; $('#empty-hint').hidden=!empty; $('#undo').disabled=!history.length;
  scene.update(cells,accent,material);
  const strip=$('#mobile-repeat'),context=strip.getContext('2d');
  context.fillStyle=context.createPattern(createPattern(cells,accent,'paper',240),'repeat');
  context.fillRect(0,0,strip.width,strip.height);
}
function remember() { history.push([...cells]); if(history.length>50)history.shift(); }
function edit(i) { hasEdited=true;cells[i]=erasing?0:encodeCell(brushShape,brushColor,brushRotation);renderGrid();scene.pulse?.();if(!reduced){$('#motif').children[i].animate([{transform:'scale(.82)'},{transform:'scale(1.07)'},{transform:'scale(1)'}],{duration:230,easing:'ease-out'});$('#mobile-repeat').animate([{opacity:.65},{opacity:1}],{duration:200});}if(sound)materialSound.draw(i,erasing);announce('Dein Zeichen wiederholt sich im Muster.'); }
$('#motif').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-index]');if(!b)return;e.preventDefault();remember();painting=true;lastPainted=Number(b.dataset.index);b.focus({preventScroll:true});edit(lastPainted);});
window.addEventListener('pointermove',e=>{if(!painting)return;const b=document.elementFromPoint(e.clientX,e.clientY)?.closest('#motif [data-index]');if(b){const i=Number(b.dataset.index);if(i!==lastPainted){lastPainted=i;edit(i);}}});
window.addEventListener('pointerup',()=>painting=false);window.addEventListener('pointercancel',()=>painting=false);window.addEventListener('blur',()=>painting=false);
$('#motif').addEventListener('keydown',e=>{
  const i=Number(e.target.dataset.index); if(!Number.isInteger(i))return;
  const delta={ArrowRight:1,ArrowLeft:-1,ArrowDown:5,ArrowUp:-5}[e.key];
  if(delta){e.preventDefault();$('#motif').children[(i+delta+25)%25].focus();}
});
$('#clear').onclick=()=>{remember();cells=Array(25).fill(0);renderGrid();announce('Dein Zeichen ist leer.');};
$('#undo').onclick=()=>{if(history.length){cells=history.pop();renderGrid();}};
function disableEraser(){erasing=false;$('#eraser').setAttribute('aria-pressed','false');}
document.querySelectorAll('[data-color]').forEach(b=>b.onclick=()=>{brushColor=Number(b.dataset.color);disableEraser();document.querySelectorAll('[data-color]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
document.querySelectorAll('.shape-tools [data-shape]').forEach(b=>b.onclick=()=>{brushShape=Number(b.dataset.shape);disableEraser();document.querySelectorAll('.shape-tools [data-shape]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));});
document.querySelector('.shape-tools [data-shape="2"] svg').innerHTML=shapePaths[2];
$('#rotate').onclick=()=>{brushRotation=(brushRotation+1)%4;document.querySelectorAll('.shape-tools [data-shape] svg').forEach(s=>s.style.transform=`rotate(${brushRotation*90}deg)`);};
$('#eraser').onclick=()=>{erasing=!erasing;$('#eraser').setAttribute('aria-pressed',String(erasing));};
document.querySelectorAll('[data-material]').forEach(b=>b.onclick=()=>{
  material=b.dataset.material;scene.update(cells,accent,material);
  document.querySelectorAll('[data-material]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $('#material-copy').textContent={paper:'Ein Muster für Papier oder Tapete. Die Wiener Werkstätte gestaltete beides.',textile:'Jetzt liegt dein Muster in Falten. Stoffentwürfe von Frauen wie Felice Rix-Ueno und Mathilde Flögl prägten die Wiener Werkstätte.',metal:'Jetzt fällt Licht auf Metall. Auch Metallarbeiten gehörten zur Wiener Werkstätte, vom Schmuck bis zum Gebrauchsgegenstand.'}[material];
  announce($('#material-copy').textContent);if(sound){materialSound.stop();materialSound.material(material);}
});
$('#scale').oninput=e=>{const v=Number(e.target.value);scene.setScale(8-v);if(sound)materialSound.scale(material);e.target.setAttribute('aria-valuetext',v<3?'Kleines, dichtes Muster':v>5?'Großes, weites Muster':'Mittleres Muster');};
$('#scale').value='5';
document.querySelectorAll('[data-reflect]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-reflect]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $('#reflection-answer').textContent=b.dataset.reflect==='scale'?'Ein kleines Muster wird als Rhythmus wahrgenommen. Ein großes kann selbst zur Architektur werden. Du hast dieselbe Form anders erlebt.':'Papier, Gewebe, Metall: Das Material verändert Licht und Oberfläche. Eine Form hat deshalb nie nur eine einzige Wirkung.';
});
document.querySelectorAll('[data-woman]').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('[data-woman]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  $('#woman-copy').textContent=t({floegl:'Mathilde Flögl gestaltete Stoffe, Tapeten, Keramik, Taschen und vieles mehr. Ihre Arbeit zeigt, wie offen die Grenzen zwischen den einzelnen Bereichen waren.',rix:'Felice Rix-Ueno entwarf fantasievolle Muster für Stoffe und Tapeten. Ihre Arbeit erinnert daran: Zur Wiener Werkstätte gehören auch lebendige Farben und freie Formen.',wieselthier:'Vally Wieselthier machte aus Keramik ausdrucksstarke Figuren und Gefäße. An ihrer Arbeit sieht man, wie eng Form, Farbe und Material zusammenwirken.'}[b.dataset.woman]);
});
$('#start').onclick=()=>setPhase('compose'); $('#enter').onclick=()=>setPhase('room'); $('#finish').onclick=()=>setPhase('end');
$('#intro-art').onclick=()=>setPhase('compose');
$('#back-intro').onclick=()=>setPhase('intro'); $('#back-compose').onclick=()=>setPhase('compose');
$('#restart').onclick=()=>{history=[];cells=[...INITIAL];material='paper';document.querySelector('[data-material="paper"]').click();$('#reflection-answer').textContent='';document.querySelectorAll('[data-reflect]').forEach(b=>b.removeAttribute('aria-pressed'));scene.setScale(3);$('#scale').value=5;renderGrid();setPhase('compose');};
$('#sound').onclick=()=>setSound(!sound);
function setReduced(value) { reduced=value;scene.setReduced(value);document.body.classList.toggle('reduced-motion',value);$('#motion').setAttribute('aria-pressed',String(value));$('#motion').textContent=value?'Bewegung reduziert':'Bewegung reduzieren'; }
setReduced(reduced); $('#motion').onclick=()=>setReduced(!reduced); motionQuery.addEventListener('change',e=>setReduced(e.matches));
window.addEventListener('pointermove',e=>{if(phase==='room'&&!e.target.closest('button, input, .room-controls'))scene.setPointer((e.clientX/innerWidth-.5)*2,-(e.clientY/innerHeight-.5)*2);});
window.addEventListener('keydown',e=>{if(phase==='room'&& !e.target.matches('input,button')){const delta={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]}[e.key];if(delta){e.preventDefault();scene.setPointer(...delta);}}});
const about=$('#about-dialog'); $('#about').onclick=()=>about.showModal();$('#close-about').onclick=()=>about.close();
about.addEventListener('click',e=>{if(e.target===about){const r=about.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)about.close();}});
document.addEventListener('visibilitychange',()=>{if(audioContext)document.hidden?(materialSound.stop(),audioContext.suspend()):sound&&audioContext.resume();});
$('#download').onclick=async()=>{
  const button=$('#download');button.disabled=true;
  try {
    await document.fonts.ready;
    const canvas=document.createElement('canvas');canvas.width=1800;canvas.height=2400;
    const c=canvas.getContext('2d');c.fillStyle=PAPER;c.fillRect(0,0,1800,2400);
    c.fillStyle=INK;c.font='80px "Della Respira"';c.fillText(t('Formgefühl.'),130,190);
    c.font='25px sans-serif';c.fillText(t('DEIN ENTWURF · SALON FORMAT'),130,255);
    const tile=createPattern(cells,accent,'paper',300);c.save();c.translate(130,345);c.fillStyle=c.createPattern(tile,'repeat');c.fillRect(0,0,1540,1650);c.restore();
    c.strokeStyle=INK;c.lineWidth=2;c.strokeRect(130,345,1540,1650);
    c.font='43px "Della Respira"';c.fillText(t('Aus einem Zeichen wird eine Welt.'),130,2140);
    c.font='24px sans-serif';c.fillText(t('Eine freie Auseinandersetzung mit der Wiener Werkstätte.'),130,2205);c.fillText('salonformat.com',130,2270);
    canvas.toBlob(blob=>{if(!blob){button.disabled=false;announce('Das Bild konnte nicht gespeichert werden. Bitte versuche es erneut.');return;}const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='formgefuehl-salonformat.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);button.disabled=false;announce('Dein Muster ist als Druckdatei bereit.');},'image/png');
  } catch { button.disabled=false;announce('Das Bild konnte nicht gespeichert werden. Bitte versuche es erneut.'); }
};
function changeLanguage(lang,record=true){
  setLanguage(lang);translateDOM();
  document.querySelectorAll('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===getLanguage())));
  [...$('#motif').children].forEach((b,i)=>b.setAttribute('aria-label',cellLabel(i,cells[i])));
  if(record)writeURL(phase,true);
}
document.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>changeLanguage(b.dataset.lang));
app.addEventListener('click',()=>queueMicrotask(()=>translateDOM()));
app.addEventListener('input',()=>queueMicrotask(()=>translateDOM()));
window.addEventListener('popstate',()=>{about.close();changeLanguage(new URL(location.href).searchParams.get('lang')||getLanguage(),false);setPhase(routeFromURL(),false);});
setLanguage(new URL(location.href).searchParams.get('lang'));
renderGrid();changeLanguage(getLanguage(),false);setPhase(routeFromURL(),false);writeURL(phase,true);
