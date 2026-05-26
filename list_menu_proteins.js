const fs = require('fs');
const path = require('path');
const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8'));

console.log('Menu items (first 25):');
db.menu.slice(0, 25).forEach(item => {
  console.log(`- ID: ${item.id}, Name: ${item.name}, Price: ${item.price}, Category: ${item.category}`);
});
