// Build the static informational site into docs/ from data/products.json
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'products.json'), 'utf8'));

const SITE = 'https://adityatc.com';
const STORAGE = 'https://idwrhktpozhisgfisaaj.supabase.co/storage/v1/object/public/';
const WHATSAPP = '919630994103';
const PHONE = '+91 96309 94103';
const SIDDHAK = 'https://siddhak.in';

const t = v => (v && typeof v === 'object') ? (v.en || Object.values(v)[0] || '') : (v || '');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const img = p => STORAGE + encodeURI(p.path).replace(/#/g, '%23');

// Render plain-text long description (blank-line paragraphs, "- " bullets, short heading lines)
function renderDesc(text) {
  if (!text) return '';
  const blocks = text.split(/\n\s*\n/);
  let html = '';
  for (const block of blocks) {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    const bullets = lines.filter(l => l.startsWith('- '));
    if (bullets.length === lines.length) {
      html += '<ul>' + lines.map(l => `<li>${esc(l.slice(2))}</li>`).join('') + '</ul>';
    } else if (bullets.length) {
      const head = lines.filter(l => !l.startsWith('- '));
      html += head.map(l => `<p>${esc(l)}</p>`).join('');
      html += '<ul>' + bullets.map(l => `<li>${esc(l.slice(2))}</li>`).join('') + '</ul>';
    } else if (lines.length === 1 && lines[0].length <= 60 && !/[.:!?]$/.test(lines[0])) {
      html += `<h3>${esc(lines[0])}</h3>`;
    } else {
      html += `<p>${lines.map(esc).join('<br>')}</p>`;
    }
  }
  return html;
}

// Siddhak.in design tokens (siddhak-website-live src/styles/global.css, Oct 2026 black & gold)
const CSS = `
:root{
--ivory:#0c0a07;--ivory-deep:#16120b;--ink:#f3ead7;--ink-soft:#b8ac93;
--kumkum:#d4af5a;--kumkum-dark:#ecd08a;--gold:#c9a24b;--line:#332a1b;
--paper:#14100a;--well:#f4efe4;--on-gold:#171108;--wa:#1f7a4d;--wa-dark:#18643f;
--radius:14px;--radius-sm:8px;--ease:cubic-bezier(.22,1,.36,1);
--font-display:'Cormorant Garamond','Tiro Devanagari Hindi',Georgia,serif;
--font-body:'Mukta',system-ui,-apple-system,'Segoe UI',sans-serif}
*{box-sizing:border-box;margin:0;padding:0}
html{color-scheme:dark}
body{font-family:var(--font-body);background:var(--ivory);color:var(--ink);line-height:1.6;text-rendering:optimizeLegibility}
a{color:inherit;text-decoration:none;text-underline-offset:3px}
:focus-visible{outline:2px solid var(--kumkum);outline-offset:2px;border-radius:4px}
::selection{background:var(--gold);color:var(--on-gold)}
img{max-width:100%;height:auto}
h1,h2,h3{font-family:var(--font-display);font-weight:600;line-height:1.15;letter-spacing:.005em;overflow-wrap:anywhere}
.hi{font-family:'Tiro Devanagari Hindi',var(--font-display);line-height:1.35}
.wrap{max-width:1200px;margin:0 auto;padding:0 16px}
@media(min-width:768px){.wrap{padding:0 28px}}
.gold-rule{height:1px;border:0;background:linear-gradient(90deg,transparent,var(--gold) 20%,var(--gold) 80%,transparent);opacity:.55}
.eyebrow{font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:600}
header.site{background:rgb(12 10 7 / .92);backdrop-filter:blur(6px);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}
header.site .wrap{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:12px;padding-bottom:12px;flex-wrap:wrap}
.logo{font-family:var(--font-display);font-size:1.45rem;color:var(--kumkum)}
.logo small{display:block;font-family:var(--font-body);font-size:.68rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-soft);font-weight:600}
nav.cats{display:flex;gap:16px;flex-wrap:wrap;font-size:.92rem}
nav.cats a{color:var(--ink-soft);font-weight:500}
nav.cats a:hover{color:var(--kumkum-dark)}
.hero{position:relative;overflow:hidden;background:radial-gradient(120% 90% at 85% 10%,#2a1f0c 0%,#120e08 45%,var(--ivory) 100%);border-bottom:1px solid var(--line);padding:58px 0 52px;text-align:center}
.hero h1{font-size:clamp(2.2rem,5.2vw,3.6rem);line-height:1.08;letter-spacing:-.02em;padding-bottom:.08em;background:linear-gradient(180deg,#f6e3ad,#c9a24b);-webkit-background-clip:text;background-clip:text;color:transparent;margin:10px auto 0;max-width:20ch}
.hero p{max-width:640px;margin:20px auto 26px;font-size:1.1rem;color:var(--ink-soft)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:48px;padding:0 1.4rem;border-radius:999px;font-weight:600;letter-spacing:.01em;font-size:.95rem;margin:4px;border:1px solid transparent;transition:background-color .2s var(--ease),color .2s,border-color .2s;cursor:pointer}
.btn-buy{background:linear-gradient(180deg,#e2c272,#c9a24b);color:var(--on-gold)}
.btn-buy:hover{background:var(--kumkum-dark)}
.btn-ghost{background:transparent;color:var(--kumkum);border-color:var(--gold)}
.btn-ghost:hover{background:var(--gold);color:var(--on-gold)}
.btn-wa{background:var(--wa);color:#fff;border-color:var(--wa)}
.btn-wa:hover{background:var(--wa-dark)}
.btn-call{background:transparent;color:var(--kumkum);border-color:var(--gold)}
.btn-call:hover{background:var(--gold);color:var(--on-gold)}
section.cat{padding:38px 0 10px}
section.cat h2{font-size:1.75rem;color:var(--ink);margin-bottom:2px}
section.cat .count{color:var(--ink-soft);font-size:.88rem;margin-bottom:18px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:18px}
.card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:border-color .2s,transform .2s var(--ease)}
.card:hover{border-color:var(--gold);transform:translateY(-2px)}
.card .ph{aspect-ratio:1;background:var(--well);display:flex;align-items:center;justify-content:center;overflow:hidden}
.card img{width:100%;height:100%;object-fit:contain}
.card .body{padding:14px 16px 16px;display:flex;flex-direction:column;gap:6px;flex:1}
.card h3{font-size:1.14rem;line-height:1.3}
.card h3 a{color:var(--ink)}
.card .hi{color:var(--ink-soft);font-size:.88rem}
.card .desc{font-size:.86rem;color:var(--ink-soft);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;flex:1}
.card .more{font-size:.88rem;font-weight:600;color:var(--kumkum)}
.crumb{padding:16px 0 0;font-size:.88rem;color:var(--ink-soft)}
.crumb a:hover{color:var(--kumkum-dark)}
.pdp{display:grid;grid-template-columns:1fr 1fr;gap:34px;padding:24px 0}
@media(max-width:760px){.pdp{grid-template-columns:1fr}}
.gallery .main{border:1px solid var(--line);border-radius:var(--radius);background:var(--well);aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden}
.gallery .main img{width:100%;height:100%;object-fit:contain}
.thumbs{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
.thumbs a{width:64px;height:64px;border:1px solid var(--line);border-radius:10px;background:var(--well);overflow:hidden;display:block}
.thumbs a:hover{border-color:var(--gold)}
.thumbs img{width:100%;height:100%;object-fit:cover}
.pinfo h1{font-size:2rem;line-height:1.15;color:var(--ink)}
.pinfo .hi{color:var(--ink-soft);margin-bottom:12px;font-size:1.05rem}
.pinfo .short{margin:10px 0 16px;color:var(--ink-soft)}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 18px}
.chip{display:inline-flex;align-items:center;min-height:36px;padding:0 .9rem;border-radius:999px;border:1px solid var(--line);background:var(--paper);font-size:.9rem;color:var(--ink)}
.note{font-size:.85rem;color:var(--ink-soft);margin-top:10px}
.longdesc{padding:8px 0 36px;max-width:68ch}
.longdesc h3{font-size:1.35rem;margin:1.4em 0 .4em;color:var(--kumkum-dark)}
.longdesc p{margin:.6em 0;color:var(--ink-soft)}
.longdesc ul{margin:.6em 0;padding-left:1.2em;list-style:disc;color:var(--ink-soft)}
.longdesc li{margin:.25em 0}
.enquiry-label{font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:600;margin:14px 0 6px}
footer.site{background:var(--ivory-deep);color:var(--ink-soft);margin-top:44px;padding:36px 0 28px;font-size:.92rem;border-top:1px solid var(--line)}
footer.site .cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:24px}
footer.site h4{font-family:var(--font-display);font-weight:600;color:var(--kumkum);margin-bottom:8px;font-size:1.15rem}
footer.site a{color:var(--kumkum-dark)}
footer.site .fine{margin-top:22px;padding-top:14px;border-top:1px solid var(--line);color:#8d8370;font-size:.82rem}
.topbar{background:linear-gradient(180deg,#e2c272,#c9a24b);color:var(--on-gold);text-align:center;font-size:.82rem;padding:6px 10px;font-weight:600}
.topbar a{color:var(--on-gold);text-decoration:underline}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important}}
`;

const CATS_ORDER = [];
const byCat = new Map();
for (const p of products) {
  const cat = t(p.category);
  if (!byCat.has(cat)) { byCat.set(cat, { slug: p.category_slug, sort: p.category_sort, items: [] }); CATS_ORDER.push(cat); }
  byCat.get(cat).items.push(p);
}
CATS_ORDER.sort((a, b) => byCat.get(a).sort - byCat.get(b).sort);

function waLink(name) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Namaste, I would like to enquire about ' + name + ' (seen on adityatc.com).')}`;
}

