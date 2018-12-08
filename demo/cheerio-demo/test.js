const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const http = require('http');
const process = require('process');
const async = require("./js/async");

let data = fs.readFileSync('fails1', 'utf8');
let dataobj = JSON.parse(data);
console.log(dataobj.length);

let data1 = fs.readFileSync('fails2', 'utf8');
let dataobj1 = JSON.parse(data);
console.log(dataobj1.length);

let c = 0;
dataobj.forEach(function (item, index) {
    dataobj.forEach(function (item2, index2) {
        if ((item.filepath + item.name) === (item2.filepath + item2.name) && (index !== index2)) {
            console.log(item);
            console.log(item.filepath + item.name);
            c++
        }
    })
});

console.log(c);

