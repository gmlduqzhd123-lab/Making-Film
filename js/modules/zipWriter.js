// ZIP STORE writer: no compression, no dependency, UTF-8 names and CRC32.
(() => {
 const Y=window.YVM, encoder=new TextEncoder(), table=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
 const crc=bytes=>{let n=0xffffffff;for(const b of bytes)n=table[(n^b)&255]^(n>>>8);return(n^0xffffffff)>>>0;};
 const header=(size,values)=>{const b=new Uint8Array(size),v=new DataView(b.buffer);values.forEach(([offset,value,width])=>width===2?v.setUint16(offset,value,true):v.setUint32(offset,value,true));return b;};
 Y.zip=async files=>{
   const parts=[],central=[];let offset=0,centralSize=0;
   for(const [name,value] of Object.entries(files)){
     const path=encoder.encode(name),bytes= value instanceof Uint8Array?value:value instanceof Blob?new Uint8Array(await value.arrayBuffer()):encoder.encode(value), checksum=crc(bytes);
     const local=header(30,[[0,0x04034b50,4],[4,20,2],[6,0x800,2],[14,checksum,4],[18,bytes.length,4],[22,bytes.length,4],[26,path.length,2]]);
     const entry=header(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[8,0x800,2],[16,checksum,4],[20,bytes.length,4],[24,bytes.length,4],[28,path.length,2],[42,offset,4]]);
     parts.push(local,path,bytes);central.push(entry,path);offset+=local.length+path.length+bytes.length;centralSize+=entry.length+path.length;
   }
   const end=header(22,[[0,0x06054b50,4],[8,Object.keys(files).length,2],[10,Object.keys(files).length,2],[12,centralSize,4],[16,offset,4]]);
   return new Blob([...parts,...central,end],{type:'application/zip'});
 };
 Y.dataBytes=src=>{const base64=src.split(',')[1],binary=atob(base64);return Uint8Array.from(binary,c=>c.charCodeAt(0));};
})();
