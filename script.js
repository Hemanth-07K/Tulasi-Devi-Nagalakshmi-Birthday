const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// MASTER SEQUENCE — keep this order unless the birthday plan is intentionally changed.
const SEQUENCE = [
  'arrival','birthdayIntro','lifeClock','discover','herWorld','smile','memories','videos',
  'gate','privateMemories','story','imagined','message','wishes','family','promises','finalWish','yearIntro','countdownScene'
];
const scenes = $$('.scene');
let current = 'arrival';
let finalBurstTimer = 0;
let endBurstTimer = 0;
let familyTimers = new Set();
let letterTimers = new Set();
let familyChoiceLocked = false;
function trackTimer(set, fn, ms){ const t=setTimeout(()=>{ set.delete(t); fn(); }, ms); set.add(t); return t; }
function clearTrackedTimers(set){ set.forEach(clearTimeout); set.clear(); }
function clearFamilyTimers(){ clearTrackedTimers(familyTimers); }
function clearLetterTimers(){ clearTrackedTimers(letterTimers); }
function go(id){
  const next = $('#'+id);
  if(!next || !SEQUENCE.includes(id)) return;
  // Leaving any interface must stop media immediately. This prevents a video
  // from continuing to play underneath the next cinematic scene.
  $$('video').forEach(v => { try { v.pause(); } catch(e) {} });
  scenes.forEach(s => s.classList.toggle('active', s.id === id));
  if(id !== 'family') clearFamilyTimers();
  if(id === 'family') resetFamilyScene();
  if(id !== 'message') clearLetterTimers();
  current = id;
  if(id !== 'countdownScene'){ clearTimeout(endBurstTimer); endBurstTimer=0; }
  if(id !== 'countdownScene') { finalBurst?.classList.remove('active'); }
  clearTimeout(finalBurstTimer); finalBurstTimer=0;
  next.scrollTop = 0;
  window.scrollTo(0,0);
  document.body.classList.toggle('countdown-active', id === 'countdownScene');
  if(id === 'birthdayIntro') setTimeout(()=>startCakeFormation(), 90);
}

window.go = go;
$$('[data-next]').forEach(b => b.addEventListener('click', () => go(b.dataset.next)));

