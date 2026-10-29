(function(){
  var nav=document.getElementById('nav'),burger=document.getElementById('burger'),menu=document.getElementById('menu');
  window.addEventListener('load',function(){setTimeout(function(){document.getElementById('loader').classList.add('done')},350)});
  function onScroll(){nav.classList.toggle('scrolled',window.scrollY>30)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  burger.addEventListener('click',function(){
    var open=menu.classList.toggle('open');burger.setAttribute('aria-expanded',open);
  });
  menu.addEventListener('click',function(e){if(e.target.tagName==='A'){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

  // scroll reveal + animated skill bars
  document.querySelectorAll('.bar-skill').forEach(function(b){b.querySelector('i').style.setProperty('--w',b.dataset.v+'%')});
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(!en.isIntersecting)return;
      en.target.classList.add('in');
      en.target.querySelectorAll('.bar-skill').forEach(function(b){b.classList.add('in')});
      io.unobserve(en.target);
    });
  },{threshold:.2});
  document.querySelectorAll('.reveal').forEach(function(el){io.observe(el)});

  // active nav link
  var links=[].slice.call(menu.querySelectorAll('a'));
  var so=new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if(en.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id)});
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  document.querySelectorAll('main section[id]').forEach(function(s){so.observe(s)});

  // project filter + tap-to-open cards
  var cards=[].slice.call(document.querySelectorAll('.card'));
  document.getElementById('filters').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    document.querySelectorAll('#filters button').forEach(function(x){x.classList.toggle('on',x===b)});
    cards.forEach(function(c){c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.c!==b.dataset.f)});
  });
  cards.forEach(function(c){
    c.addEventListener('click',function(){c.classList.toggle('open')});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();c.classList.toggle('open')}});
  });

  // hero terminal typing
  var t=document.getElementById('term');
  var lines=[
    ['cmd','$ az group create -n rg-cv -l southeastasia'],['ok','✔ Succeeded'],
    ['cmd','$ az vm create -g rg-cv -n vm-lab01'],['ok','✔ Running'],
    ['cmd','$ az role assignment create --role Reader'],['ok','✔ Access granted'],
    ['cmd','$ whoami'],['','Jamalee, AZ-104 certified']
  ];
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    t.innerHTML=lines.map(function(l){return '<span class="'+l[0]+'">'+l[1]+'</span>'}).join('\n');return;
  }
  var li=0,ci=0,html='';
  (function type(){
    if(li>=lines.length)return;
    var l=lines[li],isCmd=l[0]==='cmd';
    if(isCmd){ci++;t.innerHTML=html+'<span class="cmd">'+l[1].slice(0,ci)+'</span>▌';
      if(ci<l[1].length)return setTimeout(type,28)}
    html+='<span class="'+l[0]+'">'+l[1]+'</span>\n';t.innerHTML=html;li++;ci=0;
    setTimeout(type,isCmd?350:600);
  })();
})();
