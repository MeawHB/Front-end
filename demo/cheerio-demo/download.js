const cheerio = require('cheerio');
const path = require('path');

let tar_rul = 'http://www.kanmanhua.me/manhua-65820/';

function loadPage(url) {
    var http = require('http');
    var pm = new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            var html = '';
            res.on('data', function (data) {
                let buf = Buffer.from(data, 'binary').toString("utf8");
                html += buf
            });
            res.on('end', function () {
                // console.log(html)
                resolve(html);
            });
        }).on('error', function (e) {
            reject(e)
        });
    });
    return pm;
}

loadPage(tar_rul).then(function (data) {
    const $ = cheerio.load(data);
    let comic_name = $('body>div').eq(1).children().eq(0).children().eq(0).children().eq(2).children().eq(0).children().eq(0).text().toString();
    let tmpurls = $('body>div').eq(1).children().eq(0).children().eq(0).children().eq(2).children().eq(1).children().eq(0).children();

    console.log(comic_name);
    let comic_obj = {};
    tmpurls.each(function (index, element) {
        let episode_name = element.children[0].children[0].data;
        let episode_url = 'http://www.kanmanhua.me' + element.children[0].attribs.href;
        comic_obj[episode_name] = episode_url
    });
    console.log(comic_obj)
});