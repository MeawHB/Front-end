const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');
var http = require('http');
var async = require("./js/async");

let top_url = 'http://www.kanmanhua.me';
let tar_rul = 'http://www.kanmanhua.me/manhua-66908';
//并发数
const ANumber = 10;
const DNumber = 10;
const TIMEOUT = 600000;

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

    async.mapLimit(comic_arr, ANumber, async function (item) {
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
    }, (err, arrs) => {
        if (err) throw err;
        // results is now an array of the response bodies
        // console.log('results  ',arrs)
        // 合并上面返回的num_arr数组中的数组
        let num_arr = [];
        for (let i in arrs) {
            num_arr = num_arr.concat(arrs[i])
        }

        // 排序
        var compare = function (obj1, obj2) {
            var val1 = obj1.url;
            var val2 = obj2.url;
            if (val1 < val2) {
                return -1;
            } else if (val1 > val2) {
                return 1;
            } else {
                return 0;
            }
        };
        num_arr.sort(compare);
        console.log('获取章节内每页的链接完成');
        // console.log(num_arr)
        //  num_arr
        // { name: 0,
        //   url: 'http://www.kanmanhua.me/manhua-65820/91856_1.html',
        //   filepath: '天鹅绒之吻目录\\第32话：希望' }

        // 存储下载点
        let contentObj = [];
        contentObj = JSON.parse(fs.readFileSync('content.json', 'utf-8'));
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

        // try{
        //     let fd = fs.openSync('content.json', 'r')
        //     num_arr = JSON.parse(fs.readFileSync(fd,'utf-8'))
        // }catch (err) {
        //     if (err) {
        //         if (err.code === 'ENOENT') {
        //             fs.writeFileSync('content.json', JSON.stringify(contentObj), (err) => {
        //                 if (err) throw err;
        //                 console.log('content.json创建成功~~');
        //             });
        //             return;
        //         }
        //         throw err;
        //     }
        // }

        let index = 0;
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
                // fs.writeFileSync
                // let fsw = fs.createWriteStream(obj.filepath + path.sep + obj.name + subfix);
                // fsw.write(tmp_img, 'binary');
                // fsw.end();

                for (let i in contentObj) {
                    let item = contentObj[i];
                    if (item.name === comic_name) {
                        contentObj[i].number = parseInt(contentObj[i].number) + 1;
                        index = parseInt(contentObj[i].number) + 1
                    }
                }
                fs.writeFileSync('content.json', JSON.stringify(contentObj), (err) => {
                    if (err) throw err;
                });

                console.log('开始下载：' + (index / num_arr.length * 100).toFixed(2) + '%')
            }
        }, (err, results) => {
            if (err) throw err;
            // results is now an array of the response bodies
            console.log(num_arr.length + '个文件下载完成~~~')
        })
    })
}

start();
