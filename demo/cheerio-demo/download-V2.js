const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
var http = require('http');

let top_url = 'http://www.kanmanhua.me';
let tar_rul = 'http://www.kanmanhua.me/manhua-65820/';

let allnumber = 0;
let downloadednumber = 0;

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

//下载html
function loadPage(url) {
    var pm = new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            let html = '';
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

//下载html2
function loadPage2(item, callback) {
    http.get(item.url, function (res) {
        let html = '';
        res.on('data', function (data) {
            let buf = Buffer.from(data, 'binary').toString("utf8");
            html += buf
        });
        res.on('end', function () {
            callback(html, item);
        });
    }).on('error', function (e) {
        console.log('loadPage2..error........')
    });
}

//下载图片
function loadImg(url) {
    var pm = new Promise(function (resolve, reject) {
        http.get(url, function (res) {
            res.setEncoding('binary');
            let html = '';
            res.on('data', function (data) {
                html += data
            });
            res.on('end', function () {
                resolve(html);
            });
        }).on('error', function (e) {
            reject(e)
        });
    });
    return pm;
}

//下载图片
function loadImg2(url, callback) {
    http.get(url, function (res) {
        res.setEncoding('binary');
        let html = '';
        res.on('data', function (data) {
            html += data
        });
        res.on('end', function () {
            callback(html);
        });
    }).on('error', function (e) {
        console.log('loadImg2..error........')
    });
}

//创建文件夹
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

async function start() {
    //顶html
    let tophtml = await loadPage(tar_rul);
    let $ = cheerio.load(tophtml);

    //获取漫画名称及章节链接
    let comic_name = $('body>div').eq(1).children().eq(0).children().eq(0).children().eq(2).children().eq(0).children().eq(0).text().toString();
    let tmpurls = $('body>div').eq(1).children().eq(0).children().eq(0).children().eq(2).children().eq(1).children().eq(0).children();
    console.log(comic_name);
    let comic_arr = [];
    tmpurls.each(function (index, element) {
        let episode_name = element.children[0].children[0].data;
        let episode_url = top_url + element.children[0].attribs.href;
        let obj = {name: episode_name, url: episode_url, filepath: comic_name};
        comic_arr.push(obj)
    });
    console.log('获取漫画名称及章节链接完成');
    // console.log(comic_arr)
    //  comic_arr 内每一项
    // { name: '第32话：希望',
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856.html',
    //   filepath: '天鹅绒之吻目录' }

    //获取章节内每页的链接
    let num_arr = [];
    for (let index in comic_arr) {
        // console.log(key,comic_obj[key]);
        let item = comic_arr[index];
        let tmphtml = await loadPage(item.url);
        let $ = cheerio.load(tmphtml);
        let num_html = $('.pagination a');

        //去除头尾上一页下一页
        num_html.splice(0, 1);
        num_html.splice(num_html.length - 1, 1);
        //总下载数量统计
        allnumber += num_html.length;

        num_html.each(function (index, element) {
            let num = index;
            let num_url = top_url + element.attribs.href;
            let obj = {name: num + 1, url: num_url, filepath: item.filepath + path.sep + item.name};
            num_arr.push(obj)
        });
    }

    console.log('获取章节内每页的链接完成');
    console.log(num_arr);
    //  num_arr
    // { name: 1,
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856_1.html',
    //   filepath: '天鹅绒之吻目录\\第32话：希望' }

    //获取图片链接
    for (let index in num_arr) {
        let item = num_arr[index];
        loadPage2(item, function (data, img) {
            let $ = cheerio.load(data);
            let img_url = $('.img-responsive').eq(1)[0].attribs['data-original'];
            let obj = {name: img.name, url: img_url, filepath: img.filepath};
            console.log(obj)
        })
    }
}

start();
