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
// write a function that takes in a non-empty array of integers and returns an array of the same length where each element in the output array is equal to the product of every other number in the input array.

// make function to calculate total product
function totalProduct(arr) {
    let product = 1
    for (let i = 0; i < arr.length; i++) {
        product = product * arr[i]
    }
    return product
}

// function product except self
function productExceptSelf(arr) {
    const product = totalProduct(arr)

    const result = []

    for (let i = 0; i < arr.length; i++) {
        result.push( product / arr[i] )
    }

    return result
}

const arr = [5,1,4,2]
// output arr = [8,40,10,20]
console.log(productExceptSelf(arr))





