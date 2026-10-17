/* =====================================================================
   product.js  -  the single product page.
   product.html?id=5 shows product 5 from data.js.
   ===================================================================== */
(function(){
var id=new URLSearchParams(location.search).get("id");
var x=id&&!isKit(id)?find(id):null;
if(!x){location.replace(BASE+"shop.html");return}
var pdp={opt:0,qty:1,v:0};
var VIEWS=["Front","Close-up","Installed","In the box"];

function views(){return x.img?["Photo"]:VIEWS}
function gal(x,v){
  if(x.img)return pic(x);
  var g=IN[x.i],c='style="color:'+ICON_COLOR[x.i]+'"';
  if(v==1)return '<svg viewBox="12 14 40 40" '+ST+' aria-hidden="true" '+c+'>'+g+'</svg>';
  if(v==2)return '<svg viewBox="0 0 64 64" '+ST+' aria-hidden="true" '+c+'><rect width="64" height="64" fill="#e9e7df" stroke="none"/><path d="M0 50H64" stroke="#bdb9ab" stroke-width="1"/><rect x="42" y="12" width="16" height="38" fill="#f3f1ea" stroke="#bdb9ab" stroke-width="1"/><g transform="translate(6 12) scale(.52)">'+g+'</g></svg>';
  if(v==3)return '<svg viewBox="0 0 64 64" '+ST+' aria-hidden="true" '+c+'><path d="M12 36l-6-8M52 36l6-8" stroke-width="1.5"/><g transform="translate(18 6) scale(.44)">'+g+'</g><rect x="12" y="36" width="40" height="22" fill="#f6f6f3" stroke-width="1.5"/><path d="M26 47h12" stroke-width="1.5"/></svg>';
  return '<svg viewBox="0 0 64 64" '+ST+' '+c+'>'+g+'</svg>';
}

function product(x){
  var hasInst=x.inst>0;
  var heart='<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-9-9a4.8 4.8 0 019-2.6A4.8 4.8 0 0121 11c-2 4.6-9 9-9 9z"/></svg>';
  var rel=P.filter(function(y){return y.c==x.c&&y.id!=x.id}).concat(P.filter(function(y){return y.c!=x.c})).slice(0,4);
  return '<section class="pdp"><div class="wrap">'+
    '<nav class="crumbs" aria-label="Breadcrumb"><a href="'+BASE+'index.html">Home</a><span class="sep" aria-hidden="true">›</span><a href="'+BASE+'shop.html">Shop</a><span class="sep" aria-hidden="true">›</span><a href="'+categoryUrl(x.g)+'">'+x.c+'</a><span class="sep" aria-hidden="true">›</span><span aria-current="page">'+x.n+'</span></nav>'+
    '<div class="pgrid">'+
      '<div class="gallery"><div class="thumbs" role="group" aria-label="Product views">'+views().map(function(v,i){return '<button class="th" data-v="'+i+'" aria-pressed="false" aria-label="'+v+' view">'+gal(x,i)+'</button>'}).join("")+'</div><div class="stage" id="stage"></div></div>'+
      '<div class="panel">'+
        '<p class="brand">'+x.b+'</p><h1>'+x.n+'</h1><p class="price" id="pp"></p>'+
        (hasInst?'<div class="oh"><span>Choose an option</span><button class="lnk" data-jump="info">View full specs</button></div><div class="opts" role="radiogroup" aria-label="Option"><button class="op" role="radio" data-opt="0"><span>Device only</span><span>'+fmt(x.p)+'</span></button><button class="op" role="radio" data-opt="1"><span>Device + installation</span><span>+'+fmt(x.inst)+'</span></button></div>':'<div class="oh"><span>'+x.s+'</span><button class="lnk" data-jump="info">View full specs</button></div>')+
        '<div class="qrow"><span>Quantity</span><span class="qty"><button data-q="-1" aria-label="Fewer">−</button><span id="pq" aria-live="polite">1</span><button data-q="1" aria-label="More">+</button></span></div>'+
        '<div class="buy"><button class="btn dk" id="pdpAdd">Add to cart</button><button class="heart" id="wish" aria-pressed="false" aria-label="Save to wishlist">'+heart+'</button></div>'+
        '<p class="eta">Delivery from <b>'+eta()+'</b></p>'+
        '<p class="help"><a target="_blank" rel="noopener" href="'+wa("Hello Secure Sight Home Autos, I have a question about the "+x.n+" ("+x.code+").")+'">Not sure it fits? Ask us on WhatsApp first</a></p>'+
        '<ul class="checks"><li>Free Lagos delivery on orders over '+fmt(STORE.freeDeliveryOver)+'</li><li>'+STORE.warrantyMonths+'-month warranty</li><li>'+STORE.returnDays+'-day returns on unused items</li></ul>'+
        '<button class="more-link" data-jump="info">Find out more ↓</button>'+
      '</div>'+
    '</div>'+
    '<div class="info" id="info">'+
      '<details open><summary>Details and specs</summary><div class="in">'+
        '<p><span class="k">Description:</span> '+x.d+'</p>'+
        '<table class="sp"><tbody>'+x.sp.map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>'}).join("")+'</tbody></table>'+
        (x.box?'<p><span class="k">In the box:</span> '+x.box+'</p>':'')+
        '<p><span class="k">Warranty:</span> '+STORE.warrantyMonths+' months against manufacturing faults.</p>'+
        '<p class="code">Product code: '+x.code+'</p>'+
      '</div></details>'+
      '<div><details open><summary>Delivery and returns</summary><div class="in">'+
        '<p class="k">Lagos delivery</p><p>From <b>'+eta()+'</b> · '+fmt(STORE.deliveryFeeLagos)+'<br><span class="gy">Free when you spend '+fmt(STORE.freeDeliveryOver)+' or more</span></p>'+
        '<p class="k">Outside Lagos</p><p>We confirm the fee on WhatsApp after you order.</p>'+
        (hasInst?'<p class="k">Installation</p><p>Our technician contacts you after delivery to book a time.</p>':'')+
        '<p>Not for you? Return it unused in its original packaging within '+STORE.returnDays+' days.</p>'+
      '</div></details>'+
      '<details class="why"><summary>Why buy from us</summary><div class="in"><p>We only sell products we install ourselves, so we can tell you honestly what works in your space. We stay on WhatsApp for setup questions after you buy.</p></div></details></div>'+
    '</div>'+
    '<div class="rel"><h2>You may also like</h2><div class="grid">'+cards(rel)+'</div></div>'+
  '</div></section>';
}

function pdpUpdate(){
  if(!$("pp"))return;
  $("pp").innerHTML=fmt(x.p+(pdp.opt?x.inst:0))+(x.old?' <s class="was">'+fmt(x.old+(pdp.opt?x.inst:0))+'</s>':'');
  document.querySelectorAll("[data-opt]").forEach(function(b){b.setAttribute("aria-checked",b.dataset.opt==pdp.opt)});
  document.querySelectorAll("[data-v]").forEach(function(b){b.setAttribute("aria-pressed",b.dataset.v==pdp.v)});
  $("stage").innerHTML=gal(x,pdp.v)+(x.img?'':'<span class="lbl">'+VIEWS[pdp.v]+' view</span>');
  $("pq").textContent=pdp.qty;
  $("wish").setAttribute("aria-pressed",!!wish[x.id]);
  $("wish").setAttribute("aria-label",wish[x.id]?"Remove from wishlist":"Save to wishlist");
}
function draw(){$("view").innerHTML=product(x);pdpUpdate()}

document.title=x.n+" | Secure Sight Home Autos";
var md=document.querySelector('meta[name="description"]');if(md)md.setAttribute("content",x.d);

document.addEventListener("click",function(e){
  var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
  var d=b.dataset;
  if(d.opt!=null){pdp.opt=+d.opt;pdpUpdate()}
  if(d.q){pdp.qty=Math.min(20,Math.max(1,pdp.qty+(+d.q)));pdpUpdate()}
  if(d.v!=null){pdp.v=+d.v;pdpUpdate()}
  if(d.jump){var el=$(d.jump);if(el)el.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"})}
  if(b.id=="pdpAdd"){var k=x.id+(pdp.opt?"i":"");cart[k]=(cart[k]||0)+pdp.qty;renderCart();toast(pdp.qty+" × "+line(k).n+" added to cart");b.textContent="Added ✓";setTimeout(function(){b.textContent="Add to cart"},1100)}
  if(b.id=="wish"){if(wish[x.id])delete wish[x.id];else wish[x.id]=true;save();pdpUpdate()}
});

draw();
})();
