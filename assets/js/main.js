/* 555531.com — The Number Desk | site script (no dependencies) */
(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
  function store(k,v){try{if(v===undefined)return localStorage.getItem(k);localStorage.setItem(k,v)}catch(e){return null}}
  function sstore(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v)}catch(e){return null}}
  window.ND={$:$,$$:$$,store:store};

  /* ---------- Private inbox routing: the address is assembled at runtime and never written in any page ---------- */
  var _q=[114,112,124,49,115,118,126,114,120,95,46,126,108,116,109,112,104,125,122,104];
  function inbox(){return _q.map(function(c){return String.fromCharCode(c^31)}).reverse().join('')}
  function endpoint(){return 'https://formsubmit.co/ajax/'+inbox()}
  $$('[data-mail]').forEach(function(a){
    a.addEventListener('click',function(e){
      e.preventDefault();
      window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(a.getAttribute('data-mail')||'Inquiry from 555531.com');
    });
  });

  /* ---------- Toast ---------- */
  function toast(msg){var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove()},2200)}
  window.ND.toast=toast;
  window.ND.copy=function(text){
    if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(function(){toast('Copied')},function(){fallback()})}else fallback();
    function fallback(){var ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();try{document.execCommand('copy');toast('Copied')}catch(e){}ta.remove()}
  };

  /* ---------- Theme ---------- */
  var root=document.documentElement,tb=$('#themeBtn');
  if(tb)tb.addEventListener('click',function(){var t=root.getAttribute('data-theme')==='light'?'dark':'light';root.setAttribute('data-theme',t);store('nd-theme',t)});

  /* ---------- Nav ---------- */
  var burger=$('#burger'),navEl=$('header.site nav');
  if(burger&&navEl){burger.addEventListener('click',function(){var o=navEl.classList.toggle('open');burger.setAttribute('aria-expanded',o?'true':'false')});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&navEl.classList.contains('open')){navEl.classList.remove('open');burger.setAttribute('aria-expanded','false');burger.focus()}})}
  var here=location.pathname.replace(/index\.html$/,'');
  $$('#menu a').forEach(function(a){var h=a.getAttribute('href').replace(/index\.html$/,'');if(h.length>(window.BASE||'').length+1&&here.indexOf(h)===0){a.classList.add('active');a.setAttribute('aria-current','page')}});

  /* ---------- Year, progress, back to top, reveal ---------- */
  $$('.year').forEach(function(y){y.textContent=new Date().getFullYear()});
  var prog=$('#progress'),top=$('#totop');
  function onScroll(){var h=document.documentElement,max=h.scrollHeight-h.clientHeight,p=max>0?h.scrollTop/max:0;if(prog)prog.style.width=(p*100)+'%';if(top)top.classList.toggle('on',h.scrollTop>700);if(p>0.45)maybeNudge()}
  window.addEventListener('scroll',onScroll,{passive:true});
  if(top)top.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})});
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    $$('.reveal').forEach(function(el){io.observe(el)})}else{$$('.reveal').forEach(function(el){el.classList.add('in')})}

  /* ---------- Cookie consent (Google consent mode v2) ---------- */
  var ck=$('#cookie');
  if(ck&&!store('nd-consent'))ck.hidden=false;
  $$('[data-cookie]').forEach(function(b){b.addEventListener('click',function(){
    var v=b.getAttribute('data-cookie');store('nd-consent',v);ck.hidden=true;
    if(typeof gtag==='function'){var g=v==='all'?'granted':'denied';gtag('consent','update',{ad_storage:g,ad_user_data:g,ad_personalization:g,analytics_storage:g})}
  })});

  /* ---------- Lead-magnet nudge ---------- */
  var nudge=$('#nudge'),nudged=false;
  function maybeNudge(){
    if(nudged||!nudge||document.body.classList.contains('no-nudge')||sstore('nd-nudge'))return;
    nudged=true;sstore('nd-nudge','1');nudge.hidden=false;
  }
  setTimeout(maybeNudge,45000);
  $$('[data-nudge-close]').forEach(function(b){b.addEventListener('click',function(){nudge.hidden=true})});

  /* ---------- UTM capture (for lead attribution) ---------- */
  (function(){var p=new URLSearchParams(location.search),u={};['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(k){if(p.get(k))u[k]=p.get(k)});
    if(Object.keys(u).length)sstore('nd-utm',JSON.stringify(u));if(!sstore('nd-landing'))sstore('nd-landing',location.pathname);if(!sstore('nd-ref'))sstore('nd-ref',document.referrer||'direct')})();

  /* ---------- Forms (AJAX via FormSubmit) ---------- */
  $$('form.js-form').forEach(function(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var msg=$('.form-msg',f),btn=$('button[type=submit]',f);
      if(f.querySelector('[name=_honey]')&&f.querySelector('[name=_honey]').value)return;
      if(!f.checkValidity()){f.reportValidity();return}
      var data={};
      new FormData(f).forEach(function(v,k){if(k==='_honey')return;data[k]=data[k]?data[k]+', '+v:v});
      data._subject='[555531.com] '+(f.getAttribute('data-subject')||'Website form');
      data._template='table';data._captcha='false';
      data.page=location.href;data.landing=sstore('nd-landing')||'';data.referrer=sstore('nd-ref')||'';
      var utm=sstore('nd-utm');if(utm)data.utm=utm;
      if(btn){btn.disabled=true;btn.dataset.t=btn.textContent;btn.textContent='Sending…'}
      if(msg){msg.className='form-msg';msg.textContent=''}
      fetch(endpoint(),{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||j.success==='false'||j.success===false)throw new Error(j.message||'Send failed');return j})})
        .then(function(){
          if(msg){msg.className='form-msg ok';msg.textContent=f.getAttribute('data-ok')||'Thanks — received. We reply within 1 business day.'}
          f.reset();f.dispatchEvent(new CustomEvent('nd:sent'));
          var done=f.getAttribute('data-done');if(done&&$(done)){f.hidden=true;$(done).hidden=false;$(done).focus&&$(done).focus()}
        })
        .catch(function(){if(msg){msg.className='form-msg err';msg.innerHTML='Could not send right now. Please try again, or <a href="#" data-mail-fallback>email us directly</a>.';
          var fb=$('[data-mail-fallback]',msg);if(fb)fb.addEventListener('click',function(ev){ev.preventDefault();window.location.href='mailto:'+inbox()+'?subject='+encodeURIComponent(data._subject)})}})
        .then(function(){if(btn){btn.disabled=false;btn.textContent=btn.dataset.t}});
    });
  });

  /* ---------- Multi-step forms ---------- */
  $$('[data-steps]').forEach(function(f){
    var steps=$$('.step',f),bars=$$('.steps-bar i',f),i=0;
    function show(n){steps.forEach(function(s,k){s.classList.toggle('on',k===n)});bars.forEach(function(b,k){b.classList.toggle('on',k<=n)});i=n;var h=steps[n].querySelector('h3,legend');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}
    $$('[data-next]',f).forEach(function(b){b.addEventListener('click',function(){
      var ok=true;$$('input,select,textarea',steps[i]).forEach(function(el){if(ok&&!el.checkValidity()){el.reportValidity();ok=false}});
      if(ok&&i<steps.length-1)show(i+1)})});
    $$('[data-prev]',f).forEach(function(b){b.addEventListener('click',function(){if(i>0)show(i-1)})});
    f.addEventListener('nd:sent',function(){show(0)});
    show(0);
  });

  /* ---------- Lite YouTube embeds (privacy-enhanced, load on click) ---------- */
  $$('.yt[data-id]').forEach(function(el){
    var id=el.getAttribute('data-id');
    el.style.backgroundImage='url(https://i.ytimg.com/vi/'+id+'/hqdefault.jpg)';
    function play(){if(el.querySelector('iframe'))return;var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0';f.title=el.getAttribute('data-title')||'Video';
      f.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';f.allowFullscreen=true;el.appendChild(f)}
    el.addEventListener('click',play);
    var b=el.querySelector('.play');if(b)b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();play()}});
  });

  /* ---------- Hero keypad animation ---------- */
  var kp=$('#keypad');
  if(kp){
    var scr=$('#kpNum'),cap=$('#kpCap'),seq=['5','5','5','5','3','1'],caps=['Dialing the most famous exchange in film…','555 — the fictional-number exchange since the 1960s','5555 — four of a kind','5555 3…','5555 31 — and 31 days is the do-not-call grace period','555531 · Know who’s calling. Stop who shouldn’t.'];
    var keys={};$$('.key',kp).forEach(function(k){keys[k.getAttribute('data-k')]=k});
    var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function run(){var n=0;scr.textContent='';
      (function next(){if(n>=seq.length){setTimeout(run,5200);return}var d=seq[n],k=keys[d];scr.textContent+=d;if(n===3||n===4)scr.textContent+=(n===3?' ':'');cap.textContent=caps[n];
        if(k){k.classList.add('lit');setTimeout(function(){k.classList.remove('lit')},260)}n++;setTimeout(next,620)})();}
    if(reduce){scr.textContent='5555 31';cap.textContent=caps[5]}else run();
    $$('.key',kp).forEach(function(k){k.addEventListener('click',function(){k.classList.add('lit');setTimeout(function(){k.classList.remove('lit')},200)})});
  }

  /* ---------- Article table of contents ---------- */
  var toc=$('#toc'),art=$('#article');
  if(toc&&art){var hs=$$('h2',art).filter(function(h){return h.textContent.trim()!=='Sources'});
    if(hs.length<2)toc.remove();else hs.forEach(function(h,i){if(!h.id)h.id='s'+(i+1)+'-'+h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,40);var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;toc.appendChild(a)})}

  /* ---------- Hero / mini lookup → inspector ---------- */
  $$('form[data-lookup]').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var v=(f.querySelector('input').value||'').trim();if(!v)return;
    location.href=(window.BASE||'')+'/inspect.html?n='+encodeURIComponent(v)})});

  /* ---------- Copy buttons ---------- */
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-copy]');if(b){e.preventDefault();window.ND.copy(b.getAttribute('data-copy'))}});

  /* ---------- Scam Spotter quiz (challenge page) ---------- */
  var quiz=$('#quiz');
  if(quiz){
    var score=0,answered=0,total=$$('.qz',quiz).length;
    $$('.qz',quiz).forEach(function(q){
      $$('button',q).forEach(function(b){b.addEventListener('click',function(){
        if(q.dataset.done)return;q.dataset.done='1';answered++;
        var right=b.getAttribute('data-a')===q.getAttribute('data-correct');if(right)score++;
        b.style.background=right?'var(--green)':'var(--coral)';b.style.color=right?'#03140c':'#fff';
        var ex=$('.ex',q);if(ex)ex.hidden=false;
        if(answered===total){var r=$('#quizScore');r.hidden=false;$('#quizPts',r).textContent=score+' / '+total;var inp=$('#entryScore');if(inp)inp.value=score+'/'+total}
      })});
    });
  }
})();
