/* =====================================================================
   showroom.js  -  the LIVE product showroom on the "Smart home Tuya devices" slide.
   Real products float on the navy background. One is the HERO in the middle
   (big, with a glow); the others float around it with their name + price.
   Every few seconds the next product glides to the middle and becomes the
   hero, and the card under it shows its real name and price (taken from
   your product list, P in data.js).
   On a laptop: hover a product to bring it to the middle and hold it; the
   whole display tilts gently toward the mouse. Click / tap a product to open its page.

   Switched on by  live:"showroom"  on a HERO slide in data.js, with an
   items list (see the comment above HERO there).
   Needs: core.js (productUrl, fmt, esc, pic) and phone.js (LiveSlides).
   ===================================================================== */
(function(){

var STEP=2200;      /* ms each product stays the hero */

function html(sl){
  var list=[];
  (sl.items||[]).forEach(function(it){
    var p=P.filter(function(x){return it.id!=null?x.id==it.id:x.n==it.name})[0];
    if(p&&list.length<5)list.push({it:it,p:p});
  });
  if(!list.length)return "";
  var cards=list.map(function(o,i){
    var p=o.p,own=!!o.it.photo,
        img=own?'<img data-src="'+BASE+'images/'+o.it.photo+'" alt="" draggable="false">':pic(p);
    return '<a class="sc s'+i+(own?'':' tile')+'" href="'+productUrl(p.id)+'" aria-label="'+esc(p.n)+', '+fmt(p.p)+'"'+
      ' data-cat="'+esc(p.sub||p.c)+'" data-name="'+esc(p.n)+'" data-price="'+fmt(p.p)+'">'+
      '<span class="f"><span class="sc-a">'+img+'</span></span>'+
      '<span class="cap">'+esc(o.it.label||p.sub||p.c)+'<b>'+fmt(p.p)+'</b></span></a>';
  }).join("");
  return '<div class="live sr" data-live="showroom" role="group" aria-label="Featured smart home devices">'+
    '<div class="srs">'+
      '<i class="sr-ring"></i><i class="sr-orb"></i><i class="sr-glow"></i>'+
      '<i class="sr-ping"></i><i class="sr-ping p2"></i><i class="sr-flash"></i><i class="sr-dot"></i>'+
      '<div class="sr-cards">'+cards+'</div>'+
      '<a class="sr-label" href="#"><span class="srl-t"><span class="srl-c"></span><b class="srl-n"></b></span><span class="srl-r"><b class="srl-p"></b><i>View &rarr;</i></span></a>'+
    '</div></div>';
}

function init(el){
  var items=[].slice.call(el.querySelectorAll(".sc")),n=items.length;
  var lab=el.querySelector(".sr-label"),cards=el.querySelector(".sr-cards"),flash=el.querySelector(".sr-flash");
  var slot=items.map(function(_,i){return i});      /* slot[i] = which place product i is in (0 = the middle) */
  var hero=0,timer=null,first=null,resume=null,held=false,lastMove=0,movedX=-99,movedY=-99,hoverAt=-99999;
  var tiltOK=!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);

  function place(){
    items.forEach(function(c,i){
      for(var k=0;k<5;k++)c.classList.remove("s"+k);
      c.classList.add("s"+slot[i]);
    });
  }
  function label(i){
    var c=items[i];
    lab.href=c.getAttribute("href");
    lab.querySelector(".srl-c").textContent=c.getAttribute("data-cat");
    lab.querySelector(".srl-n").textContent=c.getAttribute("data-name");
    lab.querySelector(".srl-p").textContent=c.getAttribute("data-price");
    lab.classList.remove("in");void lab.offsetWidth;lab.classList.add("in");
  }
  /* product i glides to the middle; the old hero takes its place */
  function promote(i){
    if(i==hero)return;
    var t=slot[i];slot[hero]=t;slot[i]=0;hero=i;
    place();label(i);
    hoverAt=Date.now();
    flash.classList.remove("go");void flash.offsetWidth;flash.classList.add("go");
  }
  function next(){if(hero<n-1)promote(hero+1);else if(held)promote(0)}
  function pauseAuto(){clearInterval(timer);clearTimeout(first);clearTimeout(resume);timer=first=resume=null}
  function poke(){el.dispatchEvent(new CustomEvent("liveinteract",{bubbles:true}))}
  function reset(){            /* back to the starting line-up, without animating */
    el.classList.add("reset");
    held=false;hoverAt=-99999;
    slot=items.map(function(_,i){return i});hero=0;place();label(0);
    void el.offsetWidth;el.classList.remove("reset");
  }

  /* the slider calls these: play when the slide appears, stop when it leaves */
  function play(still){
    pauseAuto();reset();
    if(still){el.classList.remove("run");return}
    el.classList.add("run");
    first=setTimeout(function(){next();timer=setInterval(next,STEP)},STEP-300);
  }
  function stop(){pauseAuto();el.classList.remove("run")}

  /* mouse: hovering a product brings it to the middle and holds it (and holds the slider on this slide).
     Only a REAL mouse movement counts: when products glide about, the browser also reports "hover" for whatever
     lands under a resting mouse, and that must not start a tug-of-war. */
  items.forEach(function(c,i){
    c.addEventListener("pointermove",function(e){
      if(e.pointerType!="mouse")return;
      var d=Math.abs(e.clientX-movedX)+Math.abs(e.clientY-movedY);
      movedX=e.clientX;movedY=e.clientY;
      if(d<3||i==hero||Date.now()-hoverAt<1300)return;
      held=true;pauseAuto();promote(i);poke();
    });
  });
  el.addEventListener("pointerenter",function(e){if(e.pointerType=="mouse")poke()});
  el.addEventListener("pointerleave",function(e){
    if(e.pointerType!="mouse")return;
    cards.style.setProperty("--ry","0deg");cards.style.setProperty("--rx","0deg");
    clearTimeout(resume);
    resume=setTimeout(function(){if(el.classList.contains("run")&&!timer)timer=setInterval(next,STEP)},900);
  });
  /* mouse: the whole display tilts a little toward the pointer */
  var raf=0,px=0,py=0,lastPoke=0;
  el.addEventListener("pointermove",function(e){
    if(e.pointerType!="mouse")return;
    var now=Date.now();if(now-lastPoke>1500){lastPoke=now;poke()}   /* still here: keep the slider waiting */
    if(!tiltOK)return;
    var r=el.getBoundingClientRect();
    px=((e.clientX-r.left)/r.width-.5)*2;py=((e.clientY-r.top)/r.height-.5)*2;
    if(raf)return;
    raf=requestAnimationFrame(function(){
      raf=0;
      cards.style.setProperty("--ry",(px*7).toFixed(2)+"deg");
      cards.style.setProperty("--rx",(-py*5).toFixed(2)+"deg");
    });
  });

  place();label(0);
  return {play:play,stop:stop};
}

window.LiveSlides=window.LiveSlides||{};
LiveSlides.showroom={html:html,init:init};
})();
