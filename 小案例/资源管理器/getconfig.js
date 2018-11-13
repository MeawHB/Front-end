var fs = require('fs');

/**
 * 同步获取配置文件信息，转换成js对象返回
 */
function getconfig(){
    return JSON.parse(fs.readFileSync('./config.json').toString());
}

module.exports = getconfig