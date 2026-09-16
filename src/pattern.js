export const PAPER = '#f3efe5';
export const INK = '#252820';
export const ACCENTS = ['#b74332', '#b38b40', '#48626b'];
export const INITIAL = [1,0,0,0,1, 0,1,2,1,0, 0,2,0,2,0, 0,1,2,1,0, 1,0,0,0,1];
export const SHAPES = ['square','circle','arc','triangle'];
export function encodeCell(shape,color,rotation=0){return 1+color+4*shape+16*rotation;}
export function decodeCell(value){const n=Math.max(0,value-1);return {shape:Math.floor(n/4)%4,color:n%4,rotation:Math.floor(n/16)%4};}
export function cellColor(value,accent=ACCENTS[0]){return [INK,accent,ACCENTS[1],ACCENTS[2]][decodeCell(value).color];}

export function nextCell(value) { return (value + 1) % 3; }
export function motifSignature(cells) { return cells.map(v => v.toString()).join(''); }
export function createPattern(cells, accent, material = 'paper', size = 600) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const c = canvas.getContext('2d');
  const base = material === 'metal' ? '#c2a96f' : material === 'textile' ? '#e0d0af' : PAPER;
  c.fillStyle = base;
  c.fillRect(0, 0, size, size);
  const unit = size / 6;
  cells.forEach((value, i) => {
    if (!value) return;
    const x = (i % 5 + .5) * unit, y = (Math.floor(i / 5) + .5) * unit;
    const {shape,rotation,color}=decodeCell(value);
    c.fillStyle=material==='textile'&&color===0?'#414039':cellColor(value,accent);
    c.save();c.translate(x+unit/2,y+unit/2);c.rotate(rotation*Math.PI/2);
    const r=unit*.41;
    if(shape===0)c.fillRect(-r,-r,r*2,r*2);
    if(shape===1){c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();}
    if(shape===2){c.beginPath();c.arc(-r,-r,r*2,0,Math.PI/2);c.lineTo(-r,-r);c.closePath();c.fill();c.fillStyle=base;c.beginPath();c.arc(-r,-r,r,0,Math.PI/2);c.lineTo(-r,-r);c.fill();}
    if(shape===3){c.beginPath();c.moveTo(-r,r);c.lineTo(r,r);c.lineTo(-r,-r);c.closePath();c.fill();}
    c.restore();
  });
  if (material === 'textile') {
    // Alternating over/under threads, with enough width to remain visible at room scale.
    const thread=6;
    for (let y=0;y<size;y+=thread) for(let x=0;x<size;x+=thread) {
      const over=(x/thread+y/thread)%2===0;
      c.fillStyle='#fff8df30';c.fillRect(x+1,y+1,over?thread-1:2,over?2:thread-1);
      c.fillStyle='#392d242e';c.fillRect(x+thread-2,y+2,1,thread-2);
      c.fillRect(x+1,y+thread-1,thread-2,1);
    }
  }
  if (material === 'metal') {
    for (let n = 0; n < size; n += 2) {
      c.fillStyle = n % 6 ? '#ffffff12' : '#25282015'; c.fillRect(0, n, size, 1);
    }
  }
  return canvas;
}
