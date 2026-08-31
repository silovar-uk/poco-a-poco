import {lessons,discoveryItems} from './data/content.js';
import {curriculumV2} from './data/curriculum.js';
import {
  validateLessons,validateCurriculumMap,historyForLesson,completedIds,practiceLessons,pickNextLesson,
  masteryState,buildPracticeTasks,streakCount,relativeDate,dateKey,buildCompletionRecord,shuffle
} from './domain/learning.js';
import {loadState,saveState} from './storage/storage.js';
import {createLessonSession,LESSON_STEPS} from './state/session.js';

const app=document.querySelector('#app');
const supportButton=document.querySelector('#supportButton');
const supportDialog=document.querySelector('#supportDialog');
const supportChoices=document.querySelector('#supportChoices');
const stepKickers=['SITUACIÓN','ESCUCHA','BLOQUE','MEMORIA','VOZ','INTERACCIÓN','TU FRASE','TRANSFER','HECHO'];
const contentErrors=[...validateLessons(lessons),...validateCurriculumMap(curriculumV2)];
const loaded=loadState();
let state=loaded.state;
let session=null;

if(loaded.issues.length)console.warn('[Poco storage]',...loaded.issues);

function persist(){
  const result=saveState(state);
  state=result.state;
  if(!result.ok)console.error('[Poco storage]',result.issue);
  return result.ok;
}

