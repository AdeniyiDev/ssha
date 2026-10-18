/* =====================================================================
   spots.js  -  the three bands under the home slider come ALIVE as you scroll to them.
     1. Locks    : the three real locks with running lights, plus a little "face -> unlocked" story
     2. Lighting : the real 3-button Wi-Fi switch controls three pendant lights (tap them to try)
     3. Panels   : the real touch panel runs "Leave mode" / "Home mode" and the devices answer
   When a band is about a quarter on screen: its text slides up one piece at a time, the picture
   rises into place, and the animation starts. It pauses again when the band leaves the screen.
   A very slight parallax makes the picture drift a little differently from the text as you scroll.
   Bands are marked in index.html with data-spot="locks|lights|panels".
   If this file does not run, the old still pictures simply stay. Reduced motion: everything is shown
   at once, still.
   Needs: layout.js (BASE), phone.js + locks.js (LiveSlides.locks).
   ===================================================================== */
(function(){
var bands=[].slice.call(document.querySelectorAll(".spot[data-spot]"));
if(!bands.length)return;
var still=!!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches);
function qa(root,sel){return [].slice.call(root.querySelectorAll(sel))}
function img(src,x,y,w,h,cls){return '<image class="'+(cls||'')+'" href="'+BASE+'images/'+src+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'"/>'}

/* ============================ 2. LIGHTING ============================ */
var BULBS=[{cx:200,cap:140,y0:170,k:1,h1:120,h2:80},{cx:380,cap:200,y0:230,k:1.24,h1:149,h2:99},{cx:560,cap:100,y0:130,k:.92,h1:110,h2:74}];
var RINGS=[[341,461],[375.6,464.4],[408.4,465.4]];            /* where the three touch rings are on the switch photo */
var SIGNAL=["M341 446C300 410 212 350 200 272","M376 446C378 410 379 380 380 356","M408 447C470 410 552 330 560 224"];
function lightsHtml(){
  var s='<svg class="lt" viewBox="0 0 760 600" role="group" aria-label="Interactive demo: a wall switch turning three lights on and off">'+
  '<defs>'+
    '<radialGradient id="ltBloom"><stop offset="0" stop-color="#ffe08a" stop-opacity=".42"/><stop offset="1" stop-color="#ffe08a" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="ltMask"><stop offset="0" stop-color="#04070a" stop-opacity="1"/><stop offset=".78" stop-color="#04070a" stop-opacity=".96"/><stop offset="1" stop-color="#04070a" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="ltRing"><stop offset="0" stop-color="#9be3ff" stop-opacity=".55"/><stop offset=".5" stop-color="#4cc3ff" stop-opacity=".3"/><stop offset="1" stop-color="#4cc3ff" stop-opacity="0"/></radialGradient>'+
  '</defs>'+
  '<rect class="lt-line" x="0" y="40" width="760" height="3"/>';
  BULBS.forEach(function(b,i){
    s+='<g class="lt-g" data-i="'+i+'">'+
      '<circle class="lt-bl" cx="'+b.cx+'" cy="'+(b.y0+49*b.k)+'" r="'+(b.h1*1.45)+'" fill="url(#ltBloom)"/>'+
      '<circle class="lt-h1" cx="'+b.cx+'" cy="'+(b.y0+49*b.k)+'" r="'+b.h1+'"/>'+
      '<circle class="lt-h2" cx="'+b.cx+'" cy="'+(b.y0+49*b.k)+'" r="'+b.h2+'"/>'+
      '<path class="lt-cord" d="M'+b.cx+' 43V'+b.cap+'"/><rect class="lt-cap" x="'+(b.cx-9)+'" y="'+b.cap+'" width="18" height="30" rx="4"/>'+
      '<path class="lt-body" transform="translate('+b.cx+' '+b.y0+') scale('+b.k+')" d="M0 0c-31 0-50 22-50 48 0 25 15 36 24 50h52c9-14 24-25 24-50 0-25-19-48-50-48z"/>'+
    '</g>';
  });
  SIGNAL.forEach(function(d,i){s+='<path class="lt-sig" d="'+d+'"/><path class="lt-p" data-p="'+i+'" pathLength="100" d="'+d+'"/>'});
  s+=img("home/spots/switch.webp",256,362,248,228,"lt-img");
  s+='<circle class="lt-wifi" cx="347" cy="413" r="9"/>';
  RINGS.forEach(function(r,i){
    s+='<g class="lt-r" data-i="'+i+'"><circle class="lt-rg" cx="'+r[0]+'" cy="'+r[1]+'" r="26"/><circle class="lt-m" cx="'+r[0]+'" cy="'+r[1]+'" r="17"/></g>';
  });
  RINGS.forEach(function(r,i){s+='<circle class="lt-hit" data-i="'+i+'" cx="'+r[0]+'" cy="'+r[1]+'" r="24" role="switch" aria-checked="false" aria-label="Light '+(i+1)+'" tabindex="0"/>'});
  BULBS.forEach(function(b,i){s+='<circle class="lt-hit lt-hb" data-i="'+i+'" cx="'+b.cx+'" cy="'+(b.y0+49*b.k)+'" r="'+(60*b.k)+'"/>'});
  s+='<rect class="lt-all" x="236" y="352" width="288" height="248" rx="20" role="switch" aria-checked="false" aria-label="All lights" tabindex="0"/>';
  return s+'</svg>';
}
function lightsInit(root){
  var st=[0,0,0],timer=null,first=null,step=0;
  var SEQ=[[0,1],[1,1],[2,1],0,0,[2,0],[1,0],[0,0],0];     /* on, on, on, hold, hold, off, off, off, hold */
  function paint(i,v,fire){
    st[i]=v;
    qa(root,'.lt-g[data-i="'+i+'"],.lt-r[data-i="'+i+'"]').forEach(function(n){n.classList.toggle("on",!!v)});
    qa(root,'.lt-hit[data-i="'+i+'"]').forEach(function(n){if(n.hasAttribute("role"))n.setAttribute("aria-checked",v?"true":"false")});
    if(fire){var p=root.querySelector('.lt-p[data-p="'+i+'"]');p.classList.remove("fire");void p.getBoundingClientRect();p.classList.add("fire")}
  }
  function off(){for(var i=0;i<3;i++)paint(i,0,false)}
  function tick(){var s=SEQ[step%SEQ.length];step++;if(s)paint(s[0],s[1],true)}
  function stopAuto(){clearInterval(timer);clearTimeout(first);timer=first=null}
  function play(){
    stopAuto();off();step=0;
    if(still){for(var i=0;i<3;i++)paint(i,1,false);return}
    root.classList.add("run");
    first=setTimeout(function(){tick();timer=setInterval(tick,1100)},500);
  }
  function stop(){stopAuto();root.classList.remove("run")}
  function user(i){stopAuto();paint(i,st[i]?0:1,true)}
  function userAll(){                      /* phones: one tap on the switch turns all three on, or all off */
    stopAuto();var v=(st[0]&&st[1]&&st[2])?0:1;
    for(var i=0;i<3;i++)paint(i,v,true);
    var a=root.querySelector(".lt-all");if(a)a.setAttribute("aria-checked",v?"true":"false");
  }
  root.addEventListener("click",function(e){
    if(e.target.closest&&e.target.closest(".lt-all")){userAll();return}
    var h=e.target.closest&&e.target.closest(".lt-hit");if(h)user(+h.getAttribute("data-i"));
  });
  root.addEventListener("keydown",function(e){
    if(e.key!="Enter"&&e.key!=" ")return;
    if(e.target.closest&&e.target.closest(".lt-all")){e.preventDefault();userAll();return}
    var h=e.target.closest&&e.target.closest(".lt-hit[role]");
    if(h){e.preventDefault();user(+h.getAttribute("data-i"))}
  });
  off();
  return {play:play,stop:stop};
}

/* ============================ 3. CONTROL PANELS ============================ */
/* the real panel photo is placed at (230,150), 300 wide: PANEL_K scales the photo's own pixel coordinates */
var PANEL_K=300/673;
var DEV=[ /* x,y,w,h of the photo, the centre, and where the little status label sits */
  {src:"home/locks/handle.webp",  x:44, y:64, w:138,h:230,cx:113,cy:179,lx:113,ly:318,line:"M240 252C200 232 170 205 150 188"},
  {src:"home/showroom/socket.webp",x:598,y:52, w:118,h:124,cx:657,cy:114,lx:657,ly:198,line:"M520 230C560 200 600 160 640 125"},
  {src:"home/showroom/smoke.webp", x:36, y:420,w:134,h:108,cx:103,cy:472,lx:103,ly:552,line:"M252 382C212 410 172 440 140 466"},
  {src:"home/showroom/alarm.webp", x:606,y:402,w:112,h:109,cx:662,cy:456,lx:662,ly:545,line:"M516 382C562 410 612 440 640 460"}
];
var SCENES=[
  {name:"Leave mode",st:[["Locked","g"],["Off","n"],["Watching","g"],["Armed","g"]]},
  {name:"Home mode", st:[["Unlocked","a"],["On","g"],["Watching","g"],["Off","n"]]}
];
function panelsHtml(){
  var s='<svg class="pn" viewBox="0 0 760 600" role="group" aria-label="Interactive demo: a touch panel switching between Leave mode and Home mode">'+
  '<circle cx="380" cy="300" r="238" fill="#e8e4d9"/>'+
  '<ellipse cx="380" cy="446" rx="150" ry="14" fill="#000" opacity=".1"/>';
  DEV.forEach(function(d,i){s+='<path class="pn-line" d="'+d.line+'"/><path class="pn-p" data-p="'+i+'" pathLength="100" d="'+d.line+'"/>'});
  DEV.forEach(function(d,i){
    s+='<circle class="pn-ring" data-j="'+i+'" cx="'+d.cx+'" cy="'+d.cy+'" r="'+(d.h>200?70:52)+'"/>'+img(d.src,d.x,d.y,d.w,d.h,"pn-dev");
  });
  s+='<g transform="translate(230 150) scale('+PANEL_K+')">'+img("home/showroom/panel.webp",0,0,673,635,"pn-panel")+
     '<polygon class="pn-tile" data-k="0" points="110,362 270,353 240,495 75,490"/><polygon class="pn-tile" data-k="1" points="265,368 445,368 415,520 240,500"/>'+
     '<polygon class="pn-hit" data-k="0" role="button" tabindex="0" aria-label="Leave mode" points="110,362 270,353 240,495 75,490"/>'+
     '<polygon class="pn-hit" data-k="1" role="button" tabindex="0" aria-label="Home mode" points="265,368 445,368 415,520 240,500"/></g>';
  DEV.forEach(function(d,j){
    s+='<g class="pn-chip" data-j="'+j+'"><rect class="pn-cb" x="'+(d.lx-62)+'" y="'+(d.ly-16)+'" width="124" height="32" rx="16"/>'+
       '<circle class="pn-cd" cx="'+(d.lx-42)+'" cy="'+d.ly+'" r="5.5"/><text class="pn-ct" x="'+(d.lx-30)+'" y="'+(d.ly+5.5)+'">Off</text></g>';
  });
  s+='<g class="pn-pill"><rect x="285" y="68" width="190" height="36" rx="18"/><text class="pn-pt" x="380" y="91.5" text-anchor="middle">Home mode</text></g>';
  return s+'</svg><div class="pn-btns"><button type="button" class="pn-b" data-k="0">Leave mode</button><button type="button" class="pn-b" data-k="1">Home mode</button></div>';
}
function panelsInit(root){
  var chips=qa(root,".pn-chip"),rings=qa(root,".pn-ring"),pulses=qa(root,".pn-p"),tiles=qa(root,".pn-tile"),pill=root.querySelector(".pn-pt");
  var timers=[],timer=null,first=null,resume=null,cur=-1;
  function fire(n){n.classList.remove("fire");void n.getBoundingClientRect();n.classList.add("fire")}
  function setChip(j,v){
    var c=chips[j];c.querySelector(".pn-ct").textContent=v[0];
    var d=c.querySelector(".pn-cd");d.setAttribute("class","pn-cd "+v[1]);
  }
  function chipsTo(k){SCENES[k].st.forEach(function(v,j){setChip(j,v)});qa(root,".pn-b").forEach(function(bt){bt.classList.toggle("on",+bt.getAttribute("data-k")==k)})}
  function scene(k){
    pill.textContent=SCENES[k].name;
    qa(root,".pn-b").forEach(function(bt){bt.classList.toggle("on",+bt.getAttribute("data-k")==k)});
    var pl=pill.parentNode;fire(pl);fire(tiles[k]);
    SCENES[k].st.forEach(function(v,j){
      timers.push(setTimeout(function(){fire(pulses[j])},j*200));
      timers.push(setTimeout(function(){setChip(j,v);fire(rings[j])},450+j*200));
    });
  }
  function clearTimers(){timers.forEach(clearTimeout);timers=[]}
  function nextScene(){cur=(cur+1)%2;scene(cur)}
  function stopAuto(){clearInterval(timer);clearTimeout(first);clearTimeout(resume);timer=first=resume=null}
  function play(){
    stopAuto();clearTimers();cur=-1;chipsTo(1);pill.textContent="Home mode";
    if(still)return;
    root.classList.add("run");
    first=setTimeout(function(){nextScene();timer=setInterval(nextScene,4300)},700);
  }
  function stop(){stopAuto();clearTimers();root.classList.remove("run")}
  function user(k){
    stopAuto();cur=k;scene(k);
    resume=setTimeout(function(){if(root.classList.contains("run")&&!timer)timer=setInterval(nextScene,4300)},9000);
  }
  root.addEventListener("click",function(e){var h=e.target.closest&&e.target.closest(".pn-hit,.pn-b");if(h)user(+h.getAttribute("data-k"))});
  root.addEventListener("keydown",function(e){
    if(e.key!="Enter"&&e.key!=" ")return;var h=e.target.closest&&e.target.closest(".pn-hit");
    if(h){e.preventDefault();user(+h.getAttribute("data-k"))}
  });
  chipsTo(1);
  return {play:play,stop:stop};
}

/* ============================ 1. LOCKS ============================ */
function locksHtml(){
  return LiveSlides.locks.html({items:[{kind:"handle",photo:"home/locks/handle.webp"},{kind:"face",photo:"home/locks/face.webp"},{kind:"handle",photo:"home/locks/handle.webp"}]});
}
function locksInit(root){
  var el=root.querySelector(".live"),ctl=LiveSlides.locks.init(el);
  var STEPS=[["scan","Scanning face…"],["ok","Face recognised"],["open","Door unlocked"]];
  var tag=document.createElement("div");tag.className="lk-tag";tag.innerHTML='<i></i><span></span>';
  el.querySelector(".lks").appendChild(tag);
  var timer=null,n=0;
  function show(k){tag.className="lk-tag "+STEPS[k][0];tag.querySelector("span").textContent=STEPS[k][1]}
  function tick(){show(n%3);n++}
  function play(){
    clearInterval(timer);n=0;
    if(still){ctl.play(true);show(2);return}
    ctl.play(false);tick();timer=setInterval(tick,1500);
  }
  function stop(){clearInterval(timer);ctl.stop()}
  show(2);
  return {play:play,stop:stop};
}

/* ============================ build the three bands ============================ */
var KINDS={locks:{html:locksHtml,init:locksInit},lights:{html:lightsHtml,init:lightsInit},panels:{html:panelsHtml,init:panelsInit}};
bands.forEach(function(b){
  var k=KINDS[b.getAttribute("data-spot")];if(!k)return;
  if(b.getAttribute("data-spot")=="locks"&&!(window.LiveSlides&&LiveSlides.locks))return;
  var old=b.querySelector(".spot-in>img");if(!old)return;
  var art=document.createElement("div");art.className="spot-art";art.innerHTML='<div class="pa">'+k.html()+'</div>';
  old.parentNode.replaceChild(art,old);
  b._art=art;b._ctl=k.init(art);
});

/* ============================ reveal + play/pause on scroll ============================ */
if(!still)document.documentElement.classList.add("rv");
function onShow(b){if(!b.classList.contains("in"))b.classList.add("in");if(b._ctl&&!b._on){b._on=true;b._ctl.play()}}
function onHide(b){if(b._ctl&&b._on){b._on=false;b._ctl.stop()}}
if("IntersectionObserver" in window){
  var ioImg=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&window.wakeImgs){wakeImgs(e.target);ioImg.unobserve(e.target)}})},{rootMargin:"900px 0px"});
  bands.forEach(function(b){ioImg.observe(b)});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var b=e.target;
      if(e.intersectionRatio>=.22)onShow(b);else if(e.intersectionRatio<=.02)onHide(b);
    });
  },{threshold:[0,.02,.1,.22,.4]});
  bands.forEach(function(b){io.observe(b)});
}else{bands.forEach(function(b){if(window.wakeImgs)wakeImgs(b);onShow(b)})}

/* ============================ a little parallax ============================ */
if(!still){
  var raf=0;
  function par(){
    raf=0;var vh=window.innerHeight;
    bands.forEach(function(b){
      if(!b._art)return;var r=b.getBoundingClientRect();
      if(r.bottom<-50||r.top>vh+50)return;
      var p=((r.top+r.height/2)-vh/2)/(vh/2+r.height/2);p=Math.max(-1,Math.min(1,p));
      b._art.style.setProperty("--pv",(p*-16).toFixed(1));
    });
  }
  window.addEventListener("scroll",function(){if(!raf)raf=requestAnimationFrame(par)},{passive:true});
  window.addEventListener("resize",par);par();
}
})();
