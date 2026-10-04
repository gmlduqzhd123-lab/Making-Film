(() => {
  const Y = window.YVM;
  const MAX_TEXT_CHARS = 200000, MAX_TEXT_BYTES = 2 * 1024 * 1024;
  const MAX_DOCUMENT_BYTES = 12 * 1024 * 1024, MAX_XML_BYTES = 8 * 1024 * 1024;
  const categories = ['체육','사회','역사','음악','국어','AI','코딩','놀이','업무효율','기타'];
  const clean = text => String(text ?? '').replace(/\*\*|__|`/g, '').replace(/^\s*#{1,6}\s*/, '').replace(/^\s*(?:[-*+•□■✓☑]\s*|\d+(?:\.\d+)*[.)]\s*)/, '').replace(/^\s*\[[ xX]\]\s*/, '').trim();
  const shorten = (text, max) => text.length > max ? text.slice(0, max - 1) + '…' : text;
  const aliases = {
    title: ['웹앱 이름','앱 이름','프로젝트명','프로젝트 이름','정식명','서비스명','서비스 이름','제품명','Project name','App name','Product name','Title'],
    description: ['한 줄 소개','한줄 소개','프로젝트 한 줄 정의','한 줄 정의','서비스 설명','프로젝트 설명','Description','Tagline'],
    url: ['웹앱 URL','서비스 URL','웹사이트 URL','앱 URL','홈페이지','URL','Website'],
    category: ['웹앱 분야','분야','카테고리','Category'], subject: ['교과','과목','Subject'],
    grade: ['활용 학년','학년','Grade'], usage: ['활용 유형','수업 활용 유형','Usage'],
    audience: ['대상 사용자','핵심 사용자','주 대상','대상','Target audience','Audience','Primary user'],
    targetDuration: ['영상 길이','영상 시간','영상길이','Duration'], style: ['영상 스타일','스타일','Style'],
    mood: ['영상 분위기','분위기','Mood'], purpose: ['영상 목적','영상 목표','Purpose'],
    login: ['로그인 여부','접근 방법','Login'], classTime: ['수업 소요 시간','소요 시간','Class time'], participation: ['학생 참여 방식','참여 방식','Participation']
  };
  const canonical = text => clean(text).replace(/\s+/g, '').replace(/[:：]$/, '').toLowerCase();
  const knownLabels = new Set(Object.values(aliases).flat().map(canonical));
  const future = text => /^(?:phase\s*[23]|향후|추후|미래|로드맵|제외|미구현|out of scope|non.goals|future|later)/i.test(clean(text));
  const placeholder = text => /^(?:입력|선택|기본|예|예시|예제|정식명|영문명|버전|최대|지원|사용|개발 방식|배포|서버|DB|STEP\s*\d+)(?:\s|[:：]|$)/i.test(clean(text));

  function linesOf(text) {
    const source = text.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gm, '');
    return source.split('\n').flatMap(raw => {
      if (/^\s*\|.*\|\s*$/.test(raw)) {
        const cells = raw.trim().slice(1,-1).split('|').map(clean);
        if (cells.length >= 2 && !cells.every(c => /^[-:]+$/.test(c))) return [{raw, text: cells[0] + ': ' + cells.slice(1).join(', ')}];
      }
      return [{raw, text: clean(raw)}];
    });
  }
  function fieldFrom(lines, names) {
    for (let i=0; i<lines.length; i++) {
      const value=lines[i].text, colon=value.search(/[:：]/), label=colon<0?value:value.slice(0,colon);
      if (!names.some(name=>canonical(name)===canonical(label))) continue;
      if (colon>=0 && value.slice(colon+1).trim()) return {value:clean(value.slice(colon+1)), inline:true};
      const values=[];
      for (let j=i+1;j<Math.min(lines.length,i+7);j++) {
        const candidate=lines[j].text;if(!candidate)continue;
        if (knownLabels.has(canonical(candidate))) continue;
        if (/^#{1,6}\s/.test(lines[j].raw) || placeholder(candidate)) break;
        values.push(candidate);
        if(values.length>=2)break;
      }
      if(values.length)return {value:values[0], alternatives:values, inline:false};
    }
    return null;
  }
  function featuresFrom(lines) {
    const groups=[];let excluded=false,excludedLevel=0;
    for(let i=0;i<lines.length;i++) {
      const text=lines[i].text,level=lines[i].raw.match(/^\s*(#{1,6})\s/)?.[1].length||0;
      if(future(text)){excluded=true;excludedLevel=level;continue;}
      if(excluded){if(level&&level<=excludedLevel||/^MVP(?:\s|$)/i.test(text))excluded=false;else continue;}
      const match=text.match(/^(핵심\s*기능|주요\s*기능|대표\s*기능|필수\s*기능|기능\s*요구사항|기능\s*목록|MVP(?:\s*(?:기능|범위))?|core features|key features|features)\s*[:：]?\s*(.*)$/i);
      if(!match)continue;
      const before=lines.slice(Math.max(0,i-3),i).map(l=>l.text).join(' ');
      if(/^(?:예|예시|입력)[:：]?$/i.test(lines[i-1]?.text||'')||/샘플|카피 생성|자동 카피|프롬프트 예시/.test(before))continue;
      const items=match[2]?match[2].split(/[,，;；]|\s+[·•]\s+/).map(clean).filter(Boolean):[],prose=[];
      const headingLevel=lines[i].raw.match(/^\s*(#{1,6})\s/)?.[1].length||0;
      for(let j=i+1;j<Math.min(lines.length,i+90);j++) {
        const line=lines[j], t=line.text;if(!t)continue;
        const level=line.raw.match(/^\s*(#{1,6})\s/)?.[1].length||0;
        if(future(t)||/^(?:기술|데이터|디자인|사용자|샘플|화면|성능|접근성|영상 스타일|보안|기본 프로젝트 구조)/.test(t))break;
        if(level && (!headingLevel||level<=headingLevel))break;
        if(/^(?:□|☑|✓|[-*+•]|\d+[.)])\s*/.test(line.raw.trim()) || (level>headingLevel && /^기능\s*\d*[:：]?/.test(t)))items.push(t);
        else if(!placeholder(t)&&!knownLabels.has(canonical(t))&&t.length<70&&!/[.!?。]$/.test(t)&&prose.length<5)prose.push(t);
      }
      if(!items.length)items.push(...prose);
      if(items.length)groups.push({items,score:items.some(item=>/프로젝트 생성|영상 미리보기/.test(item))?4:/MVP/i.test(match[1])?3:2});
    }
    groups.sort((a,b)=>b.score-a.score);
    const candidate=groups[0]?.items||[];
    return [...new Set(candidate.map(s=>shorten(clean(s),90)).filter(s=>s&&!future(s)&&!placeholder(s)))];
  }
  function jsonFields(data) {
    if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('PRD JSON은 프로젝트 정보를 담은 객체여야 합니다.');
    const containers=[data.project,data.product,data.app,data].filter(o=>o&&typeof o==='object'&&!Array.isArray(o));
    const read=(...keys)=>{for(const obj of containers)for(const key of keys)if(Object.hasOwn(obj,key)&&obj[key]!=null)return obj[key];return '';};
    const str=value=>typeof value==='string'?value:typeof value==='number'?String(value):'';
    const features=read('features','coreFeatures','keyFeatures','주요 기능','핵심 기능')||data.requirements?.features||data.mvp?.features||[];
    const featureList=Array.isArray(features)?features.map(f=>typeof f==='string'?f: f&&typeof f==='object'?str(f.title||f.name||f.description):'').filter(Boolean):typeof features==='string'?features.split(/\n|[,，]/).map(clean).filter(Boolean):[];
    return {title:str(read('title','name','projectName','appName','프로젝트명','웹앱 이름')),description:str(read('description','summary','tagline','한 줄 소개')),url:str(read('url','website','웹앱 URL')),category:str(read('category','분야')),subject:str(read('subject','교과')),grade:str(read('grade','학년')),usage:str(read('usage','활용 유형')),audience:Array.isArray(read('audience','targetAudience'))?read('audience','targetAudience').join(', '):str(read('audience','targetAudience','대상')),targetDuration:str(read('targetDuration','duration','영상 길이')),style:str(read('style','영상 스타일')),purpose:str(read('purpose','영상 목적')),mood:str(read('mood','영상 분위기')),login:str(read('login','로그인 여부')),classTime:str(read('classTime','소요 시간')),participation:str(read('participation','참여 방식')),features:featureList};
  }

  Y.parsePRD=(raw,filename='')=>{
    if(typeof raw!=='string'||raw.trim().length<20)throw new Error('PRD 본문을 20자 이상 넣어 주세요.');
    if(raw.length>MAX_TEXT_CHARS)throw new Error('PRD 본문은 20만 자 이하로 넣어 주세요.');
    const text=raw.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'),lines=linesOf(text),values={},evidence={},warnings=[];
    const isJSON=/^\s*\{/.test(text)||/\.json$/i.test(filename);
    if(isJSON){let json;try{json=JSON.parse(text);}catch{throw new Error('PRD JSON 문법이 올바르지 않습니다.');}Object.assign(values,jsonFields(json));Object.keys(values).forEach(k=>{if(values[k]?.length)evidence[k]='본문';});}
    else {
      for(const [key,names]of Object.entries(aliases)){const field=fieldFrom(lines,names);if(field){if(key==='targetDuration'&&!field.inline&&field.alternatives?.length>1)continue;values[key]=field.value;evidence[key]='본문';}}
      values.features=featuresFrom(lines);if(values.features.length)evidence.features='본문';
      if(!values.title){const heading=lines.find(l=>(/^\s*#\s+/.test(l.raw)||l.text.length<120&&/ PRD$/i.test(l.text))&&!/^\d+$|^PRD$|^제품 요구사항/i.test(l.text));if(heading){values.title=heading.text.replace(/\s*(?:[-–—:：]\s*)?(?:PRD|제품 요구사항(?: 정의서)?|Product Requirements Document)\s*$/i,'').trim();evidence.title='문서 제목';}}
    }
    const p=Y.store.fresh();
    if(values.title)p.title=shorten(values.title,120);else{p.title=filename?filename.replace(/\.[^.]+$/,'').replace(/[-_]/g,' '):'PRD 소개영상';warnings.push('프로젝트 이름을 찾지 못했습니다. 제목을 확인해 주세요.');}
    if(values.description)p.description=shorten(values.description,120);else{
      const sentence=lines.find(l=>l.text.length>=25&&l.text.length<=220&&!/^#{1,6}|^\s*[-*+□]/.test(l.raw)&&!l.text.includes(':')&&!future(l.text));
      p.description=sentence?shorten(sentence.text,120):`${p.title}의 주요 기능과 수업 활용을 소개합니다.`;
      warnings.push('한 줄 소개는 문서에서 고른 문장 또는 소개용 기본 문구입니다. 확인해 주세요.');
    }
    p.features=(values.features||[]).slice(0,5).map(f=>shorten(clean(f),90));
    if((values.features||[]).length>5)warnings.push(`기능 ${(values.features||[]).length}개 중 앞의 5개를 반영했습니다. 중요도 순서를 확인해 주세요.`);
    if(!p.features.length){p.features=['주요 기능 소개'];warnings.push('핵심 기능 목록을 찾지 못해 소개용 항목을 넣었습니다. 실제 기능을 입력해 주세요.');}
    const subjectText=[p.title,p.description,...p.features].join(' ');
    if(categories.includes(values.category))p.category=values.category;
    else{p.category= /체육|운동|스포츠|건강/.test(subjectText)?'체육':/역사|시대|유적/.test(subjectText)?'역사':/음악|아카펠라|악기|노래/.test(subjectText)?'음악':/한글|국어|우리말|글쓰기/.test(subjectText)?'국어':/옛날놀이|전통놀이|놀이/.test(subjectText)?'놀이':/업무|행정|생활기록|문서 작성/.test(subjectText)?'업무효율':/코딩|프로그래밍/.test(subjectText)?'코딩':/인공지능|\bAI\b/i.test(subjectText)?'AI':/사회|지도|지리/.test(subjectText)?'사회':'기타';evidence.category='추천';}
    p.subject=values.subject||({체육:'체육',사회:'사회',역사:'사회',음악:'음악',국어:'국어'})[p.category]||'창체';
    p.grade=values.grade?(/^\d$/.test(values.grade)?values.grade+'학년':values.grade):'전학년';
    const usages=['도입','전개','정리','40분 전체수업','프로젝트','가정학습'];p.usage=usages.find(u=>values.usage?.includes(u))||'도입';
    const audience=values.audience||'';p.audience=[['학생',/학생|어린이|student|children/i],['교사',/교사|선생님|teacher/i],['학부모',/학부모|부모|parent/i],['교육 관계자',/교육\s*관계자|교육청|administrator/i]].filter(([,pattern])=>pattern.test(audience)).map(([name])=>name);
    if(!p.audience.length){p.audience=['교사'];evidence.audience='추천';}
    const duration=Number(values.targetDuration?.match(/\d+(?:\.\d+)?/)?.[0]);p.targetDuration=[30,45,60,90].includes(duration)?duration:60;
    if(![30,45,60,90].includes(duration))evidence.targetDuration='추천';
    p.duration=p.targetDuration;p.style=Y.catalog.templates.find(t=>t.id.toLowerCase()===values.style?.toLowerCase())?.id||Y.recommend(p.category);
    p.purpose=['서비스 소개','수업 활용 소개','SNS 홍보','교사 대상 홍보','학생 대상 안내','연구대회/발표'].find(v=>values.purpose?.includes(v))||'서비스 소개';
    p.mood=['밝고 신나는','따뜻하고 감동적인','고급스럽고 차분한','게임 같은','영화 예고편 같은','다큐멘터리 같은','교육 방송 같은'].find(v=>values.mood?.includes(v))||'밝고 신나는';
    const url=values.url?.match(/https?:\/\/[^\s<>"\])]+/i)?.[0];p.url=Y.safeURL(url||'');if(values.url&&!p.url)warnings.push('유효한 http/https URL을 찾지 못했습니다. 링크를 확인해 주세요.');
    p.login=values.login||'';p.classTime=values.classTime?.match(/\d+/)?.[0]||'';p.participation=shorten(values.participation||'',150);
    p.prd={filename:filename||'붙여넣은 PRD',characterCount:text.length,importedAt:new Date().toISOString(),method:'local-template',warnings};
    warnings.push('스크린샷이 없으면 문구 중심 초안을 만듭니다. 실제 서비스 화면은 나중에 추가하세요.');
    return {project:p,evidence,warnings};
  };

  function decodeText(buffer){const bytes=buffer instanceof Uint8Array?buffer:new Uint8Array(buffer);if(bytes[0]===0xff&&bytes[1]===0xfe)return new TextDecoder('utf-16le',{fatal:true}).decode(bytes);if(bytes[0]===0xfe&&bytes[1]===0xff)return new TextDecoder('utf-16be',{fatal:true}).decode(bytes);try{return new TextDecoder('utf-8',{fatal:true}).decode(bytes);}catch{return new TextDecoder('euc-kr',{fatal:true}).decode(bytes);}}
  async function unzipXML(file,kind){
    const bytes=new Uint8Array(await file.arrayBuffer()),v=new DataView(bytes.buffer);let eocd=-1;
    for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50){eocd=i;break;}
    if(eocd<0)throw new Error('문서 ZIP 구조를 읽을 수 없습니다. 손상되거나 암호화된 파일인지 확인해 주세요.');
    const count=v.getUint16(eocd+10,true),centralOffset=v.getUint32(eocd+16,true);if(count===65535||centralOffset===0xffffffff||count>5000)throw new Error('이 문서의 압축 형식은 지원하지 않습니다. 본문 텍스트를 붙여 넣어 주세요.');
    let offset=centralOffset;const entries=[];
    for(let i=0;i<count;i++){
      if(offset+46>bytes.length||v.getUint32(offset,true)!==0x02014b50)throw new Error('손상된 문서입니다.');
      const nameLength=v.getUint16(offset+28,true),extraLength=v.getUint16(offset+30,true),commentLength=v.getUint16(offset+32,true),name=new TextDecoder().decode(bytes.subarray(offset+46,offset+46+nameLength));
      if(kind==='docx'?name==='word/document.xml':/^Contents\/section\d+\.xml$/i.test(name))entries.push({name,flags:v.getUint16(offset+8,true),method:v.getUint16(offset+10,true),compressed:v.getUint32(offset+20,true),size:v.getUint32(offset+24,true),local:v.getUint32(offset+42,true)});
      offset+=46+nameLength+extraLength+commentLength;
    }
    if(!entries.length)throw new Error('본문이 있는 DOCX/HWPX 문서가 아닙니다.');
    entries.sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));let total=0;const parts=[];
    for(const entry of entries){
      if(entry.flags&1)throw new Error('암호화된 문서는 지원하지 않습니다.');
      if(entry.size>MAX_XML_BYTES||entry.local+30>bytes.length)throw new Error('문서 본문이 너무 크거나 손상되었습니다.');
      const start=entry.local+30+v.getUint16(entry.local+26,true)+v.getUint16(entry.local+28,true),end=start+entry.compressed;
      if(end>bytes.length||v.getUint32(entry.local,true)!==0x04034b50)throw new Error('손상된 문서 본문입니다.');
      let xmlBytes=bytes.subarray(start,end);
      if(entry.method===8){
        let stream;try{stream=new Blob([xmlBytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));}catch{throw new Error('이 브라우저는 문서 압축 해제를 지원하지 않습니다. TXT로 저장하거나 본문을 붙여 넣어 주세요.');}
        const reader=stream.getReader(),chunks=[];let length=0;
        while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>MAX_XML_BYTES){await reader.cancel();throw new Error('문서 본문이 너무 큽니다.');}chunks.push(value);}
        xmlBytes=new Uint8Array(length);let pos=0;chunks.forEach(chunk=>{xmlBytes.set(chunk,pos);pos+=chunk.length;});
      }else if(entry.method!==0)throw new Error('지원하지 않는 문서 압축 방식입니다.');
      total+=xmlBytes.length;if(total>MAX_XML_BYTES)throw new Error('문서 본문이 너무 큽니다.');
      const doc=new DOMParser().parseFromString(decodeText(xmlBytes),'application/xml');if(doc.getElementsByTagName('parsererror').length)throw new Error('문서 XML이 손상되었습니다.');
      const paragraphs=Array.from(doc.getElementsByTagNameNS('*','p')).map(p=>{
        const pieces=[];function visit(node,inText=false){if(node.nodeType===3){if(inText)pieces.push(node.nodeValue);return;}if(node!==p&&node.localName==='p')return;if(['br','lineBreak'].includes(node.localName)){pieces.push('\n');return;}if(node.localName==='tab'){pieces.push('\t');return;}for(const child of node.childNodes)visit(child,inText||node.localName==='t');}visit(p);return pieces.join('');
      }).filter(Boolean);
      parts.push(paragraphs.join('\n'));
    }
    return parts.join('\n\n');
  }
  Y.readPRDFile=async file=>{
    const kind=file.name.split('.').pop().toLowerCase(),supported=['txt','md','markdown','json','docx','hwpx'];
    if(!supported.includes(kind))throw new Error('TXT, MD, JSON, DOCX, HWPX 파일을 지원합니다. PDF·HWP는 본문 텍스트를 붙여 넣어 주세요.');
    if(file.size>(['docx','hwpx'].includes(kind)?MAX_DOCUMENT_BYTES:MAX_TEXT_BYTES))throw new Error('텍스트 파일은 2MB, DOCX/HWPX는 12MB 이하로 넣어 주세요.');
    let text;try{text=['docx','hwpx'].includes(kind)?await unzipXML(file,kind):decodeText(await file.arrayBuffer());}catch(error){throw new Error('문서를 읽지 못했습니다: '+error.message);}
    if(text.includes('\0'))throw new Error('텍스트 파일에 바이너리 데이터가 있습니다. 문서 본문을 텍스트로 저장해 주세요.');
    if(text.length>MAX_TEXT_CHARS)throw new Error('PRD 본문은 20만 자 이하로 넣어 주세요.');
    if(!text.trim())throw new Error('읽을 수 있는 본문이 없습니다. 이미지 문서에는 OCR을 제공하지 않습니다.');
    return text;
  };
})();
