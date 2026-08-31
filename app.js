import {lessons,discoveryItems} from './data/content.js';
import {
  validateLessons,historyForLesson,completedIds,practiceLessons,pickNextLesson,
  streakCount,relativeDate,dateKey,buildCompletionRecord,shuffle
} from './domain/learning.js';
import {loadState,saveState} from './storage/storage.js';
import {createLessonSession,LESSON_STEPS} from './state/session.js';

const app=document.querySelector('#app');
const supportButton=document.querySelector('#supportButton');
const supportDialog=document.querySelector('#supportDialog');
const supportChoices=document.querySelector('#supportChoices');
const stepKickers=['SITUACIÓN','SIGNIFICADO','BLOQUE','MEMORIA','VOZ','VARIACIÓN','TU FRASE','OTRA VEZ','HECHO'];
const contentErrors=validateLessons(lessons);
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
      <h1>5分で、<br>ひとつ話せる。</h1>
      <p class="lead">${state.support<=2?'日本語を足場にしながら、':''}見るだけで終わらず、思い出す → 声に出す → 自分の話へ変える。毎日ちょっとずつ。</p>
      <div class="today-card">
        <small>TODAY · 約5分</small><h2>今日の5分</h2><p>${esc(next.canDo)}</p>
        <button class="primary-button" data-start="${next.id}">${today?'もう一つ話す':'今日の5分をはじめる'} →</button>
      </div>
      <div class="stats-row"><div class="stat"><strong>${done}/${lessons.length}</strong><small>CAN-DO</small></div><div class="stat"><strong>${state.history.length}</strong><small>SESSIONS</small></div><div class="stat"><strong>${streak}</strong><small>DAY STREAK</small></div></div>
      <div class="section-head"><div><div class="eyebrow">THREE WAYS</div><h2>迷わず進む。寄り道もする。</h2></div></div>
      <div class="mini-grid">
        <a href="#path" class="mini-card path-mini" data-index="01"><span class="badge">PATH</span><b>次を決める</b><span>Can-do順に、話せる範囲を広げる。</span></a>
        <a href="#practice" class="mini-card practice-mini" data-index="02"><span class="badge orange">PRACTICE</span><b>思い出す</b><span>覚えた表現を、使える状態へ戻す。</span></a>
        <a href="#discovery" class="mini-card discovery-mini" data-index="03"><span class="badge yellow">DISCOVERY</span><b>寄り道する</b><span>言葉・文化・音から偶然の発見。</span></a>
      </div>
    </section>`;
}

function renderPath(){
  const done=completedIds(state.history);
  app.innerHTML=`<section class="page-head path-head"><span class="route-index" aria-hidden="true">01 / 03</span><div class="eyebrow">PATH</div><h1>できることから、進む。</h1><p class="lead">文法項目ではなく「何を言えるようになるか」で道を作る。</p></section><div class="card-list path-list">${lessons.map((lesson,index)=>{
    const count=historyForLesson(state.history,lesson.id).length;
    return `<button class="path-card" data-start="${lesson.id}" data-index="${String(index+1).padStart(2,'0')}"><div class="card-top"><span class="badge">${lesson.level} · ${done.has(lesson.id)?'DONE':'STEP '+(index+1)}</span><span class="arrow">→</span></div><h3>${esc(lesson.title)}</h3><p>${esc(lesson.canDo)}</p><div class="progress"><i style="width:${done.has(lesson.id)?100:count?65:8}%"></i></div></button>`;
  }).join('')}</div>`;
}

function renderPractice(){
  const list=practiceLessons(lessons,state.history,new Date());
  app.innerHTML=`<section class="page-head practice-head"><span class="route-index" aria-hidden="true">02 / 03</span><div class="eyebrow">PRACTICE</div><h1>忘れる前提で、戻る。</h1><p class="lead">Smart Random は完全ランダムではなく「自信が低い・時間が空いた・回数が少ない」表現を優先する。</p></section>${list.length?`<div class="today-card practice-hero"><small>SMART RANDOM</small><h2>${esc(list[0].title)}</h2><p>${esc(list[0].canDo)}</p><button class="primary-button" data-start="${list[0].id}">これを練習する →</button></div><div class="section-head"><div><div class="eyebrow">QUEUE</div><h2>次に戻りたい表現</h2></div></div><div class="card-list practice-list">${list.slice(1).map(lesson=>{const last=historyForLesson(state.history,lesson.id).at(-1);return `<button class="practice-card" data-start="${lesson.id}"><div class="card-top"><span class="badge orange">RETRIEVE</span><span class="arrow">→</span></div><h3>${esc(lesson.title)}</h3><p>前回: ${relativeDate(last.completedAt,new Date())} · 自信 ${last.confidence}/3</p></button>`}).join('')}</div>`:`<div class="empty">まだ復習データがないで。まず「今日の5分」を1つ完了すると、ここに戻るべき表現が育っていく。</div>`}`;
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
  if(session.step===1)return lesson.es;
  if(session.step===2)return lesson.chunk;
  if(session.step===3)return session.revealed?lesson.retrieveAnswer:'';
  if(session.step===4)return session.speakHidden?'':lesson.retrieveAnswer;
  if(session.step===5)return session.selected!==null?lesson.change[session.selected]:lesson.chunk;
  if(session.step===6)return session.personal||(session.selected!==null?lesson.change[session.selected]:lesson.chunk);
  return session.personal||lesson.retrieveAnswer;
}
function sentenceSpine(lesson){
  const phrase=phraseForSpine(lesson);
  const silent=!phrase&&(session.step===3||session.step===4);
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
function lessonStep(lesson){
  switch(session.step){
    case 0:return `<div class="eyebrow">${stepLabel('SCENE','場面')}</div><h1>${esc(state.support>=3?lesson.titleEs:lesson.title)}</h1><div class="notice">${bilingualCue(lesson.sceneEs,lesson.scene)}</div><p class="lead">${ui('まず意味のある場面から。文法の名前はあとでいい。','Empieza por una situación real. La gramática puede esperar.')}</p>${nextButton(ui('場面をつかんだ','Entendido'))}`;
    case 1:return `<div class="eyebrow">${stepLabel('MEANING / NOTICE','意味・気づき')}</div><p class="spanish">${esc(lesson.es)}</p>${jpHelp(lesson.ja)}<div class="notice">${noticeFor(lesson)}</div>${nextButton(ui('まとまりを見る','Ver el bloque'))}`;
    case 2:return `<div class="eyebrow">${stepLabel('CHUNK','かたまり')}</div><h1>${ui('使い回せる形にする。','Convierte la frase en un bloque reutilizable.')}</h1><div class="prompt-box"><small>CHUNK</small><strong>${esc(lesson.chunk)}</strong></div><p class="microcopy">${ui('___ だけ変える。文章を毎回ゼロから組み立てない。','Cambia solo ___. No construyas la frase desde cero cada vez.')}</p>${nextButton(ui('隠して思い出す','Recordar sin mirar'))}`;
    case 3:return `<div class="eyebrow">${stepLabel('RETRIEVE','思い出す')}</div><h1>${ui('見ずに、思い出す。','Recuerda sin mirar.')}</h1><div class="notice">${bilingualCue(lesson.retrieveCueEs,lesson.retrieve)}</div>${session.revealed?`<div class="reveal"><p class="spanish" style="font-size:30px;margin:0">${esc(lesson.retrieveAnswer)}</p>${jpHelp(lesson.retrieveAnswerJa,{minimal:true})}</div>${nextButton(ui('声に出す','Decirlo en voz alta'))}`:`<div class="lesson-actions"><button class="secondary-button" data-reveal>${ui('答えを見る','Ver respuesta')}</button></div>`}`;
    case 4:return `<div class="eyebrow">${stepLabel('SPEAK','声に出す')}</div><h1>${ui('声に出す。','Dilo en voz alta.')}</h1>${session.speakHidden?`<div class="prompt-box is-hidden-phrase"><small>HIDDEN · SAY IT</small><strong aria-label="文を隠しています">••••••••</strong></div><p class="lead">${ui('画面を見ずに一度言ってみる。詰まってもOK。','Dilo una vez sin mirar. No pasa nada si te atascas.')}</p><div class="lesson-actions"><button class="ghost-button" data-show-speak>${ui('見直す','Mirar otra vez')}</button>${nextButton(ui('言えた / 試した','Lo intenté'))}</div>`:`<div class="prompt-box"><small>LOOK</small><strong>${esc(lesson.retrieveAnswer)}</strong></div><p class="lead">${ui('一度読んだら、次に文を隠して話す。','Léelo una vez y después oculta la frase para hablar.')}</p><div class="lesson-actions"><button class="secondary-button" data-hide-speak>${ui('文を隠して話す','Ocultar y hablar')} →</button></div>`}`;
    case 5:return `<div class="eyebrow">${stepLabel('CHANGE','変える')}</div><h1>${ui('一部だけ変える。','Cambia solo una parte.')}</h1><p class="microcopy">${ui('気になるものを1つ選んで、声に出す。','Elige una opción y dilo en voz alta.')}</p><div class="choice-row">${lesson.change.map((value,index)=>`<button class="choice ${session.selected===index?'is-selected':''}" data-choice="${index}">${esc(value)}</button>`).join('')}</div>${session.selected!==null?nextButton(ui('自分の話にする','Hacerla tuya')):''}`;
    case 6:return `<div class="eyebrow">${stepLabel('PERSONALIZE','自分の一文')}</div><h1>${ui('自分の一文にする。','Haz una frase tuya.')}</h1><p class="lead">${ui('正解探しより、今日の自分に近づける。','No busques la frase perfecta: hazla más tuya.')}</p><textarea id="personalInput" aria-label="自分のスペイン語の一文" placeholder="${esc(lesson.chunk.replace('___','...'))}">${esc(session.personal)}</textarea>${session.personalError?`<p class="form-error" role="alert">${ui('1文だけ入力してみよう。選んだ例文を下書きにしてもOK。','Escribe una frase. También puedes usar la opción elegida como borrador.')}</p>`:''}<div class="lesson-actions">${session.selected!==null?`<button class="ghost-button" data-fill-personal>${ui('選んだ例文を下書きにする','Usar la opción como borrador')}</button>`:''}<button class="secondary-button" data-personal>${ui('この一文を使う','Usar esta frase')} →</button></div>`;
    case 7:return `<div class="eyebrow">${stepLabel('REUSE','再利用')}</div><h1>${ui('明日も、別の場所でも。','Úsala otra vez mañana.')}</h1><div class="notice"><b>${ui('次の再利用','Próxima reutilización')}</b><br>${esc(state.support>=3?lesson.reuseEs:lesson.reuse)}</div>${session.personal?`<div class="prompt-box"><small>MY SENTENCE</small><strong>${esc(session.personal)}</strong></div>`:''}<p class="microcopy">${ui('今の自信は？ Smart Random の優先度に使う。','¿Qué confianza tienes? La usaremos para priorizar la práctica.')}</p><div class="choice-row">${[[1,ui('まだ怪しい','Todavía difícil')],[2,ui('だいたい言える','Más o menos')],[3,ui('すぐ言える','Sale rápido')]].map(([value,text])=>`<button class="choice ${session.confidence===value?'is-selected':''}" data-confidence="${value}">${text}</button>`).join('')}</div>${nextButton(ui('今日の5分を完了','Terminar'))}`;
    case 8:{const finalSentence=session.personal||lesson.retrieveAnswer;return `<div class="done-burst">✓</div><div class="eyebrow">DONE · POCO A POCO</div><h1>${ui('今日、ひとつ増えた。','Hoy puedes decir una cosa más.')}</h1><small class="microcopy">${ui('今日の一文','TU FRASE DE HOY')}</small><strong class="big">${esc(finalSentence)}</strong><div class="next-suggestion"><p class="microcopy">${ui(`記録済み · 自信 ${session.confidence}/3`,`Guardado · confianza ${session.confidence}/3`)}</p><div class="lesson-actions"><button class="secondary-button" data-nav-home>${ui('ホームへ','Inicio')}</button><button class="ghost-button" data-nav-practice>${ui('復習を見る','Práctica')}</button></div></div>`}
  }
}
function nextButton(label){return `<div class="lesson-actions"><button class="secondary-button" data-next>${label} →</button></div>`}
function completeLesson(){
  const id=session.lesson.id;
  state.personal[id]=session.personal;
  state.history.push(buildCompletionRecord({lessonId:id,confidence:session.confidence,personal:session.personal,now:new Date()}));
  persist();
}

function bindEvents(){
  app.addEventListener('click',event=>{
    const start=event.target.closest('[data-start]');if(start){navigate(`lesson/${start.dataset.start}`);return}
    if(event.target.closest('[data-exit]')){session=null;navigate('home');return}
    if(event.target.closest('[data-reveal]')){session.revealed=true;renderLesson();return}
    if(event.target.closest('[data-hide-speak]')){session.speakHidden=true;renderLesson();return}
    if(event.target.closest('[data-show-speak]')){session.speakHidden=false;renderLesson();return}
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
  app.innerHTML=`<section class="empty"><strong>教材データを読み込めませんでした。</strong><p>公開前のデータ検証で問題を検出しました。</p></section>`;
}

if(contentErrors.length)renderContentFailure(contentErrors);
else{
  bindEvents();
  if(!location.hash)history.replaceState(null,'','#home');
  render();
}
