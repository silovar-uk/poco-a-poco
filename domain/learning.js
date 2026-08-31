const CAPABILITIES=new Set(['SURVIVE','CONNECT','TRANSACT','REPAIR','EXPRESS','UNDERSTAND']);

function nonEmpty(value){return typeof value==='string'&&value.trim()}
function validateChoiceBlock(block,at,errors){
  if(!block||typeof block!=='object'){errors.push(`${at} is required`);return}
  for(const field of ['es','ja','question'])if(!nonEmpty(block[field]))errors.push(`${at}.${field} is required`);
  if(!Array.isArray(block.options)||block.options.length<2||block.options.some(value=>!nonEmpty(value)))errors.push(`${at}.options must contain at least two non-empty strings`);
  if(!Number.isInteger(block.correct)||block.correct<0||block.correct>=block.options?.length)errors.push(`${at}.correct is invalid`);
}
function validateTextBlock(block,fields,at,errors){
  if(!block||typeof block!=='object'){errors.push(`${at} is required`);return}
  for(const field of fields)if(!nonEmpty(block[field]))errors.push(`${at}.${field} is required`);
}

export function validateLessons(lessons){
  const errors=[];
  const ids=new Set();
  const canDos=new Map();
  const allowedLevels=new Set(['A0','A1','A1+']);
  const required=['id','level','title','titleEs','canDo','scene','sceneEs','es','ja','notice','noticeEs','chunk','retrieve','retrieveCueEs','retrieveAnswer','retrieveAnswerJa','reuse','reuseEs'];
  for(const [index,lesson] of lessons.entries()){
    const at=`lesson[${index}]`;
    for(const field of required)if(!nonEmpty(lesson[field]))errors.push(`${at}.${field} is required`);
    if(ids.has(lesson.id))errors.push(`${at}.id duplicate: ${lesson.id}`);
    ids.add(lesson.id);
    if(!allowedLevels.has(lesson.level))errors.push(`${at}.level invalid: ${lesson.level}`);
    if(!Array.isArray(lesson.change)||lesson.change.length<1||lesson.change.some(value=>!nonEmpty(value)))errors.push(`${at}.change must contain at least one non-empty string`);
    if(canDos.has(lesson.canDo))errors.push(`${at}.canDo duplicates ${canDos.get(lesson.canDo)}`);
    else canDos.set(lesson.canDo,lesson.id);

    if(lesson.contentVersion===2){
      if(!Array.isArray(lesson.capabilities)||!lesson.capabilities.length)errors.push(`${at}.capabilities is required for v2`);
      else for(const capability of lesson.capabilities)if(!CAPABILITIES.has(capability))errors.push(`${at}.capabilities invalid: ${capability}`);
      validateChoiceBlock(lesson.partnerPrompt,`${at}.partnerPrompt`,errors);
      validateChoiceBlock(lesson.partnerResponse,`${at}.partnerResponse`,errors);
      if(!nonEmpty(lesson.partnerResponse?.reaction))errors.push(`${at}.partnerResponse.reaction is required`);
      validateTextBlock(lesson.repair,['cue','phrase','meaning'],`${at}.repair`,errors);
      validateTextBlock(lesson.pronunciation,['focus','tip'],`${at}.pronunciation`,errors);
      validateTextBlock(lesson.transfer,['cue','answer','answerJa'],`${at}.transfer`,errors);
    }
  }
  return errors;
}

export function validateCurriculumMap(items){
  const errors=[];
  const ids=new Set();
  if(!Array.isArray(items)||items.length<24||items.length>30)errors.push('curriculum must contain 24-30 Can-dos');
  for(const [index,item] of (items||[]).entries()){
    const at=`curriculum[${index}]`;
    for(const field of ['id','level','scenario','canDo','coreChunk','partnerLine','repair','pronunciation'])if(!nonEmpty(item[field]))errors.push(`${at}.${field} is required`);
    if(ids.has(item.id))errors.push(`${at}.id duplicate: ${item.id}`);ids.add(item.id);
    if(!Array.isArray(item.capability)||!item.capability.length||item.capability.some(value=>!CAPABILITIES.has(value)))errors.push(`${at}.capability invalid`);
    if(!Array.isArray(item.prerequisites)||!Array.isArray(item.reuseLater))errors.push(`${at}.graph links must be arrays`);
  }
  return errors;
}

