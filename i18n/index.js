function loadI18nAsset(src,type='script'){return new Promise((resolve,reject)=>{if(type==='css'){if(document.querySelector('link[href^="'+src.split('?')[0]+'"]'))return resolve();const link=document.createElement('link');link.rel='stylesheet';link.href=src;link.onload=resolve;link.onerror=reject;document.head.appendChild(link);return}if(document.querySelector('script[src^="'+src.split('?')[0]+'"]'))return resolve();const script=document.createElement('script');script.async=false;script.src=src;script.onload=resolve;script.onerror=reject;document.body.appendChild(script)})}
function detectPortfolioLanguage(){
 const supported=(window.portfolioLanguages||[]).map(lang=>lang.code);
 for(const raw of [...(navigator.languages||[]),navigator.language].filter(Boolean)){
  const base=String(raw).toLowerCase().split('-')[0];if(supported.includes(base))return base;
 }
 return 'en';
}
async function initI18nBundle(){const v='20261021-2';await loadI18nAsset('solar-theme.css?v='+v,'css');await loadI18nAsset('i18n/language-picker.css?v='+v,'css');await loadI18nAsset('i18n/core.js?v='+v);await loadI18nAsset('i18n/languages.js?v='+v);for(const lang of window.portfolioLanguages){await loadI18nAsset('i18n/'+lang.file+'?v='+v)}await loadI18nAsset('i18n/project-extras.js?v='+v);await loadI18nAsset('i18n/tags.js?v='+v);await loadI18nAsset('i18n/language-picker.js?v='+v);await loadI18nAsset('i18n/project-catalog-extra.js?v='+v);for(const [lang,data] of Object.entries(window.portfolioLocaleAdditions||{})){
 extraProjectDescriptions[lang]=data.extras;tagLine[lang]=data.tags;
 extraCatalogTranslations[lang]=data.catalog;projectActionLabels[lang]={visit:data.visit};
}
initLanguagePicker();initExtraCatalogProjects();initCoreI18n();
initExtraProjectDescriptions();initProjectTags();
window.addEventListener('languagechange',()=>{if(document.getElementById('languageSelect')?.value==='auto')setLang('auto')});
await loadI18nAsset('solar-theme.js?v='+v)}
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',initI18nBundle,{once:true});else initI18nBundle();