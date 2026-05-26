const fs = require('fs');
const path = require('path');
const appJs = fs.readFileSync(path.join(__dirname, 'public', 'app.js'), 'utf8');

appJs.split('\n').forEach((line, idx) => {
  if (line.includes('maestro-nav-btn') || line.includes('switchTab') || line.includes('tab-content') || line.includes('maestro-tab')) {
    console.log(`Line ${idx+1}: ${line.trim()}`);
  }
});
