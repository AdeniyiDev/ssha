/* =====================================================================
   locks.js  -  the LIVE locks slide ("3D facial and biometric locks").
   Same look as before (three locks on white pedestals, grey circle behind),
   but with REAL lock photos, and lights that run over the real buttons:
     - a light races round the keypad, key by key, again and again
     - a bright arc spins round the camera ring (face lock)
     - the fingerprint sensors pulse, the green bar shimmers,
       and a scan line sweeps down the face screen.
   The lights are small glowing dots placed on top of the photo at the exact
   spot of each key (see LK below), so they stay on the keys at any size.

   Switched on by  live:"locks"  on a HERO slide in data.js.
   Needs: phone.js (it creates window.LiveSlides).
   ===================================================================== */
(function(){

/* LK = where the lights go on each photo, as fractions (0-1) of the photo's width / height.
   keys: [x, y, order]  (order = the turn each key lights up; 0 first, clockwise round the pad, middle keys last)
   If you swap in a different lock photo, these spots have to be re-measured for that photo. */
var LK={"face": {"size": [370, 740], "keys": [[0.7056, 0.259, 0], [0.7829, 0.2619, 1], [0.8612, 0.2623, 2], [0.8589, 0.3027, 3], [0.8605, 0.3455, 4], [0.8604, 0.3846, 5], [0.7827, 0.3845, 6], [0.7052, 0.3849, 7], [0.7053, 0.342, 8], [0.7055, 0.3, 9], [0.7837, 0.3011, 10], [0.783, 0.3454, 11]], "ring": [0.7776, 0.1001, 0.1014], "fp": [0.8832, 0.5893, 0.0459], "bar": [0.6865, 0.4788, 0.1784], "scan": [0.1273, 0.0439, 0.2111, 0.2569]}, "handle": {"size": [388, 645], "keys": [[0.1056, 0.1301, 0], [0.203, 0.1318, 1], [0.3026, 0.1313, 2], [0.3003, 0.1855, 3], [0.3014, 0.2358, 4], [0.3009, 0.2905, 5], [0.202, 0.2895, 6], [0.103, 0.2912, 7], [0.1042, 0.235, 8], [0.1046, 0.1843, 9], [0.2023, 0.1843, 10], [0.2023, 0.2378, 11]], "fp": [0.1978, 0.4899, 0.0438], "card": [0.2036, 0.8868]}};

/* the stage is 702 x 522 "units" (the size of the old drawing, cropped). Everything below is in those units. */
var W=702,H=522;
var SLOTS=[
  {kind:"handle",ped:{x:26, y:386,w:190},sh:{cx:121,cy:490,rx:117.8},h:246,cx:151,ph:0   },
  {kind:"face",  ped:{x:261,y:348,w:200},sh:{cx:361,cy:452,rx:124  },h:300,cx:361,ph:.45},
  {kind:"handle",ped:{x:496,y:400,w:180},sh:{cx:586,cy:504,rx:111.6},h:222,cx:592,ph:.9 }
];
var KEYSIZE={face:.095,handle:.105};      /* glow size, as a fraction of the photo's width */

function px(v,total){return (v/total*100).toFixed(3)+"%"}
function box(x,y,w,h){return "left:"+px(x,W)+";top:"+px(y,H)+";width:"+px(w,W)+";height:"+px(h,H)}

function lightsHtml(kind){
  var c=LK[kind],s="";
  c.keys.forEach(function(k){
    s+='<i class="k" style="left:'+(k[0]*100).toFixed(2)+'%;top:'+(k[1]*100).toFixed(2)+'%;width:'+(KEYSIZE[kind]*100)+'%;--o:'+k[2]+'"></i>';
  });
  function at(a,w){return 'left:'+(a[0]*100).toFixed(2)+'%;top:'+(a[1]*100).toFixed(2)+'%;width:'+(w*100).toFixed(2)+'%'}
  if(kind=="face"){
    s+='<i class="rg" style="'+at(c.ring,c.ring[2]*2.16)+'"></i>';
    s+='<i class="fp g" style="'+at(c.fp,c.fp[2]*2)+'"></i>';
    s+='<i class="br" style="left:'+(c.bar[0]*100).toFixed(2)+'%;top:'+(c.bar[1]*100).toFixed(2)+'%;width:'+(c.bar[2]*100).toFixed(2)+'%"></i>';
    s+='<i class="lscan" style="left:'+(c.scan[0]*100).toFixed(2)+'%;top:'+(c.scan[1]*100).toFixed(2)+'%;width:'+(c.scan[2]*100).toFixed(2)+'%;height:'+(c.scan[3]*100).toFixed(2)+'%"></i>';
  }else{
    s+='<i class="fp" style="'+at(c.fp,c.fp[2]*2)+'"></i>';
    s+='<i class="cd" style="left:'+(c.card[0]*100).toFixed(2)+'%;top:'+(c.card[1]*100).toFixed(2)+'%"></i>';
  }
  return s;
}

function html(sl){
  var items=sl.items||[],out="";
  SLOTS.forEach(function(S,i){
    var it=items[i]||{},kind=it.kind||S.kind,c=LK[kind];if(!c)return;
    var hh=S.h,ww=hh*c.size[0]/c.size[1];
    var photo=it.photo||("home/locks/"+kind+".webp");
    out+='<i class="sh" style="'+box(S.sh.cx-S.sh.rx,S.sh.cy-11,S.sh.rx*2,22)+'"></i>'+
      '<i class="pd" style="'+box(S.ped.x,S.ped.y,S.ped.w,100)+'"></i>'+
      '<div class="lkp" style="'+box(S.cx-ww/2,S.ped.y+2-hh,ww,hh)+';--ph:'+S.ph+'">'+
        '<img data-src="'+BASE+'images/'+photo+'" alt="" draggable="false">'+lightsHtml(kind)+
      '</div>';
  });
  return '<div class="live lk" data-live="locks" role="img" aria-label="Smart door locks with face recognition, keypad and fingerprint">'+
    '<div class="lks"><i class="lk-c" style="'+box(130,8,476,476)+'"></i>'+out+'</div></div>';
}

function init(el){
  return {
    play:function(still){el.classList[still?"remove":"add"]("run")},
    stop:function(){el.classList.remove("run")}
  };
}

window.LiveSlides=window.LiveSlides||{};
LiveSlides.locks={html:html,init:init};
})();
