import fs from 'fs';

const html = fs.readFileSync('tmp-home.html', 'utf8');

const markers = ['id="mySvg"', "id='mySvg'", 'class="hero-image"'];
let start = -1;
for (const m of markers) {
  const i = html.indexOf(m);
  if (i !== -1) {
    start = html.lastIndexOf('<svg', i);
    if (start !== -1) break;
  }
}

if (start === -1) {
  console.error('Hero SVG not found in HTML');
  process.exit(1);
}

const end = html.indexOf('</svg>', start);
if (end === -1) {
  console.error('Closing </svg> not found');
  process.exit(1);
}

const svg = html.slice(start, end + 6);
console.log('svg length', svg.length);

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/hero-home.svg', svg);

fs.writeFileSync(
  'src/components/HeroSvg.jsx',
  `export default function HeroSvg() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/hero-home.svg"
      alt="LG Built-in Kitchen Planner interactive preview"
      className="hero-image"
    />
  );
}
`
);

console.log('Wrote public/hero-home.svg');
