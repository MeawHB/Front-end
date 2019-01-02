const mdict = require('mdict');

async function search(word, dictname) {
    // let word = 'plague'
    // let dictname = 'o8.mdx'
    let dict = await mdict.dictionary('./mdx/' + dictname);
    let words = await dict.search({
        phrase: word,
        max: 20
    });

    let tmpword = JSON.parse(JSON.stringify(words[0]));
    console.log('words[:', words);
    console.log('words[0]:', words[0]);
    console.log('tmpword:', tmpword);
    if (tmpword !== word) {
        //复数s es 过去式d ed
        if (word.endsWith('s') || word.endsWith('d')) {
            word = word.substring(0, word.length - 1);
            words = await dict.search(word, dictname);
            //es
            if (tmpword !== word && (word.endsWith('e'))) {
                word = word.substring(0, word.length - 1);
                words = await dict.search(word, dictname)
            }
            // 's
            if (tmpword !== word && word.endsWith('\'')) {
                word = word.substring(0, word.length - 1);
                words = await dict.search(word, dictname)
            }
        }
        //进行时ing
        if (word.endsWith('ing')) {
            word = word.substring(0, word.length - 3);
            console.log('ing:', word);
            words = await dict.search(word, dictname);
            if (tmpword !== word) {
                word = word + 'e';
                console.log('e:', word);
                words = await dict.search(word, dictname)
            }
        }
    }

    let definitions = await dict.lookup(words[0]);

    if (dictname === 'o8.mdx') {
        //去掉\r\n  替换css
        definitions = definitions[0].replace(/\r\n/g, '').replace(/href="O8C.css/, 'href="public/o8.css');
        //去除没用的空格
        // definitions = definitions.replace(/> +?</g, '><')
        //音频图标 英 美
        definitions = definitions.replace(/uk_pron.png/g, 'public/o8/uk_pron.png').replace(/us_pron.png/g, 'public/o8/us_pron.png');
        //声音处理
        definitions = definitions.replace(/sound:\/\//g, 'public/o8/');
        //图片处理
        definitions = definitions.replace(/src="\/thumb/g, 'src="public/o8/thumb');
        definitions = definitions.replace(/src="\/pic/g, 'src="public/o8/pic');
        //symbols文件夹
        definitions = definitions.replace(/src="\/symbols/g, 'src="public/o8/symbols');
        //去除link标签，不然页面每次载入都会抖动
        definitions = definitions.replace(/<link.*?>/g, '');
        // console.log(definitions)
    }
    if (dictname === 'o2.mdx') {
        //去掉\n\r\n  替换css
        definitions = definitions[0].replace(/\n\r\n/g, '');
        //去除link标签，不然页面每次载入都会抖动
        definitions = definitions.replace(/<link.*?>/g, '');
        //去除style标签
        definitions = definitions.replace(/<style.*?<\/style>/g, '');
        definitions = definitions.replace(/style=".*?"/g, '');
        // console.log('definitionso2:',definitions);
    }

    if (dictname === 'o1.mdx') {
        //去掉\r\n  替换css
        definitions = definitions[0].replace(/\n\r\n/g, '');
        //去除link标签，不然页面每次载入都会抖动
        definitions = definitions.replace(/<link.*?>/g, '');
        // console.log('definitionso1:',definitions);
    }
    // console.log(words);
    // console.log(definitions);
    return {
        words: words,
        definitions: definitions
    }
}

module.exports = search;