// Full-screen / landscape: request it where the browser permits it; never trap the user.
const rotatePrompt = $('#rotatePrompt');
function updateOrientationPrompt(){
  const portrait = window.innerWidth < window.innerHeight;
  const smallScreen = Math.max(window.innerWidth, window.innerHeight) <= 1100;
  rotatePrompt.classList.toggle('hidden', !(portrait && smallScreen));
}
async function requestImmersive(){
  try { if(document.documentElement.requestFullscreen && !document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch(e){}
  try { if(screen.orientation?.lock) await screen.orientation.lock('landscape'); } catch(e){}
  updateOrientationPrompt();
}
window.addEventListener('resize', updateOrientationPrompt);
window.addEventListener('orientationchange', updateOrientationPrompt);
updateOrientationPrompt();

// Global star field and romantic accents use a deterministic seed so every reload
// preserves the same cinematic composition.
const starBox = $('#stars');
let visualSeed = 29092026;
const visualRand = () => { visualSeed = (visualSeed * 1664525 + 1013904223) >>> 0; return visualSeed / 4294967296; };
for(let i=0;i<82;i++){
  const s = document.createElement('i');
  s.className = 'star' + (i < 8 ? ' special' : '');
  s.style.left = visualRand()*100 + '%';
  s.style.top = visualRand()*100 + '%';
  s.style.setProperty('--t',(1.4+visualRand()*3)+'s');
  s.style.setProperty('--d',(8+visualRand()*18)+'s');
  s.style.setProperty('--x',(-20+visualRand()*40)+'px');
  s.style.setProperty('--y',(-20+visualRand()*40)+'px');
  starBox.appendChild(s);
}
for(let i=0;i<28;i++){
  const h=document.createElement('i'); h.className='bg-heart'; h.textContent='♥';
  h.style.left=visualRand()*100+'%'; h.style.top=visualRand()*100+'%';
  h.style.setProperty('--s',(7+visualRand()*7)+'px'); h.style.setProperty('--o',(0.12+visualRand()*0.24).toFixed(2));
  h.style.setProperty('--t',(5+visualRand()*7)+'s'); h.style.setProperty('--d',(visualRand()*-8)+'s'); starBox.appendChild(h);
}
for(let i=0;i<10;i++){
  const r=document.createElement('i'); r.className='bg-rose'; r.textContent='✿';
  r.style.left=visualRand()*100+'%'; r.style.top=visualRand()*100+'%';
  r.style.setProperty('--s',(8+visualRand()*6)+'px'); r.style.setProperty('--o',(0.10+visualRand()*0.18).toFixed(2));
  r.style.setProperty('--t',(6+visualRand()*8)+'s'); r.style.setProperty('--d',(visualRand()*-10)+'s'); starBox.appendChild(r);
}

// 01 — Moon arrival. Exact wording from the approved plan.
$('#enterLight').addEventListener('click', async () => {
  requestImmersive();
  const c = $('.arrival-center');
  $('#enterLight').classList.add('moon-touched');
  $('#touchMoonLabel')?.classList.add('post-moon-hidden');
  c.classList.add('revealed');
  // Let the moon finish its vanish animation, then remove it from layout so
  // the remaining message recenters as a single cinematic composition.
  setTimeout(()=>$('#enterLight')?.classList.add('moon-gone'),950);
  $('#arrivalDate').textContent = `${String(SITE_CONFIG.birthday.day).padStart(2,'0')} · ${String(SITE_CONFIG.birthday.monthIndex+1).padStart(2,'0')} · ${SITE_CONFIG.birthday.celebrationYear}`;
  $('#arrivalLine').textContent = '';
  $('#arrivalQuote').innerHTML = 'You touched the moon…<br>and it disappeared. 🌙<br>I guess even the moon knows<br>when it has met someone more beautiful than him.<br><span class="arrival-quote-gap"></span>From this moment on,<br>it was never about the moon…<br>it was always about you. ❤️';
  $('#arrivalNext').classList.remove('hidden');
});

// 02 — Birthday cake. Video 1 C feature: the cake is constructed visibly, layer by layer.
const birth = new Date(SITE_CONFIG.birthday.birthIso);
const birthdayParticles = $('#birthdayParticles');
function birthdayParticleBurst(){
  birthdayParticles.innerHTML='';
  const count=240;
  for(let i=0;i<count;i++){
    const p=document.createElement('i');
    const a=Math.random()*Math.PI*2;
    const d=55+Math.random()*430;
    const size=2+Math.random()*5;
    p.style.setProperty('--dx',Math.cos(a)*d+'px');
    p.style.setProperty('--dy',Math.sin(a)*d+'px');
    p.style.setProperty('--delay',(Math.random()*900)+'ms');
    p.style.setProperty('--dur',(3.8+Math.random()*2.2)+'s');
    p.style.setProperty('--rot',(Math.random()*900-450)+'deg');
    p.style.setProperty('--size',size+'px');
    p.className='celebration-particle';
    birthdayParticles.appendChild(p);
  }
  birthdayParticles.classList.remove('burst');
  void birthdayParticles.offsetWidth;
  birthdayParticles.classList.add('burst');
}

// Final-wish celebration: full-screen fireworks/hearts inspired by the supplied
// reference video, while keeping the site's own black/red/gold visual language.
const finalBurst=$('#finalBurst');
function finalCelebrationBurst(){
  if(!finalBurst) return;
  finalBurst.innerHTML='';
  const colors=['heart','rose','gold','white'];
  for(let i=0;i<150;i++){
    const p=document.createElement('i');
    const a=Math.random()*Math.PI*2;
    const d=120+Math.random()*560;
    p.className='burst-piece '+colors[i%colors.length];
    p.style.left='50%'; p.style.top='50%';
    p.style.setProperty('--dx',Math.cos(a)*d+'px');
    p.style.setProperty('--dy',Math.sin(a)*d+'px');
    p.style.setProperty('--size',(2+Math.random()*5)+'px');
    p.style.setProperty('--delay',(Math.random()*520)+'ms');
    p.style.setProperty('--dur',(2.5+Math.random()*1.8)+'s');
    p.style.setProperty('--rot',(Math.random()*720-360)+'deg');
    finalBurst.appendChild(p);
  }
  // Several distinct fireworks give the burst a celebratory depth instead of a
  // single central explosion.
  for(let f=0;f<7;f++){
    const fire=document.createElement('i'); fire.className='burst-firework';
    fire.style.left=(12+Math.random()*76)+'%'; fire.style.top=(16+Math.random()*56)+'%';
    fire.style.setProperty('--fd',(90+Math.random()*180)+'px');
    fire.style.setProperty('--fdelay',(Math.random()*650)+'ms');
    fire.style.setProperty('--fcolor', ['#e95b82','#e7c46b','#f2d9e0','#d94f72'][f%4]);
    finalBurst.appendChild(fire);
  }
  finalBurst.classList.remove('active');
  void finalBurst.offsetWidth;
  finalBurst.classList.add('active');
  clearTimeout(endBurstTimer);
  endBurstTimer=setTimeout(()=>{ if(current==='countdownScene') finalBurst.classList.remove('active'); },5200);
}
let cakeRevealed=false;
let cakeFormationToken=0;
function startCakeFormation(){
  if(cakeRevealed) return;
  const cake=$('#layerCake'), prompt=$('#flamePrompt');
  if(!cake) return;
  const token=++cakeFormationToken;
  cake.classList.remove('formed-1','formed-2','formed-3','formed-4','formed-5','formed-6');
  $('#flame')?.classList.add('hidden');
  prompt?.classList.add('hidden');
  [1,2,3,4,5,6].forEach((stage,i)=>setTimeout(()=>{
    if(token!==cakeFormationToken || cakeRevealed) return;
    cake.classList.add('formed-'+stage);
    if(stage===6){
      $('#flame')?.classList.remove('hidden');
      prompt?.classList.remove('hidden');
    }
  }, 450 + i*620));
}
function revealCake(){
  if(cakeRevealed || !$('#layerCake')?.classList.contains('formed-6')) return;
  cakeRevealed=true;
  cakeFormationToken++;
  $('#flame').classList.add('extinguished');
  $('#flamePrompt').textContent='';
  $('#flamePrompt').classList.add('hidden');
  birthdayParticleBurst();
  $('#birthdayReveal').classList.add('visible');
  $('#birthdayIntro').classList.add('birthday-celebration');
  setTimeout(()=>$('#cakeNext').classList.remove('hidden'),3600);
}
$('#flame').onclick=revealCake;

// 03 — live life clock.
function lifeTick(){
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const ann = new Date(now.getFullYear(), SITE_CONFIG.birthday.monthIndex, SITE_CONFIG.birthday.day, 0,0,0,0);
  if(now < ann) years--;
  const base = new Date(birth); base.setFullYear(birth.getFullYear()+years);
  let rem = Math.max(0, now-base);
  const days=Math.floor(rem/86400000); rem%=86400000;
  const hours=Math.floor(rem/3600000); rem%=3600000;
  const mins=Math.floor(rem/60000); rem%=60000;
  const secs=Math.floor(rem/1000);
  $('#ageReveal').textContent=years; $('#years').textContent=years; $('#days').textContent=days;
  $('#hours').textContent=hours; $('#minutes').textContent=mins; $('#seconds').textContent=secs;
}
setInterval(lifeTick,1000); lifeTick();

// 04 — five-star discovery.
// Fixed, non-overlapping positions are intentional: the game must be solvable
// on every load and at every viewport size. Random placement could stack two
// stars on top of each other or place one beneath the title/action area.
const hunt=$('#starHunt');
const huntCount=$('#foundStars');
const huntQuote=$('#discoverQuote');
const huntNext=$('#discoverNext');
let found=0;
const STAR_POSITIONS=[
  [10,18],
  [31,67],
  [52,12],
  [72,73],
  [88,35]
];
STAR_POSITIONS.forEach(([left,top],i)=>{
  const b=document.createElement('button');
  b.type='button';
  b.className='hunt-star';
  b.dataset.starIndex=String(i+1);
  b.setAttribute('aria-label',`Find star ${i+1} of 5`);
  b.setAttribute('aria-pressed','false');
  b.textContent='✦';
  b.style.left=left+'%';
  b.style.top=top+'%';
  b.addEventListener('click',()=>{
    if(b.classList.contains('found')) return;
    b.classList.add('found');
    b.setAttribute('aria-pressed','true');
    b.disabled=true;
    found++;
    huntCount.textContent=found;
    if(found===5){
      huntQuote.innerHTML='They say every star has a story.<br>I think mine began the day you walked into my life. ⭐';
      huntNext.classList.remove('hidden');
    }
  });
  hunt.appendChild(b);
});

// Shared balloon feature — extracted from the balloon interaction in the reference set.
function playPopSound(){
  try{
    const C=window.AudioContext||window.webkitAudioContext; if(!C) return;
    const ctx=new C(), o=ctx.createOscillator(), g=ctx.createGain();
    o.type='triangle'; o.frequency.setValueAtTime(320,ctx.currentTime); o.frequency.exponentialRampToValueAtTime(85,ctx.currentTime+.11);
    g.gain.setValueAtTime(.0001,ctx.currentTime); g.gain.exponentialRampToValueAtTime(.13,ctx.currentTime+.008); g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+.12);
    o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime+.13); setTimeout(()=>ctx.close(),250);
  }catch(e){}
}
function makeBalloons(container, revealEl, wishes, nextBtn){
  let popped=0;
  wishes.forEach((text,i)=>{
    const b=document.createElement('button'); b.className='balloon balloon-'+(i%6); b.dataset.index=i;
    b.innerHTML='<span></span><i></i>';
    b.setAttribute('aria-label','Pop balloon '+(i+1));
    b.addEventListener('click',()=>{
      if(b.classList.contains('popped')) return;
      b.classList.add('popped'); playPopSound(); popped++;
      revealEl.textContent=text; revealEl.classList.add('show');
      if(popped===wishes.length){ nextBtn.classList.remove('hidden'); }
    });
    container.appendChild(b);
  });
}
makeBalloons($('#worldBalloons'),$('#worldBalloonReveal'),HER_WORLD,$('#worldNext'));

