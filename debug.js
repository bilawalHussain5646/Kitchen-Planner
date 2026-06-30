const fs = require('fs');
const logPath =
  'C:\\Users\\bilaw\\.gemini\\antigravity-ide\\brain\\522e76fc-6614-4ac2-8a71-f55a71697657\\.system_generated\\logs\\transcript.jsonl';
const fileContent = fs.readFileSync(logPath, 'utf8');
const lines = fileContent.split('\n');

for (const line of lines) {
  if (!line.trim()) continue;
  try {
    const data = JSON.parse(line);
    const content =
      typeof data.content === 'string'
        ? data.content
        : data.content
          ? JSON.stringify(data.content)
          : '';
    if (!content.includes('mySvg')) continue;

    console.log('Found line! Content length:', content.length);
    const svgStart = content.indexOf('<svg');
    const svgEnd = content.lastIndexOf('</svg>');
    console.log('svgStart', svgStart, 'svgEnd', svgEnd);
    if (svgStart === -1 || svgEnd === -1) continue;

    const svg = content.slice(svgStart, svgEnd + 6);
    fs.mkdirSync('public', { recursive: true });
    fs.writeFileSync('public/hero-home.svg', svg);
    console.log('Wrote hero-home.svg', svg.length);
    break;
  } catch (err) {
    /* skip */
  }
}
