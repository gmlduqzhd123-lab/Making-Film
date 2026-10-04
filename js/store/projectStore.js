(() => {
  const Y=window.YVM, STORAGE_KEY='yeopssam-projects-v1', HISTORY_LIMIT=40, AUTOSAVE_MS=1000;
  let current=null, saved=[], undo=[], redo=[], timer, listeners=[], warning='',lastGroup='',lastEdit=0;
  try { const data=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]'); if(Array.isArray(data)) saved=data.filter(p=>p&&typeof p.id==='string'&&typeof p.title==='string'&&typeof p.style==='string'&&Array.isArray(p.scenes)&&Array.isArray(p.images)&&Array.isArray(p.features)); } catch { warning='저장 공간을 읽을 수 없습니다. JSON 다운로드로 프로젝트를 보관하세요.'; }
  function status(text){ const el=document.querySelector('#save-status'); if(el) el.textContent=text; }
  function persist(){
    if(!current)return;
    current.updatedAt=new Date().toISOString();
    const index=saved.findIndex(p=>p.id===current.id);
    if(index>=0)saved[index]=Y.clone(current); else saved.unshift(Y.clone(current));
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(saved)); status('✓ 저장됨'); warning=''; }
    catch { status('⚠ JSON 저장 필요'); warning='브라우저 저장 용량을 초과했거나 저장이 차단되어 있습니다. 이미지·음악이 포함된 project.json을 다운로드하세요.'; Y.toast(warning); }
  }
  const notify=()=>listeners.forEach(fn=>fn());
  Y.store={
    get:()=>current, all:()=>Y.clone(saved), warning:()=>warning, subscribe:fn=>listeners.push(fn),
    open(project){clearTimeout(timer);current=Y.clone(project);undo=[];redo=[];lastGroup='';notify();},
    change(fn, {render=true,history=true,group=''}={}){if(!current)return;const now=Date.now();if(history){if(!group||group!==lastGroup||now-lastEdit>900){undo.push(Y.clone(current));if(undo.length>HISTORY_LIMIT)undo.shift();}redo=[];lastGroup=group;lastEdit=now;}fn(current);Y.retime(current);status('저장 중…');clearTimeout(timer);timer=setTimeout(persist,AUTOSAVE_MS);if(render)notify();else{const undoButton=document.querySelector('#undo');if(undoButton)undoButton.disabled=!undo.length;const redoButton=document.querySelector('#redo');if(redoButton)redoButton.disabled=!redo.length;}},
    undo(){if(!undo.length)return;redo.push(Y.clone(current));current=undo.pop();lastGroup='';clearTimeout(timer);timer=setTimeout(persist,AUTOSAVE_MS);notify();},
    redo(){if(!redo.length)return;undo.push(Y.clone(current));current=redo.pop();lastGroup='';clearTimeout(timer);timer=setTimeout(persist,AUTOSAVE_MS);notify();},
    canUndo:()=>undo.length>0,canRedo:()=>redo.length>0, save:persist,
    remove(id){saved=saved.filter(p=>p.id!==id);if(current?.id===id){clearTimeout(timer);current=null;}try{localStorage.setItem(STORAGE_KEY,JSON.stringify(saved));}catch{Y.toast('저장소 삭제를 반영하지 못했습니다.');}},
    duplicate(id){const p=saved.find(p=>p.id===id);if(!p)return;const copy=Y.clone(p);copy.id=Y.id();copy.title+=' (복사)';this.open(copy);persist();},
    fresh(){return {version:1,id:Y.id(),title:'',url:'',description:'',category:'체육',subject:'체육',grade:'전학년',usage:'도입',login:'직접 입력',classTime:'',participation:'',features:['','',''],images:[],scenes:[],duration:60,targetDuration:60,ratio:'16:9',style:'Adventure',mood:'밝고 신나는',purpose:'서비스 소개',audience:['교사'],bgm:null,bgmVolume:35,bgmLoop:true,bgmFadeIn:2,bgmFadeOut:3};}
  };
  window.addEventListener('pagehide',()=>{if(current)persist();});
})();