function esc(value=''){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
function navigate(route){location.hash=route}
function ui(ja,es){return state.support>=3?es:ja}
function stepLabel(en,ja){return state.support===1?`${en} · ${ja}`:en}
function jpHelp(ja,{minimal=false}={}){
  if(state.support===4)return '';
  if(state.support===3){
    if(minimal)return '';
    return `<details class="jp-help"><summary>日本語ヒント</summary><p>${esc(ja)}</p></details>`;
  }
  return `<p class="translation">${esc(ja)}</p>`;
}
function bilingualCue(es,ja){
  if(state.support===1)return esc(ja);
  if(state.support===2)return `${esc(es)}<p class="translation cue-translation">${esc(ja)}</p>`;
  if(state.support===3)return `${esc(es)}<details class="jp-help inline-help"><summary>日本語ヒント</summary><p>${esc(ja)}</p></details>`;
  return esc(es);
}
function noticeFor(lesson){
  if(state.support<=2)return lesson.notice;
  if(state.support===3)return `${lesson.noticeEs}<details class="jp-help"><summary>日本語ヒント</summary><p>${lesson.notice}</p></details>`;
  return lesson.noticeEs;
}
function setNav(route){document.querySelectorAll('.bottom-nav button').forEach(button=>button.classList.toggle('is-active',button.dataset.nav===route))}
function renderSupportChoices(){
  const rows=[
    [1,'Level 1','日本語中心。Step名にも日本語を併記'],
    [2,'Level 2','日本語とスペイン語を併用'],
    [3,'Level 3','スペイン語中心。日本語は開いて確認'],
    [4,'Level 4','レッスン内は原則スペイン語']
  ];
  supportChoices.innerHTML=rows.map(([value,title,subtitle])=>`<button type="button" class="support-choice ${state.support===value?'is-active':''}" data-support="${value}"><strong>${title}</strong><small>${subtitle}</small></button>`).join('');
}
function updateSupportButton(){supportButton.textContent=`JP ${state.support}`;renderSupportChoices()}
function notifyDesign(route,step=null){
  document.body.dataset.route=route;
  document.body.dataset.jp=String(state.support);
  if(step===null)delete document.body.dataset.step;
  else document.body.dataset.step=String(step);
  window.dispatchEvent(new CustomEvent('poco:render',{detail:{route,support:state.support,step}}));
}
function masteryLabel(value){return ({'NEW':'NEW','GETTING THERE':'GROWING','USABLE':'USABLE','REVISIT':'REVISIT'})[value]||value}
function capabilityBadges(lesson){return `<div class="capability-row">${lesson.capabilities.map(value=>`<span class="capability-chip">${esc(value)}</span>`).join('')}</div>`}

function render(){
  const [route,id]=(location.hash||'#home').slice(1).split('/');
  if(state.lastRoute!==route){state.lastRoute=route;persist()}
  setNav(route);
  window.scrollTo({top:0,behavior:'auto'});
  if(route==='path')renderPath();
  else if(route==='practice')renderPractice();
  else if(route==='discovery')renderDiscovery();
  else if(route==='lesson'&&id)startLesson(id);
  else renderHome();
  updateSupportButton();
  notifyDesign(route,route==='lesson'&&session?session.step:null);
}

function renderHome(){
  const done=completedIds(state.history).size;
  const today=state.history.filter(item=>item.date===dateKey(new Date())).length;
  const streak=streakCount(state.history,new Date());
  const next=pickNextLesson(lessons,state.history,new Date());
  app.innerHTML=`
    <section class="hero">
      <div class="eyebrow">HABLAR · POCO A POCO</div>
      <h1>少し分かる。<br>少し返せる。</h1>
      <p class="lead">${state.support<=2?'日本語を足場に、':''}相手の一言を拾う → 思い出す → 声に出す → 返答を受ける → 困ったら立て直す。少ないSpanishを何度も使う。</p>
      <div class="today-card">
        <small>TODAY · 5–8分</small><h2>今日の会話ひとつ</h2><p>${esc(next.canDo)}</p>
        ${capabilityBadges(next)}
        <button class="primary-button" data-start="${next.id}">${today?'もう一つ進む':'今日の練習をはじめる'} →</button>
      </div>
      <div class="stats-row"><div class="stat"><strong>${done}/${lessons.length}</strong><small>EXPERIENCED</small></div><div class="stat"><strong>${state.history.length}</strong><small>SESSIONS</small></div><div class="stat"><strong>${streak}</strong><small>DAY STREAK</small></div></div>
      <div class="section-head"><div><div class="eyebrow">THREE WAYS</div><h2>進む。組み替える。寄り道する。</h2></div></div>
      <div class="mini-grid">
        <a href="#path" class="mini-card path-mini" data-index="01"><span class="badge">PATH</span><b>会話で進む</b><span>Can-doを、相手とのやり取り単位で広げる。</span></a>
        <a href="#practice" class="mini-card practice-mini" data-index="02"><span class="badge orange">PRACTICE</span><b>組み替える</b><span>REACT / REPAIR / TRANSFERで過去のChunkを別条件へ。</span></a>
        <a href="#discovery" class="mini-card discovery-mini" data-index="03"><span class="badge yellow">DISCOVERY</span><b>寄り道する</b><span>言葉・文化・音から偶然の発見。</span></a>
      </div>
    </section>`;
}

function renderPath(){
  app.innerHTML=`<section class="page-head path-head"><span class="route-index" aria-hidden="true">01 / 03</span><div class="eyebrow">PATH · COMMUNICATION</div><h1>文ではなく、<br>やり取りを増やす。</h1><p class="lead">NEW → GROWING → USABLE。1回終えただけでは「習得」にしない。</p></section><div class="card-list path-list">${lessons.map((lesson,index)=>{
    const mastery=masteryState(lesson.id,state.history,new Date());
    const count=historyForLesson(state.history,lesson.id).length;
    return `<button class="path-card" data-start="${lesson.id}" data-index="${String(index+1).padStart(2,'0')}"><div class="card-top"><span class="badge">${lesson.level} · ${masteryLabel(mastery)}</span><span class="arrow">→</span></div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.canDo)}</p>${capabilityBadges(lesson)}<div class="progress"><i style="width:${mastery==='USABLE'?100:mastery==='REVISIT'?72:count?55:8}%"></i></div></button>`;
  }).join('')}</div>`;
}

