var path = require("path");
var fs = require("fs");
var WenJianMoKuai = require("./WenJianMoKuai");
var getconfig = require("./getconfig");

url = "http://127.0.0.1/index.html?a=1&&b=2"

var ext = WenJianMoKuai.getHouZhuiMing(url)

console.log('ext',ext);

var config = getconfig()
console.log('config:',getconfig().port)

console.log(WenJianMoKuai.getJueDuiLuJing("./public"));
console.log(WenJianMoKuai.getJueDuiLuJing("c:\\"));
console.log('ttttt',WenJianMoKuai.getJueDuiLuJing("../../../../"));

var file = fs.readdirSync('d:\\')
// console.log(file)

var stats = fs.statSync("D:\\github\\Front-end\\小案例\\资源管理器\\test.js");
// console.log(stats);

// var list = WenJianMoKuai.getWenJianJia("../../../../cp");
// console.log(list);

var myzip =  WenJianMoKuai.zipWenJianJia("D:\\github\\Front-end\\小案例\\资源管理器\\test")
console.log('myzip',myzip)

