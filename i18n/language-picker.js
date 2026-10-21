function initLanguagePicker(){
 const select=document.getElementById('languageSelect');const languages=window.portfolioLanguages||[];
 if(!select||select.dataset.enhanced||!languages.length)return;
 const langs=[{code:'auto',label:'Auto',name:'Auto'},...languages];
 select.replaceChildren(...langs.map(lang=>{const option=document.createElement('option');option.value=lang.code;option.textContent=lang.label;return option}));
 select.value='auto';select.dataset.enhanced='true';select.style.display='none';
 const picker=document.createElement('div');picker.className='language-picker';
 const button=document.createElement('button');button.type='button';button.className='language-picker__button';button.setAttribute('aria-haspopup','true');button.setAttribute('aria-expanded','false');
 const menu=document.createElement('div');menu.className='language-picker__menu';
 langs.forEach(lang=>{const item=document.createElement('button');item.type='button';item.dataset.lang=lang.code;
 if(lang.flagUrl){const img=document.createElement('img');img.src=lang.flagUrl;img.alt='';img.loading='lazy';item.appendChild(img)}else{const icon=document.createElement('span');icon.textContent='◌';icon.setAttribute('aria-hidden','true');item.appendChild(icon)}
 const name=document.createElement('span');name.textContent=lang.name;name.dir=lang.dir||'auto';item.appendChild(name);menu.appendChild(item)});
 picker.append(button,menu);select.after(picker);
 function refresh(){const code=select.value==='auto'?(document.documentElement.lang||detectPortfolioLanguage()).split('-')[0]:select.value;const language=languages.find(lang=>lang.code===code)||languages.find(lang=>lang.code==='en');const automatic=tx[code]?.accessibility?.automatic||'Auto';menu.querySelector('button[data-lang="auto"] span:last-child').textContent=automatic;button.textContent=language.label;button.setAttribute('aria-label',language.name+(select.value==='auto'?' · '+(tx[code]?.accessibility?.automatic||'Auto'):''));menu.querySelectorAll('button').forEach(b=>{const active=b.dataset.lang===select.value;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active))})}
 function close(){picker.classList.remove('open');button.setAttribute('aria-expanded','false')}
 button.addEventListener('click',()=>{const open=picker.classList.toggle('open');button.setAttribute('aria-expanded',String(open));if(open){const rect=button.getBoundingClientRect();const above=rect.top-12;const below=window.innerHeight-rect.bottom-12;const up=above>below;menu.style.setProperty('top',up?'auto':'calc(100% + .35rem)','important');menu.style.setProperty('bottom',up?'calc(100% + .35rem)':'auto','important');menu.style.maxHeight=Math.max(80,(up?above:below)-8)+'px'}});
 menu.addEventListener('click',event=>{const item=event.target.closest('button[data-lang]');if(!item)return;select.value=item.dataset.lang;select.dispatchEvent(new Event('change'));refresh();close();button.focus()});
 document.addEventListener('click',event=>{if(!picker.contains(event.target))close()});
 picker.addEventListener('keydown',event=>{if(event.key==='Escape'){close();button.focus()}});
 select.addEventListener('change',refresh);document.addEventListener('portfolio-language-change',refresh);refresh();
}
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',initLanguagePicker,{once:true});else initLanguagePicker();