function renderPractice(){
  const list=practiceLessons(lessons,state.history,new Date());
  const tasks=buildPracticeTasks(lessons,state.history,new Date());
  app.innerHTML=`<section class="page-head practice-head"><span class="route-index" aria-hidden="true">02 / 03</span><div class="eyebrow">PRACTICE · REBUILD</div><h1>同じLessonを、<br>そのまま繰り返さない。</h1><p class="lead">過去のChunkを「返す・立て直す・別場面へ移す」で組み替える。</p></section>${list.length?`
    <div class="today-card practice-hero"><small>SMART MIX · FULL EPISODE</small><h2>${esc(list[0].title)}</h2><p>${esc(list[0].canDo)}</p><button class="primary-button" data-start="${list[0].id}">会話Episodeをもう一度 →</button></div>
    ${tasks.length?`<div class="section-head"><div><div class="eyebrow">QUICK DRILLS</div><h2>思い出すだけじゃない復習</h2></div></div><div class="practice-drills">${tasks.map(task=>`<details class="practice-drill"><summary><span class="badge orange">${task.mode}</span><strong>${esc(task.title)}</strong><span>${esc(task.cue)}</span></summary><div class="practice-answer"><small>先に声に出してから開く</small><p class="spanish">${esc(task.prompt)}</p><p>${esc(task.answer)}</p></div></details>`).join('')}</div>`:''}
    <div class="section-head"><div><div class="eyebrow">EPISODE QUEUE</div><h2>じっくり戻るなら</h2></div></div><div class="card-list practice-list">${list.slice(1).map(lesson=>{const last=historyForLesson(state.history,lesson.id).at(-1);return `<button class="practice-card" data-start="${lesson.id}"><div class="card-top"><span class="badge orange">${masteryLabel(masteryState(lesson.id,state.history,new Date()))}</span><span class="arrow">→</span></div><h3>${esc(lesson.title)}</h3><p>前回: ${relativeDate(last.completedAt,new Date())} · 自信 ${last.confidence}/3</p></button>`}).join('')}</div>`:`<div class="empty">まだ復習データがない。まずPATHから一つの会話Episodeを完了すると、REACT / REPAIR / TRANSFERの練習がここに育つ。</div>`}`;
}

function renderDiscovery(){
  app.innerHTML=`<section class="page-head discovery-head"><span class="route-index" aria-hidden="true">03 / 03</span><div class="eyebrow">DISCOVERY</div><h1>予定外の言葉に、出会う。</h1><p class="lead">学習の道筋とは別に、文化・音・表現から「これ面白い」を増やす場所。</p></section><div class="card-list discovery-list">${shuffle(discoveryItems).map((item,index)=>`<article class="discovery-card" data-index="${String(index+1).padStart(2,'0')}"><div class="card-top"><span class="badge yellow">${item.type}</span><span class="microcopy">${item.tag}</span></div><div class="word">${esc(item.word)}</div><h3>${esc(item.title)}</h3><p>${esc(item.body)}</p></article>`).join('')}</div>`;
}

function startLesson(id){
  const lesson=lessons.find(item=>item.id===id);
  if(!lesson){navigate('home');return}
  if(!session||session.lesson.id!==id)session=createLessonSession(lesson,state.personal[id]||'');
  renderLesson();
}
function phraseForSpine(lesson){
  if(session.step===0)return '';
  if(session.step===1)return lesson.partnerPrompt.es;
  if(session.step===2)return lesson.chunk;
  if(session.step===3)return session.revealed?lesson.retrieveAnswer:'';
  if(session.step===4)return session.speakHidden?'':lesson.retrieveAnswer;
  if(session.step===5)return lesson.partnerResponse.es;
  if(session.step===6)return session.personal||(session.selected!==null?lesson.change[session.selected]:lesson.chunk);
  if(session.step===7)return session.transferRevealed?lesson.transfer.answer:'';
  return session.personal||lesson.transfer.answer||lesson.retrieveAnswer;
}
function sentenceSpine(lesson){
  const phrase=phraseForSpine(lesson);
  const silent=!phrase&&[3,4,7].includes(session.step);
  return `<div class="sentence-spine ${silent?'is-silent':''}" aria-hidden="true"><span class="sentence-spine__index">${String(session.step+1).padStart(2,'0')}</span><span class="sentence-spine__stage">${stepKickers[session.step]}</span>${phrase?`<span class="sentence-spine__phrase">${esc(phrase)}</span>`:`<span class="sentence-spine__breath">${silent?'· · ·':'poco a poco'}</span>`}</div>`;
}
function renderLesson(){
  const lesson=session.lesson;
  const total=LESSON_STEPS.length;
  const pct=Math.round(((session.step+1)/total)*100);
  const mode=LESSON_STEPS[session.step];
  app.innerHTML=`<section class="lesson" data-step="${session.step}" data-mode="${mode}"><div class="lesson-top"><button class="icon-button" data-exit aria-label="学習を終了">×</button><div class="lesson-step"><i style="width:${pct}%"></i></div><small>${session.step+1}/${total}</small></div><div class="lesson-body mode-${mode} ${session.step===8?'completion':''}">${sentenceSpine(lesson)}${lessonStep(lesson)}</div></section>`;
  notifyDesign('lesson',session.step);
}
function choiceBlock(block,selected,attribute){
  const solved=selected===block.correct;
  return `<div class="recognition-options">${block.options.map((option,index)=>{
    const selectedClass=selected===index?(index===block.correct?'is-correct':'is-wrong'):'';
    return `<button class="choice recognition-choice ${selectedClass}" ${attribute}="${index}">${esc(option)}</button>`;
  }).join('')}</div>${selected!==null&&!solved?`<p class="form-error" role="status">${ui('全部訳さず、今必要な意味だけもう一度拾おう。','Busca solo la idea que necesitas y prueba otra vez.')}</p>`:''}`;
}
function partnerCard(label,text){return `<div class="conversation-card"><small>${label}</small><p class="spanish">${esc(text)}</p></div>`}
function nextButton(label){return `<div class="lesson-actions"><button class="secondary-button" data-next>${label} →</button></div>`}

