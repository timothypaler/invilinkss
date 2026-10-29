/* Gentle wheel smoothing, native touch input and scroll-synchronized visual layers. */
(() => {
 const reduce=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover:hover) and (pointer:fine)'),clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
 const header=document.querySelector('.header-shell'),intro=document.querySelector('.intro-scroll'),work=document.querySelector('.work-scroll'),pin=work?.querySelector('.work-pin'),track=work?.querySelector('.work-track'),viewport=work?.querySelector('.work-viewport');
 const scenes=[...document.querySelectorAll('.photo-scene')];
 const stack=[...document.querySelectorAll('.stack-card')],bento=document.querySelector('.bento-grid');
 const pending=new Set(document.querySelectorAll('[data-reveal]'));
 let frame=0,wide=false,distance=0,travel=0,stopped=false,smoother=null;
 function modalState(){if(!smoother)return;if(document.querySelector('dialog[open]'))smoother.stop();else smoother.start()}
 function setupSmoothing(){
  const enabled=!!window.Lenis&&fine.matches&&innerWidth>800&&!reduce.matches;
  if(enabled&&!smoother){smoother=new Lenis({autoRaf:true,lerp:.085,smoothWheel:true,syncTouch:false,anchors:false,stopInertiaOnNavigate:true,respectReducedMotion:true});smoother.on('scroll',request);modalState()}
  else if(!enabled&&smoother){smoother.destroy();smoother=null}
  document.documentElement.dataset.scrollMode=smoother?'smooth':'native';
 }
 function goTo(top){if(smoother)smoother.scrollTo(top,{duration:1.1});else scrollTo({top,behavior:reduce.matches?'instant':'smooth'})}
 // Keep anchor navigation, modified clicks, URL history and keyboard focus meaningful.
 document.addEventListener('click',event=>{
  if(!smoother||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;
  const link=event.target.closest('a[href]');if(!link||link.download||link.target&&link.target!=='_self')return;
  const url=new URL(link.href,location.href);if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!url.hash)return;
  let id;try{id=decodeURIComponent(url.hash.slice(1))}catch{return}const target=document.getElementById(id);if(!target)return;
  event.preventDefault();if(location.hash!==url.hash)history.pushState(null,'',url.hash);
  smoother.scrollTo(target,{duration:id==='main'?.35:1.15,onComplete:()=>{if(!target.hasAttribute('tabindex'))target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}});
 });
 new MutationObserver(modalState).observe(document.body,{subtree:true,attributes:true,attributeFilter:['open']});
 addEventListener("invilinks:navigation-start",()=>smoother?.stop());addEventListener("invilinks:navigation-ready",()=>modalState());
 setupSmoothing();
 function measure(){setupSmoothing();wide=work?.dataset.galleryMode!=='browse'&&innerWidth>900&&innerHeight>=760&&!reduce.matches;if(work){work.classList.toggle('horizontal-ready',wide);viewport.removeAttribute('data-lenis-prevent');if(wide){distance=Math.max(0,track.scrollWidth-viewport.clientWidth);travel=distance*.78;work.style.height=Math.ceil(pin.offsetHeight+travel)+'px'}else{work.style.removeProperty('height');work.style.setProperty('--work-x','0px')}}request()}
 function render(){frame=0;header.classList.toggle('is-scrolled',scrollY>30);
  for(const el of pending){if(el.classList.contains('visible')){pending.delete(el);continue}const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight-20){el.classList.add('visible');pending.delete(el)}}
  if(intro){
   const rect=intro.getBoundingClientRect(),headerHeight=header.offsetHeight;
   // Keep the photograph locked to the viewport. Only the page moves over it.
   const covered=Math.max(0,Math.min(innerHeight-headerHeight,innerHeight-rect.bottom));
   intro.style.setProperty('--hero-header',headerHeight+'px');
   intro.style.setProperty('--hero-cover',reduce.matches?'0px':covered.toFixed(2)+'px');
   intro.dataset.covered=covered.toFixed(2);
  }
  for(const scene of scenes){
   const r=scene.getBoundingClientRect(),top=Math.max(header.offsetHeight,r.top),bottom=Math.max(0,innerHeight-r.bottom);
   scene.style.setProperty('--scene-top',Math.max(0,top).toFixed(2)+'px');
   scene.style.setProperty('--scene-bottom',bottom.toFixed(2)+'px');
   scene.dataset.sceneVisible=String(r.bottom>header.offsetHeight&&r.top<innerHeight);
  }
  if(work&&wide){const r=work.getBoundingClientRect(),p=clamp((header.offsetHeight-r.top)/Math.max(1,travel));work.style.setProperty('--work-x',-distance*p+'px');work.style.setProperty('--work-progress',p);work.dataset.timeline=p.toFixed(3);const n=track.querySelectorAll('.sample-card:not([hidden])').length;work.querySelector('.work-count').textContent=String(Math.min(n,Math.round(p*Math.max(0,n-1))+1)).padStart(2,'0')+' / '+String(n).padStart(2,'0')}
  if(!reduce.matches){for(const e of stack){const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)continue;const p=clamp((innerHeight*.7-r.top)/Math.max(1,innerHeight));e.style.setProperty('--stack-progress',p);e.dataset.depth=p.toFixed(3)}if(bento){const r=bento.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const p=clamp((innerHeight-r.top)/(innerHeight+r.height));bento.style.setProperty('--bento-progress',p);bento.style.setProperty('--type-weight',String(360+Math.round(p*350)))}}}
 }
 function request(){if(!frame&&!stopped)frame=requestAnimationFrame(render)}
 document.addEventListener('focusin',e=>{const el=e.target.closest('[data-reveal]');if(el){el.classList.add('visible');pending.delete(el)}});
 addEventListener('scroll',request,{passive:true});addEventListener('resize',measure);reduce.addEventListener('change',measure);
 if(work){document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>requestAnimationFrame(()=>{measure();if(wide){const top=scrollY+work.getBoundingClientRect().top-header.offsetHeight;goTo(top)}})));new ResizeObserver(measure).observe(viewport);work.querySelectorAll('img').forEach(img=>img.addEventListener('load',measure,{once:true}));
 // Keyboard navigation works for the native touch/reduced-motion gallery too.
 viewport.tabIndex=0;viewport.setAttribute('aria-label','Invitation design gallery');viewport.addEventListener('keydown',e=>{if(wide||!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();viewport.scrollBy({left:(e.key==='ArrowRight'?1:-1)*viewport.clientWidth*.85,behavior:reduce.matches?'instant':'smooth'})})}
 if(work?.dataset.galleryMode==='browse'){
  function updateGallery(){const cards=[...track.querySelectorAll('.sample-card:not([hidden])')],r=viewport.getBoundingClientRect();let index=cards.findIndex(c=>c.getBoundingClientRect().right>r.left+40);index=Math.max(0,index);work.querySelector('.work-count').textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');work.querySelector('[data-gallery-step="-1"]').disabled=viewport.scrollLeft<=2;work.querySelector('[data-gallery-step="1"]').disabled=viewport.scrollLeft>=viewport.scrollWidth-viewport.clientWidth-2}
  work.querySelectorAll('[data-gallery-step]').forEach(b=>b.addEventListener('click',()=>{const card=track.querySelector('.sample-card:not([hidden])');viewport.scrollBy({left:Number(b.dataset.galleryStep)*(card?.offsetWidth+28||viewport.clientWidth*.85),behavior:reduce.matches?'instant':'smooth'})}));
  viewport.addEventListener('scroll',updateGallery,{passive:true});addEventListener('resize',updateGallery);document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{viewport.scrollTo({left:0,behavior:'instant'});requestAnimationFrame(updateGallery)}));document.fonts.ready.then(updateGallery);updateGallery();
 }
 if(fine.matches){document.addEventListener('pointermove',e=>{if(reduce.matches)return;document.documentElement.style.setProperty('--aura-x',e.clientX/innerWidth*100+'%');document.documentElement.style.setProperty('--aura-y',e.clientY/innerHeight*100+'%')},{passive:true});document.querySelectorAll('.button,.bento,.sample-art').forEach(el=>{el.addEventListener('pointermove',e=>{if(reduce.matches)return;const r=el.getBoundingClientRect();el.style.setProperty('--mouse-x',(e.clientX-r.left)/r.width*100+'%');el.style.setProperty('--mouse-y',(e.clientY-r.top)/r.height*100+'%');if(el.classList.contains('button')){el.style.setProperty('--mx',(e.clientX-r.left-r.width/2)*.035+'px');el.style.setProperty('--my',(e.clientY-r.top-r.height/2)*.08+'px')}});el.addEventListener('pointerleave',()=>{el.style.setProperty('--mx','0px');el.style.setProperty('--my','0px')})})}
 document.fonts.ready.then(measure);measure();addEventListener('pagehide',()=>{stopped=true;cancelAnimationFrame(frame);frame=0;if(smoother){smoother.destroy();smoother=null}});addEventListener('pageshow',()=>{stopped=false;measure()});
})();
