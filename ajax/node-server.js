var http = require('http');
var url = require('url');
var querystring = require('querystring');

http
    .createServer(function (req, res) { // 简写方式，该函数会直接被注册为 server 的 request 请求事件处理函数
        // 使用 url.parse 方法将路径解析为一个方便操作的对象，第二个参数为 true 表示直接将查询字符串转为一个对象（通过 query 属性来访问）
        var parseObj = url.parse(req.url, true);
        // console.log(parseObj)
        // 单独获取不包含查询字符串的路径部分（该路径不包含 ? 之后的内容）
        var pathname = parseObj.pathname;
        console.log('pathname: ', pathname)
        if (pathname === '/' && req.method === 'GET') {
            //解决跨域请求
            res.writeHead(200, {
                "Content-Type": 'text/plain',
                'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
            });
            res.end(JSON.stringify({'nodejs': 'get'}))

        }
        else if(req.method === 'POST' && pathname === '/'){
            var post = '';
            // 通过req的data事件监听函数，每当接受到请求体的数据，就累加到post变量中
            req.on('data', function(chunk){
                post += chunk;
            });
            // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式，然后向客户端返回。
            req.on('end', function(){
                post = querystring.parse(post);
                console.log('post:', post);
                res.writeHead(200, {
                    "Content-Type": 'text/plain',
                    'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
                });
                res.end(JSON.stringify({'nodejs': 'post'}));
            });
        }else{
            console.log('404')
            res.writeHead(200, {
                "Content-Type": 'text/plain',
                'charset': 'utf-8', 'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS'
            });
            res.end("404");
        }
    })
    .listen(3000, function () {
        console.log('running...')
    });
