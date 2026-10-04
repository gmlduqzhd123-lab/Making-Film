(() => {
 const Y=window.YVM;
 Y.recommend = category => ({체육:'Adventure',역사:'Cinematic',사회:'Cinematic',국어:'Traditional Korea',음악:'Emotional',놀이:'Retro',업무효율:'Minimal',코딩:'Game',AI:'Modern Education'})[category] || 'Modern Education';
 Y.generate = p => {
   const copy=Y.catalog.copyTemplates[p.category] || Y.catalog.copyTemplates['기타'];
   const features=p.features.map(f=>f.trim()).filter(Boolean).slice(0,5), student=p.audience.includes('학생')&&!p.audience.includes('교사');
   const titles=['새로운 질문',p.title,'이렇게 시작해요',...features.slice(0,3),'수업에 더하는 가치','함께 만드는 변화','지금 만나보세요'];
   while(titles.length<9)titles.splice(3,0,'간편하게 활용해요');
   const classroom=p.classTime?`${p.classTime}분 수업`:'수업';
   const captions=[copy.hook,p.description || copy.main, student?'도전할 준비가 되었나요?':`${p.grade} · ${p.subject} · ${p.usage}`, ...[0,1,2].map(i=>features[i] || '쉽게 시작하는 수업'),student?'함께 도전하고 성장해요':'학생의 참여가 수업의 변화로','좋은 수업을 더 많은 교실에',copy.cta];
   const narrations=[copy.hook,`${p.title}. ${p.description || copy.main}`,student?`${p.title}와 함께 첫 도전을 시작해 보세요.`:`${p.grade} ${p.subject} ${classroom}에서 ${p.usage} 활동으로 활용해 보세요.`,...[0,1,2].map(i=>features[i]?`${features[i]}. ${student?'친구들과 직접 도전해 보세요.':'수업의 흐름에 맞게 활용해 보세요.'}`:'필요한 화면을 선택하고 활동을 시작하세요.'),features.length>3?`또한 ${features.slice(3).join(', ')}까지 함께 경험할 수 있습니다.`:student?'친구와 함께 도전하며 새로운 경험을 쌓아 보세요.':'직접 참여하는 활동으로 배움의 경험을 넓혀 보세요.','선생님이 만든 좋은 수업이 더 많은 교실에 닿도록.',`${p.title}. ${copy.cta}`];
   const lengths=[5,5,7,8,8,8,7,7,5], total=p.targetDuration || 60;
   let used=0;
   if(!student && p.login && p.login!=='직접 입력')narrations[2]+=` 접근 방법: ${p.login}.`;
   if(!student && p.participation)narrations[6]+=` 참여 방식: ${p.participation}.`;
   p.scenes=lengths.map((d,i)=>{const duration=i===8?total-used:Math.round(d/60*total*10)/10;used+=duration;return {id:Y.id(),type:['hook','service','demo','feature','feature','feature','value','emotion','cta'][i],title:titles[i],caption:captions[i],narration:narrations[i],duration,imageId:p.images[i%p.images.length]?.id || '',animation:i%3===0?'slowZoom':i%3===1?'panLeft':'panRight',transition:'crossfade',textAnimation:'fade',sfx:null};});
   p.concept=`${p.title}의 ${p.features.filter(Boolean).slice(0,3).join(' · ')}을 중심으로, ${p.audience.join('·')}에게 전하는 ${p.mood} ${p.purpose} 영상.`;
   p.message=p.description || copy.main;p.cta=copy.cta;p.bgmStyle=Y.catalog.templates.find(t=>t.id===p.style)?.bgm || '가벼운 교육 콘텐츠 음악';Y.retime(p);return p;
 };
 Y.scene = () => ({id:Y.id(),type:'feature',title:'새 장면',caption:'장면의 핵심 메시지를 입력하세요.',narration:'',duration:5,imageId:'',animation:'slowZoom',transition:'fade',textAnimation:'fade',sfx:null});
})();
