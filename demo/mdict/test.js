let char = 'a';
let flag = false;
let zimu = /[a-zA-Z]/i;
console.log(zimu.test(char));
if (!zimu.test(char)) {
    flag = true;
}
console.log(flag);

