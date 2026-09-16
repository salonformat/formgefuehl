import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createPattern, PAPER, decodeCell } from './pattern.js';

export function createScene(container, cells, accent, reduced) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
  catch { return createFallback(container, cells, accent); }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.setClearColor(PAPER,0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .85;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, .1, 120);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new RoomEnvironment();
  const env = pmrem.fromScene(envScene);
  scene.environment = env.texture;
  envScene.dispose(); pmrem.dispose();
  scene.add(new THREE.AmbientLight('#fff5e7', .45));
  const light = new THREE.DirectionalLight('#fff7e6', 2.3); light.position.set(-5, 12, 10); scene.add(light);
  light.castShadow=true; light.shadow.mapSize.set(1024,1024); light.shadow.camera.left=-15;light.shadow.camera.right=15;light.shadow.camera.top=15;light.shadow.camera.bottom=-15;light.shadow.camera.far=70;light.shadow.bias=-.0005;
  const glow = new THREE.PointLight('#efb879', 90, 35); glow.position.set(0, 2, -17); scene.add(glow);
  const blue = new THREE.PointLight('#94b8b5', 65, 25); blue.position.set(-3, 2, -4); scene.add(blue);
  let texture, floorTexture, hangingTexture;
  const flatMaterial = new THREE.MeshStandardMaterial({ roughness: .92, side: THREE.DoubleSide });
  const wallMaterial = new THREE.MeshStandardMaterial({ roughness: .92, side: THREE.DoubleSide });
  const floorMaterial = new THREE.MeshStandardMaterial({ roughness: .5, side: THREE.DoubleSide });
  const brass = new THREE.MeshStandardMaterial({ color: '#b38b40', metalness: .7, roughness: .25 });
  const vermilion = new THREE.MeshStandardMaterial({ color: accent, roughness: .7 });
  const plaster = new THREE.MeshStandardMaterial({ color: '#48564c', roughness: 1, side: THREE.DoubleSide });
  const ceiling = new THREE.MeshStandardMaterial({ color: '#252820', roughness: .9, side: THREE.DoubleSide });
  const hangingMaterial = new THREE.MeshStandardMaterial({ roughness: .9, side: THREE.DoubleSide });
  const weaveCanvas=document.createElement('canvas');weaveCanvas.width=weaveCanvas.height=128;
  const weave=weaveCanvas.getContext('2d');weave.fillStyle='#777';weave.fillRect(0,0,128,128);
  for(let y=0;y<128;y+=8)for(let x=0;x<128;x+=8){const over=(x+y)%16===0;weave.fillStyle='#ccc';weave.fillRect(x+1,y+1,over?6:3,over?3:6);weave.fillStyle='#333';weave.fillRect(x+6,y+2,1,6);weave.fillRect(x+1,y+6,6,1);}
  const weaveTexture=new THREE.CanvasTexture(weaveCanvas);weaveTexture.wrapS=weaveTexture.wrapT=THREE.RepeatWrapping;weaveTexture.repeat.set(10,20);
  const board = new THREE.Group();
  const flat = new THREE.Mesh(new THREE.PlaneGeometry(6, 8), flatMaterial); board.add(flat);
  const border = new THREE.Mesh(new THREE.BoxGeometry(6.13, 8.13, .08), brass); border.position.z = -.055; board.add(border);
  scene.add(board);
  const room = new THREE.Group(); scene.add(room); room.visible = false;
  function panel(w, h, x, y, z, rx, ry, material = wallMaterial) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
    m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.receiveShadow=true; room.add(m); return m;
  }
  panel(14, 10, 0, 1, -32, 0, 0, vermilion);
  panel(46, 10, -7, 1, -9, 0, Math.PI / 2, plaster);
  panel(46, 10, 7, 1, -9, 0, -Math.PI / 2, plaster);
  panel(14, 46, 0, -4, -9, -Math.PI / 2, 0, floorMaterial);
  panel(14, 46, 0, 6, -9, Math.PI / 2, 0, ceiling);
  // Freestanding pattern screens: one design crossing from paper to cloth and metal.
  const screens = [];
  for (let i=0;i<6;i++) {
    const g = new THREE.PlaneGeometry(3.5, 7, 24, 40);
    g.userData.restPositions=new Float32Array(g.attributes.position.array);
    const mesh = new THREE.Mesh(g, hangingMaterial);
    mesh.position.set(i%2 ? 4.3 : -4.3, .5, -2 - Math.floor(i/2)*9);
    mesh.rotation.y = i%2 ? -.35 : .35;
    mesh.castShadow = mesh.receiveShadow = true;
    room.add(mesh); screens.push(mesh);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(3.8,.065,.065),brass);
    rail.position.copy(mesh.position);rail.position.y=4.1;rail.rotation.y=mesh.rotation.y;room.add(rail);
  }
  const frames = [];
  for (let i = 0; i < 8; i++) {
    const frame = new THREE.Group();
    const z = 10 - i * 5.7;
    for (const x of [-6.75, 6.75]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(.10, 10, .10), brass); bar.position.set(x, 0, z); frame.add(bar);
    }
    for (const y of [-3.95, 5.8]) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(13.5, .10, .10), brass); bar.position.set(0, y, z); frame.add(bar);
    }
    room.add(frame); frames.push(frame);
  }
  // The visitor's own 25-cell composition becomes a suspended relief at the far end.
  const relief = new THREE.Group(); relief.position.set(0, 1, -24); room.add(relief);
  const reliefCells = [];
  const reliefGeometries=[0,1,2,3].map(kind=>{
    const s=new THREE.Shape(),r=.36;
    if(kind===0){s.moveTo(-r,-r);s.lineTo(r,-r);s.lineTo(r,r);s.lineTo(-r,r);s.closePath();}
    if(kind===1)s.absarc(0,0,r,0,Math.PI*2,false);
    if(kind===2){s.moveTo(r,r);s.absarc(-r,r,2*r,0,-Math.PI/2,true);s.lineTo(-r,0);s.absarc(-r,r,r,-Math.PI/2,0,false);s.closePath();}
    if(kind===3){s.moveTo(-r,r);s.lineTo(-r,-r);s.lineTo(r,-r);s.closePath();}
    return new THREE.ExtrudeGeometry(s,{depth:.18,bevelEnabled:true,bevelSize:.012,bevelThickness:.012,bevelSegments:1,steps:1,curveSegments:24});
  });
  for (let i=0;i<25;i++) {
    const mesh=new THREE.Mesh(reliefGeometries[0],brass);
    mesh.position.set((i%5-2)*.94,(2-Math.floor(i/5))*.94,0);
    mesh.castShadow=true;relief.add(mesh);reliefCells.push(mesh);
  }
  for (let i=0;i<5;i++) {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,4.4,6), brass);
    rail.position.set((i-2)*.94,2.6,-.05);relief.add(rail);
  }
  // Concentric structural apertures draw the gaze toward the relief.
  for(let i=0;i<5;i++) {
    const z=-25-i*1.1, w=5.9+i*.9, h=6.2+i*.55;
    for(const x of [-w/2,w/2]){const m=new THREE.Mesh(new THREE.BoxGeometry(.12,h,.14),brass);m.position.set(x,1,z);room.add(m);}
    for(const y of [1-h/2,1+h/2]){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.12,.14),brass);m.position.set(0,y,z);room.add(m);}
  }
  let phase = 'intro', immersion = 0, target = 0, lastTime = 0, material = 'paper', scale = 3;
  let pointer = { x: 0, y: 0 }, smoothed = { x: 0, y: 0 };
  const look = new THREE.Vector3();
  function update(newCells, newAccent, nextMaterial = material) {
    cells = [...newCells]; accent = newAccent; material = nextMaterial;
    texture?.dispose(); floorTexture?.dispose(); hangingTexture?.dispose();
    texture = new THREE.CanvasTexture(createPattern(cells, accent, material));
    texture.colorSpace = THREE.SRGBColorSpace; texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(scale, scale); texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
    floorTexture = texture.clone();floorTexture.repeat.set(scale*1.3,scale*4.2);floorTexture.needsUpdate=true;
    hangingTexture = texture.clone();hangingTexture.repeat.set(Math.max(1,scale*.5),Math.max(1,scale));hangingTexture.needsUpdate=true;
    for (const mat of [flatMaterial, wallMaterial, hangingMaterial]) {
      mat.map = texture; mat.metalness = material === 'metal' ? .75 : 0;
      mat.roughness = material === 'metal' ? .24 : material === 'textile' ? 1 : .85;
      mat.needsUpdate = true;
    }
    hangingMaterial.map=hangingTexture;
    hangingMaterial.bumpMap=material==='textile'?weaveTexture:null;
    hangingMaterial.bumpScale=material==='textile'?.12:0;
    floorMaterial.map=floorTexture;floorMaterial.metalness=material==='metal'?.65:.1;floorMaterial.roughness=material==='metal'?.24:.65;floorMaterial.needsUpdate=true;
    vermilion.color.set(accent);
    reliefCells.forEach((m,i)=>{const v=decodeCell(cells[i]);m.visible=!!cells[i];m.material=v.color===1?vermilion:brass;m.geometry=reliefGeometries[v.shape];m.rotation.z=-v.rotation*Math.PI/2;});
  }
  update(cells, accent);
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize); ro.observe(container); resize();
  renderer.setAnimationLoop(time => {
    if (document.hidden) return;
    const dt = Math.min((time - lastTime) / 1000 || .016, .05); lastTime = time;
    immersion = THREE.MathUtils.damp(immersion, target, reduced ? 18 : 1.6, dt);
    smoothed.x = THREE.MathUtils.damp(smoothed.x, pointer.x, 3, dt);
    smoothed.y = THREE.MathUtils.damp(smoothed.y, pointer.y, 3, dt);
    const p = immersion;
    const mobile = camera.aspect < .8;
    const x = (phase === 'intro' || phase === 'end') ? (mobile ? -.2 : -3.2) : (mobile ? 0 : -2.8);
    camera.position.set(x * (1 - p) + smoothed.x * p * 1.1, .1 + smoothed.y * p * .4, (mobile ? 18 : 14) * (1 - p) + 8 * p);
    camera.fov=44+16*p;camera.updateProjectionMatrix();
    look.set(smoothed.x * p * 6, -.6*p + smoothed.y * p * 3.5, -24 * p);
    camera.lookAt(look);
    board.position.set((phase==='intro'?2.8:1.6) * (1 - p), 0, -10 * p);
    board.rotation.y = (reduced ? -.12 : -.15 + Math.sin(time * .0002) * .035) * (1 - p);
    board.rotation.z = -.08 * (1 - p);
    board.scale.setScalar((phase==='intro'?1.17:1) + p * .55);
    board.visible = p < .96;
    room.visible = p > .025;
    room.scale.setScalar(.65 + p * .35);
    // The walls emerge together from the user's pattern as the camera approaches it.
    for (const mat of [wallMaterial, floorMaterial, hangingMaterial, plaster, ceiling, brass, vermilion]) {
      mat.transparent = p < .99;
      mat.opacity = Math.min(1, p * 2);
    }
    brass.opacity = board.visible ? 1 : brass.opacity;
    relief.rotation.y=reduced?0:Math.sin(time*.00016)*.18;
    for(const [i,m] of screens.entries()) {
      if(p<.025)continue;
      const positions=m.geometry.attributes.position;
      const rest=m.geometry.userData.restPositions;
      for(let j=0;j<positions.count;j++) {
        const x=rest[j*3],y=rest[j*3+1];
        const amount=material==='textile'?.5:material==='metal'?0:.025;
        const fall=(3.5-y)/7;
        const breeze=reduced?0:Math.sin(time*.00065+i)*.22*fall;
        positions.setZ(j,Math.sin(x*5.5+i+breeze)*amount*(.35+fall));
        positions.setY(j,y+(material==='textile'?Math.cos(x*5.5+i)*.09*fall*fall:0));
      }
      positions.needsUpdate=true;m.geometry.computeVertexNormals();
    }
    renderer.render(scene, camera);
  });
  return {
    update,
    setPhase(value) { phase = value; target = phase === 'room' ? 1 : 0; },
    setPointer(x, y) { pointer = { x, y }; },
    setScale(value) { scale = value; texture.repeat.set(scale, scale);floorTexture.repeat.set(scale*1.3,scale*4.2);hangingTexture.repeat.set(Math.max(1,scale*.5),Math.max(1,scale)); },
    setReduced(value) { reduced = value; },
    isFallback: false,
    dispose() { renderer.setAnimationLoop(null); ro.disconnect(); texture.dispose();floorTexture.dispose();hangingTexture.dispose();weaveTexture.dispose(); env.dispose(); scene.traverse(o => { o.geometry?.dispose(); }); [flatMaterial,wallMaterial,floorMaterial,hangingMaterial,plaster,ceiling,brass,vermilion].forEach(m=>m.dispose()); renderer.dispose(); }
  };
}

function createFallback(container, cells, accent) {
  container.classList.add('fallback');
  const c = document.createElement('canvas'); container.append(c);
  let material = 'paper', scale = 3;
  function render() {
    c.width = 1200; c.height = 1200;
    const ctx = c.getContext('2d'); const tile = createPattern(cells, accent, material, Math.round(1200 / scale));
    ctx.fillStyle = ctx.createPattern(tile, 'repeat'); ctx.fillRect(0,0,1200,1200);
  }
  render();
  return { isFallback:true, update(a,b,m=material){cells=a;accent=b;material=m;render();},setPhase(){},setPointer(){},setScale(n){scale=n;render();},setReduced(){},dispose(){} };
}
