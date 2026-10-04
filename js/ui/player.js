(() => {
 const Y=window.YVM;
 // This runtime is deliberately self-contained: the same function powers editor, HTML and ZIP output.
 Y.playerRuntime=function(root,project,options={}){
   const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
   const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(Math.floor(s%60)).padStart(2,'0')}`;
   const themes={Adventure:['#142e4e','#76e1c0'],Emotional:['#422e43','#ffd6be'],'Modern Education':['#162e62','#9ebeff'],Game:['#25204f','#aff46a'],Cinematic:['#131c2b','#e1be85'],'Traditional Korea':['#302d28','#ead6a2'],Retro:['#4b3432','#ffd168'],Minimal:['#eef2f8','#3867f4']};
   const theme=themes[project.style]||themes['Modern Education'];
   root.classList.add('yvm-player');root.style.setProperty('--video-bg',theme[0]);root.style.setProperty('--video-accent',theme[1]);root.style.setProperty('--video-text',project.style==='Minimal'?'#1e293b':'#fff');
   root.innerHTML=`<div class="vp-stage" aria-label="영상 미리보기"><div class="vp-backdrop"></div><div class="vp-previous"></div><div class="vp-shot"><div class="vp-image"></div><div class="vp-shade"></div><div class="vp-copy"><div class="vp-kicker"></div><div class="vp-caption"></div><div class="vp-title"></div></div></div><div class="vp-subtitle"></div><div class="vp-brand">${esc(project.title || '나의 웹앱')}</div><div class="vp-scene-no"></div><div class="vp-empty">화면 자료를 넣고<br>영상 구성을 만들어 보세요.</div></div><div class="vp-controls"><button class="vp-play" aria-label="재생">▶</button><button class="vp-reset" aria-label="처음으로">↺</button><button class="vp-back" aria-label="10초 뒤로">−10</button><button class="vp-forward" aria-label="10초 앞으로">+10</button><span class="vp-time">00:00 / ${time(project.duration)}</span><button class="vp-mute" aria-label="음소거">♪</button><button class="vp-subtoggle" aria-label="자막 표시 전환" aria-pressed="true">CC</button><button class="vp-full" aria-label="전체화면">⛶</button></div><input class="vp-scrub" type="range" min="0" max="${project.duration}" step="0.1" value="0" aria-label="재생 위치">`;
   const $=s=>root.querySelector(s),stage=$('.vp-stage'),shot=$('.vp-shot'),image=$('.vp-image'),copy=$('.vp-copy'),caption=$('.vp-caption'),previous=$('.vp-previous');
   const bgm=project.bgm?.src?new Audio(project.bgm.src):null;
   if(bgm){bgm.loop=project.bgmLoop;bgm.preload='metadata';}
   let position=0,playing=false,muted=false,index=-1,lastStamp=0,frame=0,sfx=null,destroyed=false,subs=true,audioNotice=false;
   function notifyAudio(){if(!audioNotice){options.onAudioError?.('브라우저가 음악 재생을 막았거나 이 형식을 지원하지 않습니다. 재생 버튼을 다시 누르거나 다른 파일을 사용하세요.');audioNotice=true;}}
   function syncBgm(){if(!bgm)return; if(Number.isFinite(bgm.duration)&&bgm.duration>0){const t=bgm.loop?position%bgm.duration:Math.min(position,bgm.duration);if(Math.abs(bgm.currentTime-t)>.5)bgm.currentTime=t;}if(playing&&!muted)bgm.play().catch(notifyAudio);else bgm.pause();}
   function display(){
     const scenes=project.scenes;
     const next=scenes.length?Math.max(0,scenes.findIndex(s=>position<s.end)): -1;
     const actual=position>=project.duration&&scenes.length?scenes.length-1:next;
     $('.vp-empty').hidden=!!scenes.length;shot.hidden=!scenes.length;
     if(actual>=0){
       const scene=scenes[actual], local=Math.max(0,position-scene.start), progress=Math.min(1,local/scene.duration);
       if(actual!==index){
         // Snapshot the outgoing shot for a real crossfade between adjacent scenes.
         previous.innerHTML=actual===index+1 && index>=0 ? shot.innerHTML : '';
         previous.style.opacity='0';index=actual;
         const img=project.images.find(img=>img.id===scene.imageId);
         image.style.backgroundImage=img?`url(${JSON.stringify(img.src)})`:'none';
         shot.classList.toggle('has-image',!!img);stage.classList.toggle('has-image',!!img);
         caption.textContent=scene.caption;$('.vp-kicker').textContent=scene.type==='cta'?'지금 시작해 보세요':project.style+' / '+scene.title;
         $('.vp-title').textContent=scene.type==='cta'?project.url:project.title;
         $('.vp-scene-no').textContent=`${String(actual+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
         if(sfx){sfx.pause();sfx=null;}
         if(scene.sfx?.src&&playing&&!muted){sfx=new Audio(scene.sfx.src);sfx.volume=(project.bgmVolume??35)/100;sfx.play().catch(notifyAudio);}
       }
       let transform='none',opacity=1,filter='none';
       const ease=playing?Math.min(1,local/.7):1;
       switch(scene.animation){
         case 'slowZoom':transform=`scale(${1+progress*.12})`;break;
         case 'zoomOut':transform=`scale(${1.12-progress*.12})`;break;
         case 'panLeft':transform=`scale(1.12) translateX(${4-progress*8}%)`;break;
         case 'panRight':transform=`scale(1.12) translateX(${-4+progress*8}%)`;break;
         case 'slideUp':transform=`translateY(${(1-ease)*18}%)`;opacity=ease;break;
         case 'slideDown':transform=`translateY(${-(1-ease)*18}%)`;opacity=ease;break;
         case 'parallax':transform=`scale(1.1) translate(${(progress-.5)*5}%,${(progress-.5)*-3}%)`;break;
         case 'float':transform=`scale(1.04) translateY(${Math.sin(local)*1.2}%)`;break;
         case 'pulse':transform=`scale(${1.025+Math.sin(local*2)*.025})`;break;
         case 'blurIn':filter=`blur(${(1-ease)*10}px)`;opacity=ease;break;
         case 'fade':case 'crossfade':opacity=ease;break;
       }
       image.style.transform=transform;image.style.opacity=opacity;image.style.filter=filter;
       const transition=playing?Math.min(1,local/.65):1;
       shot.style.opacity=scene.transition==='cut'?1:transition;
       shot.style.transform=scene.transition==='slide'?`translateX(${(1-transition)*10}%)`:'none';
       previous.style.opacity=scene.transition==='crossfade'?1-transition:0;
       let textOpacity=1,textTransform='none',clip='none';
       switch(scene.textAnimation){
         case 'typewriter':caption.textContent=playing?scene.caption.slice(0,Math.ceil(local*18)):scene.caption;break;
         case 'slide':textTransform=`translateY(${(1-ease)*30}px)`;textOpacity=ease;break;
         case 'scale':textTransform=`scale(${.9+ease*.1})`;textOpacity=ease;break;
         case 'wordReveal':{const words=scene.caption.split(' ');caption.textContent=playing?words.slice(0,Math.ceil(local*3)).join(' '):scene.caption;break;}
         case 'lineReveal':clip=`inset(0 ${100-ease*100}% 0 0)`;break;
         default:textOpacity=ease;
       }
       if(scene.animation==='textReveal')clip=`inset(0 ${100-ease*100}% 0 0)`;
       copy.style.opacity=textOpacity;copy.style.transform=textTransform;copy.style.clipPath=clip;
       $('.vp-subtitle').textContent=scene.narration;
       $('.vp-subtitle').hidden=!subs || !scene.narration;
     }else{$('.vp-subtitle').hidden=true;}
     if(bgm){const fadeIn=Math.max(.01,Number(project.bgmFadeIn)||0),fadeOut=Math.max(.01,Number(project.bgmFadeOut)||0);bgm.volume=muted?0:Math.min(1,position/fadeIn,(project.duration-position)/fadeOut)*((project.bgmVolume??35)/100);}
     $('.vp-time').textContent=`${time(position)} / ${time(project.duration)}`;$('.vp-scrub').value=position;
     $('.vp-play').textContent=playing?'Ⅱ':'▶';$('.vp-play').setAttribute('aria-label',playing?'일시정지':'재생');
     options.onTick?.(position,index,playing);
   }
   function loop(stamp){if(!playing||destroyed)return;if(lastStamp)position=Math.min(project.duration,position+(stamp-lastStamp)/1000);lastStamp=stamp;display();if(position>=project.duration){pause();options.onEnd?.();}else frame=requestAnimationFrame(loop);}
   function play(){if(!project.scenes.length)return;if(position>=project.duration)position=0;playing=true;lastStamp=0;syncBgm();if(index>=0&&project.scenes[index].sfx?.src&&!muted){sfx?.pause();sfx=new Audio(project.scenes[index].sfx.src);sfx.play().catch(notifyAudio);}display();cancelAnimationFrame(frame);frame=requestAnimationFrame(loop);}
   function pause(){playing=false;cancelAnimationFrame(frame);bgm?.pause();sfx?.pause();display();}
   function seek(t){position=Math.max(0,Math.min(project.duration,t));lastStamp=0;index=-1;syncBgm();display();}
   $('.vp-play').onclick=()=>playing?pause():play();$('.vp-reset').onclick=()=>{pause();seek(0);};$('.vp-back').onclick=()=>seek(position-10);$('.vp-forward').onclick=()=>seek(position+10);$('.vp-scrub').oninput=e=>seek(Number(e.target.value));
   $('.vp-mute').onclick=()=>{muted=!muted;$('.vp-mute').textContent=muted?'♫ ×':'♪';$('.vp-mute').setAttribute('aria-label',muted?'음소거 해제':'음소거');$('.vp-mute').setAttribute('aria-pressed',String(muted));if(sfx)sfx.muted=muted;syncBgm();display();};
   $('.vp-subtoggle').onclick=()=>{subs=!subs;$('.vp-subtoggle').setAttribute('aria-pressed',String(subs));display();};
   $('.vp-full').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else root.requestFullscreen?.().catch(()=>options.onAudioError?.('이 환경에서는 전체화면을 지원하지 않습니다.'));};
   const visibility=()=>{if(document.hidden&&playing)pause();};document.addEventListener('visibilitychange',visibility);
   display();if(options.autoplay){play();}
   return {play,pause,seek,toggle:()=>playing?pause():play(),position:()=>position,isPlaying:()=>playing,update(next){project=next;position=Math.min(position,project.duration);index=-1;$('.vp-scrub').max=project.duration;$('.vp-brand').textContent=project.title;display();},destroy(){destroyed=true;playing=false;cancelAnimationFrame(frame);bgm?.pause();sfx?.pause();if(bgm){bgm.removeAttribute('src');bgm.load();}document.removeEventListener('visibilitychange',visibility);root.innerHTML='';}};
 };
 Y.playerCSS=`.yvm-player{--video-bg:#162e62;--video-accent:#9ebeff;--video-text:#fff;background:#fff;border-radius:12px;overflow:hidden;font-family:Arial,'Malgun Gothic',sans-serif}.vp-stage{position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--video-bg);color:var(--video-text);container-type:inline-size;border-radius:10px}.vp-backdrop{position:absolute;inset:0;background:radial-gradient(circle at 85% 10%,var(--video-accent),transparent 55%);opacity:.23}.vp-backdrop:after{content:'';position:absolute;border:4cqw solid var(--video-accent);opacity:.2;border-radius:50%;width:40cqw;height:40cqw;right:-15cqw;bottom:-15cqw}.vp-shot,.vp-previous{position:absolute;inset:0}.vp-image{position:absolute;inset:0;background-size:contain;background-position:center;background-repeat:no-repeat;will-change:transform}.vp-shade{position:absolute;inset:0;background:linear-gradient(90deg,#0b193de6 0%,#0b193d7a 65%,#0b193d22)}.vp-shot:not(.has-image) .vp-shade{background:none}.vp-copy{position:absolute;left:7%;right:7%;top:24%;}.vp-kicker{color:var(--video-accent);font-size:1.7cqw;letter-spacing:.12em;margin-bottom:2cqw}.vp-caption{font-weight:800;font-size:5.4cqw;line-height:1.4;letter-spacing:-.04em;white-space:pre-wrap;overflow-wrap:anywhere;max-width:90%;text-shadow:0 1px 8px #0002}.vp-title{font-size:1.8cqw;margin-top:2cqw;opacity:.85;overflow-wrap:anywhere}.vp-brand{position:absolute;left:7%;top:6%;font-size:1.5cqw;font-weight:700}.vp-scene-no{position:absolute;right:5%;top:6%;font-size:1.5cqw;letter-spacing:.1em;opacity:.75}.vp-subtitle{position:absolute;bottom:6%;left:7%;right:7%;padding:1cqw 1.6cqw;background:#0a122bcc;color:#fff;border-radius:5px;font-size:2cqw;text-align:center;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.vp-empty{position:absolute;inset:0;display:grid;place-content:center;text-align:center;font-size:3cqw;color:var(--video-text);opacity:.8;line-height:1.8}.vp-controls{display:flex;align-items:center;gap:5px;padding:12px 0 4px;color:#1e293b}.vp-controls button{border:0;background:#f0f4fa;padding:7px 9px;border-radius:7px;color:#1e293b;font:600 13px Arial;cursor:pointer;min-height:32px}.vp-controls button:hover{background:#dbe5ff}.vp-controls .vp-play{background:#3867f4;color:#fff;width:36px}.vp-time{font-size:11px;flex:1;text-align:center;font-variant-numeric:tabular-nums}.vp-scrub{width:100%;accent-color:#3867f4;display:block;margin:7px 0 0}.yvm-player:fullscreen{border-radius:0;background:#111;display:flex;flex-direction:column;justify-content:center;padding:20px}.yvm-player:fullscreen .vp-stage{max-height:85vh;width:100%;aspect-ratio:16/9}.yvm-player:fullscreen .vp-time{color:#fff}.vp-controls button:focus-visible{outline:3px solid #23b5a9}.yvm-player [hidden]{display:none!important}@media(max-width:600px){.vp-controls{gap:3px}.vp-controls button{padding:7px 6px;font-size:12px}.vp-time{font-size:10px}}`;
 Y.playerCSS+=`.vp-caption{text-wrap:balance;word-break:keep-all}.vp-stage.has-image{color:#fff}.vp-stage.has-image .vp-kicker{color:#c7e9ed}.vp-subtitle{font-size:clamp(14px,2cqw,24px)}.vp-kicker,.vp-title,.vp-brand,.vp-scene-no{font-size:clamp(14px,1.8cqw,19px)}.vp-controls button,.vp-time{font-size:14px}.vp-caption{font-size:clamp(20px,5.4cqw,70px)}.vp-controls{flex-wrap:wrap}`;
 const style=document.createElement('style');style.textContent=Y.playerCSS;document.head.append(style);
})();
