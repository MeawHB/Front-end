let number = 100;
let number2 = 100;

for (let i = 0; i < 100; i++) {
    setTimeout(() => {
        number2++;
        console.log(number2)
    }, 100)
}

//
// setInterval(function(){
//     if (number2>number){
//         console.log(number2,number)
//         console.log(exit)
//     }
//     console.log(number2,number)
// },1000)

