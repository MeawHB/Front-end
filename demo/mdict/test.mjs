import Mdict from "js-mdict";

const mdict = new Mdict("o7.mdx");
console.log(mdict.lookup("hello"));
console.log(mdict.prefix("hello"));
//node --experimental-modules ./test.mjs