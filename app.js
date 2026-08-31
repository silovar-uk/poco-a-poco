'use strict';

const STORAGE_KEY = 'poco-a-poco-v1';
const app = document.querySelector('#app');
const supportButton = document.querySelector('#supportButton');
const supportDialog = document.querySelector('#supportDialog');
const supportChoices = document.querySelector('#supportChoices');

const lessons = [
  {id:'greet',level:'A0',title:'あいさつして、名前を言える',canDo:'会った人にあいさつし、自分の名前を伝える。',scene:'初めて会った人と、短くあいさつする。',es:'Hola, me llamo Yusuke.',ja:'こんにちは。ユウスケです。',notice:'<b>me llamo</b> は「私は〜という名前です」のまとまり。単語ごとより、ひとかたまりで。',chunk:'Me llamo ___ .',retrieve:'「私はユウスケです」を、スペイン語で思い出してみよう。',change:['Me llamo Ana.','Me llamo Ken.','Me llamo María.'],reuse:'明日、最初の30秒で名前を声に出してもう一度。'},
  {id:'like',level:'A0',title:'好きなものを一つ言える',canDo:'好きな食べ物やことを一つ伝える。',scene:'雑談で「何が好き？」と聞かれた。',es:'Me gusta el fútbol.',ja:'私はサッカーが好きです。',notice:'<b>Me gusta</b> を「私は〜が好き」として丸ごと使う。',chunk:'Me gusta ___ .',retrieve:'「私はコーヒーが好きです」をスペイン語で言ってみよう。',change:['Me gusta el café.','Me gusta la música.','Me gusta viajar.'],reuse:'今日見つけた「好き」を一つ、Me gusta で言う。'},
  {id:'want',level:'A0',title:'ほしいものを言える',canDo:'店や食事で、ほしいものを簡単に伝える。',scene:'カフェで注文したい。',es:'Quiero un café, por favor.',ja:'コーヒーを一つお願いします。',notice:'<b>Quiero</b> は「ほしい／〜したい」。por favor を足すと柔らかい。',chunk:'Quiero ___, por favor.',retrieve:'「水をお願いします」をスペイン語で言ってみよう。',change:['Quiero agua, por favor.','Quiero esto, por favor.','Quiero comer.'],reuse:'飲み物を取るとき心の中で Quiero ___ と言う。'},
  {id:'where',level:'A1',title:'場所をたずねられる',canDo:'駅やトイレなど、場所を簡単に聞ける。',scene:'知らない場所で目的地を探している。',es:'¿Dónde está la estación?',ja:'駅はどこですか？',notice:'<b>¿Dónde está...?</b> で「〜はどこ？」。場所の名詞を差し替える。',chunk:'¿Dónde está ___?',retrieve:'「トイレはどこですか？」をスペイン語で。',change:['¿Dónde está el baño?','¿Dónde está el hotel?','¿Dónde está la salida?'],reuse:'地図を開いたら、目についた場所を ¿Dónde está...? にする。'},
  {id:'from',level:'A1',title:'出身を言える',canDo:'自分の出身地や国を伝える。',scene:'旅行先で「どこから来たの？」と聞かれた。',es:'Soy de Japón.',ja:'日本出身です。',notice:'<b>Soy de</b> + 場所で「〜出身です」。',chunk:'Soy de ___ .',retrieve:'「東京出身です」をスペイン語で。',change:['Soy de Tokio.','Soy de Japón.','Soy de Saitama.'],reuse:'自己紹介で Me llamo... と Soy de... を続ける。'},
  {id:'today',level:'A1',title:'今日の状態を言える',canDo:'今の気分や状態を短く伝える。',scene:'友人に「元気？」と聞かれた。',es:'Estoy un poco cansado.',ja:'少し疲れています。',notice:'状態は <b>Estoy...</b> で始めると作りやすい。',chunk:'Estoy ___ .',retrieve:'「元気です」をスペイン語で言ってみよう。',change:['Estoy bien.','Estoy feliz.','Estoy ocupado.'],reuse:'夜に今日の状態を Estoy... で一言。'},
  {id:'time',level:'A1',title:'簡単な予定を言える',canDo:'今日・明日の簡単な予定を伝える。',scene:'明日の予定を友人に伝える。',es:'Mañana trabajo.',ja:'明日は仕事です。',notice:'時間語 <b>Mañana</b> を先に置くだけでも、短い予定が作れる。',chunk:'Mañana ___ .',retrieve:'「明日は勉強します」をスペイン語で。',change:['Mañana estudio.','Mañana descanso.','Mañana viajo.'],reuse:'寝る前に Mañana... で明日を一つ言う。'},
  {id:'opinion',level:'A1+',title:'簡単な感想を言える',canDo:'見たもの・食べたものに短い感想を返す。',scene:'食事の感想を聞かれた。',es:'Está muy rico.',ja:'とてもおいしいです。',notice:'<b>Está...</b> を使うと「今それが〜な状態」と短く評価できる。',chunk:'Está muy ___ .',retrieve:'「とてもいいです」をスペイン語で。',change:['Está muy bien.','Está muy bonito.','Está muy interesante.'],reuse:'今日触れたもの一つを Está muy... で評価する。'}
];

