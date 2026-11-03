(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,body=document.body;
  var nav=$('#nav'),burger=$('#burger'),menu=$('#menu');

  // 1. Hero sequence starts on the first frame (no blocking loader): name > role > intro > actions > terminal
  var h1=$('#name'),i=0,txt=h1.textContent;h1.innerHTML='';
  txt.split(' ').forEach(function(w){
    var ws=document.createElement('span');ws.className='w';ws.setAttribute('aria-hidden','true');
    w.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;s.style.setProperty('--i',i++);ws.appendChild(s)});
    h1.appendChild(ws);
  });
  ['.eyebrow-row','.title','.lead','.badges','.actions','.term'].forEach(function(s,k){var e=$(s,$('.hero'));if(e){e.classList.add('in-up');e.style.setProperty('--k',k===0?-3:k-1)}});
  requestAnimationFrame(function(){requestAnimationFrame(function(){body.classList.add('ready')})});
  if(!reduce)setTimeout(function(){$('#heroCta').classList.add('pulse-once')},1500);

  // 2. Navigation, scroll progress bar, and side rail (shows how far through the page you are)
  var prog=$('#prog'),ticking=false;
  function onScroll(){
    if(ticking)return;ticking=true;
    requestAnimationFrame(function(){
      nav.classList.toggle('scrolled',scrollY>30);
      var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?scrollY/h:0)+')';ticking=false;
    });
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
  var sections=$$('main section[id]'),rail=document.createElement('nav');rail.className='rail';rail.setAttribute('aria-label','Page sections');
  var names={home:'Home',about:'About',education:'Education',skills:'Skills',projects:'Projects',certs:'Certifications',experience:'Experience',contact:'Contact'};
  sections.forEach(function(s){var a=document.createElement('a');a.href='#'+s.id;a.setAttribute('aria-label',names[s.id]||s.id);a.innerHTML='<span>'+(names[s.id]||s.id)+'</span>';rail.appendChild(a)});
  body.appendChild(rail);
  var marks=$$('a',menu).concat($$('a',rail));
  var so=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting)marks.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(function(s){so.observe(s)});

  // 3. Scroll reveals: one shared motion (small upward fade), staggered, fired once
  $$('[data-stagger]').forEach(function(c){[].forEach.call(c.children,function(el,k){el.classList.add('reveal');el.style.setProperty('--i',k)})});
  $$('h2').forEach(function(h){var t=h.textContent.trim();h.setAttribute('aria-label',t);h.innerHTML=t.split(' ').map(function(w,k){return '<span class="hw" aria-hidden="true"><span style="--i:'+k+'">'+w+'</span></span>'}).join(' ')});
  $$('.bar-skill').forEach(function(b){b.querySelector('i').style.setProperty('--w',b.dataset.v+'%');var em=document.createElement('em');em.textContent='0%';b.querySelector('span').appendChild(em)});
  function count(el,to,suf){
    if(reduce){el.textContent=to+suf;return}
    var s=performance.now();(function f(now){var p=Math.min(1,(now-s)/1000),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)})(s);
  }
  function reveal(el){
    el.classList.add('in');
    if(el.dataset.n)count(el,+el.dataset.n,el.dataset.s||'');
    $$('.bar-skill',el).forEach(function(b,k){setTimeout(function(){b.classList.add('in');count(b.querySelector('em'),+b.dataset.v,'%')},k*90)});
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){io.unobserve(en.target);reveal(en.target)}})},{threshold:.2,rootMargin:'0px 0px -6% 0px'});
  var targets=$$('.reveal,[data-n],#cards,h2');
  targets.forEach(function(e){reduce?reveal(e):io.observe(e)});
  // end of page: the closing call to action pulses once when it comes into view
  new IntersectionObserver(function(es,o){es.forEach(function(en){if(en.isIntersecting&&!reduce){en.target.classList.add('pulse-once');o.disconnect()}})},{threshold:1}).observe($('#endCta'));

  // light-only effects that follow the pointer (no layout movement): card spotlight, hero glow, gentle button pull
  if(!reduce&&matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',function(e){
      var t=e.target.closest&&e.target.closest('.card,.cert,.facts,.job,.edu');
      if(t){var r=t.getBoundingClientRect();t.style.setProperty('--mx',e.clientX-r.left+'px');t.style.setProperty('--my',e.clientY-r.top+'px')}
      var h=$('.hero'),hr=h.getBoundingClientRect();
      if(e.clientY<hr.bottom){h.style.setProperty('--mx',e.clientX-hr.left+'px');h.style.setProperty('--my',e.clientY-hr.top+'px')}
    },{passive:true});
    $$('.btn').forEach(function(b){
      b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.12)+'px '+((e.clientY-r.top-r.height/2)*.2)+'px'});
      b.addEventListener('pointerleave',function(){b.style.translate=''});
    });
  }

  // 4. Project filter and lab case-study dialog
  var cards=$$('.card');
  $('#filters').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    $$('#filters button').forEach(function(x){x.classList.toggle('on',x===b)});
    cards.forEach(function(c){c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.c!==b.dataset.f)});
  });
  var dlg=$('#lab'),out=$('#labBody'),last;
  function openLab(c){last=c;out.innerHTML=$('template',c).innerHTML;[].forEach.call(out.children,function(e,k){e.style.setProperty('--n',k)});dlg.showModal();body.style.overflow='hidden'}
  cards.forEach(function(c,k){
    c.style.setProperty('--k',k);
    c.addEventListener('click',function(){openLab(c)});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openLab(c)}});
  });
  $('#labx').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('close',function(){body.style.overflow='';if(last)last.focus()});

  // 5. Hero terminal types after the entrance sequence has settled
  var term=$('#term'),lines=[
    ['cmd','$ az group create -n rg-cv -l southeastasia'],['ok','✔ Succeeded'],
    ['cmd','$ az vm create -g rg-cv -n vm-lab01'],['ok','✔ Running'],
    ['cmd','$ az role assignment create --role Reader'],['ok','✔ Access granted'],
    ['cmd','$ whoami'],['','Jamalee, AZ-104 certified']];
  if(reduce){term.innerHTML=lines.map(function(l){return '<span class="'+l[0]+'">'+l[1]+'</span>'}).join('\n');term.scrollTop=term.scrollHeight;return}
  var li=0,ci=0,html='';
  function type(){
    if(li>=lines.length)return;
    var l=lines[li],c=l[0]==='cmd';
    if(c){ci++;term.innerHTML=html+'<span class="cmd">'+l[1].slice(0,ci)+'</span>▌';term.scrollTop=term.scrollHeight;if(ci<l[1].length)return setTimeout(type,24)}
    html+='<span class="'+l[0]+'">'+l[1]+'</span>\n';term.innerHTML=html;term.scrollTop=term.scrollHeight;li++;ci=0;setTimeout(type,c?300:450);
  }
  setTimeout(type,1300);
})();