// 06 — five-note interaction. Continue is locked until every note has been opened at least once.
let openedFunNotes=0;
const funProgress=$('#funProgress');
const smileNext=$('#smileNext');
(FUN_MOMENTS||[]).forEach((x,i)=>{
  const c=document.createElement('button'); c.type='button'; c.className='fun-card';
  c.setAttribute('aria-pressed','false'); c.setAttribute('aria-label',`Open little note ${i+1} of ${FUN_MOMENTS.length}`);
  c.innerHTML='<span class="fun-front">✦</span><span class="fun-back"></span>';
  c.querySelector('.fun-back').textContent=x;
  c.addEventListener('click',()=>{
    const firstOpen=!c.classList.contains('revealed');
    c.classList.toggle('revealed'); c.setAttribute('aria-pressed',c.classList.contains('revealed')?'true':'false');
    if(firstOpen) openedFunNotes++;
    funProgress.innerHTML=`${openedFunNotes} / ${FUN_MOMENTS.length} notes opened <span>✦</span>`;
    if(openedFunNotes===FUN_MOMENTS.length){
      smileNext.classList.remove('hidden');
      funProgress.innerHTML=`All ${FUN_MOMENTS.length} notes opened <span>✦</span>`;
    }
  });
  $('#funGrid').appendChild(c);
});

// 08 — Video 1 E feature: three-card Polaroid memory scene on a horizontal rope.
const memoryTrack=$('#memoryTrack'), memoryGallery=$('#memoryGallery');
let mi=0, memDragStart=0, memDragBase=0, memDragging=false;
REAL_MEMORIES.forEach((m,i)=>{
  const d=document.createElement('article'); d.className='memory-rope-card'; d.dataset.index=i;
  d.innerHTML=`<div class="memory-pin" aria-hidden="true"></div><div class="memory-photo"><img src="${m.src}" alt="Memory ${i+1}" loading="eager"></div><span>${m.text}</span>`;
  const img=d.querySelector('img');
  const classify=()=>{
    const ratio=(img.naturalWidth||1)/(img.naturalHeight||1);
    d.dataset.orientation=ratio>1.05?'landscape':'portrait';
    fitHangingCard(d);
  };
  memoryTrack.appendChild(d);
  if(img.complete && img.naturalWidth) classify();
  else img.addEventListener('load',()=>{classify();fitHangingCard(d);renderMem();},{once:true});
  requestAnimationFrame(()=>{if(img.naturalWidth) classify();});
});
function memoryStep(){
  const cards=[...memoryTrack.querySelectorAll('.memory-rope-card')];
  const i=Math.min(mi,cards.length-1);
  return cards[i]?cards[i].getBoundingClientRect().width+(parseFloat(getComputedStyle(memoryTrack).gap)||34):260;
}
function memoryOffsetFor(index){return hangingOffsetFor(memoryTrack,memoryGallery,index);}
function renderMem(){
  const cards=[...memoryTrack.querySelectorAll('.memory-rope-card')]; const n=cards.length;
  cards.forEach((c,i)=>c.classList.toggle('active',i===mi));
  const m=REAL_MEMORIES[mi];
  $('#memoryCaption').innerHTML=`<strong>${m.text}</strong><span>${m.date}</span>`;
  $('#memIndex').textContent=String(mi+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');
  memoryTrack.style.transform=`translate3d(${memoryOffsetFor(mi)}px,0,0)`;
}
function nextMem(dir=1){mi=(mi+dir+REAL_MEMORIES.length)%REAL_MEMORIES.length;renderMem()}
$('#memPrev').onclick=()=>nextMem(-1); $('#memNext').onclick=()=>nextMem(1);
function memPointerDown(e){
  memDragging=true; memDragStart=e.clientX; memDragBase=memoryOffsetFor(mi); memoryGallery.classList.add('dragging'); memoryTrack.style.transition='none'; memoryGallery.setPointerCapture?.(e.pointerId);
}
function memPointerMove(e){
  if(!memDragging) return;
  const raw=memDragBase+(e.clientX-memDragStart);
  const total=hangingTrackWidth(memoryTrack), max=memoryGallery.clientWidth*.08, min=memoryGallery.clientWidth-total-memoryGallery.clientWidth*.08;
  memoryTrack.style.transform=`translate3d(${Math.max(min,Math.min(max,raw))}px,0,0)`;
}
function memPointerUp(e){
  if(!memDragging) return; memDragging=false; memoryGallery.classList.remove('dragging');
  const dx=e.clientX-memDragStart;
  if(Math.abs(dx)>45) mi=(mi+(dx<0?1:-1)+REAL_MEMORIES.length)%REAL_MEMORIES.length;
  memoryTrack.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)'; renderMem();
}
memoryGallery.addEventListener('pointerdown',memPointerDown);
memoryGallery.addEventListener('pointermove',memPointerMove);
memoryGallery.addEventListener('pointerup',memPointerUp);
memoryGallery.addEventListener('pointercancel',memPointerUp);
window.addEventListener('resize',()=>renderMem());
renderMem();

