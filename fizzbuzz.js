// Fizz buzz.
// from 1 to 100, return fizz for numbers that are divisible of 3,
// return buzz for numbers that are divisible of 5
// return fizzbuzz for numbers that are divisible by 3 & 5
// otherwise, just return the number
// Sample output from 1 to 10: 
// 1 
// 2
// fizz
// 4
// buzz
// fizz
// 7
// 8
// fizz
// buzz

// console log
// function fizzbuzz() {
//     for (let i = 1; i <= 100; i++) {
//         if ( i % 3 === 0 && i % 5 === 0 ) {
//             console.log('fizzbuzz')
//         } else if ( i % 3 === 0 ) {
//             console.log('fizz') 
//         } else if ( i % 5 === 0 ) {
//             console.log('buzz') 
//         } else {
//             console.log(i)
//         }
//     }
// }

// fizzbuzz()

// returns an array
// function fizzbuzz() {
//     const arr = [];
//     for (let i = 1; i <= 100; i++) {
//         let current = i;
//         if ( current % 3 === 0 && current % 5 === 0 ) {
//             arr.push('fizzbuzz')
//         } else if ( current % 3 === 0 ) {
//             arr.push('fizz')
//         } else if ( current % 5 === 0 ) {
//             arr.push('buzz')
//         } else {
//             arr.push(current)
//         }
//     }
//     return arr;
// }

// n term of fizzbuzz
function fizzBuzz(range, n) {
    const arr = []
    for ( i = 1; i <= range; i++) {
        if (i % 3 === 0 && i % 5 === 0) {
            arr.push(i)
        }
    }
    return arr[n-1]
}

console.log(fizzBuzz(100, 2))