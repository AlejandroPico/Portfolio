const languageMeta={es:['ES','Español'],ca:['CA','Català'],en:['EN','English'],fr:['FR','Français'],de:['DE','Deutsch'],pt:['PT','Português']};
window.addEventListener('DOMContentLoaded',()=>{
 const select=document.getElementById('languageSelect');
 if(!select||select.dataset.enhanced)return;
 Object.entries(languageMeta).forEach(([value,data])=>{if(!select.querySelector('option[value="'+value+'"]')){const option=document.createElement('option');option.value=value;option.textContent=data[0];select.appendChild(option);}});
 select.dataset.enhanced='true';
 select.style.display='none';
 const picker=document.createElement('div');
 picker.className='language-picker';
 const button=document.createElement('button');
 button.type='button';button.className='language-picker__button';
 const menu=document.createElement('div');
 menu.className='language-picker__menu';
 Object.entries(languageMeta).forEach(([value,data])=>{const item=document.createElement('button');item.type='button';item.dataset.lang=value;item.textContent=data[0]+' · '+data[1];menu.appendChild(item);});
 picker.appendChild(button);picker.appendChild(menu);select.after(picker);
 function refresh(){button.textContent=(languageMeta[select.value]||languageMeta.es)[0];menu.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b.dataset.lang===select.value));}
 function close(){picker.classList.remove('open');}
 button.addEventListener('click',()=>picker.classList.toggle('open'));
 menu.addEventListener('click',event=>{const item=event.target.closest('button[data-lang]');if(!item)return;select.value=item.dataset.lang;select.dispatchEvent(new Event('change'));refresh();close();});
 document.addEventListener('click',event=>{if(!picker.contains(event.target))close();});
 select.addEventListener('change',refresh);
 refresh();
});
