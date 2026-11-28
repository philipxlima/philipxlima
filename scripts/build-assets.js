// Gera o banner e os cards do README. Uso: node scripts/build-assets.js
const fs = require('fs');
const path = require('path');
const out = path.join(__dirname, '..', 'assets');
fs.mkdirSync(out, { recursive: true });
const MONO = "ui-monospace,SFMono-Regular,'Cascadia Code',Consolas,Menlo,monospace";
const SANS = "'Segoe UI',-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif";

// Barras do "leitor de acesso" acendem em sequência.
const bars = Array.from({ length: 22 }, (_, i) => {
  const h = 24 + Math.round(Math.abs(Math.sin(i * 1.7)) * 92);
  return `<rect x="${i * 13}" y="${(120 - h) / 2}" width="6" height="${h}" rx="3" fill="#56d364" opacity=".25"><animate attributeName="opacity" values=".2;1;.2" dur="2.6s" begin="${(i * 0.09).toFixed(2)}s" repeatCount="indefinite"/></rect>`;
}).join('');

fs.writeFileSync(path.join(out, 'header.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="300" viewBox="0 0 1000 300" role="img" aria-label="Philip Lima, desenvolvedor web e segurança patrimonial">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1017"/><stop offset="1" stop-color="#10241f"/></linearGradient>
</defs>
<rect x=".5" y=".5" width="999" height="299" rx="18" fill="url(#bg)" stroke="#2ea043" stroke-opacity=".4"/>
<text x="56" y="76" font-family="${MONO}" font-size="17" fill="#56d364">&gt; acesso liberado<tspan> _<animate attributeName="fill-opacity" values="1;0" calcMode="discrete" dur="1.1s" repeatCount="indefinite"/></tspan></text>
<text x="52" y="152" font-family="${SANS}" font-size="76" font-weight="800" fill="#f0f6fc" letter-spacing="-2">Philip Lima</text>
<text x="56" y="200" font-family="${SANS}" font-size="25" fill="#c9d1d9">Desenvolvedor web <tspan fill="#56d364">+</tspan> segurança patrimonial</text>
<text x="56" y="246" font-family="${MONO}" font-size="16" fill="#8b949e">São Paulo, Brasil</text>
<g transform="translate(654 90)">${bars}</g>
<rect x="640" y="84" width="312" height="2" fill="#f0f6fc" opacity=".7"><animate attributeName="y" values="84;214;84" dur="4s" repeatCount="indefinite"/></rect>
</svg>`);

const eq = c => [0, 1, 2, 3, 4].map(i => `<rect x="${i * 16}" y="10" width="9" height="50" rx="3" fill="${c}"><animate attributeName="height" values="14;50;22;42;14" dur="${1.2 + i * 0.2}s" repeatCount="indefinite"/><animate attributeName="y" values="46;10;38;18;46" dur="${1.2 + i * 0.2}s" repeatCount="indefinite"/></rect>`).join('');
const chat = c => `<path d="M4 14h68a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H34L18 64V52H4a6 6 0 0 1-6-6V20a6 6 0 0 1 6-6z" fill="${c}"/>${[20, 38, 56].map((x, i) => `<circle cx="${x}" cy="33" r="5" fill="#0d1117"><animate attributeName="opacity" values="1;.2;1" dur="1.2s" begin="${i * 0.2}s" repeatCount="indefinite"/></circle>`).join('')}`;
const play = c => `<rect x="0" y="8" width="78" height="54" rx="8" fill="none" stroke="${c}" stroke-width="6"/><path d="M31 22v26l22-13z" fill="${c}"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></path>`;
const helm = c => `<g transform="translate(40 35)"><g fill="none" stroke="${c}" stroke-width="5"><circle r="22"/><path d="M0-34V34M-34 0H34M-24-24 24 24M-24 24 24-24"/><animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="14s" repeatCount="indefinite"/></g></g>`;

const projects = [
  { f: 'kiritofy', t: 'Kiritofy', l: ['Streaming de música com busca,', 'playlists e contas de usuário.'], k: 'React / Node / MongoDB', c: '#a371f7', art: eq },
  { f: 'ticket-bot', t: 'Ticket Bot', l: ['Atendimento por tickets', 'dentro do Discord.'], k: 'Node / discord.js v14', c: '#58a6ff', art: chat },
  { f: 'bateia', t: 'Bateia', l: ['Catálogo de filmes e séries', 'organizado por gênero.'], k: 'React / Axios', c: '#f85149', art: play },
  { f: 'one-piece', t: 'One Piece', l: ['Galeria interativa dos Piratas', 'do Chapéu de Palha.'], k: 'HTML / CSS / JavaScript', c: '#e3b341', art: helm },
];
for (const p of projects) {
  fs.writeFileSync(path.join(out, `card-${p.f}.svg`), `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="220" viewBox="0 0 480 220" role="img" aria-label="${p.t}: ${p.l.join(' ')}">
<rect x="1" y="1" width="478" height="218" rx="14" fill="#0d1117" stroke="${p.c}" stroke-opacity=".55" stroke-width="2"/>
<g transform="translate(366 30)">${p.art(p.c)}</g>
<text x="30" y="70" font-family="${SANS}" font-size="38" font-weight="800" fill="#f0f6fc">${p.t}</text>
<text x="30" y="120" font-family="${SANS}" font-size="21" fill="#c9d1d9">${p.l.map((x, i) => `<tspan x="30" dy="${i ? 29 : 0}">${x}</tspan>`).join('')}</text>
<text x="30" y="193" font-family="${MONO}" font-size="16" fill="${p.c}">${p.k}</text>
</svg>`);
}
