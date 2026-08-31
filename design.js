const themeMeta=document.querySelector('meta[name="theme-color"]');
const stepThemes=['#f3efe4','#eef2e9','#dbe8df','#172720','#172720','#f7eadf','#f7f1df','#f7edbd','#f0c84a'];

function applyDesignState(detail={}){
  const route=detail.route||document.body.dataset.route||'home';
  const step=detail.step??(document.body.dataset.step!==undefined?Number(document.body.dataset.step):null);
  document.body.classList.toggle('is-lesson',route==='lesson');
  if(themeMeta)themeMeta.setAttribute('content',route==='lesson'&&step!==null?(stepThemes[step]||'#f3efe4'):'#f3efe4');
}

window.addEventListener('poco:render',event=>applyDesignState(event.detail));
applyDesignState();
