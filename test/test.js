const fs = require('fs');

let file_number = 0;

function readFileNumber(path) {
    var files = fs.readdirSync(path);
    files.forEach(function (itm, index) {
        var stat = fs.statSync(path + itm);
        if (stat.isDirectory()) {
            readFileNumber(path + itm + "/")
        } else {
            file_number++
        }
    })
}

readFileNumber("./test/");
console.log(file_number);