const discoveryItems = [
  {type:'WORD',title:'sobremesa',word:'sobremesa',body:'食後、席を立たずに会話を楽しむ時間。日本語の一語訳にしにくい、生活文化ごとの語彙。',tag:'文化と言葉'},
  {type:'CHUNK',title:'「まあ、ぼちぼち」',word:'poco a poco',body:'「少しずつ」。学習にも日常にも使える。Voy aprendiendo poco a poco. なら「少しずつ覚えています」。',tag:'使える表現'},
  {type:'NOTICE',title:'¿ の向きには理由がある',word:'¿Por qué?',body:'スペイン語は疑問文の始まりにも記号を置く。長い文でも、読む側が最初から「質問」と分かる。',tag:'文字の仕組み'},
  {type:'CULTURE',title:'tú と usted',word:'¿Cómo está?',body:'距離感によって「あなた」の形が変わる。まずは表現を丸ごと覚え、文法説明は必要になったときに足す。',tag:'距離感'},
  {type:'SOUND',title:'j は日本語の「ハ」より強め',word:'Japón',body:'j は喉の奥で摩擦を作る音。完璧な採点より、まず音の違いに気づく。',tag:'音'},
  {type:'PATTERN',title:'同じ型を使い回す',word:'Me gusta ___',body:'fútbol / café / viajar。ひとつの型に自分の語彙を差し替えるだけで、話せる範囲はすぐ広がる。',tag:'再利用'}
];