// 13 — Video 1 E feature again, but explicitly marked as imagined.
const imaginedTrack=$('#imaginedTrack'), imaginedGallery=$('#imaginedGallery');
const IMAGINED_CARDS=[
  {src:'assets/future/imagined-01.png',text:'The little home we always imagined.'},
  {src:'assets/future/imagined-02.png',text:'The day our forever finally began.'},
  {src:'assets/future/imagined-03.png',text:'A thousand roads, with you beside me.'},
  {src:'assets/future/imagined-04.png',text:'A family built from love.'},
  {src:'assets/future/imagined-05.png',text:'A life of little moments, together.'},
  {src:'assets/future/imagined-06.png',text:'A home filled with love and laughter.'},
  {src:'assets/future/imagined-07.png',text:"A life of places we'd discover together."},
  {src:'assets/future/imagined-08.png',text:'Growing together, one little memory at a time.'},
  {src:'assets/future/imagined-09.png',text:'To care for you, through every season.'},
  {src:'assets/future/imagined-10.png',text:'Wherever we go, together is enough.'},
  {src:'assets/future/imagined-11.png',text:'Still choosing adventure, side by side.'}
];
let ii=0, imaginedDown=false, imaginedStart=0, imaginedBase=0;
function hangingTrackGap(track){return parseFloat(getComputedStyle(track).gap)||34}
function hangingTrackWidth(track){
  const cards=[...track.querySelectorAll('.memory-rope-card')];
  if(!cards.length)return 0;
  const gap=hangingTrackGap(track);
  return cards.reduce((sum,c)=>sum+c.getBoundingClientRect().width,0)+gap*Math.max(0,cards.length-1);
}
function hangingOffsetFor(track,gallery,index){
  const cards=[...track.querySelectorAll('.memory-rope-card')];
  const gap=hangingTrackGap(track);
  let before=0;
  for(let i=0;i<index;i++) before+=cards[i].getBoundingClientRect().width+gap;
  const width=cards[index]?.getBoundingClientRect().width||0;
  return gallery.clientWidth/2-(before+width/2);
}
function fitHangingCard(card){
  const img=card.querySelector('img');
  if(!img?.naturalWidth||!img.naturalHeight)return;
  const cardHeight=card.offsetHeight;
  const photoHeight=cardHeight*0.75;
  const ratio=img.naturalWidth/img.naturalHeight;
  const imageWidth=(photoHeight*ratio)/0.95;

  // The card width must satisfy both constraints: the image must occupy the
  // complete 75% image band, and the quotation must fit completely inside its
  // fixed 17.5% caption band. Font size, color and caption geometry remain
  // unchanged; only the card width is allowed to grow when the text needs it.
  let width=imageWidth;
  card.style.setProperty('--polaroid-width',`${width}px`);
  const caption=card.querySelector('span, figcaption');
  if(caption){
    const maxWidth=Math.max(width,1600);
    const step=2;
    for(let candidate=width; candidate<=maxWidth; candidate+=step){
      card.style.setProperty('--polaroid-width',`${candidate}px`);
      // Force layout so scrollHeight/clientHeight reflect the candidate width.
      const fits=caption.scrollHeight <= caption.clientHeight + 1;
      if(fits){ width=candidate; break; }
      width=candidate;
    }
  }
  card.style.setProperty('--polaroid-width',`${width}px`);
}
IMAGINED_CARDS.forEach((m,i)=>{
  const d=document.createElement('article'); d.className='memory-rope-card'; d.dataset.index=i;
  d.innerHTML=`<div class="memory-pin" aria-hidden="true"></div><div class="memory-photo"><img src="${m.src}" alt="Imagined scene ${i+1}" loading="eager"></div><span>${m.text}</span>`;
  const img=d.querySelector('img');
  const apply=()=>{fitHangingCard(d);renderImagined();};
  imaginedTrack.appendChild(d);
  if(img.complete&&img.naturalWidth)apply(); else img.addEventListener('load',apply,{once:true});
});
function imaginedStep(){
  const cards=[...imaginedTrack.querySelectorAll('.memory-rope-card')];
  const i=Math.min(ii,cards.length-1);
  return cards[i]?cards[i].getBoundingClientRect().width+hangingTrackGap(imaginedTrack):260;
}
function renderImagined(){
  const offset=hangingOffsetFor(imaginedTrack,imaginedGallery,ii);
  imaginedTrack.style.transform=`translate3d(${offset}px,0,0)`;
  $('#imaginedCaption').innerHTML=`<strong>${IMAGINED_CARDS[ii].text}</strong><span></span>`;
}
function nextImagined(dir=1){ii=(ii+dir+IMAGINED_CARDS.length)%IMAGINED_CARDS.length;renderImagined()}
function imaginedPointerDown(e){imaginedDown=true;imaginedStart=e.clientX;imaginedBase=hangingOffsetFor(imaginedTrack,imaginedGallery,ii);imaginedGallery.classList.add('dragging');imaginedTrack.style.transition='none';imaginedGallery.setPointerCapture?.(e.pointerId)}
function imaginedPointerMove(e){if(!imaginedDown)return;const raw=imaginedBase+e.clientX-imaginedStart;const total=hangingTrackWidth(imaginedTrack);const max=imaginedGallery.clientWidth*.08,min=imaginedGallery.clientWidth-total-imaginedGallery.clientWidth*.08;imaginedTrack.style.transform=`translate3d(${Math.max(min,Math.min(max,raw))}px,0,0)`}
function imaginedPointerUp(e){if(!imaginedDown)return;imaginedDown=false;imaginedGallery.classList.remove('dragging');imaginedTrack.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';const dx=e.clientX-imaginedStart;if(Math.abs(dx)>45)ii=(ii+(dx<0?1:-1)+IMAGINED_CARDS.length)%IMAGINED_CARDS.length;renderImagined()}
imaginedGallery.addEventListener('pointerdown',imaginedPointerDown);imaginedGallery.addEventListener('pointermove',imaginedPointerMove);imaginedGallery.addEventListener('pointerup',imaginedPointerUp);imaginedGallery.addEventListener('pointercancel',imaginedPointerUp);window.addEventListener('resize',()=>{imaginedTrack.querySelectorAll('.memory-rope-card').forEach(fitHangingCard);renderImagined()});renderImagined();

// 09 — Video cards: one original-aspect video at a time; manual swipe/drag only.
const videoGrid=$('#videoGrid'), videoTrack=$('#videoTrack'); let vi=0, videoStart=0, videoDragging=false, videoBase=0, videoLive=0;
VIDEOS.forEach((v,i)=>{
  const d=document.createElement('div'); d.className='video-slide';
  d.innerHTML=`<video controls playsinline preload="metadata" src="${v}" aria-label="Memory video ${i+1}"></video>`;
  const media=d.querySelector('video');
  media.addEventListener('loadedmetadata',()=>{media.style.aspectRatio=`${media.videoWidth} / ${media.videoHeight}`;});
  media.addEventListener('error',()=>{d.classList.add('video-error');});
  videoTrack.appendChild(d);
});
function currentVideo(){ return videoTrack.querySelector('.video-slide.active video'); }
function syncVideoPlayButton(){
  const v=currentVideo(), b=$('#videoPlayPause');
  if(!b) return;
  b.innerHTML = v && !v.paused ? 'Pause <span>❚❚</span>' : 'Play <span>▶</span>';
  const mute=$('#videoMute');
  if(mute) mute.innerHTML = v && v.muted ? 'Sound <span>🔇</span>' : 'Sound <span>🔊</span>';
}
function renderVideos(){
  const slides=$$('.video-slide');
  slides.forEach((el,i)=>el.classList.toggle('active',i===vi));
  videoLive=-vi*100; videoTrack.style.transform=`translate3d(${videoLive}%,0,0)`;
  $('#videoIndex').textContent=String(vi+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  slides.forEach((el,i)=>{ const v=el.querySelector('video'); if(i!==vi){v.pause();v.currentTime=0;} });
  const v=currentVideo();
  if(v){ v.onplay=syncVideoPlayButton; v.onpause=syncVideoPlayButton; v.onvolumechange=syncVideoPlayButton; }
  syncVideoPlayButton();
}
function nextVideo(dir=1){
  const current=currentVideo();
  if(current){current.pause(); current.currentTime=0;}
  vi=(vi+dir+VIDEOS.length)%VIDEOS.length;
  videoTrack.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';
  renderVideos();
}
$('#videoPlayPause').onclick=()=>{
  const v=currentVideo(); if(!v) return;
  if(v.paused) v.play().catch(()=>{}); else v.pause();
};
$('#videoMute').onclick=()=>{
  const v=currentVideo(); if(!v) return;
  v.muted=!v.muted; syncVideoPlayButton();
};
$('#videoPrev').onclick=()=>nextVideo(-1); $('#videoNext').onclick=()=>nextVideo(1);
videoGrid.addEventListener('pointerdown',e=>{
  if(e.target === videoGrid.querySelector('video') || e.target.closest?.('video')) return;
  videoDragging=true; videoStart=e.clientX; videoBase=videoLive; videoTrack.style.transition='none'; videoGrid.setPointerCapture?.(e.pointerId);
});
videoGrid.addEventListener('pointermove',e=>{if(!videoDragging)return;const dx=e.clientX-videoStart;videoLive=videoBase+(dx/Math.max(1,videoGrid.clientWidth))*100;videoLive=Math.max(-(VIDEOS.length-1)*100,Math.min(0,videoLive));videoTrack.style.transform=`translate3d(${videoLive}%,0,0)`});
videoGrid.addEventListener('pointerup',e=>{if(!videoDragging)return;videoDragging=false;const dx=e.clientX-videoStart;videoTrack.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';if(Math.abs(dx)>55)nextVideo(dx<0?1:-1);else renderVideos()});
videoGrid.addEventListener('pointercancel',()=>{videoDragging=false;renderVideos()});
renderVideos();

// 10 — private gate. A fresh page load creates a new four-digit key from two
// shuffled clues in the six-value pool. The selected clues remain stable for
// the lifetime of this page so the Hint always matches the active key.
const privateCodeSession = createPrivateCodeSession();
const privateHintText = () => `This key uses ${privateCodeSession.selected[0].label} and ${privateCodeSession.selected[1].label}.`;
// The selected clues are always visible; there is no separate Hint action.
$('#hintText').textContent=privateHintText();
$('#skipPrivate').onclick=()=>{ branch='SKIP'; go('finalWish'); $('#finalWishTitle').textContent='Happy Birthday, Potti. ❤️'; $('#finalWishText').textContent='May this new year of your life bring you happiness, peace, success, beautiful surprises and countless reasons to smile.'; setSignoff(false); revealFinalNext(); };
$('#passcode').addEventListener('input',e=>{
  e.target.value=e.target.value.replace(/\D/g,'').slice(0,4);
  if(e.target.value===privateCodeSession.code){ $('#gateMessage').textContent='You remembered.'; $('#gateNext').classList.remove('hidden'); }
  else { $('#gateMessage').textContent=e.target.value.length===4?'Not this one. Some memories only open with the right key.':''; $('#gateNext').classList.add('hidden'); }
});

// 11 + 17 — Video 4 feature: horizontal Polaroid rail, manual only (never auto-scroll).
function buildPolaroidTrack(track, items, altPrefix){
  track.innerHTML='';
  items.forEach((m,i)=>{
    const card=document.createElement('figure'); card.className='moving-polaroid';
    card.innerHTML=`<div class="polaroid-pin" aria-hidden="true"></div><div class="polaroid-photo"><img src="${m.src}" alt="${altPrefix} ${i+1}" loading="eager"></div><figcaption>${m.text||'A memory worth keeping.'}</figcaption>`;
    const img=card.querySelector('img');
    const classify=()=>{
      const ratio=(img.naturalWidth||1)/(img.naturalHeight||1);
      card.dataset.orientation=ratio>1.05?'landscape':'portrait';
      fitHangingCard(card);
    };
    track.appendChild(card);
    if(img.complete && img.naturalWidth) classify();
    else img.addEventListener('load',()=>{classify();fitHangingCard(card);},{once:true});
    requestAnimationFrame(()=>{if(img.naturalWidth){classify();fitHangingCard(card);}});
  });
}
// Private memories use the same real-memory interaction pattern: hanging Polaroids,
// one active memory, a repeated caption/date below, and manual navigation.
const privateMemoryTrack=$('#privateMemoryTrack'), privateMemoryGallery=$('#privateMemoryGallery');
let pmi=0, privateDragStart=0, privateDragBase=0, privateDragging=false;
PRIVATE_MEMORIES.forEach((m,i)=>{
  const d=document.createElement('article'); d.className='memory-rope-card'; d.dataset.index=i;
  d.innerHTML=`<div class="memory-pin" aria-hidden="true"></div><div class="memory-photo"><img src="${m.src}" alt="Private memory ${i+1}" loading="eager"></div><span>${m.text}</span>`;
  const img=d.querySelector('img');
  const classify=()=>{
    const ratio=(img.naturalWidth||1)/(img.naturalHeight||1);
    d.dataset.orientation=ratio>1.05?'landscape':'portrait';
    fitHangingCard(d);
  };
  privateMemoryTrack.appendChild(d);
  if(img.complete && img.naturalWidth) classify();
  else img.addEventListener('load',()=>{classify();fitHangingCard(d);renderPrivateMem();},{once:true});
  requestAnimationFrame(()=>{if(img.naturalWidth) classify();});
});
function privateMemoryStep(){
  const cards=[...privateMemoryTrack.querySelectorAll('.memory-rope-card')];
  const i=Math.min(pmi,cards.length-1);
  return cards[i]?cards[i].getBoundingClientRect().width+(parseFloat(getComputedStyle(privateMemoryTrack).gap)||34):260;
}
function privateMemoryOffsetFor(index){return hangingOffsetFor(privateMemoryTrack,privateMemoryGallery,index);}
function renderPrivateMem(){
  const cards=[...privateMemoryTrack.querySelectorAll('.memory-rope-card')]; const n=cards.length;
  cards.forEach((c,i)=>c.classList.toggle('active',i===pmi));
  const m=PRIVATE_MEMORIES[pmi];
  $('#privateMemoryCaption').innerHTML=`<strong>${m.text}</strong>${m.date ? `<span>${m.date}</span>` : ''}`;
  $('#privateMemIndex').textContent=String(pmi+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');
  privateMemoryTrack.style.transform=`translate3d(${privateMemoryOffsetFor(pmi)}px,0,0)`;
}
function nextPrivateMem(dir=1){pmi=(pmi+dir+PRIVATE_MEMORIES.length)%PRIVATE_MEMORIES.length;renderPrivateMem()}
$('#privateMemPrev').onclick=()=>nextPrivateMem(-1); $('#privateMemNext').onclick=()=>nextPrivateMem(1);
function privatePointerDown(e){
  privateDragging=true; privateDragStart=e.clientX; privateDragBase=privateMemoryOffsetFor(pmi); privateMemoryGallery.classList.add('dragging'); privateMemoryTrack.style.transition='none'; privateMemoryGallery.setPointerCapture?.(e.pointerId);
}
function privatePointerMove(e){
  if(!privateDragging)return;
  const raw=privateDragBase+(e.clientX-privateDragStart);
  const total=hangingTrackWidth(privateMemoryTrack), max=privateMemoryGallery.clientWidth*.08, min=privateMemoryGallery.clientWidth-total-privateMemoryGallery.clientWidth*.08;
  privateMemoryTrack.style.transform=`translate3d(${Math.max(min,Math.min(max,raw))}px,0,0)`;
}
function privatePointerUp(e){
  if(!privateDragging)return; privateDragging=false; privateMemoryGallery.classList.remove('dragging');
  const dx=e.clientX-privateDragStart;
  if(Math.abs(dx)>45) pmi=(pmi+(dx<0?1:-1)+PRIVATE_MEMORIES.length)%PRIVATE_MEMORIES.length;
  privateMemoryTrack.style.transition='transform .55s cubic-bezier(.2,.8,.2,1)';
  renderPrivateMem();
}
privateMemoryGallery.addEventListener('pointerdown',privatePointerDown);
privateMemoryGallery.addEventListener('pointermove',privatePointerMove);
privateMemoryGallery.addEventListener('pointerup',privatePointerUp);
privateMemoryGallery.addEventListener('pointercancel',privatePointerUp);
privateMemoryGallery.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();nextPrivateMem(e.deltaX>0?1:-1);}},{passive:false});
window.addEventListener('resize',()=>renderPrivateMem());
renderPrivateMem();

function enableManualRail(windowEl,trackEl){
  let down=false,start=0,base=0,currentX=0;
  function bounds(){
    const max=18, min=Math.min(18,windowEl.clientWidth-trackEl.scrollWidth-18); return {min,max};
  }
  function pointerDown(e){down=true;start=e.clientX;base=currentX;windowEl.classList.add('dragging');trackEl.style.transition='none';windowEl.setPointerCapture?.(e.pointerId)}
  function pointerMove(e){if(!down)return;const b=bounds();currentX=Math.max(b.min,Math.min(b.max,base+(e.clientX-start)));trackEl.style.transform=`translate3d(${currentX}px,0,0)`}
  function pointerUp(e){if(!down)return;down=false;windowEl.classList.remove('dragging');trackEl.style.transition='transform .35s ease';const b=bounds();currentX=Math.max(b.min,Math.min(b.max,base+(e.clientX-start)));trackEl.style.transform=`translate3d(${currentX}px,0,0)`;}
  windowEl.addEventListener('pointerdown',pointerDown);windowEl.addEventListener('pointermove',pointerMove);windowEl.addEventListener('pointerup',pointerUp);windowEl.addEventListener('pointercancel',pointerUp);
  windowEl.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();const b=bounds();currentX=Math.max(b.min,Math.min(b.max,currentX-e.deltaX));trackEl.style.transform=`translate3d(${currentX}px,0,0)`;}},{passive:false});
}

