'use strict';

(function(){
  const appRoot=document.querySelector('#app');
  const themeMeta=document.querySelector('meta[name="theme-color"]');
  const stepNames=['scene','meaning','chunk','retrieve','speak','change','personalize','reuse','done'];
  const stepKickers=['SITUACIÓN','SIGNIFICADO','BLOQUE','MEMORIA','VOZ','VARIACIÓN','TU FRASE','OTRA VEZ','HECHO'];
  const stepThemes=['#f3efe4','#f3efe4','#ece8dc','#172720','#172720','#f3efe4','#f7f1df','#e6eee7','#f0c84a'];

  function safe(value=''){
    return String(value).replace(/[&<>\"']/g,char=>({
      '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'
    }[char]));
  }

  function getRoute(){
    return (location.hash||'#home').slice(1).split('/')[0]||'home';
  }

  function getSupportLevel(){
    try{return typeof state!=='undefined'&&state?Number(state.support)||2:2}catch{return 2}
  }

  function getStep(){
    const label=document.querySelector('.lesson-top > small');
    if(!label)return null;
    const value=parseInt(label.textContent,10);
    return Number.isFinite(value)?Math.max(0,Math.min(8,value-1)):null;
  }

  function getSession(){
    try{return typeof session!=='undefined'?session:null}catch{return null}
  }

  function phraseFor(step,s){
    if(!s||!s.lesson)return '';
    const l=s.lesson;
    if(step===0)return '';
    if(step===1)return l.es||'';
    if(step===2)return l.chunk||'';
    if(step===3)return s.revealed?(l.retrieveAnswer||''):'';
    if(step===4)return s.speakHidden?'':(l.retrieveAnswer||'');
    if(step===5)return s.selected!==null&&s.selected!==undefined?(l.change?.[s.selected]||''):(l.chunk||'');
    if(step===6)return s.personal||(s.selected!==null&&s.selected!==undefined?(l.change?.[s.selected]||''):(l.chunk||''));
    if(step===7)return s.personal||l.retrieveAnswer||'';
    if(step===8)return s.personal||l.retrieveAnswer||'';
    return '';
  }

  function decorateLesson(){
    const lesson=document.querySelector('.lesson');
    const step=getStep();
    if(!lesson||step===null){
      delete document.body.dataset.step;
      return;
    }

    const mode=stepNames[step];
    lesson.dataset.step=String(step);
    lesson.dataset.mode=mode;
    document.body.dataset.step=String(step);
    if(themeMeta)themeMeta.setAttribute('content',stepThemes[step]);

    const body=lesson.querySelector('.lesson-body');
    if(!body)return;
    stepNames.forEach(name=>body.classList.remove(`mode-${name}`));
    body.classList.add(`mode-${mode}`);

    if(!body.querySelector('.sentence-spine')){
      const s=getSession();
      const phrase=phraseFor(step,s);
      const isSilent=!phrase&&(step===3||step===4);
      const marker=step===8?'09':String(step+1).padStart(2,'0');
      const html=`<div class="sentence-spine ${isSilent?'is-silent':''}" aria-hidden="true"><span class="sentence-spine__index">${marker}</span><span class="sentence-spine__stage">${stepKickers[step]}</span>${phrase?`<span class="sentence-spine__phrase">${safe(phrase)}</span>`:`<span class="sentence-spine__breath">${isSilent?'· · ·':'poco a poco'}</span>`}</div>`;
      body.insertAdjacentHTML('afterbegin',html);
    }
  }

  function decorateRoute(){
    const route=getRoute();
    const support=getSupportLevel();
    document.body.dataset.route=route;
    document.body.dataset.jp=String(support);
    document.body.classList.toggle('is-lesson',route==='lesson');

    if(route!=='lesson'){
      delete document.body.dataset.step;
      if(themeMeta)themeMeta.setAttribute('content','#f3efe4');
    }

    const routeMap={path:'01 / 03',practice:'02 / 03',discovery:'03 / 03'};
    const head=document.querySelector('.page-head');
    if(head&&routeMap[route]&&!head.querySelector('.route-index')){
      head.insertAdjacentHTML('afterbegin',`<span class="route-index" aria-hidden="true">${routeMap[route]}</span>`);
    }

    document.querySelectorAll('.mini-card').forEach((card,index)=>card.dataset.index=String(index+1).padStart(2,'0'));
    document.querySelectorAll('.path-card').forEach((card,index)=>card.dataset.index=String(index+1).padStart(2,'0'));
    document.querySelectorAll('.discovery-card').forEach((card,index)=>card.dataset.index=String(index+1).padStart(2,'0'));
  }

  function decorate(){
    decorateRoute();
    decorateLesson();
  }

  let scheduled=false;
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;decorate()});
  }

  if(appRoot){
    const observer=new MutationObserver(schedule);
    observer.observe(appRoot,{childList:true,subtree:true});
  }

  window.addEventListener('hashchange',schedule);
  document.addEventListener('click',schedule,true);
  schedule();
})();
