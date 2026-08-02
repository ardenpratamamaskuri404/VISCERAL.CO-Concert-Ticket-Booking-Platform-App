const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = {
  mandiri: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
  bca: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
  bri: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/BRI_2020.svg',
  bni: 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg',
  qris: 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Logo_QRIS.svg',
  shopee: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg',
  ovo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
  dana: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg'
};

const outputDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

for (const [key, url] of Object.entries(urls)) {
  const isSvg = url.endsWith('.svg');
  const ext = isSvg ? '.svg' : '.png';
  
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/100.0.4896.127 Safari/537.36' }
  };

  const req = https.get(url, options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, options, (res2) => {
        const dest = fs.createWriteStream(path.join(outputDir, key + ext));
        res2.pipe(dest);
      });
    } else {
      const dest = fs.createWriteStream(path.join(outputDir, key + ext));
      res.pipe(dest);
    }
  });
  req.on('error', console.error);
}

console.log('Downloading logos with User-Agent...');
