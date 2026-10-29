(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,touch=matchMedia('(hover:none)').matches;
  var nav=$('#nav'),burger=$('#burger'),menu=$('#menu'),loader=$('#loader');

  // loader counter, then curtain lift
  var pct=$('#pct'),n=0;
  function start(){document.body.classList.add('ready')}
  if(reduce){start()}else{
    var t=setInterval(function(){
      n=Math.min(100,n+Math.ceil(Math.random()*9));pct.textContent=n;loader.style.setProperty('--p',n/100);
      if(n>=100){clearInterval(t);setTimeout(function(){loader.classList.add('done');setTimeout(start,350)},250)}
    },45);
  }

  // split hero name into letters
  var h1=$('#name'),i=0,txt=h1.textContent;h1.innerHTML='';
  txt.split(' ').forEach(function(w){
    var ws=document.createElement('span');ws.className='w';ws.setAttribute('aria-hidden','true');
    w.split('').forEach(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;s.style.setProperty('--i',i++);ws.appendChild(s)});
    h1.appendChild(ws);
  });
  ['.status','.title','.lead','.actions','.term'].forEach(function(s,k){var e=$(s,$('.hero'));if(e){e.classList.add('in-up');e.style.setProperty('--d',(1+k*.15)+'s')}});

  // nav, progress bar
  var prog=$('#prog');
  function onScroll(){
    nav.classList.toggle('scrolled',scrollY>30);
    var h=document.documentElement.scrollHeight-innerHeight;prog.style.transform='scaleX('+(h>0?scrollY/h:0)+')';
  }
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

  // reveal, count-up, skill bars
  $$('h2').forEach(function(h){h.classList.add('reveal-h')});
  $$('.bar-skill').forEach(function(b){b.querySelector('i').style.setProperty('--w',b.dataset.v+'%');var em=document.createElement('em');em.textContent='0%';b.querySelector('span').appendChild(em)});
  function count(el,to,suf,dur){
    if(reduce){el.textContent=to+suf;return}
    var s=performance.now();(function f(now){var p=Math.min(1,(now-s)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e)+suf;if(p<1)requestAnimationFrame(f)})(s);
  }
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(!en.isIntersecting)return;var el=en.target;io.unobserve(el);
    if(el.tagName==='H2'){el.classList.add('in');return}
    if(el.dataset.n){count(el,+el.dataset.n,el.dataset.s||'',1500);return}
    el.classList.add('in');
    $$('.bar-skill',el).forEach(function(b,k){setTimeout(function(){b.classList.add('in');count(b.querySelector('em'),+b.dataset.v,'%',1400)},k*120)});
  })},{threshold:.25});
  $$('h2,.reveal,[data-n]').forEach(function(e){io.observe(e)});

  // active nav link
  var links=$$('a',menu);
  var so=new IntersectionObserver(function(es){es.forEach(function(en){
    if(en.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});
  $$('main section[id]').forEach(function(s){so.observe(s)});

  // project filter, tap to open, 3D tilt
  var cards=$$('.card');
  $('#filters').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    $$('#filters button').forEach(function(x){x.classList.toggle('on',x===b)});
    cards.forEach(function(c){var hide=b.dataset.f!=='all'&&c.dataset.c!==b.dataset.f;c.classList.toggle('hide',hide);if(!hide){c.style.animation='none';void c.offsetWidth;c.style.animation=''}});
  });
  cards.forEach(function(c){
    c.addEventListener('click',function(){c.classList.toggle('open')});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('open')}});
    if(reduce||touch)return;
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect();
      c.style.setProperty('--ry',((e.clientX-r.left)/r.width-.5)*10+'deg');c.style.setProperty('--rx',(.5-(e.clientY-r.top)/r.height)*10+'deg')});
    c.addEventListener('mouseleave',function(){c.style.setProperty('--rx','0deg');c.style.setProperty('--ry','0deg')});
  });

  // cursor, magnetic buttons, hero spotlight
  if(!reduce&&!touch){
    var cur=$('#cur'),dot=$('#dot'),x=0,y=0,cx=0,cy=0;
    addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;cur.style.opacity=1;dot.style.opacity=1;dot.style.transform='translate('+x+'px,'+y+'px)'});
    (function loop(){cx+=(x-cx)*.15;cy+=(y-cy)*.15;cur.style.transform='translate('+cx+'px,'+cy+'px)';requestAnimationFrame(loop)})();
    $$('a,button,.card').forEach(function(e){e.addEventListener('mouseenter',function(){cur.classList.add('big')});e.addEventListener('mouseleave',function(){cur.classList.remove('big')})});
    $$('.btn').forEach(function(b){
      b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.2+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)'});
      b.addEventListener('mouseleave',function(){b.style.transform=''});
    });
    var hero=$('.hero');hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect();hero.style.setProperty('--mx',e.clientX-r.left+'px');hero.style.setProperty('--my',e.clientY-r.top+'px')});
  }

  // hero terminal
  var term=$('#term'),lines=[
    ['cmd','$ az group create -n rg-cv -l southeastasia'],['ok','✔ Succeeded'],
    ['cmd','$ az vm create -g rg-cv -n vm-lab01'],['ok','✔ Running'],
    ['cmd','$ az role assignment create --role Reader'],['ok','✔ Access granted'],
    ['cmd','$ whoami'],['','Jamalee, AZ-104 certified']];
  if(reduce){term.innerHTML=lines.map(function(l){return '<span class="'+l[0]+'">'+l[1]+'</span>'}).join('\n');return}
  var li=0,ci=0,html='',go=false;
  (function type(){
    if(!go){if(!document.body.classList.contains('ready'))return setTimeout(type,200);go=true;return setTimeout(type,900)}
    if(li>=lines.length)return;
    var l=lines[li],c=l[0]==='cmd';
    if(c){ci++;term.innerHTML=html+'<span class="cmd">'+l[1].slice(0,ci)+'</span>▌';if(ci<l[1].length)return setTimeout(type,26)}
    html+='<span class="'+l[0]+'">'+l[1]+'</span>\n';term.innerHTML=html;li++;ci=0;setTimeout(type,c?350:550);
  })();
})();
