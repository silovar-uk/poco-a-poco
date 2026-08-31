export const STORAGE_KEY='poco-a-poco-v1';
export const SCHEMA_VERSION=1;

export function defaultState(){
  return {schemaVersion:SCHEMA_VERSION,support:2,history:[],personal:{},lastRoute:'home'};
}

export function migrateState(input){
  if(!input||typeof input!=='object'||Array.isArray(input))return {state:defaultState(),issues:['invalid_state_shape']};
  if(input.schemaVersion===undefined){
    return {state:normalizeState({...input,schemaVersion:SCHEMA_VERSION}),issues:['migrated_legacy_v0_to_v1']};
  }
  if(input.schemaVersion!==SCHEMA_VERSION){
    return {state:null,issues:[`unsupported_schema_version:${input.schemaVersion}`]};
  }
  return {state:normalizeState(input),issues:[]};
}

export function normalizeState(input){
  const base=defaultState();
  const support=Number(input.support);
  return {
    schemaVersion:SCHEMA_VERSION,
    support:[1,2,3,4].includes(support)?support:base.support,
    history:Array.isArray(input.history)?input.history.filter(isHistoryRecord):[],
    personal:isPlainObject(input.personal)?Object.fromEntries(Object.entries(input.personal).filter(([k,v])=>typeof k==='string'&&typeof v==='string')):{},
    lastRoute:typeof input.lastRoute==='string'&&input.lastRoute?input.lastRoute:base.lastRoute
  };
}

function isHistoryRecord(item){
  return !!item&&typeof item==='object'&&typeof item.lessonId==='string'&&typeof item.completedAt==='string'&&typeof item.date==='string'&&[1,2,3].includes(Number(item.confidence));
}
function isPlainObject(value){return !!value&&typeof value==='object'&&!Array.isArray(value)}

function backupCorruptRaw(storage,raw,now){
  try{storage.setItem(`${STORAGE_KEY}-corrupt-${now.getTime()}`,raw);return true}catch{return false}
}

export function loadState(storage=globalThis.localStorage,now=new Date()){
  const issues=[];
  let raw;
  try{raw=storage?.getItem(STORAGE_KEY)}catch(error){return {state:defaultState(),issues:[`storage_read_failed:${error?.name||'Error'}`]}}
  if(!raw)return {state:defaultState(),issues};
  let parsed;
  try{parsed=JSON.parse(raw)}catch{
    const backedUp=backupCorruptRaw(storage,raw,now);
    return {state:defaultState(),issues:[backedUp?'corrupt_json_backed_up':'corrupt_json_backup_failed']};
  }
  const migrated=migrateState(parsed);
  issues.push(...migrated.issues);
  if(!migrated.state)return {state:defaultState(),issues};
  return {state:migrated.state,issues};
}

export function saveState(state,storage=globalThis.localStorage){
  const normalized=normalizeState(state);
  try{
    storage?.setItem(STORAGE_KEY,JSON.stringify(normalized));
    return {ok:true,state:normalized,issue:null};
  }catch(error){
    const name=error?.name||'Error';
    return {ok:false,state:normalized,issue:name==='QuotaExceededError'?'storage_quota_exceeded':`storage_write_failed:${name}`};
  }
}

export function clearState(storage=globalThis.localStorage){
  try{storage?.removeItem(STORAGE_KEY);return {ok:true,issue:null}}
  catch(error){return {ok:false,issue:`storage_clear_failed:${error?.name||'Error'}`}}
}
