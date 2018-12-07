const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
const http = require('http');
const process = require('process');
const async = require("./js/async");

//待下载文件数量
let FILE_NUMBER = 0;
//已下载文件数量
let DOWN_NUMBER = 0;
//网站域名
let top_url = 'http://www.kanmanhua.me';
//漫画下载链接
let tar_rul = 'http://www.kanmanhua.me/manhua-66908';
//获取链接并发数
const ANumber = 10;
//下载图片并发数
const DNumber = 500;
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
            console.log('loagImgErr:', e);
            reject(error)
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


//获取图片页面链接
async function getImgPageLink(item) {
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
    //  num_arr
    // { name: 0,
    //   url: 'http://www.kanmanhua.me/manhua-65820/91856_1.html',
    //   filepath: '天鹅绒之吻目录\\第32话：希望' }
}

//获取图片
async function getImg(item) {
    let res = '';
    try {
        res = await loadPage(item.url);
    } catch (e) {
        console.log('loadPageErr:', e);
        await getImg(item);
        return
    }
    let $ = cheerio.load(res);

    //如果是502错误，重新请求
    if ($('title').text() === '502 Bad Gateway') {
        console.log('请求失败,重新请求', item.url);
        await getImg(item);
        return
    }
    let img_url = {};
    try {
        img_url = $('.img-responsive').eq(1)[0].attribs['data-original'];
    } catch (e) {
        console.log(item.url);
        console.log(res);
        throw e
    }
    let obj = {name: item.name, url: img_url, filepath: item.filepath};
    let i = obj.url.lastIndexOf('.');
    let subfix = obj.url.substring(i);
    if (mkdirsSync(obj.filepath)) {
        let tmp_img = await loadImg2(obj.url);
        console.log(obj.filepath + path.sep + obj.name + subfix);
        fs.writeFileSync(obj.filepath + path.sep + obj.name + subfix, tmp_img, {encoding: 'binary'});
        DOWN_NUMBER++;
        console.log('下载完成：' + DOWN_NUMBER + '/' + FILE_NUMBER + '  ' + (DOWN_NUMBER / FILE_NUMBER * 100).toFixed(2) + '%')
    }
}

async function start() {
    //获取漫画名称及章节链接
    let comic_obj = await getComicInfo();
    //漫画名称
    let comic_name = comic_obj.name;
    //章节链接数组
    let comic_arr = comic_obj.arr;
    //并发获取图片页面链接
    let arrs = await async.mapLimit(comic_arr, ANumber, getImgPageLink);
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
    //创建漫画根目录
    mkdirsSync(comic_name);
    //待下载漫画目录
    let current_dir = "./" + comic_name + path.sep;
    //中间超时退出,重新下报错时的那些文件
    DOWN_NUMBER = getFileNumber(current_dir);
    // if (DOWN_NUMBER - DNumber > 0) {
    //     DOWN_NUMBER = DOWN_NUMBER - DNumber
    // } else {
    //     DOWN_NUMBER = 0
    // }
    //去除重复文件
    num_arr.splice(0, DOWN_NUMBER);
    //下载图片
    await async.mapLimit(num_arr, DNumber, getImg);

    console.log('漫画文件数量：' + FILE_NUMBER);
    console.log('文件夹内数量为：' + getFileNumber(current_dir));
    console.log('下载完成')
}

// start是否运行着
let running = false;
let myInterval = setInterval(function () {
    console.log('程序检查中。。。');
    if (!running) {
        running = true;
        async function func() {
            try {
                await start();
                stopmyInterval()
            } catch (e) {
                console.log(e);
                console.log('出错拉.......10秒后钟重启..............................................');
                setTimeout(function () {
                    running = false
                }, 10000)
            }
        }
        func()
    }
}, 3000);

function stopmyInterval() {
    console.log('关闭定时器');
    clearInterval(myInterval);
}

// process.on('uncaughtException', function (err) {
//     console.log('-----------------------------------------------------------------------------------');
//     //打印出错误
//     console.log(err);
//     //打印出错误的调用栈方便调试
//     console.log(err.stack);
//     setTimeout(() => {
//         start()
//     }, 5000);
// });
//
// start();