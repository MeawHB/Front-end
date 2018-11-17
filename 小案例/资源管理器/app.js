var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var WenJianMoKuai = require("./WenJianMoKuai");
var getconfig = require("./getconfig");
var jszip = require("./public/jszip");

http
    .createServer(function (req, res) {
        // console.log('req.url:',req.url)
        // console.log('querystring.parse',querystring.parse(req.url))
        var parseObj = url.parse(req.url, true);
        var url_path = parseObj.pathname;
        var obj_query = parseObj.query;
        // console.log('obj_query',obj_query)

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
            file_path = decodeURI(file_path);   //中文乱码解码
            url_path = decodeURI(url_path);
            console.log('请求文件路径decodeURI: ', file_path);
            console.log('请求文件是否文件夹: ', WenJianMoKuai.getShiFouWenJianJia(file_path));

            if (WenJianMoKuai.getShiFouWenJianJia(file_path)) {
                if(obj_query.download === "yes"){
                    let obj_zip = WenJianMoKuai.zipWenJianJia(file_path);
                    console.log('kaishixiazai:');
                    res.writeHead(200, {
                        'Content-Type': 'application/octet-stream;charset=utf8',
                        'Content-Disposition': 'attachment; filename*="utf8\'\'' + obj_zip.zip_name + '.zip"'
                    });
                    obj_zip.zip.generateNodeStream({ streamFile: true })
                        .pipe(res)
                        .on('finish', function() {
                            res.end();
                        });
                }else{
                    var filelist = WenJianMoKuai.getWenJianJia(url_path, file_path);
                    // console.log(filelist)
                    res.writeHead(200, {
                        "Content-Type": 'application/json',
                        'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                    });
                    res.end(JSON.stringify(filelist))
                }

            } else {
                console.log('jszip');
                var f = fs.createReadStream(file_path);
                let arr = file_path.split('/');
                file_name = encodeURI(arr[arr.length - 1]);
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream;charset=utf8',
                    'Content-Disposition': 'attachment; filename*="utf8\'\'' + file_name + '"'
                });
                f.pipe(res);
            }
        } else if (url_path.indexOf('/upload') === 0) {
            console.log('start-------------upload---------------------------------------');
            //设置二进制编码
            req.setEncoding('binary');
            var postData = '';
            req.on('data', function (chunk) {
                postData += chunk;
            });
            req.on('end', function () {
                //请求头的boundary
                let boundary = querystring.parse(req.headers['content-type'], '; ', '=').boundary;
                //分析后返回文件和自定义数据的对象
                // data_obj: { url: '/files/03-JavaScript-高级-第1天/04源代码/.idea',
                //     parent_url: '/files/03-JavaScript-高级-第1天/04源代码',
                //     file_name: '新建文本文档.txt',
                //     file_data: '111' }
                let data_obj = WenJianMoKuai.getPostFenXi(postData, boundary);
                // console.log('data_obj:',data_obj)
                let write_path = getconfig().directory + data_obj.url.substring(6);
                write_path = WenJianMoKuai.getJueDuiLuJing(write_path);

                console.log('write_path:', write_path);
                //写入
                let fsw = fs.createWriteStream(write_path + '/' + data_obj.file_name);
                fsw.write(data_obj.file_data, 'binary');
                fsw.end();
                res.writeHead(200, {'Content-Type': 'application/json'});
                console.log('end-------------upload---------------------------------------');
                res.end(JSON.stringify({file_name: data_obj.file_name, size: data_obj.file_data.length}))
            })

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

