const fs = require('fs');
let contentObj = JSON.parse(fs.readFileSync('content.json', 'utf-8'));
for (let item in contentObj) {
    console.log(contentObj[item])
}
