var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');
var querystring = require('querystring');
var execsql = require("./mySql2000");

http
    .createServer(function (req, res) {
        var parseObj = url.parse(req.url, true);
        var url_path = parseObj.pathname;
        if (url_path === '/') {
            fs.readFile('./views/index.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        } else if (url_path.indexOf('/canfeibumen') === 0) {
            execsql("select * from hrjisuanjieguo").then(data => {
                res.writeHead(200, {
                    "Content-Type": 'application/json',
                    'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                });
                res.end(JSON.stringify(data))
            })
        } else if (url_path.indexOf('/public') === 0) {
            fs.readFile('.' + url_path, function (err, data) {
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

