import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lessons} from '../data/content.js';
import {curriculumV2,CAPABILITIES} from '../data/curriculum.js';
import {
  validateLessons,validateCurriculumMap,priorityScore,practiceLessons,pickNextLesson,masteryState,
  buildPracticeTasks,streakCount,dateKey,buildCompletionRecord
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

test('all implemented lessons satisfy the v2 communication episode contract',()=>{
  assert.deepEqual(validateLessons(lessons),[]);
  assert.ok(lessons.every(lesson=>lesson.contentVersion===2));
  assert.ok(lessons.every(lesson=>lesson.partnerPrompt&&lesson.partnerResponse&&lesson.repair&&lesson.transfer));
  assert.equal(new Set(lessons.map(x=>x.id)).size,lessons.length);
});

test('repair is introduced before transactional lessons',()=>{
  assert.equal(lessons[0].id,'greet');
  assert.equal(lessons[1].id,'repair');
  assert.ok(lessons[1].capabilities.includes('REPAIR'));
  assert.ok(lessons.findIndex(x=>x.id==='repair')<lessons.findIndex(x=>x.id==='want'));
});

test('legacy lesson ids remain available for saved history compatibility',()=>{
  for(const id of ['greet','like','want','where','from','today','time','opinion'])assert.ok(lessons.some(lesson=>lesson.id===id),`missing legacy lesson ${id}`);
});

test('v2 validator rejects missing partner and transfer data',()=>{
  const broken={...lessons[0],partnerPrompt:null,transfer:{}};
  const errors=validateLessons([broken]);
  assert.ok(errors.some(x=>x.includes('partnerPrompt')));
  assert.ok(errors.some(x=>x.includes('transfer')));
});

test('curriculum map contains 24-30 connected Can-dos across all capabilities',()=>{
  assert.deepEqual(validateCurriculumMap(curriculumV2),[]);
  assert.ok(curriculumV2.length>=24&&curriculumV2.length<=30);
  const used=new Set(curriculumV2.flatMap(item=>item.capability));
  for(const capability of CAPABILITIES)assert.ok(used.has(capability),`missing capability ${capability}`);
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

test('practice v2 produces react repair and transfer rather than only lesson replay',()=>{
  const now=new Date('2026-08-31T12:00:00Z');
  const history=['greet','repair','like'].map((lessonId,index)=>({lessonId,date:'2026-08-31',completedAt:`2026-08-31T0${index+1}:00:00Z`,confidence:2,personal:''}));
  const tasks=buildPracticeTasks(lessons,history,now);
  assert.equal(tasks.length,3);
  assert.deepEqual(new Set(tasks.map(task=>task.mode)),new Set(['REACT','REPAIR','TRANSFER']));
  assert.ok(tasks.every(task=>task.prompt&&task.cue));
});

test('mastery does not equate one completion with usable',()=>{
  const now=new Date('2026-08-31T12:00:00Z');
  const once=[{lessonId:'greet',date:'2026-08-31',completedAt:'2026-08-31T10:00:00Z',confidence:3,personal:''}];
  assert.equal(masteryState('greet',once,now),'GETTING THERE');
  const twice=[...once,{lessonId:'greet',date:'2026-08-31',completedAt:'2026-08-31T11:00:00Z',confidence:3,personal:''}];
  assert.equal(masteryState('greet',twice,now),'USABLE');
  assert.equal(masteryState('repair',twice,now),'NEW');
});

test('next lesson prefers the first unfinished Can-do including the new repair skill',()=>{
  const history=[{lessonId:'greet',date:'2026-08-31',completedAt:'2026-08-31T01:00:00Z',confidence:2,personal:''}];
  assert.equal(pickNextLesson(lessons,history,new Date('2026-08-31T12:00:00Z')).id,'repair');
});

test('streak accepts today or yesterday as the current edge',()=>{
  const history=[
    {lessonId:'greet',date:'2026-08-30'},
    {lessonId:'like',date:'2026-08-29'}
  ];
  assert.equal(streakCount(history,new Date(2026,7,31)),2);
  assert.equal(dateKey(new Date(2026,7,31)),'2026-08-31');
});

test('completion record carries content version when provided',()=>{
  const now=new Date('2026-08-31T12:34:56Z');
  const record=buildCompletionRecord({lessonId:'greet',confidence:3,personal:'Hola',contentVersion:2,now});
  assert.equal(record.completedAt,now.toISOString());
  assert.equal(record.confidence,3);
  assert.equal(record.contentVersion,2);
});

test('lesson session has nine explicit communication steps',()=>{
  const session=createLessonSession(lessons[0],'Hola');
  assert.equal(session.step,0);
  assert.equal(session.personal,'Hola');
  assert.deepEqual(LESSON_STEPS,['scene','partner','chunk','retrieve','speak','interact','personalize','transfer','done']);
  assert.equal(session.recognitionSelected,null);
  assert.equal(session.transferRevealed,false);
});

test('design layer remains explicit and app does not bypass storage adapter',()=>{
  const design=fs.readFileSync(new URL('../design.js',import.meta.url),'utf8');
  const app=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
  assert.equal(design.includes('MutationObserver'),false);
  assert.equal(design.includes('typeof state'),false);
  assert.ok(app.includes('data-mode='));
  assert.ok(app.includes('poco:render'));
  assert.ok(app.includes('partnerPrompt'));
  assert.ok(app.includes('data-transfer-reveal'));
  assert.equal(app.includes('localStorage.'),false);
});

console.log(`\n${count} tests passed.`);