function lessonStep(lesson){
  switch(session.step){
    case 0:return `<div class="eyebrow">${stepLabel('SCENE','場面')}</div><h1>${esc(state.support>=3?lesson.titleEs:lesson.title)}</h1><div class="notice">${bilingualCue(lesson.sceneEs,lesson.scene)}</div>${capabilityBadges(lesson)}<p class="lead"><b>${ui('今日できるようにすること','Objetivo')}</b><br>${esc(lesson.canDo)}</p>${nextButton(ui('相手の一言を聞く','Escuchar a la otra persona'))}`;
    case 1:{
      const solved=session.recognitionSelected===lesson.partnerPrompt.correct;
      return `<div class="eyebrow">${stepLabel('HEAR / READ PARTNER','相手の一言')}</div><h1>${ui('全部訳さず、芯を拾う。','Capta la idea, no cada palabra.')}</h1>${partnerCard('PARTNER',lesson.partnerPrompt.es)}<p class="microcopy">${esc(lesson.partnerPrompt.question)}</p>${choiceBlock(lesson.partnerPrompt,session.recognitionSelected,'data-recognition-option')}${solved?`<div class="feedback-card"><b>GIST ✓</b><p>${esc(lesson.partnerPrompt.ja)}</p></div>${nextButton(ui('自分の返しを作る','Preparar tu respuesta'))}`:''}`;
    }
    case 2:return `<div class="eyebrow">${stepLabel('NOTICE / CHUNK','気づき・かたまり')}</div><p class="spanish">${esc(lesson.es)}</p>${jpHelp(lesson.ja)}<div class="notice">${noticeFor(lesson)}</div><div class="prompt-box"><small>CORE CHUNK</small><strong>${esc(lesson.chunk)}</strong></div><div class="pronunciation-note"><small>${esc(lesson.pronunciation.focus)}</small><p>${esc(lesson.pronunciation.tip)}</p></div>${nextButton(ui('隠して思い出す','Recordar sin mirar'))}`;
    case 3:return `<div class="eyebrow">${stepLabel('RETRIEVE','思い出す')}</div><h1>${ui('見ずに、取り出す。','Recuerda sin mirar.')}</h1><div class="notice">${bilingualCue(lesson.retrieveCueEs,lesson.retrieve)}</div>${session.revealed?`<div class="reveal"><p class="spanish" style="font-size:30px;margin:0">${esc(lesson.retrieveAnswer)}</p>${jpHelp(lesson.retrieveAnswerJa,{minimal:true})}</div>${nextButton(ui('今度は声に出す','Ahora dilo'))}`:`<div class="lesson-actions"><button class="secondary-button" data-reveal>${ui('言ってから答えを見る','Decir y ver respuesta')}</button></div>`}`;
    case 4:return `<div class="eyebrow">${stepLabel('SPEAK','声に出す')}</div><h1>${ui('画面から、文を消す。','Quita la frase de la pantalla.')}</h1>${session.speakHidden?`<div class="prompt-box is-hidden-phrase"><small>HIDDEN · SAY IT</small><strong aria-label="文を隠しています">••••••••</strong></div><p class="lead">${ui('詰まってもOK。自力で一度出そうとすることが目的。','No pasa nada si te atascas. Intenta sacarla una vez.')}</p><div class="lesson-actions"><button class="ghost-button" data-show-speak>${ui('見直す','Mirar otra vez')}</button>${nextButton(ui('相手の返答を受ける','Recibir la respuesta'))}</div>`:`<div class="prompt-box"><small>LOOK ONCE</small><strong>${esc(lesson.retrieveAnswer)}</strong></div><div class="lesson-actions"><button class="secondary-button" data-hide-speak>${ui('文を隠して話す','Ocultar y hablar')} →</button></div>`}`;
    case 5:{
      const solved=session.interactionSelected===lesson.partnerResponse.correct;
      return `<div class="eyebrow">${stepLabel('INTERACT / REPAIR','返答・立て直す')}</div><h1>${ui('言ったら、相手が返してくる。','Después de hablar, la otra persona responde.')}</h1>${partnerCard('PARTNER RESPONSE',lesson.partnerResponse.es)}<p class="microcopy">${esc(lesson.partnerResponse.question)}</p>${choiceBlock(lesson.partnerResponse,session.interactionSelected,'data-interaction-option')}${solved?`<div class="feedback-card"><b>RESPONSE ✓</b><p>${esc(lesson.partnerResponse.ja)}</p>${lesson.partnerResponse.reaction?`<p><small>${ui('短く返すなら','Puedes reaccionar')}</small><br><strong>${esc(lesson.partnerResponse.reaction)}</strong></p>`:''}</div><div class="repair-card"><small>IF STUCK · REPAIR</small><strong>${esc(lesson.repair.phrase)}</strong><p>${esc(lesson.repair.meaning)}</p><span>${esc(lesson.repair.cue)}</span></div>${nextButton(ui('自分の話にする','Hacerla tuya'))}`:''}`;
    }
    case 6:return `<div class="eyebrow">${stepLabel('PERSONALIZE','自分の一文')}</div><h1>${ui('自分へ、少しずらす。','Hazla un poco más tuya.')}</h1><p class="lead">${ui('例文を丸暗記せず、今日の自分に近い形へ変える。','No memorices solo el ejemplo. Acércalo a tu vida.')}</p><div class="choice-row">${lesson.change.map((value,index)=>`<button class="choice ${session.selected===index?'is-selected':''}" data-choice="${index}">${esc(value)}</button>`).join('')}</div><textarea id="personalInput" aria-label="自分のスペイン語の一文" placeholder="${esc(lesson.chunk.replace('___','...'))}">${esc(session.personal)}</textarea>${session.personalError?`<p class="form-error" role="alert">${ui('1文だけ入力してみよう。上の例文を下書きにしてもOK。','Escribe una frase. Puedes usar un ejemplo como borrador.')}</p>`:''}<div class="lesson-actions">${session.selected!==null?`<button class="ghost-button" data-fill-personal>${ui('選んだ例文を下書きにする','Usar el ejemplo como borrador')}</button>`:''}<button class="secondary-button" data-personal>${ui('この一文で進む','Seguir con esta frase')} →</button></div>`;
    case 7:return `<div class="eyebrow">${stepLabel('TRANSFER','別の条件へ')}</div><h1>${ui('同じ文ではなく、同じ力を使う。','Usa la misma habilidad en otra situación.')}</h1><div class="transfer-card"><small>NEW CONDITION</small><p>${esc(lesson.transfer.cue)}</p></div>${session.transferRevealed?`<div class="reveal"><p class="spanish" style="font-size:30px;margin:0">${esc(lesson.transfer.answer)}</p>${jpHelp(lesson.transfer.answerJa,{minimal:true})}</div><div class="notice"><b>${ui('次の再利用','Próxima reutilización')}</b><br>${esc(state.support>=3?lesson.reuseEs:lesson.reuse)}</div><p class="microcopy">${ui('この条件でも使えた感覚は？','¿Cómo te fue en esta nueva condición?')}</p><div class="choice-row">${[[1,ui('まだ怪しい','Difícil')],[2,ui('だいたい使えた','Más o menos')],[3,ui('すぐ使えた','Salió rápido')]].map(([value,text])=>`<button class="choice ${session.confidence===value?'is-selected':''}" data-confidence="${value}">${text}</button>`).join('')}</div>${nextButton(ui('今日の会話を完了','Terminar'))}`:`<div class="lesson-actions"><button class="secondary-button" data-transfer-reveal>${ui('先に言ってから答えを見る','Intentar y ver respuesta')} →</button></div>`}`;
    case 8:{
      const finalSentence=session.personal||lesson.transfer.answer||lesson.retrieveAnswer;
      return `<div class="done-burst">✓</div><div class="eyebrow">DONE · COMMUNICATION EPISODE</div><h1>${ui('今日、会話がひとつ伸びた。','Hoy puedes mantener una interacción un poco más.')}</h1><div class="done-can-do"><small>CAN-DO</small><p>${esc(lesson.canDo)}</p></div><small class="microcopy">${ui('自分の一文','TU FRASE')}</small><strong class="big">${esc(finalSentence)}</strong><div class="repair-card compact"><small>ESCAPE HATCH</small><strong>${esc(lesson.repair.phrase)}</strong></div><div class="next-suggestion"><p class="microcopy">${ui(`記録済み · 自信 ${session.confidence}/3 · 一度完了 ≠ 習得`,`Guardado · confianza ${session.confidence}/3`)}</p><div class="lesson-actions"><button class="secondary-button" data-nav-home>${ui('ホームへ','Inicio')}</button><button class="ghost-button" data-nav-practice>${ui('別条件で復習','Práctica')}</button></div></div>`;
    }
  }
}

