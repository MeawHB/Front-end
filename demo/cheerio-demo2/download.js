let request = require('request');
let config = require('./config.json');

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

    console.log(resframe.body)

}

download();
