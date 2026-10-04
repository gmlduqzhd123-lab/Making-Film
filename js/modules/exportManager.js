(() => {
 const Y=window.YVM;
 const serial=p=>JSON.stringify(p).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
 Y.runtimeScript=p=>`(${Y.playerRuntime.toString()})(document.getElementById('video'),${serial(p)},{autoplay:true,onAudioError:function(message){document.getElementById('audio-note').textContent=message;}});`;
 Y.exportHTML=(p,inline=true)=>`<!doctype html>\n<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${Y.esc(p.title)} · 소개영상</title>${inline?`<style>${Y.playerCSS}\n${Y.exportCSS}</style>`:'<link rel="stylesheet" href="style.css">'}</head><body><main><div id="video"></div><p id="audio-note">자동재생 소개영상 · 음악은 브라우저 정책에 따라 재생 버튼을 눌러야 들릴 수 있습니다.</p>${Y.safeURL(p.url)?`<a class="app-link" href="${Y.esc(Y.safeURL(p.url))}" target="_blank" rel="noopener noreferrer">${Y.esc(p.title)} 만나보기 ↗</a>`:''}</main>${inline?`<script>${Y.runtimeScript(p)}</script>`:'<script src="app.js"></script>'}</body></html>`;
 Y.exportCSS=`*{box-sizing:border-box}body{margin:0;background:#f7f8fc;color:#1e293b;font:14px/1.6 Arial,'Malgun Gothic',sans-serif}main{max-width:1100px;margin:6vh auto;padding:24px;background:#fff;border-radius:16px;box-shadow:0 20px 60px #162e6210}#audio-note{color:#64748b;font-size:12px}.app-link{display:inline-block;padding:10px 16px;border-radius:8px;background:#3867f4;color:white;text-decoration:none}button:focus-visible,a:focus-visible{outline:3px solid #23b5a9}@media(max-width:767px){main{margin:0;padding:12px;border-radius:0}}`;
 Y.exportFiles=p=>({
   'project.json':JSON.stringify(p,null,2),'scenes.json':JSON.stringify(Y.scenesData(p),null,2),
   'subtitles-ko.srt':Y.srt(p),'narration-ko.txt':Y.narration(p),'codex-prompt.txt':Y.codexPrompt(p),
   'ai-video-prompts.txt':p.scenes.map((s,i)=>Y.aiPrompt(p,s,i)).join('\n\n'),'video.html':Y.exportHTML(p)
 });
 Y.package=async p=>{
   const project=Y.clone(p),files={},assetPaths=new Map();
   function asset(src,path){if(!src.startsWith('data:'))throw new Error('이미지·음악이 내부 데이터로 포함되지 않았습니다. 파일을 다시 업로드하세요.');files[path]=Y.dataBytes(src);assetPaths.set(src,path);return path;}
   const ext=src=>({'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/svg+xml':'svg','audio/mpeg':'mp3','audio/mp3':'mp3','audio/wav':'wav','audio/x-wav':'wav','audio/ogg':'ogg'})[src.match(/^data:([^;,]+)/)?.[1]]||'bin';
   project.images.forEach((img,i)=>{img.src=asset(img.src,`assets/images/scene-${String(i+1).padStart(2,'0')}.${ext(img.src)}`);});
   if(project.bgm)project.bgm.src=asset(project.bgm.src,`assets/audio/bgm.${ext(project.bgm.src)}`);
   project.scenes.forEach((scene,i)=>{if(scene.sfx)scene.sfx.src=assetPaths.get(scene.sfx.src)||asset(scene.sfx.src,`assets/audio/sfx-${i+1}.${ext(scene.sfx.src)}`);});
   const scenesData=Y.scenesData(project);scenesData.scenes.forEach((s,i)=>{s.image=project.images.find(img=>img.id===project.scenes[i].imageId)?.src||'';});
   Object.assign(files,{'index.html':Y.exportHTML(project,false),'style.css':Y.playerCSS+'\n'+Y.exportCSS,'app.js':Y.runtimeScript(project),'data/scenes.json':JSON.stringify(scenesData,null,2),'project.json':JSON.stringify(p,null,2),'subtitles/subtitles-ko.srt':Y.srt(p),'scripts/narration-ko.txt':Y.narration(p),'scripts/codex-prompt.txt':Y.codexPrompt(p),'scripts/ai-video-prompts.txt':p.scenes.map((s,i)=>Y.aiPrompt(p,s,i)).join('\n\n'),'README.md':`# ${p.title} 소개영상\n\n압축을 풀고 index.html을 열면 자동재생 HTML 영상이 시작됩니다. 음악은 브라우저 정책에 따라 재생 버튼을 눌러야 할 수 있습니다. GitHub 저장소 루트에 파일과 폴더를 올리고 Settings > Pages에서 해당 브랜치를 선택하세요. 빌드, 서버, 계정, API Key가 필요하지 않습니다.\n\n이 결과물은 MP4가 아닌 HTML 영상입니다. project.json은 원본 제작기에서 다시 불러올 수 있으며 이미지와 음악을 포함합니다. 내레이션은 텍스트와 SRT로 제공되며 합성 음성이 영상에 포함되지는 않습니다. assets의 음악·이미지 사용 권한을 확인하세요.\n`});
   return Y.zip(files);
 };
 const MAX_IMPORT_BYTES=80*1024*1024;
 Y.validateProject=input=>{
   if(!input||input.version!==1||!Array.isArray(input.scenes)||!Array.isArray(input.images))throw new Error('지원하는 v1 project.json 파일이 아닙니다.');
   if(input.scenes.length>100 || input.images.length>100)throw new Error('장면과 이미지는 각각 최대 100개까지 불러올 수 있습니다.');
   const p={...Y.store.fresh(),...input};p.id=typeof input.id==='string'?input.id:Y.id();
   if(new Set(p.scenes.map(s=>s.id)).size!==p.scenes.length||new Set(p.images.map(i=>i.id)).size!==p.images.length)throw new Error('장면 또는 이미지 ID가 중복되어 있습니다.');
   if(![30,45,60,90].includes(Number(p.targetDuration)))throw new Error('목표 영상 길이가 올바르지 않습니다.');p.targetDuration=Number(p.targetDuration);
   for(const field of ['title','url','description','category','subject','grade','usage','login','classTime','participation','style','mood','purpose'])if(typeof p[field]!=='string')throw new Error(`${field} 형식이 올바르지 않습니다.`);
   if(!Array.isArray(p.features)||!p.features.every(f=>typeof f==='string')||p.features.length>5)throw new Error('핵심 기능 형식이 올바르지 않습니다.');
   if(!Array.isArray(p.audience)||!p.audience.every(f=>typeof f==='string'))throw new Error('대상 형식이 올바르지 않습니다.');
   const validImage=src=>/^data:image\/(png|jpeg|webp|svg\+xml);base64,[A-Za-z0-9+/=]+$/.test(src);
   const validAudio=src=>/^data:audio\/[a-zA-Z0-9.+-]+;base64,[A-Za-z0-9+/=]+$/.test(src);
   p.images.forEach(img=>{if(typeof img.id!=='string'||typeof img.name!=='string'||typeof img.src!=='string'||!validImage(img.src))throw new Error('이미지가 포함되지 않았거나 지원하지 않는 형식입니다.');});
   if(p.bgm&&(!validAudio(p.bgm.src)||typeof p.bgm.name!=='string'))throw new Error('BGM 형식이 올바르지 않습니다.');
   p.scenes.forEach(s=>{if(['id','title','caption','narration','type','imageId','animation','transition'].some(k=>typeof s[k]!=='string')||!Number.isFinite(s.duration)||s.duration<1||s.duration>120)throw new Error('장면 형식이나 시간 범위가 올바르지 않습니다.');if(s.sfx&&!validAudio(s.sfx.src))throw new Error('효과음 형식이 올바르지 않습니다.');s.textAnimation=s.textAnimation||'fade';});
   p.bgmVolume=Math.min(100,Math.max(0,Number(p.bgmVolume)||0));p.bgmFadeIn=Math.min(30,Math.max(0,Number(p.bgmFadeIn)||0));p.bgmFadeOut=Math.min(30,Math.max(0,Number(p.bgmFadeOut)||0));Y.retime(p);return p;
 };
 Y.importProject=async file=>{if(file.size>MAX_IMPORT_BYTES)throw new Error('JSON 파일은 80MB 이하로 불러올 수 있습니다.');let data;try{data=JSON.parse(await file.text());}catch{throw new Error('JSON 파일의 문법이 올바르지 않습니다.');}return Y.validateProject(data);};
})();
