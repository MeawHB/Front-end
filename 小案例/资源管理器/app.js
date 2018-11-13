var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var WenJianMoKuai = require("./WenJianMoKuai");
var getconfig = require("./getconfig");

http
    .createServer(function (req, res) {
        var parseObj = url.parse(req.url, true);
        var url_path = parseObj.pathname;
        if (url_path === '/') {
            fs.readFile('./views/files.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        } else if (url_path.indexOf('/public') === 0) {
            fs.readFile('.' + url_path, function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        } else if (url_path.indexOf('/files') === 0) {
            let file_path = getconfig().directory + url_path.substring(6);
            console.log('请求文件路径: ', file_path);
            file_path = decodeURI(file_path);
            console.log('请求文件路径decodeURI: ', file_path);
            console.log('请求文件是否文件夹: ', WenJianMoKuai.getShiFouWenJianJia(file_path));

            if (WenJianMoKuai.getShiFouWenJianJia(file_path)) {
                var filelist = WenJianMoKuai.getWenJianJia(url_path, file_path);
                // console.log(filelist)
                res.writeHead(200, {
                    "Content-Type": 'application/json',
                    'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                });
                res.end(JSON.stringify(filelist))
            } else {
                var f = fs.createReadStream(file_path);
                let arr = file_path.split('/');
                file_name = encodeURI(arr[arr.length - 1]);
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream;charset=utf8',
                    'Content-Disposition': 'attachment; filename*="utf8\'\'' + file_name + '"'
                });
                f.pipe(res);
            }
        } else {
            fs.readFile('./views/404.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        }
    })
    .listen(getconfig().port, function () {
        console.log('running...')
    });

