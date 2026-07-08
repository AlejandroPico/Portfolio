function initScrollReveal(){
  const items=[...document.querySelectorAll('.project-card,.tech-card,.resume-column,.value-grid p,.profile-text p,.contact-form')];
  if(!items.length)return;
  if(!document.getElementById('scroll-reveal-style')){
    const style=document.createElement('style');
    style.id='scroll-reveal-style';
    style.textContent='@media (prefers-reduced-motion:no-preference){.reveal-item{opacity:0;transform:translateY(18px);transition:opacity .58s ease,transform .58s ease;transition-delay:var(--reveal-delay,0ms)}.reveal-item.is-visible{opacity:1;transform:none}}';
    document.head.appendChild(style);
  }
  items.forEach((item,index)=>{item.classList.add('reveal-item');item.style.setProperty('--reveal-delay',Math.min(index%8,6)*45+'ms')});
  if(!('IntersectionObserver'in window)){items.forEach(item=>item.classList.add('is-visible'));return;}
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.14,rootMargin:'0px 0px -6% 0px'});
  items.forEach(item=>observer.observe(item));
}
if(document.readyState==='loading')window.addEventListener('DOMContentLoaded',()=>setTimeout(initScrollReveal,450),{once:true});else setTimeout(initScrollReveal,450);
document.addEventListener('portfolio-language-change',()=>setTimeout(initScrollReveal,120));
