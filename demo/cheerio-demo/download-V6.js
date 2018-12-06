const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const http = require('http');
const async = require("./js/async");

//待下载文件数量
let FILE_NUMBER = 0;
//已下载文件数量
let DOWN_NUMBER = 0;
//网站域名
let top_url = 'http://www.kanmanhua.me';
//漫画下载链接
let tar_rul = 'http://www.kanmanhua.me/manhua-65820/';
//获取链接并发数
const ANumber = 10;
//下载图片并发数
const DNumber = 10;
//http.request 超时  貌似没用？
const TIMEOUT = 600000;

//下载html  http.get
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

//下载图片  http.get
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

//下载图片  http.request
function loadImg2(url) {
    var pm = new Promise(function (resolve, reject) {
        let html = '';
        let p = url.match(/http:\/\/(.+?)(\/.+)/i);
        // console.log(p[1])
        // console.log(p[2])
        const options = {
            hostname: p[1],
            port: 80,
            path: p[2],
            method: 'GET',
            timeout: TIMEOUT
        };
        const req = http.request(options, (res) => {
            res.setEncoding('binary');
            res.on('data', function (data) {
                html += data
            });
            res.on('end', () => {
                resolve(html);
            });
        });
        req.on('error', (e) => {
            reject(e)
        });
        req.end();
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

// 合并数组内部的数组为一个数组 [[1,2],[3,4]]-->[1,2,3,4]
function array_concat(arrs) {
    let tmparray = [];
    for (let i in arrs) {
        tmparray = tmparray.concat(arrs[i])
    }
    return tmparray
}

//数组排序
function array_sort(arr, field) {
    var compare = function (obj1, obj2) {
        var val1 = obj1[field];
        var val2 = obj2[field];
        if (val1 < val2) {
            return -1;
        } else if (val1 > val2) {
            return 1;
        } else {
            return 0;
        }
    };
    arr.sort(compare);
    return arr
}

//统计文件夹内文件数量
function getFileNumber(path) {
    let file_number = 0;

    function getNumber(path) {
        var files = fs.readdirSync(path);
        files.forEach(function (item, index) {
            var stat = fs.statSync(path + item);
            if (stat.isDirectory()) {
                getNumber(path + item + "/")
            } else {
                file_number++
            }
        })
    }

    getNumber(path);
    return file_number
}


//获取漫画名称及章节链接
async function getComicInfo() {
    let comic_obj = {};
    //漫画下载链接
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
    // console.log(comic_arr)
    //  comic_arr 内每一项
    // { name: '第32话：希望',
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856.html',
    //   filepath: '天鹅绒之吻目录' }
    comic_obj = {name: comic_name, arr: comic_arr};
    console.log('获取漫画名称及章节链接完成');
    return comic_obj
}

async function start() {
    let comic_obj = await getComicInfo();
    let comic_name = comic_obj.name;
    let comic_arr = comic_obj.arr;

    //并发获取图片链接
    let arrs = await async.mapLimit(comic_arr, ANumber, async function (item) {
        let num_arr = [];
        let tmphtml = await loadPage(item.url);
        let $ = cheerio.load(tmphtml);
        let num_html = $('.pagination a');

        //去除头尾上一页下一页
        num_html.splice(0, 1);
        num_html.splice(num_html.length - 1, 1);

        num_html.each(function (index, element) {
            let num = index;
            let num_url = top_url + element.attribs.href;
            let obj = {name: num + 1, url: num_url, filepath: item.filepath + path.sep + item.name, isdownload: false};
            num_arr.push(obj)
        });
        return num_arr
    });

    // 合并上面返回的 多个num_arr数组 的 合并数组arrs
    let num_arr = array_concat(arrs);
    //按照url排序数组
    num_arr = array_sort(num_arr, 'url');
    //  num_arr
    // { name: 0,
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856_1.html',
    //   filepath: '天鹅绒之吻目录\\第32话：希望' }
    console.log('获取章节内每页的链接完成');

    //待下载文件总数
    FILE_NUMBER = num_arr.length;
    //待下载漫画目录
    let current__dir = "./" + comic_name + path.sep;

    let contentObj = [];
    //测试是否存在,不存在创建新文件
    if (fs.existsSync('content.json')) {
        contentObj = JSON.parse(fs.readFileSync('content.json', 'utf-8'));
    } else {
        let emptyarr = [];
        fs.writeFileSync('content.json', JSON.stringify(emptyarr), (err) => {
            if (err) throw err;
        });
    }

    // 存储下载点
    let flag = false;
    for (let i in contentObj) {
        let item = contentObj[i];
        if (item.name === comic_name) {
            flag = true;
            //可能中间报错导致其他并发失败，重新下载报错前10个
            if (item.number - DNumber > 0) {
                contentObj[i].number = item.number - DNumber
            } else {
                contentObj[i].number = 0
            }
            num_arr.splice(0, contentObj[i].number)
        }
    }
    if (!flag) {
        contentObj.push({name: comic_name, number: 0})
    }

    async.mapLimit(num_arr, DNumber, async function (item) {
        const res = await loadPage(item.url);
        let $ = cheerio.load(res);
        let img_url = $('.img-responsive').eq(1)[0].attribs['data-original'];
        let obj = {name: item.name, url: img_url, filepath: item.filepath};
        let i = obj.url.lastIndexOf('.');
        let subfix = obj.url.substring(i);
        if (mkdirsSync(obj.filepath)) {
            let tmp_img = await loadImg2(obj.url);
            console.log(obj.filepath + path.sep + obj.name + subfix);
            fs.writeFileSync(obj.filepath + path.sep + obj.name + subfix, tmp_img, {encoding: 'binary'});

            for (let i in contentObj) {
                let item = contentObj[i];
                if (item.name === comic_name) {
                    contentObj[i].number = parseInt(contentObj[i].number) + 1;
                    DOWN_NUMBER = parseInt(contentObj[i].number) + 1
                }
            }
            fs.writeFileSync('content.json', JSON.stringify(contentObj), (err) => {
                if (err) throw err;
            });

            console.log('开始下载：' + DOWN_NUMBER + '/' + FILE_NUMBER + '  ' + (DOWN_NUMBER / FILE_NUMBER * 100).toFixed(2) + '%')
        }
    }, (err, results) => {
        if (err) throw err;
        let file_number = getFileNumber(current__dir);
        console.log(FILE_NUMBER + '个文件下载完成~~~');
        console.log('文件夹内数量为：' + file_number)
    })
}

start();
