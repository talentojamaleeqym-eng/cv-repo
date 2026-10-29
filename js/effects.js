(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,touch=matchMedia('(hover:none)').matches;

  // icon line-draw setup + staggered card entrance
  $$('.ico *').forEach(function(e){e.setAttribute('pathLength','1')});
  $$('.card').forEach(function(c,k){c.style.setProperty('--k',k);$$('.ico *',c).forEach(function(e){e.style.setProperty('--k',k)})});
  var cards=$('#cards');
  new IntersectionObserver(function(es,o){es.forEach(function(e){if(e.isIntersecting){cards.classList.add('in');o.disconnect()}})},{threshold:.15}).observe(cards);

  // lab case-study modal
  var dlg=$('#lab'),body=$('#labBody'),last;
  function open(c){last=c;body.innerHTML=$('template',c).innerHTML;[].forEach.call(body.children,function(e,i){e.style.setProperty('--n',i)});dlg.showModal();document.body.style.overflow='hidden'}
  $$('.card').forEach(function(c){
    c.addEventListener('click',function(){open(c)});
    c.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(c)}});
  });
  $('#labx').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  dlg.addEventListener('close',function(){document.body.style.overflow='';if(last)last.focus()});

  if(reduce)return;

  // parallax ghost words behind each section heading
  var ghosts=[];
  $$('.sec').forEach(function(s){var h=$('h2',s);if(!h)return;var g=document.createElement('span');g.className='ghost';g.setAttribute('aria-hidden','true');g.textContent=h.textContent.toUpperCase().split(' ')[0];s.insertBefore(g,s.firstChild);ghosts.push([s,g])});

  // scroll velocity drives marquee speed and ghost parallax
  var marq=$('.marq div'),anim=marq&&marq.getAnimations()[0],lastY=scrollY,vel=0;
  (function tick(){
    var d=scrollY-lastY;lastY=scrollY;vel+=(d-vel)*.12;
    if(anim)anim.playbackRate=1+Math.min(Math.abs(vel)*.35,8)*(vel<0?-1:1);
    ghosts.forEach(function(p){var r=p[0].getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)p[1].style.transform='translate3d('+(r.top*.12)+'px,'+(r.top*-.1)+'px,0)'});
    requestAnimationFrame(tick);
  })();

  // text scramble on lab titles
  var chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  function scramble(el){
    var final=el.dataset.t||(el.dataset.t=el.textContent),f=0,n=18;
    clearInterval(el._t);el._t=setInterval(function(){
      f++;el.textContent=final.split('').map(function(c,i){return c===' '||i<f*final.length/n?c:chars[Math.random()*chars.length|0]}).join('');
      if(f>=n){clearInterval(el._t);el.textContent=final}
    },30);
  }
  if(!touch)$$('.card').forEach(function(c){var h=$('h3',c);c.addEventListener('mouseenter',function(){scramble(h)})});

  // hero depth: terminal tilts and name drifts with the mouse
  var hero=$('.hero'),term=$('.term'),h1=$('#name');
  if(!touch)hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    term.style.setProperty('--ty',(x*14-3)+'deg');term.style.setProperty('--tx',(-y*10)+'deg');
    h1.style.setProperty('--hx',(x*-14)+'px');h1.style.setProperty('--hy',(y*-8)+'px');
  });
})();
