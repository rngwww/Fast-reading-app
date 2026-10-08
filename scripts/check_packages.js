const fs = require('fs');

console.log('Node version:', process.version);

const packages = ['puppeteer', 'playwright', '@playwright/test', 'selenium-webdriver'];
for (const pkg of packages) {
  try {
    require(pkg);
    console.log(pkg, 'AVAILABLE in root');
  } catch(e) {
    console.log(pkg, 'not in root');
  }
}

// Check in tachyon-promo/node_modules
for (const pkg of packages) {
  try {
    require('./tachyon-promo/node_modules/' + pkg);
    console.log(pkg, 'AVAILABLE in tachyon-promo');
  } catch(e) {
    // console.log(pkg, 'not in tachyon-promo');
  }
}
