/* =====================================================================
   shop.js  -  the Shop page (shop.html) AND every category page.
   A category page just sets  <body data-group="smart-security">  and
   this file does the rest.  No data-group = the full shop.
   ===================================================================== */
(function(){
var slug=document.body.getAttribute("data-group")||"";
var grp=slug?groupOf(slug):null;
var cur="All",query="",sub="All",sort="feat",page=1;
var PER=STORE.perPage||16;
var filt={min:"",max:"",inst:false};
var SORTS=[["feat","Featured"],["price-asc","Price: low to high"],["price-desc","Price: high to low"],["new","Newest first"]];

/* ---------- helpers ---------- */
function passFilt(x){return(filt.min===""||x.p>=Number(filt.min))&&(filt.max===""||x.p<=Number(filt.max))&&(!filt.inst||x.inst>0)}
function fCount(){return(filt.min!==""?1:0)+(filt.max!==""?1:0)+(filt.inst?1:0)}
function filterBtn(){
  var c=fCount();
  return '<button class="filterbtn" id="filterbtn" aria-haspopup="dialog">'+
    '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>'+
    'Filter'+(c?'<span class="fbadge">'+c+'</span>':'')+'</button>';
}
function sortList(list,key){
  var l=list.slice();
  if(key=="price-asc")l.sort(function(a,b){return a.p-b.p});
  else if(key=="price-desc")l.sort(function(a,b){return b.p-a.p});
  else if(key=="new")l.sort(function(a,b){return b.id-a.id});
  return l;
}
function sortOpts(sel){return SORTS.map(function(o){return '<option value="'+o[0]+'"'+(sel==o[0]?" selected":"")+'>'+o[1]+'</option>'}).join("")}

/* ---------- pagination ---------- */
function pageSlice(list){
  var pages=Math.max(1,Math.ceil(list.length/PER));
  if(page>pages)page=pages;if(page<1)page=1;
  return list.slice((page-1)*PER,page*PER);
}
function pager(total){
  var pages=Math.ceil(total/PER);if(pages<2)return '';
  var nums=[],last=0;
  for(var i=1;i<=pages;i++){
    if(pages<=7||i==1||i==pages||Math.abs(i-page)<=1){if(last&&i-last>1)nums.push('<span class="pg-dots">…</span>');nums.push('<button data-pg="'+i+'"'+(i==page?' class="on" aria-current="page"':'')+' aria-label="Page '+i+'">'+i+'</button>');last=i}
  }
  return '<nav class="pager" aria-label="Pages">'+
    '<button class="pg-nav" data-pg="prev"'+(page==1?' style="visibility:hidden"':'')+'>‹ Prev</button>'+
    '<div class="pg-nums">'+nums.join("")+'</div>'+
    '<button class="pg-nav" data-pg="next"'+(page==pages?' style="visibility:hidden"':'')+'>Next ›</button></nav>';
}
function syncUrl(){try{var u=new URL(location.href);if(page>1)u.searchParams.set("page",page);else u.searchParams.delete("page");history.replaceState(null,"",u)}catch(e){}}

/* ---------- page render ---------- */
function render(){
  var html;
  if(grp){
    var inGroup=P.filter(function(x){return x.g==slug});
    var all=sortList(inGroup.filter(function(x){return(sub=="All"||x.sub==sub)&&passFilt(x)}),sort);
    var list=pageSlice(all);
    html='<section><div class="wrap">'+
      '<nav class="crumbs" aria-label="Breadcrumb"><a href="'+BASE+'index.html">Home</a><span class="sep" aria-hidden="true">›</span><a href="'+BASE+'shop.html">Shop</a><span class="sep" aria-hidden="true">›</span><span aria-current="page">'+grp.name+'</span></nav>'+
      '<div class="grouphead"><h2>'+grp.name+'</h2><div class="ghright">'+filterBtn()+'<label class="sortrow">Sort by <select id="sortsel" aria-label="Sort products">'+sortOpts(sort)+'</select></label></div></div>'+
      '<div class="grid">'+(list.length?cards(list):'<p class="none">'+(inGroup.length?'No products match these filters.':'Products for this category are coming soon.')+'</p>')+'</div>'+pager(all.length)+
    '</div></section>';
  }else{
    var all=P.filter(function(x){return(cur=="All"||x.c==cur)&&passFilt(x)&&(x.n+" "+x.c+" "+x.sub+" "+x.s).toLowerCase().indexOf(query)>=0});
    var l=pageSlice(all);
    html='<section><div class="wrap"><div class="grouphead"><h2>Shop</h2><div class="ghright">'+filterBtn()+'</div></div><div class="grid">'+cards(l)+'</div>'+pager(all.length)+'<div class="kit" id="kitbox">'+kitHtml()+'</div></div></section>';
  }
  $("view").innerHTML=html;
  syncUrl();
  if(!grp)initKit();
}
if(!grp)window.onSearch=function(v){query=v;page=1;render()};

/* ---------- starter-kit rotator ---------- */
var kitIdx=0,kitTimer=null;
function kitHtml(){
  return KITS.map(function(k,i){
    return '<div class="kit-slide '+k.theme+(i===0?' active':'')+'">'+
      '<div><p class="kit-tag">'+k.tag+'</p><h2>'+k.n+'</h2><p>'+k.desc+'</p></div>'+
      '<button class="btn kit-btn" data-add="'+k.id+'">Add kit · '+fmt(k.p)+'</button>'+
    '</div>';
  }).join('')+
  '<div class="kit-dots">'+KITS.map(function(_,i){return '<span'+(i===0?' class="on"':'')+'></span>'}).join('')+'</div>';
}
function goKit(i){
  var wrap=$('kitbox');if(!wrap)return;
  var slides=wrap.querySelectorAll('.kit-slide'),dots=wrap.querySelectorAll('.kit-dots span');
  slides.forEach(function(s){s.classList.remove('active')});
  dots.forEach(function(d){d.classList.remove('on')});
  kitIdx=(i+KITS.length)%KITS.length;
  if(slides[kitIdx])slides[kitIdx].classList.add('active');
  if(dots[kitIdx])dots[kitIdx].classList.add('on');
}
function startKitTimer(){clearInterval(kitTimer);kitTimer=setInterval(function(){goKit(kitIdx+1)},4500)}
function initKit(){
  var wrap=$('kitbox');if(!wrap)return;
  kitIdx=0;
  wrap.querySelectorAll('.kit-dots span').forEach(function(dot,i){dot.addEventListener('click',function(){goKit(i);startKitTimer()})});
  startKitTimer();
}

/* ---------- filter panel ---------- */
document.body.insertAdjacentHTML("beforeend",
  '<div id="fveil"></div>'+
  '<aside id="fpanel" aria-label="Filter products" aria-hidden="true">'+
    '<div class="fh"><h2>Filter products</h2><button class="fpclose" id="fclose" aria-label="Close filters">×</button></div>'+
    '<div class="fbody" id="fbody"></div>'+
    '<div class="ffoot"><button class="ffoot-clear" id="fclear">Clear all</button><button class="ffoot-apply" id="fdone">Show results</button></div>'+
  '</aside>');

function catSection(){
  var rows;
  if(grp){
    var stocked={};
    P.filter(function(x){return x.g==slug}).forEach(function(x){stocked[x.sub]=true});
    rows=['<label class="fopt"><input type="radio" name="fcat" value="All"'+(sub=="All"?" checked":"")+'><span>All subcategories</span></label>'].concat(grp.subs.map(function(sn){
      return stocked[sn]
        ?'<label class="fopt"><input type="radio" name="fcat" value="'+esc(sn)+'"'+(sub==sn?" checked":"")+'><span>'+sn+'</span></label>'
        :'<label class="fopt soon"><input type="radio" disabled><span>'+sn+'</span><span class="soonlbl">Soon</span></label>';
    }));
    return '<div class="fsec"><h3>Subcategory</h3>'+rows.join("")+'</div>';
  }
  var stockedG={};P.forEach(function(x){stockedG[x.g]=true});
  rows=['<label class="fopt"><input type="radio" name="fcat" value="All"'+(cur=="All"?" checked":"")+'><span>All categories</span></label>'].concat(GROUPS.map(function(g){
    return stockedG[g.slug]
      ?'<label class="fopt"><input type="radio" name="fcat" value="'+esc(g.name)+'"'+(cur==g.name?" checked":"")+'><span>'+g.name+'</span></label>'
      :'<label class="fopt soon"><input type="radio" disabled><span>'+g.name+'</span><span class="soonlbl">Soon</span></label>';
  }));
  return '<div class="fsec"><h3>Category</h3>'+rows.join("")+'</div>';
}
function renderFilterBody(){
  $("fbody").innerHTML=catSection()+
    '<div class="fsec"><h3>Price range</h3><div class="frange">'+
      '<input type="number" id="fmin" placeholder="₦ Min" min="0" value="'+esc(filt.min)+'"><span>—</span>'+
      '<input type="number" id="fmax" placeholder="₦ Max" min="0" value="'+esc(filt.max)+'">'+
    '</div></div>'+
    '<div class="fsec"><h3>Installation</h3><label class="fopt"><input type="checkbox" id="finst"'+(filt.inst?" checked":"")+'><span>Products with installation available</span></label></div>';
}
function openFilterPanel(){renderFilterBody();$("fpanel").classList.add("open");$("fveil").classList.add("on");$("fpanel").setAttribute("aria-hidden","false")}
function closeFilterPanel(){$("fpanel").classList.remove("open");$("fveil").classList.remove("on");$("fpanel").setAttribute("aria-hidden","true")}

document.addEventListener("click",function(e){
  var t=e.target,b=t.closest?t.closest("button"):null;
  if(b&&b.dataset.pg){
    var v=b.dataset.pg;page=v=="prev"?page-1:v=="next"?page+1:+v;
    render();
    var gh=document.querySelector(".grouphead");if(gh&&gh.scrollIntoView)gh.scrollIntoView();
  }
  if(b&&b.id=="filterbtn")openFilterPanel();
  if(b&&(b.id=="fclose"||b.id=="fdone"))closeFilterPanel();
  if(t.id=="fveil")closeFilterPanel();
  if(b&&b.id=="fclear"){page=1;filt={min:"",max:"",inst:false};if(grp)sub="All";else cur="All";render();renderFilterBody()}
});
document.addEventListener("keydown",function(e){if(e.key=="Escape")closeFilterPanel()});
document.addEventListener("change",function(e){
  var t=e.target;if(!t)return;
  if(t.id=="sortsel"){sort=t.value;page=1;render()}
  if(t.name=="fcat"){if(grp)sub=t.value;else cur=t.value;page=1;render()}
  if(t.id=="finst"){filt.inst=t.checked;page=1;render()}
});
document.addEventListener("input",function(e){
  var t=e.target;if(!t)return;
  if(t.id=="fmin"){filt.min=t.value;page=1;render()}
  if(t.id=="fmax"){filt.max=t.value;page=1;render()}
});

/* ---------- start ---------- */
var pp=parseInt(new URLSearchParams(location.search).get("page"),10);if(pp>0)page=pp;
if(!grp){
  var qp=new URLSearchParams(location.search).get("q");
  if(qp){query=qp.toLowerCase();window.openSearch(qp)}
}
render();
})();
