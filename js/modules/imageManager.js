(() => {
 const Y=window.YVM, MAX_EDGE=1920, MAX_IMAGE_BYTES=20*1024*1024, MAX_AUDIO_BYTES=15*1024*1024;
 Y.readDataURL=file=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('파일을 읽지 못했습니다.'));reader.readAsDataURL(file);});
 Y.readImage=async(file,webp=true)=>{
   if(!['image/png','image/jpeg','image/webp'].includes(file.type))throw new Error('PNG, JPG, WEBP 이미지 파일을 선택하세요.');
   if(file.size>MAX_IMAGE_BYTES)throw new Error('이미지는 한 장당 20MB 이하로 올려주세요.');
   const src=await Y.readDataURL(file), img=new Image();
   await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('손상되었거나 지원하지 않는 이미지입니다.'));img.src=src;});
   const scale=Math.min(1,MAX_EDGE/Math.max(img.width,img.height)), canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
   return {id:Y.id(),name:file.name.replace(/\.[^.]+$/,''),originalName:file.name,width:canvas.width,height:canvas.height,src:canvas.toDataURL(webp?'image/webp':file.type, .86),kind:'screenshot'};
 };
 Y.readAudio=async(file)=>{if(!/\.(mp3|wav|ogg)$/i.test(file.name))throw new Error('MP3, WAV, OGG 파일을 선택하세요.');if(file.size>MAX_AUDIO_BYTES)throw new Error('음악은 15MB 이하로 올려주세요.');const mime={mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg'}[file.name.split('.').pop().toLowerCase()];return {name:file.name,src:(await Y.readDataURL(file)).replace(/^data:[^;]*;/,`data:${mime};`)};};
 Y.uploadImages=async(files,webp)=>{const images=[],available=Math.max(0,100-Y.store.get().images.length);if(files.length>available)Y.toast('프로젝트의 이미지는 최대 100장까지 추가할 수 있습니다.');for(const file of Array.from(files).slice(0,available)){try{images.push(await Y.readImage(file,webp));}catch(e){Y.toast(`${file.name}: ${e.message}`);}}if(images.length){Y.store.change(p=>p.images.push(...images));Y.toast(`${images.length}개 화면을 추가했습니다.`);}};
})();
