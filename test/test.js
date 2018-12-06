var http = require('http');


var url = 'http://manhua-me.oss-cn-hongkong.aliyuncs.com/statics/images/mh/65/3f/653f0d13b4bae66693b84f52a9b59acd.jpg';

let p = url.match(/http:\/\/(.+?)(\/.+)/i);
console.log(p[1]);
console.log(p[2]);
const options = {
    hostname: p[1],
    port: 80,
    path: p[2],
    method: 'GET',
};
const req = http.request(options, (res) => {
    res.setEncoding('binary');
    let html = '';
    res.on('data', function (data) {
        html += data
    });
    res.on('end', () => {
        console.log(html);
    });
});
req.on('error', (e) => {
    console.error(e);
});
req.end();