function defaultState(){return {support:2,history:[],personal:{},lastRoute:'home'};}
function loadState(){try{return {...defaultState(),...JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')}}catch{return defaultState()}}
let state=loadState();
let session=null;
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}
function esc(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function todayKey(){return new Date().toLocaleDateString('sv-SE');}
function completedIds(){return new Set(state.history.map(h=>h.lessonId));}
function lessonHistory(id){return state.history.filter(h=>h.lessonId===id)}
function currentRoute(){return (location.hash||'#home').slice(1).split('/')[0]||'home'}
function jpText(ja,{minimal=false}={}){if(state.support===4)return '';if(state.support===3&&minimal)return '';return ja;}
function setNav(route){document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('is-active',b.dataset.nav===route));}
function navigate(route){location.hash=route;}

function render(){const hash=(location.hash||'#home').slice(1);const [route,id]=hash.split('/');state.lastRoute=route;saveState();setNav(route);window.scrollTo({top:0,behavior:'instant'});if(route==='path')renderPath();else if(route==='practice')renderPractice();else if(route==='discovery')renderDiscovery();else if(route==='lesson'&&id)startLesson(id);else renderHome();updateSupportButton();}

function renderHome(){
  const done=completedIds().size; const today=state.history.filter(h=>h.date===todayKey()).length; const streak=calcStreak(); const next=pickNextLesson();
  app.innerHTML=`
    <section class="hero">
      <div class="eyebrow">HABLAR · POCO A POCO</div>
      <h1>5分で、<br>ひとつ話せる。</h1>
      <p class="lead">${state.support<=2?'日本語を足場にしながら、':''}見るだけで終わらず、思い出す → 声に出す → 自分の話へ変える。毎日ちょっとずつ。</p>
      <div class="today-card">
        <small>TODAY · 約5分</small><h2>今日の5分</h2>
        <p>${esc(next.canDo)}</p>
        <button class="primary-button" data-start="${next.id}">${today?'もう一つ話す':'今日の5分をはじめる'} →</button>
      </div>
      <div class="stats-row"><div class="stat"><strong>${done}/${lessons.length}</strong><small>CAN-DO</small></div><div class="stat"><strong>${state.history.length}</strong><small>SESSIONS</small></div><div class="stat"><strong>${streak}</strong><small>DAY STREAK</small></div></div>
      <div class="section-head"><div><div class="eyebrow">THREE WAYS</div><h2>迷わず進む。寄り道もする。</h2></div></div>
      <div class="mini-grid">
        <a href="#path" class="mini-card"><span class="badge">PATH</span><b>次を決める</b><span>Can-do順に、話せる範囲を広げる。</span></a>
        <a href="#practice" class="mini-card"><span class="badge orange">PRACTICE</span><b>思い出す</b><span>覚えた表現を、使える状態へ戻す。</span></a>
        <a href="#discovery" class="mini-card"><span class="badge yellow">DISCOVERY</span><b>寄り道する</b><span>言葉・文化・音から偶然の発見。</span></a>
      </div>
    </section>`;
}

function renderPath(){const done=completedIds();app.innerHTML=`<section class="page-head"><div class="eyebrow">PATH</div><h1>できることから、進む。</h1><p class="lead">文法項目ではなく「何を言えるようになるか」で道を作る。</p></section><div class="card-list">${lessons.map((l,i)=>{const count=lessonHistory(l.id).length;return `<button class="path-card" data-start="${l.id}"><div class="card-top"><span class="badge">${l.level} · ${done.has(l.id)?'DONE':'STEP '+(i+1)}</span><span class="arrow">→</span></div><h3>${esc(l.title)}</h3><p>${esc(l.canDo)}</p><div class="progress"><i style="width:${done.has(l.id)?100:count?65:8}%"></i></div></button>`}).join('')}</div>`}

function priorityScore(l){const hs=lessonHistory(l.id);if(!hs.length)return -999;const last=hs.at(-1);const age=(Date.now()-new Date(last.completedAt).getTime())/86400000;return (last.confidence===1?50:last.confidence===2?25:0)+age+Math.max(0,3-hs.length)*4;}
function practiceLessons(){return lessons.filter(l=>lessonHistory(l.id).length).sort((a,b)=>priorityScore(b)-priorityScore(a));}
function renderPractice(){const list=practiceLessons();app.innerHTML=`<section class="page-head"><div class="eyebrow">PRACTICE</div><h1>忘れる前提で、戻る。</h1><p class="lead">Smart Random は完全ランダムではなく「自信が低い・時間が空いた・回数が少ない」表現を優先する。</p></section>${list.length?`<div class="today-card"><small>SMART RANDOM</small><h2>${esc(list[0].title)}</h2><p>${esc(list[0].canDo)}</p><button class="primary-button" data-start="${list[0].id}">これを練習する →</button></div><div class="section-head"><div><div class="eyebrow">QUEUE</div><h2>次に戻りたい表現</h2></div></div><div class="card-list">${list.slice(1).map(l=>`<button class="practice-card" data-start="${l.id}"><div class="card-top"><span class="badge orange">RETRIEVE</span><span class="arrow">→</span></div><h3>${esc(l.title)}</h3><p>前回: ${relativeDate(lessonHistory(l.id).at(-1).completedAt)} · 自信 ${lessonHistory(l.id).at(-1).confidence}/3</p></button>`).join('')}</div>`:`<div class="empty">まだ復習データがないで。まず「今日の5分」を1つ完了すると、ここに戻るべき表現が育っていく。</div>`}`}

function renderDiscovery(){app.innerHTML=`<section class="page-head"><div class="eyebrow">DISCOVERY</div><h1>予定外の言葉に、出会う。</h1><p class="lead">学習の道筋とは別に、文化・音・表現から「これ面白い」を増やす場所。</p></section><div class="card-list">${shuffle([...discoveryItems]).map(x=>`<article class="discovery-card"><div class="card-top"><span class="badge yellow">${x.type}</span><span class="microcopy">${x.tag}</span></div><div class="word">${esc(x.word)}</div><h3>${esc(x.title)}</h3><p>${esc(x.body)}</p></article>`).join('')}</div>`}

function startLesson(id){const lesson=lessons.find(l=>l.id===id);if(!lesson){navigate('home');return}if(!session||session.lesson.id!==id)session={lesson,step:0,confidence:2,personal:state.personal[id]||'',startedAt:new Date().toISOString(),revealed:false,selected:null};renderLesson();}
function renderLesson(){const l=session.lesson; const total=9; const pct=Math.round(((session.step+1)/total)*100); app.innerHTML=`<section class="lesson"><div class="lesson-top"><button class="icon-button" data-exit aria-label="学習を終了">×</button><div class="lesson-step"><i style="width:${pct}%"></i></div><small>${session.step+1}/${total}</small></div><div class="lesson-body ${session.step===8?'completion':''}">${lessonStep(l)}</div></section>`}
function lessonStep(l){
  switch(session.step){
    case 0:return `<div class="eyebrow">SCENE</div><h1>${esc(l.title)}</h1><div class="notice">${esc(l.scene)}</div><p class="lead">まず意味のある場面から。文法の名前はあとでいい。</p>${nextButton('場面をつかんだ')}`;
    case 1:return `<div class="eyebrow">MEANING / NOTICE</div><p class="spanish">${esc(l.es)}</p>${jpText(`<p class="translation">${esc(l.ja)}</p>`)}<div class="notice">${l.notice}</div>${nextButton('まとまりを見る')}`;
    case 2:return `<div class="eyebrow">CHUNK</div><h1>使い回せる形にする。</h1><div class="prompt-box"><small>CHUNK</small><strong>${esc(l.chunk)}</strong></div><p class="microcopy">___ だけ変える。文章を毎回ゼロから組み立てない。</p>${nextButton('隠して思い出す')}`;
    case 3:return `<div class="eyebrow">RETRIEVE</div><h1>見ずに、思い出す。</h1><div class="notice">${esc(l.retrieve)}</div>${session.revealed?`<div class="reveal"><p class="spanish" style="font-size:30px;margin:0">${esc(l.es)}</p>${jpText(`<p class="translation" style="margin:8px 0 0">${esc(l.ja)}</p>`,{minimal:true})}</div>${nextButton('声に出す')}`:`<div class="lesson-actions"><button class="secondary-button" data-reveal>答えを見る</button></div>`}`;
    case 4:return `<div class="eyebrow">SPEAK</div><h1>声に出す。</h1><div class="prompt-box"><small>LOOK → HIDE → SAY</small><strong>${esc(l.es)}</strong></div><p class="lead">一度読んだら、画面から目を離して言う。発音採点はなし。まず「口から出す」を作る。</p>${nextButton('言えた / 試した')}`;
    case 5:return `<div class="eyebrow">CHANGE</div><h1>一部だけ変える。</h1><p class="microcopy">気になるものを1つ選んで、声に出す。</p><div class="choice-row">${l.change.map((x,i)=>`<button class="choice ${session.selected===i?'is-selected':''}" data-choice="${i}">${esc(x)}</button>`).join('')}</div>${session.selected!==null?nextButton('自分の話にする'):''}`;
    case 6:return `<div class="eyebrow">PERSONALIZE</div><h1>自分の一文にする。</h1><p class="lead">正解探しより、今日の自分に近づける。</p><textarea id="personalInput" placeholder="${esc(l.chunk.replace('___','...'))}">${esc(session.personal)}</textarea><div class="lesson-actions"><button class="secondary-button" data-personal>この一文を使う →</button></div>`;
    case 7:return `<div class="eyebrow">REUSE</div><h1>明日も、別の場所でも。</h1><div class="notice"><b>次の再利用</b><br>${esc(l.reuse)}</div>${session.personal?`<div class="prompt-box"><small>MY SENTENCE</small><strong>${esc(session.personal)}</strong></div>`:''}<p class="microcopy">今の自信は？ Smart Random の優先度に使う。</p><div class="choice-row">${[[1,'まだ怪しい'],[2,'だいたい言える'],[3,'すぐ言える']].map(([v,t])=>`<button class="choice ${session.confidence===v?'is-selected':''}" data-confidence="${v}">${t}</button>`).join('')}</div>${nextButton('今日の5分を完了')}`;
    case 8:return `<div class="done-burst">✓</div><div class="eyebrow">DONE · POCO A POCO</div><h1>今日、ひとつ増えた。</h1><strong class="big">${esc(l.es)}</strong><p class="lead">${jpText(esc(l.ja))||'Say it again tomorrow.'}</p><div class="next-suggestion"><p class="microcopy">記録済み · 自信 ${session.confidence}/3</p><div class="lesson-actions"><button class="secondary-button" data-nav-home>ホームへ</button><button class="ghost-button" data-nav-practice>復習を見る</button></div></div>`;
  }
}
function nextButton(label){return `<div class="lesson-actions"><button class="secondary-button" data-next>${label} →</button></div>`}
function completeLesson(){const id=session.lesson.id;state.personal[id]=session.personal;state.history.push({lessonId:id,date:todayKey(),completedAt:new Date().toISOString(),confidence:session.confidence,personal:session.personal});saveState();}
function pickNextLesson(){const done=completedIds();return lessons.find(l=>!done.has(l.id))||practiceLessons()[0]||lessons[0]}
function calcStreak(){const dates=[...new Set(state.history.map(h=>h.date))].sort().reverse();if(!dates.length)return 0;let cursor=new Date();let n=0;for(const d of dates){const key=cursor.toLocaleDateString('sv-SE');if(d===key){n++;cursor.setDate(cursor.getDate()-1)}else{const y=new Date();y.setDate(y.getDate()-1);if(n===0&&d===y.toLocaleDateString('sv-SE')){n++;cursor=y;cursor.setDate(cursor.getDate()-1)}else break}}return n}
function relativeDate(iso){const days=Math.floor((Date.now()-new Date(iso).getTime())/86400000);return days<=0?'今日':days===1?'昨日':`${days}日前`}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}

function renderSupportChoices(){const rows=[[1,'Level 1','日本語中心 + スペイン語'],[2,'Level 2','日本語とスペイン語を併用'],[3,'Level 3','スペイン語中心 + 必要時だけ日本語'],[4,'Level 4','原則スペイン語']];supportChoices.innerHTML=rows.map(([v,t,s])=>`<button type="button" class="support-choice ${state.support===v?'is-active':''}" data-support="${v}"><strong>${t}</strong><small>${s}</small></button>`).join('')}
function updateSupportButton(){supportButton.textContent=`JP ${state.support}`;renderSupportChoices()}

app.addEventListener('click',e=>{
  const start=e.target.closest('[data-start]');if(start){navigate(`lesson/${start.dataset.start}`);return}
  if(e.target.closest('[data-exit]')){session=null;navigate('home');return}
  if(e.target.closest('[data-reveal]')){session.revealed=true;renderLesson();return}
  const choice=e.target.closest('[data-choice]');if(choice){session.selected=Number(choice.dataset.choice);renderLesson();return}
  const conf=e.target.closest('[data-confidence]');if(conf){session.confidence=Number(conf.dataset.confidence);renderLesson();return}
  if(e.target.closest('[data-personal]')){const v=document.querySelector('#personalInput').value.trim();session.personal=v||session.lesson.chunk.replace('___','...');session.step++;renderLesson();return}
  if(e.target.closest('[data-next]')){if(session.step===7)completeLesson();session.step=Math.min(8,session.step+1);renderLesson();return}
  if(e.target.closest('[data-nav-home]')){session=null;navigate('home');return}
  if(e.target.closest('[data-nav-practice]')){session=null;navigate('practice');return}
});

document.addEventListener('click',e=>{const nav=e.target.closest('[data-nav]');if(nav){e.preventDefault();navigate(nav.dataset.nav)}});
supportButton.addEventListener('click',()=>{renderSupportChoices();supportDialog.showModal()});
supportChoices.addEventListener('click',e=>{const b=e.target.closest('[data-support]');if(!b)return;state.support=Number(b.dataset.support);saveState();updateSupportButton();supportDialog.close();render()});
window.addEventListener('hashchange',()=>{session=null;render()});
if(!location.hash)history.replaceState(null,'','#home');
render();
