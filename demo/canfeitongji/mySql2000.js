const sql = require('mssql');

module.exports = async function (sql_str) {
    const config = {
        user: 'sa',
        password: 'xxxx',
        server: '192.168.1.30',
        database: 'test',
        options: {
            tdsVersion: "7_1"  // sql2000
        }
    };
    let pool = await sql.connect(config);
    let result = await pool.request().query(sql_str);
    sql.close();
    return result;
};
