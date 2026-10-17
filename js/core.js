/* =====================================================================
   core.js  -  shared logic used by every page: currency, prices, cart
   storage, product cards, toast, "add to cart" buttons.
   Load order on each page:  data.js -> layout.js -> core.js -> page file
   ===================================================================== */
var $=function(i){return document.getElementById(i)};

/* ---------- PRODUCT ICONS ---------- */
var ST='fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';
var IN={
  cam:'<rect x="8" y="20" width="36" height="20" rx="4"/><path d="M44 26l12-6v24l-12-6"/><circle cx="26" cy="30" r="5"/><path d="M20 40v10h12"/>',
  box:'<rect x="8" y="22" width="48" height="22" rx="4"/><circle cx="18" cy="33" r="2.5" fill="#800000" stroke="none"/><path d="M28 33h20"/>',
  lock:'<rect x="14" y="28" width="36" height="26" rx="4"/><path d="M22 28v-8a10 10 0 0120 0v8"/><circle cx="32" cy="41" r="3" fill="#800000" stroke="none"/>',
  bulb:'<path d="M22 40c-6-4-8-9-8-14a18 18 0 0136 0c0 5-2 10-8 14v6H22z"/><path d="M24 54h16"/>',
  sens:'<rect x="12" y="24" width="18" height="16" rx="3"/><rect x="36" y="24" width="16" height="16" rx="3"/><circle cx="21" cy="32" r="2" fill="#800000" stroke="none"/>'
};
var ICON_COLOR={cam:"#00202f",box:"#444",lock:"#00202f",bulb:"#b87800",sens:"#555"};
var ICON={};
for(var ik in IN){ICON[ik]='<svg viewBox="0 0 64 64" '+ST+' style="color:'+ICON_COLOR[ik]+'">'+IN[ik]+'</svg>'}

/* ---------- PRODUCT PICTURE ----------
   Shows /images/<img>.jpg if the product has an "img" in data.js.
   It also tries .webp, .png and .jpeg. If no file exists yet it
   quietly falls back to the product icon.                        */
var IMG_EXT=["jpg","webp","png","jpeg"];
function imgFail(el){
  var n=(+el.getAttribute("data-n")||0)+1;
  if(n<IMG_EXT.length){el.setAttribute("data-n",n);el.src=el.src.replace(/\.[a-z]+$/,"."+IMG_EXT[n])}
  else el.outerHTML=ICON[el.getAttribute("data-i")]||ICON.box;
}
function pic(x){
  if(!x.img)return ICON[x.i||"box"];
  return '<img src="'+BASE+'images/'+x.img+'.jpg" alt="'+esc(x.n)+'" loading="lazy" data-i="'+(x.i||"box")+'" onerror="imgFail(this)">';
}

/* ---------- MONEY ---------- */
/* All prices are shown in Naira (NGN) only. */
function ngn(n){return "₦"+Math.round(n).toLocaleString("en-NG")}
function fmt(n){return ngn(n)}

