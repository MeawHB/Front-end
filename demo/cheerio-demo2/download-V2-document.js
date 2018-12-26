const request = require('request');
const config = require('./config.json');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const https = require('https');
const readline = require('readline');

//等待用户输入 参考nodejs文档，稍加修改，resolve就是返回str
function read() {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '请选择课程（数字）：'
        });
        // 显示 请选择课程（数字）： 这句话
        rl.prompt();
        //str 存储用户输入的内容
        let str = '';
        rl.on('line', (line) => {
            //把输入的一行放入到str
            str = line;
            //关闭rl，会出发下面的 .on('close', () => {
            rl.close()
        }).on('close', () => {
            //返回str
            resolve(str)
        });
    });
}


//单行显示
function log(str) {
    //光标上移n1行
    process.stdout.write('\033[1A');
    //\r移动到行首  033[K 清楚光标到行尾
    process.stdout.write('\r\033[K');
    console.log('\x1B[36m%s\x1B[0m', str);
}

//下载视频
function loadvideo(url, filename) {
    var pm = new Promise(function (resolve, reject) {
        https.get(url, function (res) {
            res.setEncoding('binary');
            let length = res.headers['content-length'];
            let video = '';
            console.log('');
            res.on('data', function (data) {
                video += data;
                log(filename + '  ' + (video.length / length * 100).toFixed(2) + '%')
            });
            res.on('end', function () {
                fs.writeFileSync(filename, video, {encoding: 'binary'});
                console.log(filename + '---下载成功');
                resolve(filename + '---下载成功');
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

/**
 * 写成promise，这样可以用async
 * request请求并用resolve返回一个对象，
 * body里面存的是网页内容
 * res里面存的是服务器返回的响应头，里面有cookie，给服务器提交用户名密码后，下次请求就直接用cookie了
 {
    err: err,
    res: res,
    body: body
    }
 * */

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
    /**
     * optslogin request模块请求需要传入的参数
     @type {{
               url: 请求地址,
               method: 请求方式为GET,
               headers: 请求头，有很多信息，这里只写一个，能成功就行了
       }}
     */
    let optslogin = {
        url: 'https://wl.scutde.net/edu3/edu3/login.html',
        method: 'GET',
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:64.0) Gecko/20100101 Firefox/64.0",
        }
    };
    /**
     * reslogin 是请求后返回的对象
     {
        err: err,  错误信息
        res: res,  响应头
        body: body  网页内容
        }
     */
    let reslogin = await send(optslogin);

    /**
     * optslogin request 模块请求需要传入的参数
     * url是请求的地址
     * method：请求方法用POST
     * headers是请求头，这里多了个cookie，表示用的是前面请求的cookie
     * 连同用户名密码一起发送到服务器，服务器会把当前cookie设置为有效登陆状态
     * 下次请求需要验证密码的页面时，在请求头加入当前这个cookie就行了
     * reslogin.res.headers['set-cookie']
     reslogin是前面返回的对象
     res是返回对象里面的响应头
     headers['set-cookie']  headers是个数组，里面有一项叫set-cookie
     reslogin.res.headers['set-cookie']就是取得前面服务器返回的cookie
     * form: {authenticationFailureUrl: string, defaultTargetUrl: string, j_username, j_password, fromNet: string}
     * }}
     * forms是表单信息 内容可以到 浏览器 右键 查看元素 网络 左边下面的请求 参数 里面看到
     */

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
    //resform是发送用户名密码后，服务器返回的信息，因为后面是直接跳转，所以这个页面可以不需要
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
    //resframe是请求课程列表返回的对象
    let resframe = await send(optsframe);

    //解析课表
    /**
     * let $ = cheerio.load(resframe.body);固定写法
     * resframe.body 是前面请求课程列表返回的对象里面的页面
     */
    let $ = cheerio.load(resframe.body);
    //类似jquery 取id为tab 下面的tr 下面的第二个td 下面的 a标签
    let frameobj = $("#tab tr td:nth-child(2) a");
    let framearr = [];
    //遍历循环 index是数组下标, element是每个数组元素
    frameobj.each(function (index, element) {
        //      framearr 的格式  两个courseid是后面拼接页面地址需要用到的
        //     { name: '网上学习指南',
        //     courseId: 'FBECB1BCE79E171EE030007F01001614',
        //     planCourseId: 'ff808081645dce9501646305efe158d1' }
        framearr.push({
            //element的children的第0个元素下面的data
            name: element.children[0].data,
            //element的attribs的onclick  用\切分 取第2个
            courseId: element.attribs.onclick.split('\'')[1],
            //element的attribs的onclick  用\切分 取第4个
            planCourseId: element.attribs.onclick.split('\'')[3]
        })
    });
    console.log('获取课表成功。。。');


    //操作上面的framearr 控制台列出 数字以及代表的课程名称
    for (let i = 0; i < framearr.length; i++) {
        console.log(i, framearr[i].name)
    }
    //等待用户输入，具体看read函数，num是选择课程的号码，也就是数组的下标
    let num = await read();
    // tmpobj是选择的课程，从前面的数组取出
    let tmpobj = framearr[num];

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
    for (let i = 0; i < idarr.length; i++) {
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
            let href = $(this).attr('href');
            let href2 = '';
            if ($(this).attr('onclick')) {
                href2 = $(this).attr('onclick').split('\'')[5];
            }
            if (href2.indexOf("wmv") != -1) {
                //去掉重复url
                let flag = true;
                for (let i = 0; i < video_arr.length; i++) {
                    if (video_arr[i].url === href2) {
                        flag = false
                    }
                }
                if (flag) {
                    video_arr.push({
                        name: idarr[i].name,
                        url: href2,
                        prefix: 'wmv'
                    })
                }
            }
            if (href.indexOf("video") != -1) {
                video_arr.push({
                    name: idarr[i].name,
                    url: href,
                    prefix: 'html'
                })
            }
        });
    }

    console.log(video_arr);
    console.log('获取视频网页地址成功');

    let GREEN = "\033[32m";
    let END = "\033[0m";
    console.log();
    //下载
    for (let i = 0; i < video_arr.length; i++) {
        let filepath = '';
        let fileurl = '';
        if (video_arr[i].prefix === 'html') {
            //MP4
            let tmparr = video_arr[i].url.split('/');
            let filename = tmparr[tmparr.length - 1].replace('html', 'mp4');
            filepath = video_arr[i].name + '/' + filename;
            fileurl = video_arr[i].url.substring(0, video_arr[i].url.length - 4) + 'mp4';
            console.log(fileurl)
        }
        if (video_arr[i].prefix === 'wmv') {
            //wmv
            let tmparr = video_arr[i].url.split('/');
            let filename = tmparr[tmparr.length - 1];
            filepath = video_arr[i].name + '/' + filename;
            fileurl = video_arr[i].url;
            console.log(fileurl)
        }
        mkdirsSync(video_arr[i].name);
        if (fs.existsSync(filepath)) {
            console.log(filepath + '  已存在');
            continue
        }
        console.log('视频文件总数：', video_arr.length, '  开始下载第： ', GREEN, i + 1, END, '个');
        await loadvideo(fileurl, filepath)
    }
    console.log('下载完成～～～');
    process.exit(0)
}

download();
