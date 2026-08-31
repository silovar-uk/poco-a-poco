import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessons} from '../data/content.js';
import {
  validateLessons,priorityScore,practiceLessons,pickNextLesson,streakCount,
  dateKey,buildCompletionRecord
} from '../domain/learning.js';
import {SCHEMA_VERSION,STORAGE_KEY,defaultState,migrateState,loadState,saveState} from '../storage/storage.js';
import {createLessonSession,LESSON_STEPS} from '../state/session.js';

class MemoryStorage{
  constructor(seed={}){this.map=new Map(Object.entries(seed))}
  getItem(key){return this.map.has(key)?this.map.get(key):null}
  setItem(key,value){this.map.set(key,String(value))}
  removeItem(key){this.map.delete(key)}
}

let count=0;
function test(name,fn){
  try{fn();count++;console.log(`✓ ${name}`)}
  catch(error){console.error(`✗ ${name}`);throw error}
}

test('lesson content satisfies the data contract',()=>{
  assert.deepEqual(validateLessons(lessons),[]);
  assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length);
});

test('validator rejects duplicate ids and missing fields',()=>{
  const broken=[{...lessons[0]},{...lessons[0],title:''}];
  const errors=validateLessons(broken);
  assert.ok(errors.some(x=>x.includes('duplicate')));
  assert.ok(errors.some(x=>x.includes('.title is required')));
});

test('legacy state migrates without losing learning history',()=>{
  const legacy={support:3,history:[{lessonId:'greet',date:'2026-08-31',completedAt:'2026-08-31T01:00:00.000Z',confidence:2,personal:'Me llamo Yusuke.'}],personal:{greet:'Me llamo Yusuke.'},lastRoute:'practice'};
  const migrated=migrateState(legacy);
  assert.equal(migrated.state.schemaVersion,SCHEMA_VERSION);
  assert.equal(migrated.state.history.length,1);
  assert.equal(migrated.state.personal.greet,'Me llamo Yusuke.');
  assert.ok(migrated.issues.includes('migrated_legacy_v0_to_v1'));
});

test('corrupt JSON is backed up before fallback',()=>{
  const storage=new MemoryStorage({[STORAGE_KEY]:'{not-json'});
  const loaded=loadState(storage,new Date('2026-08-31T00:00:00Z'));
  assert.equal(loaded.state.schemaVersion,SCHEMA_VERSION);
  assert.ok(loaded.issues.includes('corrupt_json_backed_up'));
  assert.equal(storage.getItem(`${STORAGE_KEY}-corrupt-${new Date('2026-08-31T00:00:00Z').getTime()}`),'{not-json');
});

test('unsupported future schema is not interpreted as current data',()=>{
  const migrated=migrateState({schemaVersion:99,history:[{danger:'unknown'}]});
  assert.equal(migrated.state,null);
  assert.ok(migrated.issues[0].startsWith('unsupported_schema_version'));
});

test('storage adapter round-trips normalized state',()=>{
  const storage=new MemoryStorage();
  const input={...defaultState(),support:4,personal:{greet:'Hola'}};
  assert.equal(saveState(input,storage).ok,true);
  const output=loadState(storage).state;
  assert.equal(output.support,4);
  assert.equal(output.personal.greet,'Hola');
});

test('practice prioritizes low confidence and older items',()=>{
  const now=new Date('2026-08-31T12:00:00Z');
  const history=[
    {lessonId:'greet',date:'2026-08-30',completedAt:'2026-08-30T12:00:00Z',confidence:3,personal:''},
    {lessonId:'like',date:'2026-08-31',completedAt:'2026-08-31T10:00:00Z',confidence:1,personal:''}
  ];
  assert.ok(priorityScore('like',history,now)>priorityScore('greet',history,now));
  assert.equal(practiceLessons(lessons,history,now)[0].id,'like');
});

test('next lesson prefers the first unfinished Can-do',()=>{
  const history=[{lessonId:'greet',date:'2026-08-31',completedAt:'2026-08-31T01:00:00Z',confidence:2,personal:''}];
  assert.equal(pickNextLesson(lessons,history,new Date('2026-08-31T12:00:00Z')).id,'like');
});

test('streak accepts today or yesterday as the current edge',()=>{
  const history=[
    {lessonId:'greet',date:'2026-08-30'},
    {lessonId:'like',date:'2026-08-29'}
  ];
  assert.equal(streakCount(history,new Date(2026,7,31)),2);
  assert.equal(dateKey(new Date(2026,7,31)),'2026-08-31');
});

test('completion record is deterministic when now is injected',()=>{
  const now=new Date('2026-08-31T12:34:56Z');
  const record=buildCompletionRecord({lessonId:'greet',confidence:3,personal:'Hola',now});
  assert.equal(record.completedAt,now.toISOString());
  assert.equal(record.confidence,3);
});

test('lesson session is ephemeral and has nine explicit steps',()=>{
  const session=createLessonSession(lessons[0],'Hola');
  assert.equal(session.step,0);
  assert.equal(session.personal,'Hola');
  assert.equal(LESSON_STEPS.length,9);
});

test('design layer no longer uses MutationObserver or hidden global state',()=>{
  const design=fs.readFileSync(new URL('../design.js',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
  assert.equal(design.includes('MutationObserver'),false);
  assert.equal(design.includes('typeof state'),false);
  assert.ok(app.includes('data-mode='));
  assert.ok(app.includes('poco:render'));
  assert.equal(app.includes('localStorage.'),false);
});

console.log(`\n${count} tests passed.`);
