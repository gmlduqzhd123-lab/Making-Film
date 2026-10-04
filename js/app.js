(() => {
 const Y=window.YVM,$=s=>document.querySelector(s),e=Y.esc;
 let inEditor=false;
 function sampleCard(p){return `<article class="sample-card"><div class="cover" style="--sample-color:${e(p.color)}"><span>${e(p.title)}</span><small>예시 화면 포함</small></div><div class="card-body"><h3>${e(p.title)}</h3><p class="hint">${e(p.description)}</p><div class="actions"><span class="badge">60초 · ${e(p.style)}</span><button class="small" data-sample="${e(p.slug)}">샘플 열기 ↗</button></div></div></article>`;}
 function home(){
  if(inEditor)Y.store.save();Y.leaveEditor();inEditor=false;const projects=Y.store.all();
  $('#app').innerHTML=`<div class="home"><section class="hero"><div><div class="eyebrow">FOR TEACHERS, BY TEACHERS</div><h1>웹앱 하나,<br><em>영상 한 편.</em></h1><p>좋은 웹앱을 만들었다면, 이제 보여줄 차례입니다.<br>소개영상 제작은 엽쌤스쿨 영상제작기가 도와드립니다.</p><div class="actions"><button id="new-project" class="primary large">＋ 내 웹앱 영상 만들기</button><button id="import-project" class="large">프로젝트 불러오기</button></div><span class="hero-note">무료로, 가입 없이. 내 화면과 이야기만 준비하세요.</span></div><div class="hero-art" aria-hidden="true"><div class="mock-player"><span class="tiny">YOUR CLASSROOM, YOUR STORY</span><strong>교사가 만든 좋은 수업,<br>더 많은 교실에 닿도록.</strong><span class="play-circle">▶</span></div><div class="floating-tag">60초, 우리 수업의 가능성</div></div></section><div class="steps-strip"><span><b>01</b>웹앱 정보 입력</span><span><b>02</b>화면과 특징 선택</span><span><b>03</b>60초 영상 구성</span><span><b>04</b>수정하고 다운로드</span></div><section id="projects"><div class="section-head"><div><h2>내 프로젝트</h2><p class="hint">이 브라우저에 저장한 이야기</p></div><span class="hint">${projects.length}개 프로젝트</span></div>${projects.length?`<div class="card-grid">${projects.map(p=>`<article class="project-card"><span class="badge">${e(p.style)}</span><h3 style="margin:14px 0 6px">${e(p.title||'이름 없는 프로젝트')}</h3><p class="hint">${p.duration}초 · ${p.scenes.length}개 장면 · ${e(p.updatedAt?new Date(p.updatedAt).toLocaleDateString('ko-KR'):'')}</p><div class="actions"><button class="primary small" data-open="${e(p.id)}">수정</button><button class="small" data-duplicate="${e(p.id)}">복제</button><button class="small" data-project-export="${e(p.id)}">JSON</button><button class="quiet small danger" data-delete="${e(p.id)}">삭제</button></div></article>`).join('')}</div>`:'<div class="empty">아직 저장한 영상이 없어요. 새 영상이나 샘플로 첫 이야기를 시작해 보세요.</div>'}</section><section id="samples"><div class="section-head"><div><h2>이런 영상은 어떨까요?</h2><p class="hint">6개의 샘플을 열고, 내 웹앱에 맞게 바꿔 보세요.</p></div><span class="hint">8가지 영상 스타일</span></div><div class="card-grid">${Y.catalog.samples.map(sampleCard).join('')}</div></section></div>`;
  $('#new-project').insertAdjacentHTML('afterend','<button id="prd-new" class="large">✦ PRD로 영상 만들기</button>');
  $('#prd-new').onclick=Y.openPRDImport;
  $('#new-project').onclick=newProject;$('#import-project').onclick=()=>$('#project-file').click();
  document.querySelectorAll('[data-sample]').forEach(b=>b.onclick=()=>{Y.store.save();const p=Y.clone(Y.catalog.samples.find(p=>p.slug===b.dataset.sample));p.id=Y.id();delete p.updatedAt;Y.store.open(p);Y.enterEditor(5);navigateEditor();});
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{Y.store.open(Y.store.all().find(p=>p.id===b.dataset.open));Y.enterEditor(5);navigateEditor();});
  document.querySelectorAll('[data-duplicate]').forEach(b=>b.onclick=()=>{Y.store.duplicate(b.dataset.duplicate);home();});
  document.querySelectorAll('[data-project-export]').forEach(b=>b.onclick=()=>Y.download('project.json',JSON.stringify(Y.store.all().find(p=>p.id===b.dataset.projectExport),null,2),'application/json'));
  document.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>{const p=Y.store.all().find(p=>p.id===b.dataset.delete);Y.modal('프로젝트 삭제',`<p>이 브라우저에서 “${e(p.title)}” 프로젝트를 삭제합니다.</p><button id="delete-confirm" class="danger">프로젝트 삭제</button>`);$('#delete-confirm').onclick=()=>{Y.store.remove(p.id);$('#modal').close();home();};});
  if(location.hash==='#samples')$('#samples').scrollIntoView({behavior:'smooth'});
 }
 function navigateEditor(){if(location.hash==='#editor')route();else location.hash='editor';}
 Y.openPRDProject=project=>{const current=Y.store.get();if(current&&(current.title||current.scenes.length||current.images.length))Y.store.save();Y.store.open(project);Y.enterEditor(5);navigateEditor();Y.store.save();};
 function newProject(){Y.store.save();Y.store.open(Y.store.fresh());Y.enterEditor(1);navigateEditor();}
 function route(){if(location.hash==='#editor'&&Y.store.get()){inEditor=true;Y.renderEditor();window.scrollTo(0,0);}else home();}
 Y.store.subscribe(()=>{if(inEditor)Y.renderEditor();});window.addEventListener('hashchange',route);
 $('#project-file').onchange=async ev=>{const file=ev.target.files[0];ev.target.value='';if(!file)return;try{const project=await Y.importProject(file);Y.store.save();Y.store.open(project);Y.enterEditor(project.scenes.length?5:1);navigateEditor();Y.toast('이미지와 장면을 포함한 프로젝트를 불러왔습니다.');}catch(error){Y.toast(error.message);}};
 $('#help').onclick=()=>Y.modal('처음 만드는 소개영상',`<div class="onboard-steps"><div><b>1</b><span>웹앱 이름과 중요한 기능을 입력하세요.</span></div><div><b>2</b><span>실제 웹앱의 스크린샷을 1장 이상 넣으세요.</span></div><div><b>3</b><span>스타일을 고르고 영상 구성을 만드세요.</span></div></div><p class="hint">오른쪽 장면에서 문구·내레이션·시간을 수정하고 순서를 바꾸세요. 완성한 영상은 HTML 또는 ZIP으로 다운로드할 수 있습니다. 프로젝트는 JSON으로 보관하면 다른 기기에서도 이어 만들 수 있어요.</p><p class="hint">Space 재생 · Ctrl+S 저장 · Ctrl+Z 되돌리기 · Ctrl+Shift+Z 다시 실행 · Ctrl+D 장면 복제 · Delete 장면 삭제<br>입력창에서는 글자 편집 단축키가 우선합니다.</p><button id="help-new" class="primary full">30초 만에 시작하기</button>`);
 document.querySelector('#modal').addEventListener('click',ev=>{if(ev.target.id==='help-new'){document.querySelector('#modal').close();newProject();}});
 window.addEventListener('keydown',ev=>{
  if(!inEditor||$('#modal').open)return;const editing=/INPUT|TEXTAREA|SELECT/.test(ev.target.tagName)||ev.target.isContentEditable,ctrl=ev.ctrlKey||ev.metaKey;
  if(ctrl&&ev.key.toLowerCase()==='s'){ev.preventDefault();Y.store.save();Y.toast(Y.store.warning()||'프로젝트를 저장했습니다.');return;}
  if(editing)return;
  if(ctrl&&ev.key.toLowerCase()==='z'){ev.preventDefault();ev.shiftKey?Y.store.redo():Y.store.undo();}
  else if(ctrl&&ev.key.toLowerCase()==='d'){ev.preventDefault();Y.duplicateScene();}
  else if(ev.key==='Delete'){ev.preventDefault();Y.deleteScene();}
  else if(ev.code==='Space'&&ev.target.tagName!=='BUTTON'){ev.preventDefault();Y.player?.toggle();}
 });
 route();
 let seen=false;try{seen=localStorage.getItem('yeopssam-onboarded')==='1';}catch{}
 if(!seen){$('#help').click();try{localStorage.setItem('yeopssam-onboarded','1');}catch{}}
 if('speechSynthesis' in window)speechSynthesis.getVoices();
})();