// Shared Video-4 hanging system: calculate the rope's vertical position from
// the actual clip, so the rope stays physically attached at every viewport size.
function syncHangingPolaroidRopes(){
  $$('.polaroid-window').forEach(win=>{
    const pin=win.querySelector('.polaroid-pin');
    if(!pin) return;
    const wr=win.getBoundingClientRect();
    const pr=pin.getBoundingClientRect();
    win.style.setProperty('--rope-y',(pr.top + pr.height/2 - wr.top)+'px');
  });
}
requestAnimationFrame(syncHangingPolaroidRopes);
window.addEventListener('resize',syncHangingPolaroidRopes);


// 12 — Video 5 feature: yellow timeline line, dots and horizontal story cards; manual only.
const storyTrack=$('#storyTrack');
TIMELINE.forEach((t,i)=>{
  const card=document.createElement('article'); card.className='story-card';
  card.innerHTML=`<div class="story-icon">${i%2===0?'✦':'♡'}</div><time>${t.date}</time><h3>${t.title}</h3><p>${t.text}</p>`;
  storyTrack.appendChild(card);
});
storyTrack.style.animation='none';
let storyDown=false,storyStart=0,storyBase=0,storyX=0;
const storyWindow=$('#storyWindow');
function storyBounds(){return {min:Math.min(12,storyWindow.clientWidth-storyTrack.scrollWidth-12),max:12}}
storyWindow.addEventListener('pointerdown',e=>{storyDown=true;storyStart=e.clientX;storyBase=storyX;storyWindow.classList.add('dragging');storyTrack.style.transition='none';storyWindow.setPointerCapture?.(e.pointerId)});
storyWindow.addEventListener('pointermove',e=>{if(!storyDown)return;const b=storyBounds();storyX=Math.max(b.min,Math.min(b.max,storyBase+e.clientX-storyStart));storyTrack.style.transform=`translate3d(${storyX}px,0,0)`});
storyWindow.addEventListener('pointerup',e=>{if(!storyDown)return;storyDown=false;storyWindow.classList.remove('dragging');storyTrack.style.transition='transform .35s ease';const b=storyBounds();storyX=Math.max(b.min,Math.min(b.max,storyBase+e.clientX-storyStart));storyTrack.style.transform=`translate3d(${storyX}px,0,0)`});
storyWindow.addEventListener('pointercancel',()=>{storyDown=false;storyTrack.style.transition='transform .35s ease'});
storyWindow.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>Math.abs(e.deltaY)){e.preventDefault();const b=storyBounds();storyX=Math.max(b.min,Math.min(b.max,storyX-e.deltaX));storyTrack.style.transform=`translate3d(${storyX}px,0,0)`;}},{passive:false});

