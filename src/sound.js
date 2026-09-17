// Short, original procedural material sounds; no recording, samples or continuous music.
export function createMaterialSound(context) {
  const output=context.createGain();output.gain.value=.5;
  const limiter=context.createDynamicsCompressor();limiter.threshold.value=-16;limiter.knee.value=12;limiter.ratio.value=5;
  output.connect(limiter);limiter.connect(context.destination);
  const noise=context.createBuffer(1,context.sampleRate*2,context.sampleRate);
  const data=noise.getChannelData(0);let seed=314159;
  for(let i=0;i<data.length;i++){seed=(1664525*seed+1013904223)>>>0;data[i]=seed/2147483648-1;}
  const active=new Set();let lastDraw=-1,lastScale=-1;
  function track(source,nodes){active.add(source);source.onended=()=>{active.delete(source);source.disconnect();nodes.forEach(n=>n.disconnect());};}
  function rustle(at,duration,frequency,gain,pan=0,type='bandpass'){
    const source=context.createBufferSource();source.buffer=noise;
    const filter=context.createBiquadFilter();filter.type=type;filter.frequency.value=frequency;filter.Q.value=.7;
    const envelope=context.createGain();envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(gain,at+Math.min(.09,duration*.2));envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);
    const stereo=context.createStereoPanner();stereo.pan.value=pan;
    source.connect(filter);filter.connect(envelope);envelope.connect(stereo);stereo.connect(output);track(source,[filter,envelope,stereo]);source.start(at,(at*.137)%1);source.stop(at+duration+.02);
  }
  function ring(at,frequency,gain,duration,pan){
    const source=context.createOscillator(),envelope=context.createGain(),stereo=context.createStereoPanner();source.frequency.value=frequency;
    envelope.gain.setValueAtTime(0,at);envelope.gain.linearRampToValueAtTime(gain,at+.005);envelope.gain.exponentialRampToValueAtTime(.0001,at+duration);stereo.pan.value=pan;
    source.connect(envelope);envelope.connect(stereo);stereo.connect(output);track(source,[envelope,stereo]);source.start(at);source.stop(at+duration+.02);
  }
  function material(kind,at=context.currentTime,pan=0,strength=1){
    if(kind==='textile'){
      rustle(at,.75,650,.23*strength,pan,'lowpass');rustle(at+.12,.48,1250,.07*strength,pan);
    }else if(kind==='metal'){
      rustle(at,.08,3200,.055*strength,pan);
      [731,1193,1877,2941].forEach((f,i)=>ring(at+i*.004,f,.04*strength/(i+1),1.1-i*.16,pan));
    }else{
      rustle(at,.26,2100,.12*strength,pan);
      rustle(at+.065,.11,3800,.05*strength,pan);rustle(at+.19,.19,1250,.075*strength,pan);
    }
  }
  return {
    draw(index=12,erase=false){const at=context.currentTime;if(at-lastDraw<.045)return;lastDraw=at;const pan=(index%5-2)*.18;rustle(at,erase?.14:.045,erase?850:2400,erase?.13:.16,pan);if(!erase)ring(at,220+(index%5)*19,.018,.045,pan);},
    material,
    unfold(kind,reduced=false){const at=context.currentTime;if(reduced){material(kind,at,0,.8);return;}for(let i=0;i<6;i++)material(kind,at+.15+i*.27,(i%2?1:-1)*(.2+i*.055),.65);rustle(at+.5,1.8,260,.12,0,'lowpass');},
    scale(kind){const at=context.currentTime;if(at-lastScale<.12)return;lastScale=at;rustle(at,.12,kind==='metal'?2400:kind==='textile'?500:1400,.065,0,kind==='textile'?'lowpass':'bandpass');},
    stop(){for(const source of active){try{source.stop();}catch{}}active.clear();},
    mute(value){output.gain.cancelScheduledValues(context.currentTime);output.gain.setTargetAtTime(value?0:.5,context.currentTime,.025);}
  };
}
