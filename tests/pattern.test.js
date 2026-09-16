import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL, encodeCell, decodeCell, motifSignature } from '../src/pattern.js';
test('all shape, colour and orientation combinations survive the stored motif representation',()=>{
  const unique=new Set();
  for(let shape=0;shape<4;shape++)for(let color=0;color<4;color++)for(let rotation=0;rotation<4;rotation++){
    const encoded=encodeCell(shape,color,rotation);unique.add(encoded);assert.notEqual(encoded,0);
    assert.deepEqual(decodeCell(encoded),{shape,color,rotation});
  }
  assert.equal(unique.size,64);
});
test('a personal edit changes the exported motif signature without changing the seed',()=>{
  const changed=[...INITIAL];changed[12]=encodeCell(2,3,1);
  assert.notEqual(motifSignature(changed),motifSignature(INITIAL));assert.equal(INITIAL[12],0);
});
