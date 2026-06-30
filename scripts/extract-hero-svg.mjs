import fs from 'fs';

const geminiPath =
  'C:/Users/bilaw/.gemini/antigravity-ide/brain/522e76fc-6614-4ac2-8a71-f55a71697657/.system_generated/logs/transcript.jsonl';

const raw = fs.readFileSync(geminiPath, 'utf8');
const start = raw.indexOf('<svg class=\\"hero-image\\"');

if (start === -1) {
  console.error('Hero SVG start not found');
  process.exit(1);
}

const closes = [];
let p = start;
while ((p = raw.indexOf('</svg>', p + 1)) !== -1) {
  closes.push(p);
}

console.log('start', start, 'close count', closes.length);
console.log(
  'first 5 deltas',
  closes.slice(0, 5).map((c) => c - start)
);
console.log(
  'last 5 deltas',
  closes.slice(-5).map((c) => c - start)
);

// Use the last </svg> before the next JSON log entry (next line starting with {)
const nextEntry = raw.indexOf('\n{"step_index"', start + 1000);
const validCloses = closes.filter((c) => c < nextEntry || nextEntry === -1);
const end = validCloses[validCloses.length - 1] ?? closes[closes.length - 1];

console.log('using end delta', end - start, 'nextEntry', nextEntry - start);

let svg = raw.slice(start, end + 6);
svg = svg.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');

console.log('svg length', svg.length);
console.log('valid tail', !svg.includes('JSON.parse'));
console.log('has pattern', svg.includes('pattern0_257_829'));

if (svg.length < 50000 || svg.includes('JSON.parse')) {
  console.error('Invalid extraction');
  process.exit(1);
}

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

console.log('Done. Ends:', svg.slice(-100));
