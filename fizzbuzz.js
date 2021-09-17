// Calculate the nth fizzBuzz
// Fizzbuzz - conditions:
// If a number is divisible by 3 - Fizz
// If a number is divisible by 5 - Buzz
// If a number is divisible by 3 and 5 - FizzBuzz


function fizzBuzz(n) {
    let counter = 1
    let currentFizzBuzz = 0
    // while the number of fizzBuzzes that if find, is less than N, keep going
    while(currentFizzBuzz < n) {
        if(counter % 3 === 0 && counter % 5 === 0) {
            currentFizzBuzz++
            if(currentFizzBuzz === n) {
                return counter
            }
        }
        counter++
    }
    return counter
}

// Hack - 
// function fizzBuzzFast(n) {
//     return n * 3 * 5
// }

console.log(fizzBuzz(40000))





// function fizzBuzz(num) {
//     for(let i = 1; i <= num; i++) {
//         if(i % 3 === 0 && i % 5 === 0) {
//             console.log('fizzBuzz')
//         } else if(i % 5 === 0) {
//             console.log('buzz')
//         } else if(i % 3 === 0) {
//             console.log('fizz')
//         } else {
//             console.log(i) 
//         }
//     }
// }

// fizzBuzz(100)