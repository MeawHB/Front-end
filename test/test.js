const fs = require('fs');

let arr = [];
try {
    let fd = fs.openSync('content.json', 'r')
} catch (err) {
    if (err) {
        if (err.code === 'ENOENT') {
            fs.writeFileSync('content.json', JSON.stringify(arr), (err) => {
                if (err) throw err;
                console.log('content.json创建成功~~');
            });
        }
        // throw err;
    }
}

