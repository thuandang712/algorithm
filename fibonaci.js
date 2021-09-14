// write a function called fib(n) that takes in a number and returns the n-th number of the Fibonaci sequence
// Fibonacci: fib(n) =  1,   1,  2,  3,  5,  8,  13, ...
//               n      1    2   3   4   5   6   7 
// the 1st two numbers are 1; to generate the next number, sum the previous two.

// brute force method that has O(n^2) time complexity
// const fib = (n) => {
//     if (n <= 2) return 1;
//     return fib(n - 1) + fib(n - 2);
// }


// using memoization to refactor the code to reduce the time complexity to O(n) 
// js obj, key will be arg, value will be the return value 
const fib = (n, memo = {}) => {
    if (n in memo) return memo[n];
    if (n <= 2) return 1;
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
    return memo[n];
}

console.log(fib(5)) // 5
console.log(fib(6)) // 8
console.log(fib(7)) // 13
console.log(fib(50)) // 12586269025