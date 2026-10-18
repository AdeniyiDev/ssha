/* =====================================================================
   phone.js  -  the LIVE phone on the "Simplify your life" home slide.
   A working phone screen: four switches that turn the floating devices
   on and off. It plays by itself, and visitors can tap the switches
   (or the devices) to try it. Plain SVG + CSS (css/phone.css), no library.

   Used by home.js when a HERO slide has  live:"phone"  in data.js.
   LivePhone.html()    -> the markup for the slide
   LivePhone.init(el)  -> starts it, returns {play(still), stop()}
   ===================================================================== */
(function(){

var DEV=[
  {k:"light", name:"Light",  on:"On",     off:"Off"},
  {k:"lock",  name:"Door",   on:"Locked", off:"Unlocked"},
  {k:"plug",  name:"Plug",   on:"On",     off:"Off"},
  {k:"sensor",name:"Sensor", on:"Armed",  off:"Off"}
];
/* where each floating device sits (top-left corner of its 84px card) */
var CARD={light:{x:24,y:130},lock:{x:24,y:430},plug:{x:452,y:200},sensor:{x:452,y:440}};
/* dashed line from the phone to each device: starts at the phone, ends under the card */
var LINE={
  light:"M172 214C128 214 118 172 66 172",
  lock:"M172 306C124 306 112 472 66 472",
  plug:"M388 398C440 398 448 242 494 242",
  sensor:"M388 490C440 490 446 482 494 482"
};
var LABEL={light:"Living room light",lock:"Front door lock",plug:"Smart plug",sensor:"Motion sensor"};

function rowY(i){return 176+i*92}

function cardIcon(k){
  if(k=="light")return '<path class="bfill" d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/><path d="M9 18h6M10 21h4"/>';
  if(k=="lock") return '<g class="shackle"><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g><rect class="lbody" x="5" y="11" width="14" height="10" rx="2.2"/><circle class="kh" cx="12" cy="16" r="1.3"/>';
  if(k=="plug") return '<rect class="pbody" x="6" y="9" width="12" height="11" rx="3"/><path d="M9.5 9V4.5M14.5 9V4.5"/><path class="pslot" d="M12 13v3"/>';
  return '<circle class="sdot" cx="12" cy="12" r="2"/><path class="sarc" d="M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5.2 5.2a9.6 9.6 0 0 0 0 13.6M18.8 5.2a9.6 9.6 0 0 1 0 13.6"/>';
}

function cardHtml(k){
  var c=CARD[k],cx=c.x+42,cy=c.y+42;
  var behind=
    (k=="light"?'<circle class="glow" cx="'+cx+'" cy="'+cy+'" r="58" fill="url(#lpGlow)"/>':'')+
    (k=="plug"?'<circle class="pring" cx="'+cx+'" cy="'+cy+'" r="30"/>':'')+
    (k=="sensor"?'<circle class="rip" cx="'+cx+'" cy="'+cy+'" r="24"/><circle class="rip r2" cx="'+cx+'" cy="'+cy+'" r="24"/>':'');
  return '<g class="card" data-d="'+k+'" aria-hidden="true">'+behind+
    '<rect class="cs" x="'+c.x+'" y="'+(c.y+6)+'" width="84" height="84" rx="22"/>'+
    '<rect class="cw" x="'+c.x+'" y="'+c.y+'" width="84" height="84" rx="22"/>'+
    '<svg class="ci" x="'+(c.x+18)+'" y="'+(c.y+18)+'" width="48" height="48" viewBox="0 0 24 24">'+cardIcon(k)+'</svg>'+
  '</g>';
}

function rowHtml(d,i){
  var y=rowY(i);
  return '<g class="row" data-d="'+d.k+'" role="switch" aria-checked="false" aria-label="'+LABEL[d.k]+'" tabindex="0">'+
    '<rect class="rbg" x="184" y="'+y+'" width="192" height="76" rx="18"/>'+
    '<circle cx="216" cy="'+(y+38)+'" r="20" fill="#00202f"/>'+
    '<svg class="ri" x="204" y="'+(y+26)+'" width="24" height="24" viewBox="0 0 24 24"><use href="#lp-'+d.k+'"/></svg>'+
    '<text class="rn" x="244" y="'+(y+35)+'">'+d.name+'</text>'+
    '<text class="st" x="244" y="'+(y+54)+'">'+d.off+'</text>'+
    '<rect class="tk" x="328" y="'+(y+26)+'" width="40" height="24" rx="12"/>'+
    '<circle class="kn" cx="340" cy="'+(y+38)+'" r="9.5"/>'+
  '</g>';
}

function html(){
  var lines='',pulses='',cards='',rows='';
  DEV.forEach(function(d,i){
    lines+='<path class="conn" d="'+LINE[d.k]+'"/>';
    pulses+='<path class="pulse" data-c="'+d.k+'" pathLength="100" d="'+LINE[d.k]+'"/>';
    cards+=cardHtml(d.k);
    rows+=rowHtml(d,i);
  });
  return '<div class="live" data-live="phone" role="group" aria-label="Interactive demo: a phone switching smart devices on and off">'+
  '<svg viewBox="0 0 560 660" preserveAspectRatio="xMidYMid meet">'+
    '<defs>'+
      '<radialGradient id="lpGlow"><stop offset="0" stop-color="#ffd95a" stop-opacity=".95"/><stop offset=".55" stop-color="#ffd95a" stop-opacity=".35"/><stop offset="1" stop-color="#ffd95a" stop-opacity="0"/></radialGradient>'+
      '<g id="lp-light"><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/><path d="M9 18h6M10 21h4"/></g>'+
      '<g id="lp-lock"><rect x="5" y="11" width="14" height="10" rx="2.2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></g>'+
      '<g id="lp-plug"><rect x="6" y="9" width="12" height="11" rx="3"/><path d="M9.5 9V4.5M14.5 9V4.5M12 13v3"/></g>'+
      '<g id="lp-sensor"><circle cx="12" cy="12" r="2"/><path d="M8 8a5.7 5.7 0 0 0 0 8M16 8a5.7 5.7 0 0 1 0 8M5.2 5.2a9.6 9.6 0 0 0 0 13.6M18.8 5.2a9.6 9.6 0 0 1 0 13.6"/></g>'+
    '</defs>'+
    '<circle cx="280" cy="330" r="226" fill="#d8dee2"/>'+
    '<ellipse cx="280" cy="636" rx="128" ry="11" fill="#0a2432" opacity=".1"/>'+
    lines+pulses+
    '<g class="phone">'+
      '<rect x="160" y="60" width="240" height="550" rx="44" fill="#14232d"/>'+
      '<rect x="172" y="72" width="216" height="526" rx="33" fill="#fff"/>'+
      '<rect x="250" y="84" width="60" height="16" rx="8" fill="#14232d"/>'+
      '<text class="pt" x="188" y="134">Smart Home</text>'+
      '<text class="ps" data-role="count" x="188" y="153">0 of 4 on</text>'+
      rows+
      '<rect x="240" y="580" width="80" height="5" rx="2.5" fill="#c9d0d5"/>'+
    '</g>'+
    cards+
    '<g class="hint"><rect x="212" y="624" width="136" height="30" rx="15" fill="#00202f"/><text x="280" y="644" text-anchor="middle" fill="#fff" font-size="12.5" letter-spacing=".4">Tap any switch</text></g>'+
  '</svg></div>';
}

function init(el){
  var order=["light","lock","plug","sensor"],st={light:0,lock:0,plug:0,sensor:0};
  var timer=null,first=null,step=0,cnt=el.querySelector("[data-role=count]");

  function paint(k,v,fire){
    st[k]=v;
    var nodes=el.querySelectorAll('.row[data-d="'+k+'"],.card[data-d="'+k+'"]');
    for(var i=0;i<nodes.length;i++){
      nodes[i].classList.toggle("on",!!v);
      if(nodes[i].classList.contains("row"))nodes[i].setAttribute("aria-checked",v?"true":"false");
    }
    var d=DEV[order.indexOf(k)];
    el.querySelector('.row[data-d="'+k+'"] .st').textContent=v?d.on:d.off;
    var n=0;for(var j in st)n+=st[j];
    cnt.textContent=n+" of 4 on";
    if(fire){
      var p=el.querySelector('.pulse[data-c="'+k+'"]');
      p.classList.remove("fire");void p.getBoundingClientRect();p.classList.add("fire");
    }
  }
  function allOff(){order.forEach(function(k){paint(k,0,false)})}
  function stopAuto(){clearInterval(timer);clearTimeout(first);timer=first=null}

  /* the self-playing demo: turns the four devices on one by one, then off one by one, and repeats */
  function tick(){
    var k=order[step%4],on=Math.floor(step/4)%2==0;
    paint(k,on?1:0,true);step++;
  }
  function play(still){
    stopAuto();allOff();step=0;
    if(still){order.forEach(function(k){paint(k,1,false)});el.classList.remove("run");return}
    el.classList.add("run");
    first=setTimeout(function(){tick();timer=setInterval(tick,1200)},600);
  }
  function stop(){stopAuto();el.classList.remove("run")}

  /* a visitor taps a switch or a device: they take over from the demo */
  function userToggle(k){
    stopAuto();
    el.classList.add("touched");
    paint(k,st[k]?0:1,true);
    el.dispatchEvent(new CustomEvent("liveinteract",{bubbles:true}));
  }
  el.addEventListener("click",function(e){
    var t=e.target.closest?e.target.closest(".row,.card"):null;
    if(t&&el.contains(t))userToggle(t.getAttribute("data-d"));
  });
  el.addEventListener("keydown",function(e){
    if(e.key!="Enter"&&e.key!=" ")return;
    var t=e.target.closest?e.target.closest(".row"):null;
    if(t){e.preventDefault();userToggle(t.getAttribute("data-d"))}
  });

  allOff();
  return {play:play,stop:stop};
}

window.LivePhone={html:html,init:init};
window.LiveSlides=window.LiveSlides||{};
LiveSlides.phone=window.LivePhone;
/* pictures that are not needed yet carry data-src instead of src; this loads them (called when their slide or band is about to show) */
window.wakeImgs=function(root){var a=root.querySelectorAll("img[data-src]");for(var i=0;i<a.length;i++){a[i].src=a[i].getAttribute("data-src");a[i].removeAttribute("data-src")}};
})();
