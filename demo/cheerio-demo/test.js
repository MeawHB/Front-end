const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const http = require('http');
const async = require("./js/async");
const process = require("process");

function filter_array(array) {
    return array.filter(item => {
        return item
    });
}

//调用
var arr = [undefined, undefined, 1, '', 'false', false, true, null, 'null'];
console.log(filter_array(arr));

