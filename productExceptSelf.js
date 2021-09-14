// Write a function that takes in an array of numbers and returns an array, 
// where each element in the output array is equal to every other number in the array multiplied together.


const multiply = (arr) => {

    const result = arr.map( (ele, i, arr) => {
        let tempArr = arr.slice() // makes copy
        tempArr.splice(i, 1) // remove 1 element at current i index
        // console.log(tempArr)
        return product = tempArr.reduce( (prev, curr) => prev * curr )
    })
    return result 
}


const arr = [1,3,5,6]
//             i
console.log(multiply(arr)) // [90, 30, 18, 15] // because 3 * 5 * 6 = 90