function page({ title, desc, canonicalPath, ogImage, body, depth }) {
  const pre = depth ? '../' : './';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}${canonicalPath}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}">` : ''}
<meta property="og:type" content="website">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Mukta:wght@400;500;600&family=Tiro+Devanagari+Hindi&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${pre}style.css">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%AA%94%3C/text%3E%3C/svg%3E">
</head>
<body>
<div class="topbar">Trade &amp; bulk enquiries welcome · <a href="${waLink('your products')}">WhatsApp ${PHONE}</a></div>
<header class="site"><div class="wrap">
  <a class="logo" href="${pre}index.html">Aditya Trading Company<small>Ujjain · Pooja Samagri &amp; Natural Products</small></a>
  <nav class="cats">${CATS_ORDER.map(c => `<a href="${pre}index.html#${byCat.get(c).slug}">${esc(c)}</a>`).join('')}</nav>
</div></header>
${body}
<footer class="site"><div class="wrap">
<div class="cols">
<div><h4>Aditya Trading Company</h4>
1, L.M. Complex, Shanku Marg,<br>Freeganj, Ujjain, Madhya Pradesh 456010<br>GSTIN: 23KDJPS9384B1Z1</div>
<div><h4>Contact</h4>
WhatsApp / Call: <a href="tel:+${WHATSAPP}">${PHONE}</a><br>
<a href="${waLink('your products')}">Message us on WhatsApp</a></div>
<div><h4>Buy online</h4>
Our products are sold under the <strong>Siddhak</strong> brand.<br>
Shop online at <a href="${SIDDHAK}" rel="noopener">siddhak.in</a></div>
</div>
<div class="fine">This is an informational catalogue. For prices, availability and bulk / wholesale rates, please contact us on WhatsApp or phone. © Aditya Trading Company, Ujjain.</div>
</div></footer>
</body></html>`;
}

// ---- product pages ----
fs.mkdirSync(path.join(OUT, 'p'), { recursive: true });
for (const p of products) {
  const name = t(p.name), hi = (p.name && p.name.hi) || '';
  const short = t(p.short_description);
  const images = (p.images || []).slice(0, 6);
  const mainImg = images[0] ? img(images[0]) : '';
  const variants = (p.variants || []).map(v => t(v.label)).filter(Boolean);
  const gallery = `
