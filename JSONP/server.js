const http = require('http');
const url = require('url');

const server = http.createServer();

server.on('request', function (req, res) {
    let {pathname: url_path, query} = url.parse(req.url, true);
    console.log('url.parse(req.url, true): ', url.parse(req.url, true));
    console.log('url_path:', url_path);
    console.log('query.callback:', query.callback);
    if (url_path === '/getscript') {
        data = {
            name: 'keyide',
            age: 999,
            gender: 'boy'
        };
        //对象解构赋值
        let {age, gender} = data;
        console.log('age:', age);
        console.log('gender:', gender);
        scriptStr = `${query.callback}(${JSON.stringify(data)})`;
        res.end(scriptStr)
    } else {
        res.end('404')
    }
});

server.listen(3000, function () {
    console.log('running....')
});