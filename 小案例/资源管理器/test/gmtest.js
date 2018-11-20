// var fs = require('fs')
//     , gm = require('gm');

console.log('11111')
// resize and remove EXIF profile data
// gm('C:\\Users\\jf\\Desktop\\tupianceshi\\111.jpg')
//     .resize(240, 240)
//     .noProfile()
//     .write('C:\\Users\\jf\\Desktop\\tupianceshi\\111-gm.jpg', function (err) {
//         console.log('22222')
//         if (!err) console.log('done');
//     });

var gm = require('gm');
gm('C:\\Users\\jf\\Desktop\\tupianceshi\\111.jpg')
    .resize(200,0)     //设置压缩后的w/h
    .setFormat('JPEG')
    .quality(70)       //设置压缩质量: 0-100
    .strip()
    .autoOrient()
    .write('C:\\Users\\jf\\Desktop\\tupianceshi\\111gm.jpg' ,
        function(err){console.log("err: " + err);})
// //2, 获取图片尺寸
// gm("图片路径").size(function(err,value){});
// //3, 获取图片大小
// gm("图片路径").filesize(function(err,value){});```