<div class="gallery">
  <div class="main"><img id="mainimg" src="${mainImg}" alt="${esc(name)}"></div>
  ${images.length > 1 ? `<div class="thumbs">${images.map(im => `<a href="${img(im)}" onclick="document.getElementById('mainimg').src=this.href;return false"><img src="${img(im)}" alt="" loading="lazy"></a>`).join('')}</div>` : ''}
</div>`;
  const body = `
<div class="wrap">
<div class="crumb"><a href="../index.html">Home</a> › <a href="../index.html#${byCat.get(t(p.category)).slug}">${esc(t(p.category))}</a> › ${esc(name)}</div>
<div class="pdp">
${gallery}
<div class="pinfo">
  <h1>${esc(name)}</h1>
  ${hi ? `<div class="hi">${esc(hi)}</div>` : ''}
  <p class="short">${esc(short)}</p>
  ${variants.length ? `<div class="enquiry-label">Available packs &amp; sizes</div><div class="chips">${variants.map(v => `<span class="chip">${esc(v)}</span>`).join('')}</div>` : ''}
  <div class="enquiry-label">Enquire / order</div>
  <a class="btn btn-wa" href="${waLink(name)}">WhatsApp enquiry</a>
  <a class="btn btn-ghost" href="tel:+${WHATSAPP}">Call ${PHONE}</a>
  <a class="btn btn-buy" href="${SIDDHAK}/product/${p.slug}/" rel="noopener">Buy online · siddhak.in</a>
  <p class="note">Prices on request — WhatsApp us for retail, bulk and trade rates.</p>
