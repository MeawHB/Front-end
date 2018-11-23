var mssql = require('./mssql_connect_v2');

exports.myquery = function myquery(sqlstr) {
    return new Promise(function (resolve, reject) {
        var conn = new mssql.mssql();
        conn.query(sqlstr, function (err, data) {
            if (!err) {
                resolve(data)
            }
            else {
                reject(err)
            }
        });
    });
};
//
// ;(async () => {
//     var mydata = await myquery("select * from hrjisuanjieguo")
//     console.log(mydata)
// })()