// 14 — Video 1 letter feature: the envelope opens, the paper physically rises out,
// settles as a real letter, and the message is written line-by-line like the reference.
let letterOpened=false, letterTyping=false;
const sealedLetter=$('#sealedLetter'), letterContent=$('#letterContent'), tapHint=$('#tapHint'), messageNext=$('#messageNext');

function renderLetterIdle(){
  letterContent.innerHTML='<div class="letter-writing-area"></div>';
  tapHint.innerHTML='TAP THE LETTER TO OPEN <span>→</span>';
}

function typeLetter(){
  if(letterTyping) return;
  letterTyping=true;
  tapHint.textContent='WRITING…';
  const area=letterContent.querySelector('.letter-writing-area');
  area.innerHTML='';
  const paragraphs=LETTER_LINES.map((line,i)=>({line,delay:i===0?0:180}));
  let pIndex=0;

  function formatLetterLine(line){
    const escaped=line.replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
    return escaped.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  }

  function nextParagraph(){
    if(pIndex>=paragraphs.length){
      letterTyping=false;
      tapHint.textContent='MESSAGE COMPLETE';
      messageNext.classList.remove('hidden');
      return;
    }
    const item=paragraphs[pIndex++];
    const p=document.createElement('p');
    p.className=(pIndex===1?'letter-greeting ':'')+(pIndex===paragraphs.length?'letter-closing':'');
    area.appendChild(p);
    let i=0;
    const text=item.line.replace(/\*\*/g,'');
    const tick=()=>{
      if(i<text.length){
        p.textContent=text.slice(0,++i);
        trackTimer(letterTimers,tick,18);
      }else{
        p.innerHTML=formatLetterLine(item.line);
        trackTimer(letterTimers,nextParagraph,item.delay);
      }
    };
    tick();
  }
  trackTimer(letterTimers,nextParagraph,360);
}

