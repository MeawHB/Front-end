const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
var http = require('http');

let top_url = 'http://www.kanmanhua.me';
let tar_rul = 'http://www.kanmanhua.me/manhua-65820/';

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

        num_html.each(function (index, element) {
            let num = index;
            let num_url = top_url + element.attribs.href;
            // num_obj[index] = num_url
            let obj = {name: num + 1, url: num_url, filepath: item.filepath + path.sep + item.name};
            num_arr.push(obj)
        });
    }

    console.log('获取章节内每页的链接完成');
    // console.log(num_arr)
    //  num_arr
    // { name: 0,
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856_1.html',
    //   filepath: '天鹅绒之吻目录\\第32话：希望' }

    //获取图片链接
    let img_arr = [];
    for (let index in num_arr) {
        let item = num_arr[index];
        let img_html = await loadPage(item.url);
        let $ = cheerio.load(img_html);
        let img_url = $('.img-responsive').eq(1)[0].attribs['data-original'];
        // img_obj[parseInt(key) + 1] = img_url
        let obj = {name: item.name, url: img_url, filepath: item.filepath};
        img_arr.push(obj);
        console.log('获取图片链接：' + (index / num_arr.length * 100).toFixed(2) + '%')
    }
    console.log('获取每页内的图片链接完成');
    // console.log(img_arr)
    //  img_arr
    // { name: 23,
    //   url: 'http://manhua-me.oss-cn-hongkong.aliyuncs.com/statics/images/mh/3b/d1/3bd16f21fd40d6677171273e686afe57.png',
    //   filepath: '天鹅绒之吻目录\\第32话：希望' }
    for (let index in img_arr) {
        let item = img_arr[index];
        let i = item.url.lastIndexOf('.');
        let subfix = item.url.substring(i);
        if (mkdirsSync(item.filepath)) {
            let tmp_img = await loadImg(item.url);
            console.log(item.filepath + path.sep + item.name + subfix);
            let fsw = fs.createWriteStream(item.filepath + path.sep + item.name + subfix);
            fsw.write(tmp_img, 'binary');
            fsw.end();
            console.log('开始下载：' + (index / num_arr.length * 100).toFixed(2) + '%')
        }
    }
    console.log('下载完成~~~')
}

start();
