(() => {
 const Y=window.YVM;
 Y.quality=p=>{
   const warnings=[],scenes=p.scenes, syllables=text=>Array.from(text.replace(/[\s\p{P}\p{S}]/gu,'')).length;
   if(!p.title.trim())warnings.push('영상 제목이 없습니다.');
   if(!scenes.length)warnings.push('장면을 먼저 생성하세요.');
   scenes.forEach((s,i)=>{if(!p.images.some(img=>img.id===s.imageId))warnings.push(`Scene ${i+1}에 이미지가 없습니다.`);if(syllables(s.narration)/3.5>s.duration)warnings.push(`Scene ${i+1} 내레이션이 장면 시간보다 길 수 있습니다.`);if(s.caption.length>70)warnings.push(`Scene ${i+1} 화면 문구를 짧게 다듬어 주세요.`);});
   const narrationTime=Math.ceil(scenes.reduce((n,s)=>n+syllables(s.narration)/3.5,0));
   if(narrationTime>p.duration)warnings.push(`전체 내레이션 예상 ${narrationTime}초가 영상 길이를 초과합니다.`);
   if(scenes.at(-1)?.duration<1)warnings.push('마지막 CTA 시간이 1초 미만입니다.');
   if(scenes.length && scenes.at(-1).type!=='cta')warnings.push('마지막 장면에 CTA를 넣어 주세요.');
   if(p.images.some(img=>img.kind==='illustration'))warnings.push('샘플 이미지는 예시 그림입니다. 실제 웹앱 스크린샷으로 교체해 주세요.');
   const scores={스토리:scenes.length>=5?20:scenes.length?10:0,가독성:Math.max(0,20-scenes.filter(s=>s.caption.length>70 || !s.caption).length*4),'장면 다양성':Math.min(20,new Set(scenes.map(s=>s.imageId).filter(Boolean)).size*4),'영상 길이':scenes.length?Math.max(0,20-Math.ceil(Math.abs(p.duration-p.targetDuration))):0,CTA:scenes.at(-1)?.type==='cta'&&scenes.at(-1)?.caption?20:0};
   return {warnings,scores,score:Object.values(scores).reduce((a,b)=>a+b,0),narrationTime,imageCount:new Set(scenes.map(s=>s.imageId).filter(id=>p.images.some(i=>i.id===id))).size};
 };
})();
