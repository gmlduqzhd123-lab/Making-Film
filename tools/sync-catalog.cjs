// Optional maintainer utility. The app runs without this command or a build.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const catalog={templates:read('data/templates.json'),copyTemplates:read('data/copyTemplates.json'),presets:read('data/animationPresets.json'),samples:fs.readdirSync(path.join(root,'sample-projects')).filter(f=>f.endsWith('.json')).map(f=>read('sample-projects/'+f))};
fs.writeFileSync(path.join(root,'data/catalog.js'),'window.YVM=window.YVM||{};window.YVM.catalog='+JSON.stringify(catalog)+';\n');
console.log('Offline catalog synchronized. No build required to run index.html.');
