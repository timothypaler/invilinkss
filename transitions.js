/* An invitation-themed curtain for same-site page navigation. */
(() => {
 const root=document.documentElement,veil=document.querySelector('.page-veil'),label=veil?.querySelector('.veil-label'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),key='invilinks-page-transition';
 const titles={'/':'The collection','/pricing/':'The packages','/how-it-works/':'How it works','/photo-credits/':'Photo credits'};
 let leaving=false,watchdog=0,arrivalToken=0;
 function read(){try{return JSON.parse(sessionStorage.getItem(key)||'null')}catch{return null}}
 function clear(){try{sessionStorage.removeItem(key)}catch{}}
 function reset(){leaving=false;clearTimeout(watchdog);root.classList.remove('page-navigating','page-arriving','page-uncovering','page-leaving');veil?.setAttribute('aria-hidden','true');document.body.removeAttribute('aria-busy');dispatchEvent(new CustomEvent('invilinks:navigation-ready'))}
 async function arrive(){
  const token=++arrivalToken,marker=read();clear();
  if(marker)root.dataset.transitionArrival='received';
  if(!veil||!root.classList.contains('page-arriving')||reduced.matches){reset();return}
  if(label)label.textContent=marker?.label||titles[location.pathname]||'InviLinks';
  veil.setAttribute('aria-hidden','false');
  // Reveal once the document and typography are ready; the timeout is a recovery bound.
  const loaded=document.readyState==='complete'?Promise.resolve():new Promise(done=>addEventListener('load',done,{once:true}));
  await Promise.race([Promise.all([loaded,document.fonts?.ready||Promise.resolve()]),new Promise(done=>setTimeout(done,1600))]);
  if(token!==arrivalToken)return;
  root.classList.add('page-uncovering');root.dataset.transitionArrival='revealing';
  const animation=veil.getAnimations().find(a=>a.animationName==='invitation-uncover');
  if(animation)try{await animation.finished}catch{}
  if(token===arrivalToken){root.dataset.transitionArrival='complete';reset();}
 }
 arrive();
 addEventListener('pageshow',event=>{if(event.persisted){arrivalToken++;clear();reset()}});
 addEventListener('pagehide',()=>clearTimeout(watchdog));
 document.addEventListener('click',async event=>{
  const link=event.target.closest('a[href]');
  if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.hasAttribute('download')||(link.target&&link.target!=='_self'))return;
  const url=new URL(link.href,location.href);
  if(url.origin!==location.origin||url.protocol!=='https:'&&url.protocol!=='http:'||url.pathname===location.pathname&&url.search===location.search)return;
  if(reduced.matches||!veil)return;
  event.preventDefault();if(leaving)return;leaving=true;
  const title=titles[url.pathname]||'InviLinks';if(label)label.textContent=title;
  try{sessionStorage.setItem(key,JSON.stringify({label:title,to:url.pathname,at:Date.now()}))}catch{}
  veil.setAttribute('aria-hidden','false');document.body.setAttribute('aria-busy','true');root.classList.remove('page-arriving','page-uncovering');root.classList.add('page-navigating');
  dispatchEvent(new CustomEvent('invilinks:navigation-start'));
  watchdog=setTimeout(()=>{clear();reset()},6000);
  const animation=veil.getAnimations().find(a=>a.animationName==='invitation-cover');
  if(animation)try{await animation.finished}catch{}
  location.assign(url.href);
 });
 reduced.addEventListener('change',()=>{if(reduced.matches&&!leaving){arrivalToken++;clear();reset()}});
})();
