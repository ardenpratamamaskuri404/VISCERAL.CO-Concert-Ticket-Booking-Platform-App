const fs = require('fs');
const path = require('path');

const briSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
  <rect width="100" height="30" fill="transparent"/>
  <text x="50" y="22" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="22" fill="#00529C" text-anchor="middle">BRI</text>
</svg>`;

const bniSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
  <rect width="100" height="30" fill="transparent"/>
  <text x="35" y="22" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-style="italic" font-size="22" fill="#006699" text-anchor="middle">BNI</text>
  <text x="75" y="22" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-style="italic" font-size="22" fill="#F15A23" text-anchor="middle">46</text>
</svg>`;

const danaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30">
  <rect width="100" height="30" rx="4" fill="#118EEA"/>
  <text x="50" y="21" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="18" fill="#FFFFFF" text-anchor="middle">DANA</text>
</svg>`;

const outputDir = path.join(__dirname, 'public', 'logos');
fs.writeFileSync(path.join(outputDir, 'bri.svg'), briSvg);
fs.writeFileSync(path.join(outputDir, 'bni.svg'), bniSvg);
fs.writeFileSync(path.join(outputDir, 'dana.svg'), danaSvg);

console.log('SVGs written successfully!');
