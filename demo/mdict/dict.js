var http = require('http');
var fs = require('fs');
var url = require('url');
const querystring = require('querystring');
var dict = require('./search');

http
    .createServer(function (req, res) {
        var parseObj = url.parse(req.url, true);
        var url_path = parseObj.pathname;
        console.log('请求路径：', url_path);
        if (url_path === '/') {
            fs.readFile('./dict.html', function (err, data) {
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
        } else if (url_path.indexOf('/word') === 0) {
            var data = '';
            req.on('data', function (chunk) {
                data += chunk;
            });
            req.on('end', function () {
                data = decodeURI(data);
                var dataObject = querystring.parse(data);
                search(dataObject.word, 'o8.mdx')

            });

            async function search(word, d) {
                let result = await dict(word, d);
                let str = JSON.stringify(result);
                // console.log(str)
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(str)
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
    .listen(3000, function () {
        console.log('running...')
    });

