var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var template = require('art-template');
var myquery = require('./mssql_query');
var myquery_v2 = require('./mssql_query_v2')


http
    .createServer(function (req, res) { // 简写方式，该函数会直接被注册为 server 的 request 请求事件处理函数
        // 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
        var parseObj = url.parse(req.url, true);

        // 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）
        var pathname = parseObj.pathname;

        if (pathname === '/') {
            fs.readFile('./views/index.html', function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                ;(async () => {
                    var baoyi = await myquery_v2.myquery("select * from hrjisuanjieguo where bumencaiwu not like '%包装%'")
                    var baozhuang = await myquery_v2.myquery("select * from hrjisuanjieguo where bumencaiwu like '%包装%'")
                    var hedui = await myquery_v2.myquery("select * from hrjisuanjieguohedui")
                    var htmlStr = template.render(data.toString(), {
                        baoyi: baoyi,
                        baozhuang: baozhuang,
                        hedui: hedui
                    });
                    res.end(htmlStr)
                })()
            })
        } else if (pathname === '/getexcel') {
            myquery.myquery('select * from hrjisuanjieguo', function (data) {
                arr = []
                for (i in data) {
                    arr.push(data[i])
                }
                res.writeHead(200, {'Content-Type': 'application/json'});   //不加这句会报错
                res.end(JSON.stringify(arr))
            })
        } else if (req.method === 'POST' && pathname ==='/gengxin') {
            var postData = '';
            // post请求的参数不是一次性就发送的，因为post请求可以发送大量的数据
            // 浏览器每发送一次数据包（chuck），该函数会调用一次。
            req.on('data',function (chuck) {
                postData += chuck;
            });
            // 到post请求数据发完了之后会执行一个end事件，这个事件只执行一次
            req.on('end', function () {
                var postObjc = querystring.parse(postData);
                console.log(postObjc);
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.end(JSON.stringify(postObjc))
            })
        } else if (pathname.indexOf('/public/') === 0) {
            // 统一处理：
            //    如果请求路径是以 /public/ 开头的，则我认为你要获取 public 中的某个资源
            //    所以我们就直接可以把请求路径当作文件路径来直接进行读取
            fs.readFile('.' + pathname, function (err, data) {
                if (err) {
                    return res.end('404 Not Found.')
                }
                res.end(data)
            })
        } else {
            console.log('err')
            // 其它的都处理成 404 找不到
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

