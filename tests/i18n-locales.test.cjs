const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{},tx:{},projectText:{},projectDescriptions:{},catLabels:{},nameLabels:{}});
for(const lang of ['ko','ru','ar'])vm.runInContext(fs.readFileSync(path.join(root,'i18n',lang+'.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'i18n/languages.js'),'utf8'),context);
function assertComplete(actual,reference,location){
 if(Array.isArray(reference))assert.equal(actual.length,reference.length,location);
 if(reference&&typeof reference==='object')for(const key of Object.keys(reference))assertComplete(actual?.[key],reference[key],location+'.'+key);
 else assert.equal(typeof actual==='string'&&actual.trim().length>0,true,location+' must contain translated text');
}
for(const lang of ['ru','ar'])test(lang+' covers the full interface, CV, projects and skills',()=>{
 for(const table of ['tx','projectText','projectDescriptions','catLabels','nameLabels'])assertComplete(context[table][lang],context[table].ko,table+'.'+lang);
 assertComplete(context.window.portfolioLocaleAdditions[lang],context.window.portfolioLocaleAdditions.ko,'additions.'+lang);
 for(const style of ['matte','classic','aurora','nebula','solstice','ocean','sky','cosmos'])assertComplete(context.tx[lang].visualStyles[style],['title','description'],'style.'+style);
 for(const label of ['menu','navigation','repo','open','visit','automatic','photo','language'])assert.equal(typeof context.tx[lang].accessibility[label],'string');
});
test('language registry declares Arabic RTL and keeps one Portuguese locale',()=>{
 const languages=context.window.portfolioLanguages;
 assert.equal(languages.length,13);
 assert.equal(new Set(languages.map(l=>l.code)).size,13);
 assert.equal(languages.find(l=>l.code==='ar').dir,'rtl');
 assert.equal(languages.filter(l=>l.code.startsWith('pt')).length,1);
 for(const lang of languages){assert(fs.existsSync(path.join(root,'i18n',lang.file)));assert(fs.existsSync(path.join(root,lang.flagUrl)))}
});
