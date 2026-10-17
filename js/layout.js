/* =====================================================================
   layout.js  -  builds the shared HEADER and FOOTER on every page.
   Edit a menu link or footer text here ONCE and every page updates.
   Each page must have:  <div id="site-header"></div>  and
   <div id="site-footer"></div>, and  <html data-base="">  (use "../"
   for pages inside the categories/ or policies/ folders).
   ===================================================================== */
(function(){
var BASE=document.documentElement.getAttribute("data-base")||"";
var PAGE=document.body.getAttribute("data-page")||"";
var NAVON=(PAGE=="product"||PAGE=="group")?"shop":PAGE;
window.BASE=BASE;
function g(i){return document.getElementById(i)}
function on(p){return NAVON==p?' class="on"':''}

var ICON_WA='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-1s-.5-.1-.7.1-.8 1-.9 1.1-.4.1-.6 0a7.6 7.6 0 01-3.8-3.3c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5s-.7-1.7-1-2.3c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4C7 7.4 6 8.4 6 10.4s1.5 3.8 1.7 4c.2.3 2.9 4.5 7.1 6.3 4.2 1.7 4.2 1.1 5 1.1.7 0 2.3-1 2.6-1.9s.3-1.7.2-1.9c-.1-.2-.4-.3-.7-.4z" fill="currentColor"/><path d="M20.5 3.5A12 12 0 003.5 20.5L2 22l1.5-1.5A12 12 0 1020.5 3.5z" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>';
var ICON_IG='<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>';

/* ---------- HEADER ---------- */
var shopMenu=GROUPS.map(function(x){return '<a href="'+BASE+'categories/'+x.slug+'.html"><svg viewBox="0 0 24 24" aria-hidden="true">'+x.icon+'</svg><span>'+x.name+'</span></a>'}).join("");
var headerHTML=
'<header>'+
  '<div class="wrap">'+
    '<div class="hdr-left"><a class="hdr-brand" href="'+BASE+'index.html" aria-label="Secure Sight Home Autos">Secure Sight<span>Home Autos</span></a>'+
    '<nav aria-label="Main">'+
      '<a href="'+BASE+'index.html" data-p="home"'+(NAVON=="home"?' class="on"':'')+'>Home</a>'+
      '<span class="navdd" id="shopdd">'+
        '<a href="'+BASE+'shop.html" data-p="shop" id="shopa"'+(NAVON=="shop"?' class="on"':'')+' aria-haspopup="true" aria-expanded="false" aria-controls="shopm">Shop</a>'+
        '<div class="navm" id="shopm" role="menu" aria-label="Shop by category">'+shopMenu+'</div>'+
      '</span>'+
      '<a href="'+BASE+'about.html" data-p="about"'+on("about")+'>About</a>'+
      '<a href="'+BASE+'contact.html" data-p="contact"'+on("contact")+'>Contact</a>'+
    '</nav></div>'+
    '<div class="tools">'+
      '<span class="cur" title="All prices are in Nigerian Naira"><span class="flag" aria-hidden="true"></span>NGN</span>'+
      '<button class="ib" id="sb" aria-label="Search"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button>'+
      '<a class="ib" href="'+BASE+'cart.html" id="open" aria-label="Cart"><svg viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="13" rx="3"/><path d="M8 8V6a4 4 0 018 0v2"/></svg><span class="badge" id="count">0</span></a>'+
    '</div>'+
  '</div>'+
  '<div id="sbar"><div class="wrap"><input id="q" type="search" placeholder="Search products…" aria-label="Search products"><button class="sx" id="sx" aria-label="Close search">×</button></div></div>'+
'</header>';

/* ---------- FOOTER ---------- */
function fl(href,label){return '<a href="'+BASE+href+'">'+label+'</a>'}
var footerHTML=
'<footer>'+
  '<div class="wrap">'+
    '<div class="ft-main">'+
      '<div class="ft-brand">'+
        '<p class="ft-logo">Secure Sight<span>Home Autos</span></p>'+
        '<p class="ft-tagline">Smart security and home automation for Nigerian homes and businesses. Supplied, installed and supported.</p>'+
      '</div>'+
      '<div class="ft-col"><h4>Company</h4>'+fl("about.html","About us")+fl("contact.html","Contact us")+fl("contact.html","Get directions")+'</div>'+
      '<div class="ft-col"><h4>Help</h4>'+fl("policies/shipping.html","Shipping policy")+fl("policies/refund.html","Refund policy")+fl("policies/refund.html","Returns &amp; warranty")+fl("contact.html","Installation help")+'</div>'+
      '<div class="ft-col"><h4>Legal</h4>'+fl("policies/privacy.html","Privacy policy")+fl("policies/terms.html","Terms of service")+'</div>'+
      '<div class="ft-news"><h4>Stay in the loop</h4><p>New arrivals and home security tips, straight to your inbox.</p>'+
        '<div class="ft-news-form"><input class="ft-news-input" id="ft-em" type="email" placeholder="Your email address" aria-label="Email address"><button class="ft-news-btn" id="ft-join">Subscribe</button></div>'+
        '<p class="ft-news-msg" id="ft-jm"></p></div>'+
    '</div>'+
    '<div class="ft-bottom">'+
      '<p class="ft-copy">© <span id="yr">'+new Date().getFullYear()+'</span> Secure Sight Home Autos. All rights reserved.</p>'+
      '<div class="ft-socials">'+
        '<a class="ft-soc" data-ig href="#" target="_blank" rel="noopener" aria-label="Instagram">'+ICON_IG+'</a>'+
        '<a class="ft-soc" data-wa="Hello Secure Sight Home Autos" href="#" target="_blank" rel="noopener" aria-label="WhatsApp">'+ICON_WA+'</a>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</footer>'+
'<div id="toast" role="status" aria-live="polite"></div>';

/* ---------- INSERT INTO THE PAGE ---------- */
function put(id,html,where){
  var el=g(id);
  if(el)el.outerHTML=html;
  else document.body.insertAdjacentHTML(where,html);
}
put("site-header",headerHTML,"afterbegin");
put("site-footer",footerHTML,"beforeend");

/* ---------- SHOP DROPDOWN ---------- */
var dd=g("shopdd"),sa=g("shopa"),ddTimer=null;
function openShopMenu(){clearTimeout(ddTimer);dd.classList.add("open");sa.setAttribute("aria-expanded","true")}
function closeShopMenu(){clearTimeout(ddTimer);dd.classList.remove("open");sa.setAttribute("aria-expanded","false")}
dd.addEventListener("mouseenter",openShopMenu);
dd.addEventListener("mouseleave",function(){clearTimeout(ddTimer);ddTimer=setTimeout(closeShopMenu,2000)});

/* ---------- SEARCH ----------
   On the Shop page typing filters live (shop.js sets window.onSearch).
   On any other page, press Enter to jump to the Shop page with results. */
var sbar=g("sbar"),q=g("q");
function closeSearch(){
  sbar.classList.remove("on");
  var had=q.value!=="";
  q.value="";
  if(had&&window.onSearch)window.onSearch("");
  g("sb").focus();
}
window.openSearch=function(v){sbar.classList.add("on");q.value=v||"";if(!v)q.focus()};
q.addEventListener("input",function(){if(window.onSearch)window.onSearch(this.value.toLowerCase())});
q.addEventListener("keydown",function(e){
  if(e.key=="Escape")closeSearch();
  if(e.key=="Enter"&&!window.onSearch){var v=q.value.trim();if(v)location.href=BASE+"shop.html?q="+encodeURIComponent(v)}
});

document.addEventListener("click",function(e){
  var t=e.target,b=t.closest?t.closest("button,a"):null;
  if(b&&b.id=="sb"){sbar.classList.toggle("on");if(sbar.classList.contains("on"))q.focus();else closeSearch()}
  if(b&&b.id=="sx")closeSearch();
  if(b&&b.id=="shopa"&&matchMedia("(max-width:860px)").matches){e.preventDefault();var o=!dd.classList.contains("open");dd.classList.toggle("open",o);b.setAttribute("aria-expanded",o)}
  if(b&&b.closest("#shopm"))closeShopMenu();
  if(!t.closest("#shopdd"))closeShopMenu();
  if(b&&b.id=="ft-join"){var fv=g("ft-em").value.trim();g("ft-jm").textContent=fv.indexOf("@")>0?"You're on the list! (demo — nothing was saved).":"Enter a valid email address."}
});
document.addEventListener("keydown",function(e){if(e.key=="Escape")closeShopMenu()});
})();
