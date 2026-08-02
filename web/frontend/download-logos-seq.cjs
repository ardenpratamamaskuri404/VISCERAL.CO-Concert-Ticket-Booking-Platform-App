const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = {
  bri: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/BRI_2020.svg',
  bni: 'https://upload.wikimedia.org/wikipedia/id/5/55/BNI_logo.svg',
  shopee: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg',
  ovo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
  dana: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg'
};

const outputDir = path.join(__dirname, 'public', 'logos');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const entries = Object.entries(urls);
let i = 0;

function downloadNext() {
  if (i >= entries.length) {
    console.log('All done!');
    return;
  }
  const [key, url] = entries[i];
  const isSvg = url.endsWith('.svg');
  const ext = isSvg ? '.svg' : '.png';
  
  const options = {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  };

  console.log('Downloading ' + key + '...');
  
  const req = https.get(url, options, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, options, (res2) => {
        const dest = fs.createWriteStream(path.join(outputDir, key + ext));
        res2.pipe(dest);
        res2.on('end', () => {
          i++;
          setTimeout(downloadNext, 1500); // 1.5s delay
        });
      });
    } else {
      const dest = fs.createWriteStream(path.join(outputDir, key + ext));
      res.pipe(dest);
      res.on('end', () => {
        i++;
        setTimeout(downloadNext, 1500); // 1.5s delay
      });
    }
  });
  req.on('error', console.error);
}

downloadNext();
