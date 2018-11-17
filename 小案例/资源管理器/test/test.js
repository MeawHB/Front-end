arr_data = ['-----------------------------12877276062472',
    'Content-Disposition: form-data; name="attachments[]"; filename="新建文本文档.txt"',
    'Content-Type: text/plain',
    '',
    '111',
    '-----------------------------12877276062472--',
    ''];
// let arr_data = data.split('\r\n');
// console.log('arr_data', arr_data);

let arr_file_data = arr_data[1].split('\"');
console.log('arr_file_data', arr_file_data);
console.log('arr_file_data[4]:', arr_file_data[3]);
console.log(arr_data[4]);
