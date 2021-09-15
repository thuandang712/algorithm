// Write a function that takes in an array of numbers and returns an array, 
// where each element in the output array is equal to every other number in the array multiplied together.

// O(n^2) time complexity
// const multiply = (arr) => {

//     const result = arr.map( (ele, i, arr) => {
//         let tempArr = arr.slice() // makes copy
//         tempArr.splice(i, 1) // remove 1 element at current i index
//         // console.log(tempArr)
//         return product = tempArr.reduce( (prev, curr) => prev * curr )
//     })
//     return result 
// }
// const arr = [1,3,5,6]
// //             i
// console.log(multiply(arr)) // [90, 30, 18, 15] // because 3 * 5 * 6 = 90


// O(n)
function test(arr) {
    // Cacheing
    // O(n)
    const totalProdcut = calculateProduct(arr)
    const returnArray = []
    // O(n)
    for(let i = 0; i < arr.length; i++) {
        let current = arr[i]
        returnArray.push(totalProdcut / current)
    }
    return returnArray
}
function calculateProduct(arr) {
    let product = 1
    for(let i = 0; i < arr.length; i++) {
        let current = arr[i]
        product = product * current
    }
    return product
}


const arr = [4, 5, 6, 7]
console.log(test(arr))





