(() => {
 const Y=window.YVM;
 Y.narration=p=>p.scenes.map((s,i)=>`[${String(i+1).padStart(2,'0')} · ${Y.time(s.start)}–${Y.time(s.end)}] ${s.title}\n${s.narration}`).join('\n\n');
 const stamp=seconds=>{const ms=Math.round(seconds*1000);return `${String(Math.floor(ms/3600000)).padStart(2,'0')}:${String(Math.floor(ms/60000)%60).padStart(2,'0')}:${String(Math.floor(ms/1000)%60).padStart(2,'0')},${String(ms%1000).padStart(3,'0')}`;};
 Y.srt=p=>p.scenes.filter(s=>s.narration.trim()).map((s,i)=>`${i+1}\n${stamp(s.start)} --> ${stamp(s.end)}\n${s.narration.replace(/\r/g,'')}\n`).join('\n');
 Y.scenesData=p=>({project:{title:p.title,duration:p.duration,ratio:p.ratio,style:p.style,url:p.url,concept:p.concept,message:p.message,bgmStyle:p.bgmStyle},scenes:p.scenes.map(s=>({...s,image:p.images.find(i=>i.id===s.imageId)?.originalName || ''}))});
})();