export function historyForLesson(history,lessonId){return history.filter(item=>item.lessonId===lessonId)}
export function completedIds(history){return new Set(history.map(item=>item.lessonId))}

export function priorityScore(lessonId,history,now=new Date()){
  const records=historyForLesson(history,lessonId);
  if(!records.length)return -999;
  const last=records.at(-1);
  const lastTime=new Date(last.completedAt).getTime();
  const age=Number.isFinite(lastTime)?Math.max(0,(now.getTime()-lastTime)/86400000):0;
  return (last.confidence===1?50:last.confidence===2?25:0)+age+Math.max(0,3-records.length)*4;
}

export function practiceLessons(lessons,history,now=new Date()){
  return lessons.filter(lesson=>historyForLesson(history,lesson.id).length)
    .sort((a,b)=>priorityScore(b.id,history,now)-priorityScore(a.id,history,now));
}

export function masteryState(lessonId,history,now=new Date()){
  const records=historyForLesson(history,lessonId);
  if(!records.length)return 'NEW';
  const last=records.at(-1);
  const lastTime=new Date(last.completedAt).getTime();
  const ageDays=Number.isFinite(lastTime)?Math.max(0,(now.getTime()-lastTime)/86400000):0;
  if(ageDays>=14)return 'REVISIT';
  if(records.length>=2&&Number(last.confidence)===3)return 'USABLE';
  return 'GETTING THERE';
}

export function buildPracticeTasks(lessons,history,now=new Date()){
  const ranked=practiceLessons(lessons,history,now).filter(lesson=>lesson.contentVersion===2).slice(0,6);
  const modes=['REACT','REPAIR','TRANSFER'];
  return ranked.slice(0,3).map((lesson,index)=>{
    const count=historyForLesson(history,lesson.id).length;
    const mode=modes[(count+index-1)%modes.length];
    if(mode==='REPAIR')return {id:`${lesson.id}:repair`,lessonId:lesson.id,mode,title:lesson.title,cue:lesson.repair.cue,prompt:lesson.repair.phrase,answer:lesson.repair.meaning};
    if(mode==='TRANSFER')return {id:`${lesson.id}:transfer`,lessonId:lesson.id,mode,title:lesson.title,cue:lesson.transfer.cue,prompt:lesson.transfer.answer,answer:lesson.transfer.answerJa};
    return {id:`${lesson.id}:react`,lessonId:lesson.id,mode,title:lesson.title,cue:`相手: ${lesson.partnerPrompt.es}`,prompt:lesson.retrieveAnswer,answer:lesson.retrieveAnswerJa};
  });
}

export function pickNextLesson(lessons,history,now=new Date()){
  const done=completedIds(history);
  return lessons.find(lesson=>!done.has(lesson.id))||practiceLessons(lessons,history,now)[0]||lessons[0];
}

export function dateKey(date=new Date()){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,'0');
  const d=String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

export function streakCount(history,today=new Date()){
  const dates=[...new Set(history.map(item=>item.date).filter(Boolean))].sort().reverse();
  if(!dates.length)return 0;
  let cursor=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  let count=0;
  for(const value of dates){
    if(value===dateKey(cursor)){
      count++;
      cursor.setDate(cursor.getDate()-1);
      continue;
    }
    if(count===0){
      const yesterday=new Date(cursor);
      yesterday.setDate(yesterday.getDate()-1);
      if(value===dateKey(yesterday)){
        count++;
        cursor=yesterday;
        cursor.setDate(cursor.getDate()-1);
        continue;
      }
    }
    break;
  }
  return count;
}

export function relativeDate(iso,now=new Date()){
  const then=new Date(iso).getTime();
  if(!Number.isFinite(then))return '不明';
  const days=Math.max(0,Math.floor((now.getTime()-then)/86400000));
  return days===0?'今日':days===1?'昨日':`${days}日前`;
}

export function buildCompletionRecord({lessonId,confidence,personal,contentVersion=1,now=new Date()}){
  return {lessonId,date:dateKey(now),completedAt:now.toISOString(),confidence,personal,contentVersion};
}

export function shuffle(items,rng=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(rng()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
