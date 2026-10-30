const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{addEventListener(){}},document:{readyState:'loading'},tx:{},projectText:{},projectDescriptions:{},catLabels:{},nameLabels:{}});
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
vm.runInContext(read('i18n/project-catalog-extra.js')+'\nwindow.catalogForTest=extraCatalogProjects;window.translationsForTest=extraCatalogTranslations;',context);
vm.runInContext(read('i18n/languages.js'),context);
for(const lang of ['zh','ja','hi','ko','ru','ar'])vm.runInContext(read('i18n/'+lang+'.js'),context);
const projects=context.window.catalogForTest;
const entries=[['historicmap','Historicmap','historicmap'],['extra-extra','Xtraxtra','extraExtra']];
test('the two requested projects appear in order with their published links',()=>{
 assert.deepEqual(Array.from(projects.slice(-2),p=>p.id),entries.map(e=>e[0]));
 for(const [id,repo] of entries){
  const item=projects.find(p=>p.id===id);assert.equal(projects.filter(p=>p.id===id).length,1);
  assert.equal(item.url,'https://alejandropico.github.io/'+repo+'/');
  assert.equal(item.repo,'https://github.com/AlejandroPico/'+repo);
  if(id==='extra-extra')assert.equal(new URL(item.icon).pathname,'/Xtraxtra/favicon.png');
 }
});
test('both new project descriptions and tags exist for every supported language',()=>{
 const translations=context.window.translationsForTest;
 for(const lang of context.window.portfolioLanguages){
  const local=context.window.portfolioLocaleAdditions?.[lang.code]?.catalog||translations[lang.code];
  for(const [, , key] of entries){
   const item=local?.[key];assert(item,lang.code+': '+key);
   assert(item.description.trim().length>20,lang.code+': '+key+' description');
   assert.equal(item.tags.length,2,lang.code+': '+key+' tags');
   assert(item.tags.every(tag=>tag.trim()),lang.code+': '+key+' empty tag');
   if(lang.code!=='es')assert.notEqual(item.description,translations.es[key].description,lang.code+': '+key+' untranslated');
  }
 }
});