</div>
</div>
<div class="longdesc">${renderDesc(t(p.long_description))}${p.usage_ritual_notes ? `<h3>Usage notes</h3>${renderDesc(t(p.usage_ritual_notes))}` : ''}${p.ingredients ? `<h3>Ingredients</h3>${renderDesc(t(p.ingredients))}` : ''}</div>
</div>`;
  fs.writeFileSync(path.join(OUT, 'p', p.slug + '.html'), page({
    title: `${name} — Aditya Trading Company, Ujjain`,
    desc: short.slice(0, 158),
    canonicalPath: `/p/${p.slug}.html`,
    ogImage: mainImg,
    body, depth: 1,
  }));
}

// ---- index ----
const sections = CATS_ORDER.map(cat => {
  const { slug, items } = byCat.get(cat);
  return `<section class="cat" id="${slug}"><div class="wrap">
<h2>${esc(cat)}</h2><div class="count">${items.length} products</div>
<div class="grid">
${items.map(p => {
    const name = t(p.name), hi = (p.name && p.name.hi) || '';
    const mainImg = p.images && p.images[0] ? img(p.images[0]) : '';
    return `<div class="card">
<a class="ph" href="./p/${p.slug}.html"><img src="${mainImg}" alt="${esc(name)}" loading="lazy"></a>
<div class="body">
<h3><a href="./p/${p.slug}.html">${esc(name)}</a></h3>
${hi ? `<div class="hi">${esc(hi)}</div>` : ''}
<div class="desc">${esc(t(p.short_description))}</div>
<a class="more" href="./p/${p.slug}.html">View details →</a>
</div></div>`;
  }).join('\n')}
</div></div></section>`;
}).join('\n');

const indexBody = `
<div class="hero"><div class="wrap">
<div class="eyebrow">Aditya Trading Company · Ujjain</div>
<h1>Pooja Samagri, Dhoop &amp; Natural Products</h1>
<p>Aditya Trading Company, Ujjain — makers and traders of the <strong>Siddhak</strong> range: cow dung cakes, havan samagri, dhoop, incense and eco-friendly essentials. Browse our full product range below; contact us for prices, bulk and trade enquiries.</p>
<a class="btn btn-wa" href="${waLink('your products')}">WhatsApp enquiry</a>
<a class="btn btn-call" href="tel:+${WHATSAPP}">Call ${PHONE}</a>
</div></div>
${sections}`;

fs.writeFileSync(path.join(OUT, 'index.html'), page({
  title: 'Aditya Trading Company, Ujjain — Siddhak Pooja Samagri & Natural Products',
  desc: 'Informational catalogue of Aditya Trading Company (Ujjain): Siddhak pooja samagri, cow dung cakes, dhoop & incense, natural wellness and eco-friendly products. Contact for prices and bulk enquiries.',
  canonicalPath: '/',
  ogImage: '',
  body: indexBody, depth: 0,
}));

fs.writeFileSync(path.join(OUT, 'style.css'), CSS);
fs.writeFileSync(path.join(OUT, 'CNAME'), 'adityatc.com\n');
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  `<url><loc>${SITE}/</loc></url>\n` +
  products.map(p => `<url><loc>${SITE}/p/${p.slug}.html</loc></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, '404.html'), `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/"><a href="/">Aditya Trading Company</a>`);

console.log('built', products.length, 'product pages +', CATS_ORDER.length, 'categories');
