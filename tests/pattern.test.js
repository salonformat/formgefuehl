import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL, nextCell, motifSignature } from '../src/pattern.js';
test('all 25 editable cells cycle through blank, ink, accent and back',()=>{
  assert.equal(INITIAL.length,25);
  for(const cell of INITIAL){assert.ok([0,1,2].includes(cell));assert.equal(nextCell(nextCell(nextCell(cell))),cell);}
});
test('a personal edit changes the exported motif signature without changing the seed',()=>{
  const changed=[...INITIAL];changed[12]=nextCell(changed[12]);
  assert.notEqual(motifSignature(changed),motifSignature(INITIAL));assert.equal(INITIAL[12],0);
});
