// Builds index.html from src/template.html + content/*.json.
// Staff edit content through Pages CMS; Netlify runs this on every deploy.
const fs = require('fs');
const path = require('path');
const read = f => JSON.parse(fs.readFileSync(path.join(__dirname, 'content', f + '.json'), 'utf8'));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// keep the last two words together so lines never end on one orphaned word
const tie = s => s.replace(/ (\S{1,14})$/, '&nbsp;$1');
// plain text with **bold**, *italic* and [links](https://...)
const fmt = s => tie(esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.+?)\*/g, '<em>$1</em>')
  .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g, '<a href="$2">$1</a>'));
const txt = s => tie(esc(s));
const img = p => esc(String(p || '').replace(/^\//, ''));
const vimeo = link => (String(link || '').match(/(\d{6,})/) || [])[1] || '';
const money = n => '$' + Number(n).toLocaleString('en-US');
const millions = n => (n / 1e6).toFixed(1).replace(/\.0$/, '');

const v = read('vision'), g = read('goals'), gv = read('giving'), st = read('stories'),
      l = read('letter'), faq = read('faq'), ph = read('photos'), ft = read('footer');

const goalIcons = ['witness', 'faith', 'give'];
const rom = gv.here.amount + gv.there.amount + gv.everywhere.amount;
const total = gv.coreAmount + rom;
const pct = n => (n / total * 100).toFixed(1);
const rpct = n => (n / rom * 100).toFixed(1);
const where = (key, label, extra = '') => `
        <article class="reveal">
          <svg class="ico"><use href="#i-${key}"/></svg>
          <h3>${label}</h3>
          <p class="amt">${money(gv[key].amount)}</p>
          <ul>
${(gv[key].items || []).map(i => `            <li>${fmt(i)}</li>`).join('\n')}
          </ul>${extra}
        </article>`;

const content = `<main>
  <section class="zoom" id="top" aria-label="Reach One More">
    <div class="stage">
      <div class="z-photo"><img src="${img(ph.hero)}" alt=""></div>
      <div class="z-disc"></div>
      <img class="z-logo" src="images/ROM-MainLogo-S3_Yellow.webp" alt="Reach One More">
      <div class="z-ring" aria-hidden="true">
        <img class="rs" src="images/ring-sharp.webp" alt="">
        <img class="rb" src="images/ring-blur.webp" alt="">
      </div>
      <a class="z-cue" href="#vision" aria-label="Scroll to the vision">Scroll</a>
    </div>
  </section>

  <section class="vision" id="vision">
    <div class="wrap">
      <div class="intro-copy reveal">
        <p class="eyebrow" style="color:var(--rom-yellow)">Christ Community&nbsp;Church</p>
        <p class="lede">${fmt(v.intro)}</p>
        <p class="archive-note">${fmt(v.archiveNote)}</p>
      </div>

      <div class="vision-grid">
        <div class="vision-copy">
          <p class="eyebrow" style="color:var(--rom-yellow)">Our Vision</p>
          <h2>${txt(v.heading)}</h2>
          <p>${fmt(v.text)}</p>
        </div>
        <div class="verse">
          <blockquote>${txt(v.verse)}</blockquote>
          <cite>${esc(v.verseRef)}</cite>
        </div>
      </div>

      <p class="statement reveal">${esc(v.statement)} <em>${txt(v.statementHighlight)}</em></p>

      <div class="film parallax" data-speed="0.04" data-popup>
        <div class="player" data-vimeo="${vimeo(v.videoLink)}" data-title="${esc(v.videoTitle)}" data-poster="${img(ph.visionVideoPoster)}"></div>
        <div class="film-label"><p class="eyebrow">Watch</p><strong>${txt(v.videoTitle)}</strong></div>
        <img class="pink parallax" data-speed="-0.12" src="images/pink-circle.webp" alt="" aria-hidden="true">
      </div>
    </div>
  </section>

  <div class="band" role="img" aria-label="${esc(ph.band1Label)}"><img data-speed="0.1" data-fill style="--focus:center ${esc(ph.band1Focus || '35%')}" src="${img(ph.band1)}" alt=""></div>
  <div class="divider"><img data-speed="-0.03" src="images/yellow-circle.webp" alt="" aria-hidden="true"></div>

  <section class="goals" id="goals">
    <div class="wrap">
      <div class="goal-head reveal">
        <p class="eyebrow">Primary Goal</p>
        <p class="big"><span data-count="100">100</span>% Engagement</p>
        <p>${fmt(g.intro)}</p>
      </div>
      <div class="people parallax" data-speed="0.03" id="people" aria-hidden="true"></div>
      <p class="people-cap">${fmt(g.caption).replace(/<strong>(.+?)<\/strong>/g, '<span>$1</span>')}</p>
      <div class="cards">
${(g.cards || []).map((c, i) => `        <div class="card reveal">
          <svg class="ico"><use href="#i-${goalIcons[i % 3]}"/></svg>
          <h3>${txt(c.title)}</h3>
          <p>${fmt(c.text)}</p>
        </div>`).join('\n')}
      </div>
    </div>
  </section>

  <div class="band" role="img" aria-label="${esc(ph.band2Label)}"><img data-speed="0.1" data-fill style="--focus:center ${esc(ph.band2Focus || '35%')}" src="${img(ph.band2)}" alt=""></div>

  <section class="funding">
    <div class="wrap">
      <div class="goal-head reveal">
        <p class="eyebrow">Secondary Goal</p>
        <p class="big">$<span data-count="${millions(total)}" data-dec="1">${millions(total)}</span> Million</p>
        <p>${fmt(gv.intro)}</p>
      </div>
      <div class="bars" id="bars">
        <div class="bar-label"><span>Total goal</span><span>$${millions(total)}M</span></div>
        <div class="bar" role="img" aria-label="${money(gv.coreAmount)} core ministry, ${money(rom)} Reach One More">
          <div class="core" data-w="${pct(gv.coreAmount)}">$${millions(gv.coreAmount)}M<small>Core Ministry</small></div>
          <div class="rom" data-w="${pct(rom)}">$${millions(rom)}M<small>Reach One More</small></div>
        </div>
        <div class="bar-label"><span>Reach One More</span><span>$${millions(rom)}M</span></div>
        <div class="bar" role="img" aria-label="Here ${money(gv.here.amount)}, There ${money(gv.there.amount)}, Everywhere ${money(gv.everywhere.amount)}">
          <div class="b1" data-w="${rpct(gv.here.amount)}">Here</div>
          <div class="b2" data-w="${rpct(gv.there.amount)}">There</div>
          <div class="b3" data-w="${rpct(gv.everywhere.amount)}">Everywhere</div>
        </div>
      </div>
      <div class="where">${where('here', 'Here')}${where('there', 'There')}${where('everywhere', 'Everywhere', `
          <div class="churches" id="churches" aria-hidden="true"></div>
          <p class="churches-cap">${txt(gv.churchesCaption)}</p>`)}
      </div>
    </div>
  </section>

  <section class="stories" id="stories" style="background-image:url('${img(ph.storiesBackground)}')">
    <div class="wrap">
      <div class="goal-head reveal">
        <p class="eyebrow" style="color:var(--rom-yellow)">Stories</p>
        <h2>${txt(st.heading)}</h2>
        <p>${fmt(st.intro)}</p>
      </div>
      <div class="videos" data-popup>
${(st.videos || []).map(x => `        <div class="video"><div class="player" data-vimeo="${vimeo(x.link)}"></div><h3>${txt(x.name)}</h3></div>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="letter" id="letter">
    <div class="wrap split">
      <div class="letter-photos">
        <img class="preach parallax" data-speed="0.04" src="${img(l.photo)}" alt="${esc(l.signoff)} preaching">
        <img class="portrait" data-speed="-0.07" src="${img(l.portrait)}" alt="${esc(l.signoff)}">
      </div>
      <div class="letter-body">
        <p class="eyebrow">${txt(l.label)}</p>
        <h2>${txt(l.heading)}</h2>
${(l.paragraphs || []).map(p => `        <p>${fmt(p)}</p>`).join('\n')}
        <img class="sig" src="images/mark-sig.webp" alt="Mark Ashton signature">
        <p class="signoff">${txt(l.signoff)}</p>
        <p class="role">${esc(l.role)}</p>
      </div>
    </div>
  </section>

  <div class="divider"><img data-speed="-0.03" src="images/yellow-circle.webp" alt="" aria-hidden="true"></div>

  <section class="faq" id="faq">
    <div class="wrap">
      <div class="goal-head reveal">
        <p class="eyebrow">FAQ</p>
        <h2>Questions</h2>
      </div>
      <div class="faq-list">
${(faq || []).map(f => `        <details>
          <summary>${txt(f.question)}</summary>
          <p>${fmt(f.answer)}</p>
        </details>`).join('\n')}
      </div>
    </div>
  </section>
</main>

<footer>
  <div class="wrap">
    <div>
      <img src="images/CCC-Long---yellow.webp" alt="Christ Community Church">
      <p>${esc(ft.addressLine1)}<br>${esc(ft.addressLine2)}</p>
    </div>
    <ul>
      <li><a href="tel:${esc(String(ft.phone).replace(/\D/g, ''))}">${esc(ft.phone)}</a></li>
      <li><a href="mailto:${esc(ft.email)}">${esc(ft.email)}</a></li>
      <li><a href="https://cccomaha.org">cccomaha.org</a></li>
    </ul>
    <ul>
      <li><a href="https://youtube.com/@cccomaha">YouTube</a></li>
      <li><a href="https://instagram.com/cccomaha">Instagram</a></li>
      <li><a href="https://facebook.com/cccomaha">Facebook</a></li>
      <li><a href="https://tiktok.com/@cccomaha">TikTok</a></li>
    </ul>
    <p class="copy">&copy; <span id="yr">2026</span> Christ Community Church</p>
  </div>
</footer>`;

const tpl = fs.readFileSync(path.join(__dirname, 'src', 'template.html'), 'utf8');
fs.writeFileSync(path.join(__dirname, 'index.html'), tpl.replace('<!--CONTENT-->', content));
console.log('Built index.html');
