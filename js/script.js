// 필터·검색 기능 (services.js의 services 목록을 화면에 그림)
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const bullets=s=>'<ul>'+String(s||'').split('\n').map(l=>l.replace(/^•\s*/,'').trim()).filter(Boolean).map(l=>'<li>'+esc(l)+'</li>').join('')+'</ul>';
const price=s=>String(s||'').split('\n').map(l=>l.trim().startsWith('※')?'<span class="n">'+esc(l)+'</span>':'<span>'+esc(l)+'</span><br>').join('');
const cats=[...new Set(services.map(d=>d.category))];
let cat='';
const chips=document.getElementById('chips');
function mkChip(label,val,n){const b=document.createElement('button');b.className='chip';b.type='button';b.dataset.v=val;b.innerHTML=esc(label)+'<span>'+n+'</span>';b.setAttribute('aria-pressed',val===cat);b.onclick=()=>{cat=val;chips.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.v===cat));render()};chips.append(b)}
mkChip('전체','',services.length);cats.forEach(c=>mkChip(c,c,services.filter(d=>d.category===c).length));
document.getElementById('total').textContent=services.length;
document.getElementById('note').textContent=NOTE;
const grid=document.getElementById('grid');
grid.innerHTML=services.map((d,i)=>`<article class="card" data-i="${i}">
<div class="top"><span class="cat">${esc(d.category)}</span><span class="fee">${esc(d.pricing)}</span></div>
<div><h2>${esc(d.name)}</h2><p class="intro">${esc(d.desc)}</p></div>
<a class="url" href="${esc(d.url)}" target="_blank" rel="noopener">${esc(d.url.replace(/^https?:\/\//,'').replace(/\/$/,''))} ↗</a>
<div class="pc"><div class="pros"><b>장점</b>${bullets(d.pros)}</div><div class="cons"><b>단점</b>${bullets(d.cons)}</div></div>
<dl><dt>적합한 용도</dt><dd>${esc(d.use)}</dd><dt>월 가격</dt><dd class="price">${price(d.price)}</dd></dl>
</article>`).join('');
const cards=[...grid.children];
const q=document.getElementById('q'),fee=document.getElementById('fee');
function render(){
  const t=q.value.trim().toLowerCase(),f=fee.value;let n=0;
  cards.forEach(el=>{const d=services[el.dataset.i];
    const txt=(d.name+' '+d.desc+' '+d.use+' '+d.category+' '+d.pros).toLowerCase();
    const isFree=d.pricing.includes('무료');
    const ok=(!cat||d.category===cat)&&(!t||txt.includes(t))&&(!f||(f==='free'?isFree:!isFree));
    el.hidden=!ok;if(ok)n++});
  document.getElementById('count').textContent=n+'개 표시';
  document.getElementById('empty').hidden=n>0;
}
q.addEventListener('input',render);fee.addEventListener('change',render);render();