function advanceLetter(){
  if(letterOpened) return;
  letterOpened=true;
  sealedLetter.classList.add('opening');
  tapHint.textContent='OPENING…';
  // Flap opens first; the paper then rises from inside the envelope.
  trackTimer(letterTimers,()=>{
    sealedLetter.classList.remove('opening');
    sealedLetter.classList.add('opened');
    sealedLetter.closest('#message')?.classList.add('letter-opened');
    trackTimer(letterTimers,typeLetter,1450);
  },900);
}

sealedLetter.addEventListener('click',advanceLetter);
renderLetterIdle();

// 15/16 — normal birthday wishes after the private/letter path.
const nowYear=new Date().getFullYear();
const pack=getBirthdayPack(nowYear);
let wi=0;
$('#wishReveal').onclick=()=>{
  if(wi>=pack.wishes.length)return;
  $('#wishReveal').innerHTML='<span>'+pack.wishes[wi]+'</span>'; wi++;
  $('#wishNumber').textContent=String(wi).padStart(2,'0');
  if(wi>=pack.wishes.length){$('#wishReveal').classList.add('complete');$('#wishes .interaction-label').textContent='ALL WISHES REVEALED';$('#wishesNext').classList.remove('hidden')}
};

// 19 + 20A/20B — family choice branches.
function resetFamilyScene(){
  clearFamilyTimers();
  familyChoiceLocked=false;
  branch='A';
  $('#choiceRow').classList.remove('hidden');
  $('#authors').classList.remove('active','hug');
  $('#family .family-photo').classList.remove('dissolve');
  $('#branchMessage').innerHTML='';
  $('#branchNext').classList.add('hidden');
  $('#branchNext').innerHTML='My promises <span>→</span>';
}
let branch='A';
const familyPhoto=$('.family-photo');
function revealFinalNext(){$('#finalNext').classList.remove('hidden')}
function setSignoff(isB){
  const sign=$('#signoff'); $('#finalNext').classList.add('hidden');
  if(isB){
    sign.innerHTML='<span class="signing-prefix">Signing off,</span><span class="senior-word">your senior</span><span class="hemanth-word">Hemanth ❤️</span>';
    sign.classList.remove('animate-signoff'); void sign.offsetWidth; sign.classList.add('animate-signoff');
  }else sign.innerHTML='';
}
const PROMISES=[
  ['Always listen','I will make space for your thoughts, even when they come out in the smallest details.'],
  ['Celebrate you','Your wins deserve to be celebrated, from the biggest dream to the tiniest happy moment.'],
  ['Respect you','Your choices, boundaries and dreams will always belong to you.'],
  ['Be honest','I will choose honesty, even when a conversation is difficult.'],
  ['Keep growing','I will keep learning, improving and becoming someone you can be proud to know.'],
  ['Keep the laughter','I will never underestimate the power of one ridiculous joke on an ordinary day.']
];
function renderPromises(){
  const wrap=document.createElement('div'); wrap.className='promises-wrap';
  wrap.innerHTML='<div class="promise-grid"></div>';
  const grid=wrap.querySelector('.promise-grid');
  let flipped=0;
  $('#promisesNext').classList.add('hidden');
  PROMISES.forEach((p,i)=>{
    const c=document.createElement('button');
    c.className='promise-card';
    c.innerHTML=`<span class="promise-front"><b>${['💧','🙂','💛','🌙','🔥','♾️'][i]}</b><small>${p[0]}</small></span><span class="promise-back"><strong>${p[0]}</strong><em>${p[1]}</em></span>`;
    c.addEventListener('click',()=>{
      const wasFlipped=c.classList.contains('flipped');
      c.classList.toggle('flipped');
      if(!wasFlipped){
        flipped++;
        if(flipped===PROMISES.length) $('#promisesNext').classList.remove('hidden');
      }
    });
    grid.appendChild(c);
  });
  $('#promisesHost').innerHTML=''; $('#promisesHost').appendChild(wrap);
}
$('#chooseTogether').onclick=()=>{
  if(familyChoiceLocked) return; familyChoiceLocked=true;
  branch='A'; $('#branchNext').innerHTML='My promises <span>→</span>'; $('#choiceRow').classList.add('hidden'); $('#authors').classList.add('active');
  trackTimer(familyTimers,()=>$('#authors').classList.add('hug'),2300);
  trackTimer(familyTimers,()=>$('#branchNext').classList.remove('hidden'),4500);
};
$('#choosePath').onclick=()=>{
  if(familyChoiceLocked) return; familyChoiceLocked=true;
  branch='B'; $('#branchNext').innerHTML='Continue <span>→</span>'; $('#choiceRow').classList.add('hidden'); familyPhoto.classList.add('dissolve');
  trackTimer(familyTimers,()=>{
    const msg=`<p class="choice-letter-greeting">Dear Potti,</p>
<p>If life takes you somewhere different, I will respect that.</p>
<p>Your life is yours to choose, and I hope whatever path you take brings you happiness, peace, success and everything you dream of.</p>
<p>Keep smiling, keep growing, and keep choosing the life that feels right for you.</p>
<p class="choice-letter-closing">With care,<br>Hemanth ❤️</p>`;
    $('#branchMessage').innerHTML=`<div class="choice-letter-wrap"><p class="choice-letter-intro">One last thing I want you to know…</p><div class="choice-envelope" id="choiceEnvelope"><div class="choice-envelope-paper"><div class="choice-letter-writing"></div></div><div class="choice-envelope-front"></div><div class="choice-envelope-flap"></div></div><div class="choice-letter-hint">A letter, just for you.</div></div>`;
    const choiceEnvelope=$('#choiceEnvelope');
    const choiceWriting=choiceEnvelope.querySelector('.choice-letter-writing');
    choiceEnvelope.classList.add('opening');
    const choiceLines=["Dear Potti,","If life takes you somewhere different, I will respect that.","Your life is yours to choose, and I hope whatever path you take brings you happiness, peace, success and everything you dream of.","Keep smiling, keep growing, and keep choosing the life that feels right for you.","With care,","Hemanth ❤️"];
    // Match the main letter's physical sequence: flap opens first, the paper
    // rises out, then the writing begins only after the paper has settled.
    trackTimer(familyTimers,()=>{
      choiceEnvelope.classList.remove('opening');
      choiceEnvelope.classList.add('open');
      choiceEnvelope.closest('.choice-letter-wrap')?.classList.add('letter-opened');
      trackTimer(familyTimers,()=>{
        choiceWriting.innerHTML=''; let li=0;
        const write=()=>{ if(li>=choiceLines.length){ trackTimer(familyTimers,()=>$('#branchNext').classList.remove('hidden'),500); return; }
          const p=document.createElement('p'); choiceWriting.appendChild(p); let ci=0;
          const tick=()=>{ if(ci<choiceLines[li].length){p.textContent=choiceLines[li].slice(0,++ci);trackTimer(familyTimers,tick,24);} else {li++;trackTimer(familyTimers,write,120);} }; tick();
        }; write();
      },1450);
    },900);
  },1400);
};
$('#branchNext').onclick=()=>{
  if(branch==='A'){
    go('promises');
    renderPromises();
    return;
  }
  go('finalWish');
  $('#finalWishTitle').textContent='Happy Birthday, Potti. ❤️';
  $('#finalWishText').textContent='May the life you choose bring you happiness, peace, success and all the beautiful things you deserve.';
  setSignoff(true); revealFinalNext();
};

