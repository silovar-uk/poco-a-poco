import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=path=>fs.readFileSync(new URL(`../${path}`,import.meta.url),'utf8');
const index=read('index.html');
const css=read('game-v1.css');
const app=read('app.js');

let count=0;
function test(name,fn){
  try{fn();count++;console.log(`✓ ${name}`)}
  catch(error){console.error(`✗ ${name}`);throw error}
}

test('game language layer is loaded after learning styles',()=>{
  const learning=index.indexOf('./learning-v2.css');
  const game=index.indexOf('./game-v1.css');
  assert.ok(learning>=0);
  assert.ok(game>learning);
});

test('PATH is implemented as a living route, not a generic node tree',()=>{
  assert.ok(css.includes('.path-list:before'));
  assert.ok(css.includes('.path-card:nth-child(even)'));
  assert.ok(css.includes('LANGUAGE BECOMES A ROUTE'));
  assert.equal(css.includes('loot-box'),false);
});

test('Practice has a tactile language-tool workbench treatment',()=>{
  assert.ok(css.includes('.practice-drills'));
  assert.ok(css.includes('YOUR KNOWN LANGUAGE IS YOUR TOOLKIT'));
  assert.ok(css.includes('.practice-drill:nth-child(2)'));
});

test('Interaction is visually treated as a conversation rally',()=>{
  assert.ok(app.includes("data-mode=\"${mode}\""));
  assert.ok(css.includes('.mode-interact'));
  assert.ok(css.includes('RALLY'));
  assert.ok(css.includes('poco-enter-left'));
  assert.ok(css.includes('poco-enter-right'));
});

test('Completion is capability unlock rather than points reward',()=>{
  assert.ok(css.includes('.lesson-body.completion'));
  assert.ok(css.includes('UNLOCKED'));
  assert.equal(css.toLowerCase().includes('leaderboard'),false);
  assert.equal(css.toLowerCase().includes('coin'),false);
});

test('motion has a reduced-motion fallback',()=>{
  assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
  assert.ok(css.includes('animation:none!important'));
  assert.ok(css.includes('transition:none!important'));
});

test('interactive surfaces retain visible focus from the base system',()=>{
  const base=read('styles.css');
  assert.ok(base.includes(':focus-visible'));
});

console.log(`\n${count} game UI tests passed.`);
