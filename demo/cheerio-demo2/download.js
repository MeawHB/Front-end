const request = require('request');
const config = require('./config.json');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

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

// request请求并返回
function send(opts) {
    return new Promise((resolve, reject) => {
        request(opts, function (err, res, body) {
            resolve({
                err: err,
                res: res,
                body: body
            });
        });
    });
}

async function download() {
    //登陆界面获取cookie
    let optslogin = {
        url: 'https://wl.scutde.net/edu3/edu3/login.html',
        method: 'GET',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
        }
    };
    let reslogin = await send(optslogin);

    //post发送用户名密码信息
    let optsform = {
        url: "https://wl.scutde.net/edu3/j_spring_security_check",
        method: 'POST',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
            Cookie: reslogin.res.headers['set-cookie'], //这里是登陆后得到的cookie,(重点)
        },
        form: {
            authenticationFailureUrl: '/edu3/login.html?error=true',
            defaultTargetUrl: "/edu3/framework/index.html",
            j_username: config.username,
            j_password: config.password,
            fromNet: 'pub'
        }
    };
    let resform = await send(optsform);
    console.log('登陆成功。。。');

    //获取课程列表
    let optsframe = {
        url: 'https://wl.scutde.net/edu3/edu3/framework/index.html',
        method: 'GET',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
            Cookie: reslogin.res.headers['set-cookie']
        }
    };
    let resframe = await send(optsframe);

    //解析课表
    let $ = cheerio.load(resframe.body);
    let frameobj = $("#tab tr td:nth-child(2) a");
    let framearr = [];
    frameobj.each(function (index, element) {
        //     { name: '网上学习指南',
        //     courseId: 'FBECB1BCE79E171EE030007F01001614',
        //     planCourseId: 'ff808081645dce9501646305efe158d1' }
        framearr.push({
            name: element.children[0].data,
            courseId: element.attribs.onclick.split('\'')[1],
            planCourseId: element.attribs.onclick.split('\'')[3]
        })
    });
    console.log(framearr);
    console.log('获取课表成功。。。');


    let tmpobj = framearr[7];
    let optslearn = {
        url: 'https://wl.scutde.net/edu3/edu3/learning/interactive/main.html?planCourseId=' + tmpobj.planCourseId + '&courseId=' + tmpobj.courseId + '&isNeedReExamination=',
        method: 'GET',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
            Cookie: reslogin.res.headers['set-cookie']
        }
    };
    let reslearn = await send(optslearn);
    // console.log(reslearn.body)

    let strlearn = reslearn.body;
    //取var zNodes之后第一对有效的中括号内的内容
    let start = strlearn.indexOf('var zNodes');
    let end = start;
    let left = 0;
    let right = 0;
    for (let i = start; i < strlearn.length; i++) {
        //记录start
        if (strlearn[i] === '[' && left === 0) {
            start = i
        }
        if (strlearn[i] === '[') {
            left++;
        }
        if (strlearn[i] === ']') {
            right++;
        }
        //记录end
        if (left === right && left !== 0) {
            end = i + 1;
            break
        }
    }
    let zhangjie_arr = JSON.parse(strlearn.substring(start, end));

    let idarr = [];

    function foo(arr, filename) {
        for (let i = 0; i < arr.length; i++) {
            let tmpname = '';
            if (filename) {
                tmpname = filename + '/' + arr[i].name
            } else {
                tmpname = arr[i].name
            }
            idarr.push({
                name: tmpname,
                id: arr[i].id.substring(0, arr[i].id.indexOf(','))
            });
            if (arr[i].nodes) {
                foo(arr[i].nodes, tmpname)
            }
        }
    }

    foo(zhangjie_arr, '');
    console.log(idarr);
    console.log('获取章节成功。。。');

    //获取视频网页
    let video_arr = [];
    for (let i = 2; i < idarr.length; i++) {
        let optsshipin = {
            url: 'https://wl.scutde.net/edu3/edu3/learning/interactive/materesource/list.html?syllabusId=' + idarr[i].id,
            method: 'POST',
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
                Cookie: reslogin.res.headers['set-cookie']
            }
        };
        let resshipin = await send(optsshipin);
        let $ = cheerio.load(resshipin.body);
        $('a').each(function () {
            var href = $(this).attr('href');
            if (href.indexOf("video") != -1) {
                video_arr.push({
                    name: idarr[i].name,
                    url: href
                })
            }
        });
    }
    console.log(video_arr);
    console.log('获取视频网页地址成功');

    //下载
    for (let i = 2; i < idarr.length; i++) {

    }
}

download();
