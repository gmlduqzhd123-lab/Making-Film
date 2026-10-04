window.YVM = window.YVM || {};
(() => {
  const Y = window.YVM;
  Y.clone = value => JSON.parse(JSON.stringify(value));
  Y.id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  Y.esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  Y.time = seconds => `${Math.floor(seconds / 60).toString().padStart(2,'0')}:${Math.floor(seconds % 60).toString().padStart(2,'0')}`;
  Y.safeURL = value => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  Y.download = (name, data, type='text/plain;charset=utf-8') => {
    const blob = data instanceof Blob ? data : new Blob([data], {type});
    const url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 30000);
  };
  Y.toast = message => { const container=document.querySelector('#toasts');Array.from(container.children).filter(el=>el.textContent===message).forEach(el=>el.remove());while(container.children.length>=3)container.firstElementChild.remove();const el = document.createElement('div'); el.className = 'toast'; el.textContent = message; container.append(el); setTimeout(()=>el.remove(),5000); };
  Y.copy = async text => { try { await navigator.clipboard.writeText(text); Y.toast('클립보드에 복사했습니다.'); } catch { Y.modal('텍스트 복사', `<p class="hint">브라우저의 복사 권한이 없습니다. 아래 내용을 선택하여 복사하세요.</p><textarea readonly>${Y.esc(text)}</textarea>`); document.querySelector('dialog textarea').select(); } };
  Y.modal = (title, html) => { const dialog = document.querySelector('#modal'); dialog.innerHTML = `<div class="close-row"><h2>${Y.esc(title)}</h2><button id="close-modal" aria-label="창 닫기">✕</button></div>${html}`; dialog.querySelector('#close-modal').onclick=()=>dialog.close(); if (!dialog.open) dialog.showModal(); };
  Y.retime = project => { let t=0; project.scenes.forEach(scene => { scene.duration = Math.max(1, Math.min(120, Number(scene.duration) || 5)); scene.start=Math.round(t*100)/100; t+=scene.duration; scene.end=Math.round(t*100)/100; }); project.duration = project.scenes.length ? Math.round(t*100)/100 : Number(project.targetDuration)||60; };
})();