/* ---------- LOOKUPS ---------- */
function isKit(k){return String(k).indexOf("kit-")==0}
function find(id){
  var k=KITS.filter(function(x){return x.id==id})[0];
  if(k)return k;
  return P.filter(function(x){return x.id==id})[0];
}
/* cart keys:  "5" = product 5 device only,  "5i" = product 5 + installation,  "kit-1" = a starter kit */
function line(k){
  k=String(k);
  var inst=!isKit(k)&&k.slice(-1)=="i",x=find(inst?k.slice(0,-1):k);
  if(!x)return{x:null};
  return{x:x,n:x.n+(inst?" + installation":""),p:x.p+(inst?x.inst:0)};
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}
function wa(t){return "https://wa.me/"+STORE.whatsapp+"?text="+encodeURIComponent(t)}
function eta(){var d=new Date(),n=0;while(n<STORE.deliveryDays){d.setDate(d.getDate()+1);if(d.getDay()!=0)n++}return d.toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
function productUrl(id){return BASE+"product.html?id="+id}
function categoryUrl(slug){return BASE+"categories/"+slug+".html"}

/* ---------- CART + WISHLIST (saved in the browser) ---------- */
var cart={},wish={};
function save(){try{localStorage.setItem("ss_cart",JSON.stringify(cart));localStorage.setItem("ss_wish",JSON.stringify(wish))}catch(e){}}
function load(){
  try{
    var c=JSON.parse(localStorage.getItem("ss_cart")||"{}"),w=JSON.parse(localStorage.getItem("ss_wish")||"{}");
    for(var k in c)if(line(k).x&&c[k]>0)cart[k]=c[k];
    for(var j in w)if(find(j)&&w[j])wish[j]=true;
  }catch(e){}
}
function count(){var n=0;for(var k in cart)n+=cart[k];return n}
function tot(){var t=0;for(var k in cart)t+=line(k).p*cart[k];return t}
function delivery(sub){return sub>=STORE.freeDeliveryOver?0:STORE.deliveryFeeLagos}
/* updates the little number on the cart icon and saves the cart */
function renderCart(){
  var n=count();
  $("count").textContent=n;
  $("count").style.display=n?"block":"none";
  $("open").setAttribute("aria-label","Cart, "+n+" item"+(n==1?"":"s"));
  save();
}

/* ---------- TOAST ---------- */
var tt=null;
function toast(msg){
  var el=$("toast");
  el.innerHTML='<span>'+msg+'</span><a href="'+BASE+'cart.html">View cart</a>';
  el.classList.add("on");
  clearTimeout(tt);
  tt=setTimeout(function(){el.classList.remove("on")},3500);
}

/* ---------- PRODUCT CARDS (used by shop, categories, home, product pages) ---------- */
function card(x){
  return '<article class="card">'+
    '<a class="pic" href="'+productUrl(x.id)+'" aria-label="View '+esc(x.n)+'">'+
      '<span class="cat-pill">'+x.c+'</span>'+
      (x.inst>0?'<span class="inst-badge">Installation available</span>':'')+
      ((x.old||x.sale)?'<span class="sale-badge">SALE</span>':'')+
      pic(x)+
    '</a>'+
    '<div class="body">'+
      '<p class="card-brand">'+x.b+'</p>'+
      '<h3><a href="'+productUrl(x.id)+'">'+x.n+'</a></h3>'+
      '<p class="spec">'+x.s+'</p>'+
      '<div class="row">'+
        '<div class="price-wrap"><span class="price-main">'+fmt(x.p)+(x.old?'<s class="price-was">'+fmt(x.old)+'</s>':'')+'</span></div>'+
        '<button class="add" data-add="'+x.id+'">Add to cart</button>'+
      '</div>'+
    '</div>'+
  '</article>';
}
function cards(list){
  if(!list.length)return '<p class="none">No products match your search.</p>';
  return list.map(card).join("");
}

/* ---------- STATIC-PAGE HELPERS ----------
   Lets plain HTML pages (about, contact, policies) pull values from STORE:
   data-wa="message" -> WhatsApp link   data-ig -> Instagram link
   data-mailto -> email link            data-store="email" -> shows the value
   data-today -> today's date                                          */
function applyStore(){
  document.querySelectorAll("[data-wa]").forEach(function(a){a.href=wa(a.getAttribute("data-wa"))});
  document.querySelectorAll("[data-ig]").forEach(function(a){a.href=STORE.instagram});
  document.querySelectorAll("[data-mailto]").forEach(function(a){a.href="mailto:"+STORE.email});
  document.querySelectorAll("[data-store]").forEach(function(el){el.textContent=STORE[el.getAttribute("data-store")]||el.getAttribute("data-empty")||""});
  document.querySelectorAll("[data-today]").forEach(function(el){el.textContent=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"})});
}

/* ---------- GLOBAL "ADD TO CART" BUTTONS ---------- */
document.addEventListener("click",function(e){
  var t=e.target,b=t.closest?t.closest("button"):null;
  if(b&&b.dataset.add){
    var id=b.dataset.add;
    cart[id]=(cart[id]||0)+1;
    renderCart();
    toast(find(id).n+" added to cart");
    if(!isKit(id)){b.textContent="Added ✓";setTimeout(function(){b.textContent="Add to cart"},1100)}
  }
});

/* ---------- START UP ---------- */
(function(){
  load();
  renderCart();
  applyStore();
})();