function completeLesson(){
  const id=session.lesson.id;
  state.personal[id]=session.personal;
  state.history.push(buildCompletionRecord({lessonId:id,confidence:session.confidence,personal:session.personal,contentVersion:session.lesson.contentVersion||1,now:new Date()}));
  persist();
}

function bindEvents(){
  app.addEventListener('click',event=>{
    const start=event.target.closest('[data-start]');if(start){navigate(`lesson/${start.dataset.start}`);return}
    if(event.target.closest('[data-exit]')){session=null;navigate('home');return}
    if(event.target.closest('[data-reveal]')){session.revealed=true;renderLesson();return}
    if(event.target.closest('[data-hide-speak]')){session.speakHidden=true;renderLesson();return}
    if(event.target.closest('[data-show-speak]')){session.speakHidden=false;renderLesson();return}
    if(event.target.closest('[data-transfer-reveal]')){session.transferRevealed=true;renderLesson();return}
    const recognition=event.target.closest('[data-recognition-option]');if(recognition){session.recognitionSelected=Number(recognition.dataset.recognitionOption);renderLesson();return}
    const interaction=event.target.closest('[data-interaction-option]');if(interaction){session.interactionSelected=Number(interaction.dataset.interactionOption);renderLesson();return}
    const choice=event.target.closest('[data-choice]');if(choice){session.selected=Number(choice.dataset.choice);renderLesson();return}
    const confidence=event.target.closest('[data-confidence]');if(confidence){session.confidence=Number(confidence.dataset.confidence);renderLesson();return}
    if(event.target.closest('[data-fill-personal]')){session.personal=session.lesson.change[session.selected]||'';session.personalError=false;renderLesson();requestAnimationFrame(()=>document.querySelector('#personalInput')?.focus());return}
    if(event.target.closest('[data-personal]')){
      const value=document.querySelector('#personalInput').value.trim();
      if(!value){session.personalError=true;renderLesson();requestAnimationFrame(()=>document.querySelector('#personalInput')?.focus());return}
      session.personal=value;session.personalError=false;session.step++;renderLesson();return;
    }
    if(event.target.closest('[data-next]')){if(session.step===7)completeLesson();session.step=Math.min(8,session.step+1);renderLesson();return}
    if(event.target.closest('[data-nav-home]')){session=null;navigate('home');return}
    if(event.target.closest('[data-nav-practice]')){session=null;navigate('practice');return}
  });
  document.addEventListener('click',event=>{const nav=event.target.closest('[data-nav]');if(nav){event.preventDefault();navigate(nav.dataset.nav)}});
  supportButton.addEventListener('click',()=>{renderSupportChoices();supportDialog.showModal()});
  supportChoices.addEventListener('click',event=>{const button=event.target.closest('[data-support]');if(!button)return;state.support=Number(button.dataset.support);persist();updateSupportButton();supportDialog.close();render()});
  window.addEventListener('hashchange',()=>{session=null;render()});
}

function renderContentFailure(errors){
  console.error('[Poco content validation]',errors);
  app.innerHTML=`<section class="empty"><strong>教材データを読み込めませんでした。</strong><p>公開前のCurriculum / Content検証で問題を検出しました。</p></section>`;
}

if(contentErrors.length)renderContentFailure(contentErrors);
else{
  bindEvents();
  if(!location.hash)history.replaceState(null,'','#home');
  render();
}
