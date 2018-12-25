const fs = require('fs');
const path = require('path');

//创建文件夹
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

mkdirsSync('离散数学/第六章 特殊的图类/第三节 树与有向树');

fs.createWriteStream();