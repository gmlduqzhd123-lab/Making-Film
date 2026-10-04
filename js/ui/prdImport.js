(() => {
  const Y=window.YVM,$=s=>document.querySelector(s),e=Y.esc;
  const SAMPLE=`# 별빛 퀴즈 PRD\n프로젝트명: 별빛 퀴즈\n한 줄 소개: 학생들이 함께 퀴즈를 풀고 배움을 확인하는 교실 도구\n웹앱 분야: 놀이\n교과: 사회\n학년: 3~4학년\n대상: 교사, 학생\n영상 길이: 60초\n\n## 핵심 기능\n- 주제별 퀴즈 선택\n- 팀별 문제 풀이\n- 결과 확인\n\n## 향후 기능\n- AI 문제 생성\n`;
  let session=0;
  function error(message){const box=$('#prd-error');box.hidden=false;box.textContent=message;}
  function result(parsed){
    const p=parsed.project;
    $('#prd-result').innerHTML=`<h3>추출한 내용</h3><p class="hint">본문에서 찾은 내용에 추천 설정을 더했습니다. 필요한 부분을 고친 뒤 생성하세요.</p><div class="inline"><label class="field">웹앱 이름 *<input id="prd-title" maxlength="120" value="${e(p.title)}"></label><label class="field">영상 길이<select id="prd-duration">${[30,45,60,90].map(n=>`<option value="${n}" ${n===p.targetDuration?'selected':''}>${n}초</option>`).join('')}</select></label></div><label class="field">한 줄 소개<input id="prd-description" maxlength="160" value="${e(p.description)}"></label><label class="field">웹앱 URL<input id="prd-url" type="url" value="${e(p.url)}"></label><label class="field">핵심 기능 · 줄마다 하나, 최대 5개<textarea id="prd-features" rows="5">${e(p.features.join('\n'))}</textarea></label><div class="inline"><label class="field">분야<select id="prd-category">${['체육','사회','역사','음악','국어','AI','코딩','놀이','업무효율','기타'].map(v=>`<option ${v===p.category?'selected':''}>${v}</option>`).join('')}</select></label><label class="field">학년<input id="prd-grade" value="${e(p.grade)}"></label></div><span class="label">영상 대상</span><div class="check-row">${['학생','교사','학부모','교육 관계자'].map(v=>`<label><input type="checkbox" data-prd-audience="${v}" ${p.audience.includes(v)?'checked':''}>${v}</label>`).join('')}</div><p class="hint">${e(p.subject)} · ${e(p.usage)} · ${e(p.style)}<br>분야: ${e(parsed.evidence.category||'본문')} / 대상: ${e(parsed.evidence.audience||'본문')} / 길이: ${e(parsed.evidence.targetDuration||'본문')}</p>${parsed.warnings.map(w=>`<div class="warning">${e(w)}</div>`).join('')}<button id="prd-create" class="primary full large">✦ 이 PRD로 영상 만들기</button>`;
    $('#prd-result').hidden=false;
    $('#prd-create').onclick=()=>{
      const title=$('#prd-title').value.trim(),features=$('#prd-features').value.split('\n').map(v=>v.trim()).filter(Boolean),url=$('#prd-url').value.trim(),audience=Array.from(document.querySelectorAll('[data-prd-audience]:checked')).map(el=>el.dataset.prdAudience);
      if(!title){error('웹앱 이름을 입력해 주세요.');$('#prd-title').focus();return;}
      if(!features.length||features.length>5){error('핵심 기능은 1~5개를 줄마다 하나씩 넣어 주세요.');$('#prd-features').focus();return;}
      if(url&&!Y.safeURL(url)){error('웹앱 URL을 http/https 주소로 입력해 주세요.');$('#prd-url').focus();return;}
      if(!audience.length){error('대상을 하나 이상 선택하세요.');return;}
      const project=Y.clone(p);Object.assign(project,{title,features,url,description:$('#prd-description').value.trim(),grade:$('#prd-grade').value.trim()||'전학년',targetDuration:Number($('#prd-duration').value),audience});
      if(project.category!==$('#prd-category').value){project.category=$('#prd-category').value;project.style=Y.recommend(project.category);}
      Y.generate(project);$('#modal').close();Y.openPRDProject(project);Y.toast(`${project.duration}초 PRD 영상 초안을 만들었습니다. 실제 화면을 추가하고 문구를 확인하세요.`);
    };
  }
  Y.openPRDImport=()=>{
    const token=++session;let filename='';
    Y.modal('PRD로 영상 만들기',`<p class="hint">PRD 파일이나 텍스트에서 정보를 추출해 영상 초안을 만듭니다. 현재 작업은 보관하고 새 프로젝트로 생성합니다. 모든 처리는 이 브라우저 안에서 이루어집니다.</p><label class="dropzone" id="prd-drop" tabindex="0" role="button" aria-label="PRD 파일 업로드"><strong>PRD 파일 선택 또는 끌어다 놓기</strong><small>TXT · MD · JSON · DOCX · HWPX</small><input id="prd-file" type="file" accept=".txt,.md,.markdown,.json,.docx,.hwpx" hidden></label><p id="prd-file-status" class="hint" role="status" aria-live="polite">텍스트 2MB / DOCX·HWPX 12MB 이하 · PDF·HWP는 본문을 붙여 넣어 주세요.</p><label class="field">PRD 텍스트<textarea id="prd-text" maxlength="200000" placeholder="프로젝트명, 한 줄 소개, 핵심 기능, 대상 등이 있는 PRD를 붙여 넣으세요."></textarea></label><div class="actions"><button id="prd-analyze" class="primary">PRD 분석하기</button><button id="prd-sample">입력 예시 넣기</button></div><p class="hint">외부 AI 없이 제목·항목·목록을 분석합니다. 문서마다 표현이 달라 추출 결과를 확인하는 과정이 있습니다.</p><div id="prd-error" class="warning error" role="alert" hidden></div><div id="prd-result" hidden></div>`);
    const analyze=()=>{try{const parsed=Y.parsePRD($('#prd-text').value,filename);$('#prd-error').hidden=true;result(parsed);$('#prd-result').scrollIntoView({behavior:'smooth',block:'start'});}catch(err){error(err.message);}};
    async function load(file){if(!file)return;const status=$('#prd-file-status'),text=$('#prd-text');const readToken=++session;$('#prd-analyze').disabled=true;$('#prd-result').hidden=true;$('#prd-error').hidden=true;status.textContent=`${file.name} 본문을 읽고 있습니다…`;try{const contents=await Y.readPRDFile(file);if(readToken!==session||!text.isConnected)return;filename=file.name;text.value=contents;status.textContent=`${file.name} · ${contents.length.toLocaleString()}자 · 본문을 읽었습니다.`;analyze();}catch(err){if(readToken===session&&text.isConnected){status.textContent='파일을 읽지 못했습니다.';error(err.message);}}finally{if(readToken===session&&text.isConnected)$('#prd-analyze').disabled=false;}}
    $('#prd-file').onchange=ev=>{const file=ev.target.files[0];ev.target.value='';load(file);};
    const drop=$('#prd-drop');drop.ondragover=ev=>{ev.preventDefault();drop.classList.add('drag-over');};drop.ondragleave=()=>drop.classList.remove('drag-over');drop.ondrop=ev=>{ev.preventDefault();drop.classList.remove('drag-over');load(ev.dataTransfer.files[0]);};drop.onkeydown=ev=>{if(['Enter',' '].includes(ev.key)){ev.preventDefault();$('#prd-file').click();}};
    $('#prd-analyze').onclick=analyze;$('#prd-sample').onclick=()=>{session++;filename='';$('#prd-analyze').disabled=false;$('#prd-text').value=SAMPLE;$('#prd-file-status').textContent='입력 형식을 설명하는 예시 PRD입니다.';$('#prd-result').hidden=true;$('#prd-error').hidden=true;};
    $('#prd-text').oninput=()=>{session++;$('#prd-analyze').disabled=false;$('#prd-result').hidden=true;$('#prd-error').hidden=true;};
    // Closing/reopening invalidates asynchronous document reads without altering the next dialog.
    $('#modal').addEventListener('close',()=>{if(token<=session)session++;},{once:true});
  };
})();
