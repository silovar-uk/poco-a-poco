export function validateLessons(lessons){
  const errors=[];
  const ids=new Set();
  const canDos=new Map();
  const allowedLevels=new Set(['A0','A1','A1+']);
  const required=['id','level','title','titleEs','canDo','scene','sceneEs','es','ja','notice','noticeEs','chunk','retrieve','retrieveCueEs','retrieveAnswer','retrieveAnswerJa','reuse','reuseEs'];
  for(const [index,lesson] of lessons.entries()){
    const at=`lesson[${index}]`;
    for(const field of required){
      if(typeof lesson[field]!=='string'||!lesson[field].trim())errors.push(`${at}.${field} is required`);
    }
    if(ids.has(lesson.id))errors.push(`${at}.id duplicate: ${lesson.id}`);
    ids.add(lesson.id);
    if(!allowedLevels.has(lesson.level))errors.push(`${at}.level invalid: ${lesson.level}`);
    if(!Array.isArray(lesson.change)||lesson.change.length<1||lesson.change.some(x=>typeof x!=='string'||!x.trim()))errors.push(`${at}.change must contain at least one non-empty string`);
    if(canDos.has(lesson.canDo))errors.push(`${at}.canDo duplicates ${canDos.get(lesson.canDo)}`);
    else canDos.set(lesson.canDo,lesson.id);
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

export function buildCompletionRecord({lessonId,confidence,personal,now=new Date()}){
  return {lessonId,date:dateKey(now),completedAt:now.toISOString(),confidence,personal};
}

export function shuffle(items,rng=Math.random){
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(rng()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}
