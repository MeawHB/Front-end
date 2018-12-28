const mdict = require('mdict');

async function search(word, dictname) {
    // let word = 'plague'
    // let dictname = 'o8.mdx'
    let dict = await mdict.dictionary('./mdx/' + dictname);
    let words = await dict.search({
        phrase: word,
        max: 10
    });
    let definitions = await dict.lookup(words[0]);

    if (dictname === 'o8.mdx') {
        //去掉\r\n  替换css
        definitions = definitions[0].replace(/\r\n/g, '').replace(/href="O8C.css/, 'href="public/o8.css');
        //音频图标 英 美
        definitions = definitions.replace(/uk_pron.png/g, 'public/o8/uk_pron.png').replace(/us_pron.png/g, 'public/o8/us_pron.png');
        //声音处理
        definitions = definitions.replace(/sound:\/\//g, 'public/o8/');
        console.log(definitions)
    }

    // console.log(words);
    // console.log(definitions);
    return {
        words: words,
        definitions: definitions
    }
}

module.exports = search;



