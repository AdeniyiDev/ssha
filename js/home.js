/* =====================================================================
   home.js  -  the Home page: slider, category tiles, popular picks, and
   the Secure Sight name that glides into the menu bar when you scroll.
   ===================================================================== */
(function(){

/* ---------- HERO SLIDER ---------- */
var HX=["jpg","webp","png","jpeg"];
/* Banner pictures: an <img data-banner="path-without-extension"> stays hidden until a real file
   (.jpg, .webp, .png or .jpeg) is found, so a missing picture never shows a broken-image icon. */
function loadBanners(){
  document.querySelectorAll("img[data-banner]").forEach(function(el){
    var base=el.getAttribute("data-banner"),i=0;
    (function next(){
      if(i>=HX.length)return;
      var t=new Image();
      t.onload=function(){el.src=t.src;el.style.display="block"};
      t.onerror=function(){i++;next()};
      t.src=base+"."+HX[i];
    })();
  });
}
function slideHtml(sl,i,total){
  var dk=sl.tone=="dark";
  return '<div class="slide'+(sl.flip?' flip':'')+'" data-tone="'+sl.tone+'" style="background:'+sl.bg+'" role="group" aria-roledescription="slide" aria-label="'+(i+2)+' of '+total+'" aria-hidden="true">'+
    (sl.art?'<img class="slide-art" src="'+BASE+'images/'+sl.art+'" alt="">':'')+
    '<img class="slide-img" data-banner="'+BASE+'images/'+sl.img+'" alt="">'+
    '<p class="slide-brand">Secure Sight<span>Home Autos</span></p>'+
    '<div class="slide-in"><div class="slide-copy">'+
      (sl.tag?'<span class="slide-tag">'+sl.tag+'</span>':'')+
      '<h2>'+sl.title+'</h2>'+
      (sl.text?'<p>'+sl.text+'</p>':'')+
      (sl.apps?'<p class="slide-apps">'+sl.apps+'</p>':'')+
      (sl.logos?'<img class="slide-logos" data-banner="'+BASE+'images/'+sl.logos+'" alt="">':'')+
      '<a class="btn lg '+(dk?'light':'dk')+'" href="'+BASE+sl.href+'">'+sl.btn+'</a>'+
    '</div></div></div>';
}
function initSlider(){
  var box=$("slider");if(!box)return;
  var total=HERO.length+1;
  box.insertAdjacentHTML("beforeend",HERO.map(function(s,i){return slideHtml(s,i,total)}).join("")+
    '<button class="sl-arrow prev" aria-label="Previous slide"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg></button>'+
    '<button class="sl-arrow next" aria-label="Next slide"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></button>'+
    '<div class="sl-dots" role="group" aria-label="Choose slide">'+Array.apply(null,Array(total)).map(function(_,i){return '<button data-slide="'+i+'" aria-label="Go to slide '+(i+1)+'"></button>'}).join("")+'</div>');
  var slides=box.querySelectorAll(".slide"),dots=box.querySelectorAll(".sl-dots button"),idx=0,timer=null;
  function show(n){
    idx=(n+slides.length)%slides.length;
    slides.forEach(function(s,i){s.classList.toggle("on",i==idx);s.setAttribute("aria-hidden",i==idx?"false":"true")});
    dots.forEach(function(d,i){d.classList.toggle("on",i==idx);if(i==idx)d.setAttribute("aria-current","true");else d.removeAttribute("aria-current")});
    box.setAttribute("data-tone",slides[idx].getAttribute("data-tone"));
    if(window.flyUpdate)window.flyUpdate();
  }
  /* Moves to the next slide every HERO_DELAY ms, always. Clicking an arrow or dot just restarts the count. */
  function stop(){clearInterval(timer);timer=null}
  function start(){stop();timer=setInterval(function(){show(idx+1)},HERO_DELAY)}
  box.addEventListener("click",function(e){
    var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
    if(b.classList.contains("next"))show(idx+1);
    else if(b.classList.contains("prev"))show(idx-1);
    else if(b.dataset.slide!=null)show(+b.dataset.slide);
    else return;
    start();
  });
  box.addEventListener("keydown",function(e){if(e.key=="ArrowRight"){show(idx+1);start()}if(e.key=="ArrowLeft"){show(idx-1);start()}});
  var x0=null;
  box.addEventListener("touchstart",function(e){x0=e.touches[0].clientX},{passive:true});
  box.addEventListener("touchend",function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;x0=null;if(Math.abs(dx)>45){show(idx+(dx<0?1:-1));start()}},{passive:true});
  /* only waits while the browser tab is hidden, then carries on */
  document.addEventListener("visibilitychange",function(){if(document.hidden)stop();else start()});
  show(0);start();
}


/* ---------- CATEGORY TILES ---------- */
function renderCats(){
  $("cats-grid").innerHTML=HOME_CATS.map(function(c){
    var g=groupOf(c.slug),n=P.filter(function(x){return x.g==c.slug}).length;
    return '<a class="cat '+c.cls+'" href="'+categoryUrl(c.slug)+'">'+
      '<div class="cat-copy"><h3>'+g.name+'</h3><p>'+c.desc+'</p></div>'+
      '<span class="cat-count">'+(n?('View '+n+' product'+(n==1?'':'s')):'Coming soon')+'</span>'+
      (c.photos&&c.photos.length
        ?'<div class="cat-photos">'+c.photos.map(function(p){return '<img'+(/\.png$/i.test(p)?' class="cut"':'')+' src="'+BASE+'images/home/'+p+'" alt="" loading="lazy">'}).join("")+'</div>'
        :'<img class="cat-art" src="'+BASE+'images/home/'+c.art+'" alt="" loading="lazy">')+
    '</a>';
  }).join("");
}

/* ---------- POPULAR PICKS (names come from HOME_PICKS in data.js) ---------- */
function renderPicks(){
  var list=HOME_PICKS.map(function(n){return P.filter(function(x){return x.n==n})[0]}).filter(Boolean);
  $("picks-grid").innerHTML=cards(list);
}

/* ---------- NAME THAT GLIDES INTO THE MENU BAR ----------
   At the top of the page the name sits big in the middle of the slider.
   As you scroll the first ~150px it moves up and shrinks into the left of the
   menu bar, in front of HOME. (Screens under 601px skip this.) */
function initBrand(){
  var hb=document.querySelector(".hdr-brand"),hdr=document.querySelector("header");if(!hb||!hdr)return;
  var fly=document.createElement("a");
  fly.id="brandFly";fly.className="brand-fly";fly.href=BASE+"index.html";
  fly.setAttribute("aria-label","Secure Sight Home Autos");
  fly.innerHTML='Secure Sight<span>Home Autos</span>';
  document.body.appendChild(fly);
  var g={};
  function measure(){
    var w0=fly.offsetWidth,h0=fly.offsetHeight;if(!w0||!h0){g.ok=false;return}
    var r=hb.getBoundingClientRect(),S0=parseFloat(getComputedStyle(fly).fontSize),S1=parseFloat(getComputedStyle(hb).fontSize)||15;
    g.k=S1/S0;
    g.x0=(window.innerWidth-w0)/2;
    g.y0=hdr.offsetHeight+Math.max(14,Math.min(26,window.innerHeight*0.026));
    g.x1=r.left+(r.width-w0*g.k)/2;
    g.y1=r.top+(r.height-h0*g.k)/2;
    g.D=Math.max(90,Math.min(170,window.innerHeight*0.22));
    g.ok=true;
  }
  function update(){
    if(!g.ok)return;
    var s=Math.min(Math.max(window.pageYOffset||0,0),g.D)/g.D,e=s*s*(3-2*s);
    var x=g.x0+(g.x1-g.x0)*e,y=g.y0+(g.y1-g.y0)*e,k=1+(g.k-1)*e;
    fly.style.transform="translate("+x.toFixed(2)+"px,"+y.toFixed(2)+"px) scale("+k.toFixed(4)+")";
    var box=$("slider"),dark=box&&box.getAttribute("data-tone")=="dark";
    fly.classList.toggle("dk",!!dark&&s<0.5);
  }
  var tick=false;
  window.addEventListener("scroll",function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;update()})},{passive:true});
  window.addEventListener("resize",function(){measure();update()});
  window.flyUpdate=update;
  measure();update();
  window.addEventListener("load",function(){measure();update()});
}

renderCats();
renderPicks();
if($("dd"))$("dd").textContent=STORE.deliveryDays;
initSlider();
loadBanners();
initBrand();

})();
