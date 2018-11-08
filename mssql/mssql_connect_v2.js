var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

exports.mssql = function () {
    config = {
        'userName': 'sa',
        'password': 'xxxxxx',
        'server': '192.168.1.3',
        'options': {
            'port': 1433,
            'database': 'database',
            encrypt: false,
            tdsVersion: "7_1"//sql server 2000 的需要加上这个，其他版本请注释此参数
        }
    }
    this.connection = new Connection(config);
    this.query = function (str, callback) {          //执行查询
        var connection = this.connection;
        var rows = {};
        connection.on('connect', function (err) {                 //连接数据库，执行匿名函数
            if (err) {
                callback({'err': err['message'] + '请检查账号、密码是否正确,且数据库存在'});
            } else {
                var request = new Request(str, function (err, rowCount) {
                    if (err) err = {'err': err['message']};
                    callback(err, rows);
                    connection.close();
                });

                var n = 0;
                request.on('row', function (columns) {                            //查询成功数据返回
                    rows[n] = {};
                    columns.forEach(function (column) {
                        rows[n][column.metadata.colName] = column.value;        //获取数据
                    });
                    n++;
                });
                connection.execSql(request);                                 //执行sql语句
            }
        });
    }


}