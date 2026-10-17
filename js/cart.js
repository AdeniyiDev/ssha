/* =====================================================================
   cart.js  -  the Cart page (cart.html) and the Checkout page
   (checkout.html). The page is chosen by <body data-page="cart|checkout">.
   Checkout sends the order to your WhatsApp - no payment is taken.
   ===================================================================== */
(function(){
var PG=document.body.getAttribute("data-page");
var finished=false;

function emptyCart(){
  return '<section><div class="wrap"><div class="emptyc">'+
    '<div class="empty-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="8" width="16" height="13" rx="3"/><path d="M8 8V6a4 4 0 018 0v2"/></svg></div>'+
    '<h1>Your cart is empty</h1>'+
    '<p>You haven\'t added anything yet. Browse the shop to find cameras, smart locks, lighting and more.</p>'+
    '<a class="btn dk" href="'+BASE+'shop.html">Browse the shop</a>'+
  '</div></div></section>';
}
function lineHtml(k){
  var l=line(k),x=l.x,inst=!isKit(k)&&k.slice(-1)=="i";
  var href=isKit(k)?BASE+"shop.html":productUrl(x.id);
  var opt=isKit(k)?"Bundle":inst?"Device + installation":x.inst?"Device only":x.c;
  var rmIcon='<svg viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>';
  return '<div class="ln">'+
    '<a class="pic" href="'+href+'" aria-label="View '+esc(x.n)+'">'+pic(x)+'</a>'+
    '<div class="ln-info"><h3><a href="'+href+'">'+x.n+'</a></h3><p class="meta">'+opt+'</p></div>'+
    '<div class="ln-qty"><span class="qty"><button data-m="'+k+'" aria-label="Fewer">−</button><span>'+cart[k]+'</span><button data-pl="'+k+'" aria-label="More">+</button></span></div>'+
    '<div class="ln-price">'+fmt(l.p*cart[k])+'</div>'+
    '<div class="ln-rm"><button class="rm" data-rm="'+k+'" aria-label="Remove '+esc(x.n)+'">'+rmIcon+'</button></div>'+
  '</div>';
}
function summary(withItems,actions){
  var sub=tot(),del=delivery(sub),isFree=del===0;
  var itemRows=withItems?'<div class="sum-items">'+Object.keys(cart).map(function(k){var l=line(k);return '<div class="sum-item"><span>'+cart[k]+' × '+l.n+'</span><span>'+fmt(l.p*cart[k])+'</span></div>'}).join("")+'</div><hr class="sum-divider">':'';
  return '<aside class="sum">'+
    '<p class="sum-title">Order summary</p>'+
    itemRows+
    '<div class="sr"><span>Subtotal</span><span>'+fmt(sub)+'</span></div>'+
    '<div class="sr"><span>Lagos delivery</span><span>'+(isFree?'<span class="free-badge">Free</span>':fmt(del))+'</span></div>'+
    (del?'<p class="nudge">Spend '+fmt(STORE.freeDeliveryOver-sub)+' more to get free Lagos delivery.</p>':'')+
    '<p class="nudge">Outside Lagos — we confirm the fee on WhatsApp.</p>'+
    '<div class="sr tt"><span>Total</span><span>'+fmt(sub+del)+'</span></div>'+
    '<div class="sum-actions">'+actions+'</div>'+
  '</aside>';
}
function cartPage(){
  var ids=Object.keys(cart),n=count();
  return '<section class="cartpg"><div class="wrap">'+
    '<div class="cart-header"><h1>Your cart</h1><p>'+n+' item'+(n==1?'':'s')+' in your bag</p></div>'+
    '<div class="cgrid">'+
      '<div><div class="lines"><div class="lines-head"><span></span><span>Product</span><span>Quantity</span><span>Price</span><span></span></div>'+ids.map(lineHtml).join("")+'</div></div>'+
      summary(false,'<a class="btn dk" href="'+BASE+'checkout.html">Proceed to checkout</a><a class="cont" href="'+BASE+'shop.html">← Continue shopping</a>')+
    '</div>'+
  '</div></section>';
}
function checkoutPage(){
  var waIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-1s-.5-.1-.7.1-.8 1-.9 1.1-.4.1-.6 0a7.6 7.6 0 01-3.8-3.3c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4C7 7.4 6 8.4 6 10.4s1.5 3.8 1.7 4c.2.3 2.9 4.5 7.1 6.3 4.2 1.7 4.2 1.1 5 1.1.7 0 2.3-1 2.6-1.9s.3-1.7.2-1.9c-.1-.2-.4-.3-.7-.4z" fill="currentColor"/><path d="M20.5 3.5A12 12 0 003.5 20.5L2 22l1.5-1.5A12 12 0 1020.5 3.5z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
  return '<section class="ckpg"><div class="wrap">'+
    '<a class="ck-back" href="'+BASE+'cart.html"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg> Back to cart</a>'+
    '<div class="ck-grid">'+
      '<div class="ck-form">'+
        '<h2>Delivery details</h2>'+
        '<p class="err" id="ferr" role="alert"></p>'+
        '<div class="field"><label for="nm">Full name</label><input id="nm" type="text" autocomplete="name" placeholder="e.g. Adeyemi Johnson"></div>'+
        '<div class="field"><label for="ph">Phone number</label><input id="ph" type="tel" autocomplete="tel" placeholder="e.g. 0812 345 6789"></div>'+
        '<div class="field"><label for="ad">Delivery address</label><textarea id="ad" rows="3" autocomplete="street-address" placeholder="Street, area, city"></textarea></div>'+
        '<div class="wa-note">'+waIcon+'<span>After you place your order, we\'ll send the details to WhatsApp. We\'ll confirm your delivery date and payment from there — no card needed here.</span></div>'+
      '</div>'+
      summary(true,'<button class="btn dk" id="place">Place order</button><a class="cont" href="'+BASE+'cart.html">← Back to cart</a>')+
    '</div>'+
  '</div></section>';
}
function draw(){
  if(finished)return;
  var keep={};
  ["nm","ph","ad"].forEach(function(i){var e=$(i);if(e)keep[i]=e.value});
  $("view").innerHTML=!Object.keys(cart).length?emptyCart():(PG=="cart"?cartPage():checkoutPage());
  for(var i in keep){if($(i))$(i).value=keep[i]}
}

function done(){
  var nm=$("nm").value.trim(),ph=$("ph").value.trim(),ad=$("ad").value.trim();
  if(!nm||!ph||!ad){$("ferr").textContent="Fill in your name, phone number and delivery address.";return}
  var sub=tot(),del=delivery(sub),lines=Object.keys(cart).map(function(k){return cart[k]+" x "+line(k).n}).join(", ");
  var link=wa("Hello Secure Sight Home Autos, I'd like to order: "+lines+". Subtotal "+fmt(sub)+", Lagos delivery "+(del?fmt(del):"free")+", total "+fmt(sub+del)+". Name: "+nm+", Phone: "+ph+", Address: "+ad);
  cart={};renderCart();finished=true;
  document.title="Order received | Secure Sight Home Autos";
  $("view").innerHTML='<section><div class="wrap"><div class="donepg">'+
    '<div class="done-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg></div>'+
    '<h1>Order received</h1>'+
    '<p>Thanks, '+esc(nm)+'. This is a demo so no payment was taken. Tap the button below to send your order to us on WhatsApp — we\'ll confirm delivery and payment from there.</p>'+
    '<a class="btn dk" target="_blank" rel="noopener" href="'+link+'">Send order on WhatsApp</a>'+
    '<a class="cont" href="'+BASE+'shop.html">← Back to shop</a>'+
  '</div></div></section>';
  window.scrollTo(0,0);
}

document.addEventListener("click",function(e){
  var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
  var d=b.dataset,changed=false;
  if(d.pl){cart[d.pl]=Math.min(99,cart[d.pl]+1);changed=true}
  if(d.m){cart[d.m]--;if(!cart[d.m])delete cart[d.m];changed=true}
  if(d.rm){delete cart[d.rm];changed=true}
  if(changed){renderCart();draw()}
  if(b.id=="place")done();
});

draw();
})();