// 20A — promises are intentionally a separate interface after the two avatars meet.
$('#promisesNext').onclick=()=>{
  go('finalWish');
  $('#finalWishTitle').textContent='Happy Birthday, Potti. ❤️';
  $('#finalWishText').textContent='May every dream you carry find its own beautiful way forward. I hope your life is filled with courage, laughter, peace, success and people who truly value you.';
  setSignoff(false);
  revealFinalNext();
};

// 23 — next birthday countdown. Rolls automatically every year.
const BIRTHDAY_MONTH_INDEX=SITE_CONFIG.birthday.monthIndex, BIRTHDAY_DAY=SITE_CONFIG.birthday.day; let nextTarget;
function setTarget(){const now=new Date();nextTarget=new Date(now.getFullYear(),BIRTHDAY_MONTH_INDEX,BIRTHDAY_DAY,0,0,0,0);if(nextTarget<=now)nextTarget.setFullYear(now.getFullYear()+1);$('#targetYear').textContent=String(nextTarget.getFullYear());}
setTarget();
$('#celebrationYear').textContent=String(SITE_CONFIG.birthday.celebrationYear);
function countdownTick(){const now=new Date();if(now>=nextTarget)setTarget();let ms=nextTarget-now;const d=Math.floor(ms/86400000);ms%=86400000;const h=Math.floor(ms/3600000);ms%=3600000;const m=Math.floor(ms/60000);ms%=60000;const s=Math.floor(ms/1000);$('#bigDays').textContent=String(d);$('#bigHours').textContent=String(h).padStart(2,'0');$('#bigMinutes').textContent=String(m).padStart(2,'0');$('#bigSeconds').textContent=String(s).padStart(2,'0');$('#miniTimer').textContent=`${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}`}
setInterval(countdownTick,1000);countdownTick();

// 22 -> 23 -> 24. User explicitly taps Next; countdown then docks top-right and stays live.
$('#finalNext').onclick=()=>{
  go('yearIntro');
  $('#timerDock').classList.add('hidden'); $('#endMessage').classList.remove('visible');
};

// Public yearly birthday idea is deliberately outside the private room and sits
// immediately before the final live countdown.
$('#yearIntroNext').onclick=()=>{
  go('countdownScene');
  const center=$('.countdown-center'); center.classList.remove('timer-moved'); void center.offsetWidth;
  setTimeout(()=>{center.classList.add('timer-moved');$('#timerDock').classList.remove('hidden')},2600);
  setTimeout(()=>{
    $('#endMessage').classList.add('visible');
    clearTimeout(endBurstTimer);
    endBurstTimer=setTimeout(()=>{ if(current==='countdownScene') finalCelebrationBurst(); },650);
  },4400);
};
