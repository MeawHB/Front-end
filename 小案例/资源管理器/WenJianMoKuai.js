/**
 * 参考链接 https://github.com/shushanfx/nfile
 */
var fs = require("fs");
var path = require("path");
var getconfig = require("./getconfig");
var jszip = require("./public/jszip");

class WenJianMoKuai {
    /**
     * 打包文件夹
     */
    zipWenJianJia(dir_path){
        if(this.getShiFouWenJianJia(dir_path)){
            let ab_path = this.getJueDuiLuJing(dir_path);
            let zip_name = path.basename(dir_path);

            console.log('dir_path', dir_path)
            console.log('ab_path', ab_path)
            console.log('zip_name',zip_name)

            var zip = new jszip()
            zip.folder(zip_name)

            var ziWenJianJia = function(ab_path,zip_name,zip) {
                var list = fs.readdirSync(ab_path)
                list.forEach(function(item) {
                    var new_ab_path = path.join(ab_path, item)
                    var st = fs.statSync(new_ab_path)
                    if (!st.isDirectory()) {
                        zip.file(zip_name+'/'+item, fs.readFileSync(new_ab_path))
                    } else{
                        ziWenJianJia(new_ab_path,zip_name+'/'+item, zip)
                    }
                })
            }
            ziWenJianJia(ab_path,zip_name,zip)
            // console.log(zip);
            return {zip_name:zip_name, zip:zip};
        }
    }

    /**
     * 获取传入文件夹路径内的文件数组列表
     */
    getWenJianJia(url_path, file_path) {
        let list = [];
        let temp_path = this.getJueDuiLuJing(file_path);
        var files = fs.readdirSync(temp_path);
        if (files.length > 0) {
            files.forEach(item => {
                var ab_path = path.join(temp_path,item);
                var stats = fs.statSync(ab_path);

                if(stats.isDirectory()){
                    list.push({file_path:ab_path, url_path:url_path+'/'+item, file_name:item, isDirectory:true})
                }else{
                    list.push({file_path:ab_path, url_path:url_path+'/'+item, file_name:item, isDirectory:false})
                }
            })
        }
        return list;
    }

    /**
     * 传入路径，返回是否是文件夹
     */
    getShiFouWenJianJia(file_path){
        let ab_path = this.getJueDuiLuJing(file_path);
        let stats = fs.statSync(ab_path);
        if(stats.isDirectory()){
            return true;
        }else{
            return false;
        }
    }

    /**
     * 传入相对或者绝对路径，返回绝对路径
     */
    getJueDuiLuJing(temppath) {
        if (path.isAbsolute(temppath)) {
            return temppath;
        } else {
            return path.join(__dirname, temppath);
        }
    }
    /**
     * 获取后缀名
     * filePath: "http://127.0.0.1/index.html?a=1&&b=2"     返回 html
     */
    getHouZhuiMing(filePath) {
        var ext = "";   //后缀名
        var temp = [];  //存放分割后的文件路径数组
        var url = filePath;
        if (filePath) {
            //去掉url的？后面的字符串
            if (url.indexOf("?") !== -1) {
                temp = url.split("?");
                url = temp[0];
            }
            //获取后缀名
            if (url) {
                temp = url.split(".");
                ext = temp[temp.length - 1];
            }
        }
        return ext;
    }
}

module.exports = new WenJianMoKuai();