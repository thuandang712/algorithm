const twoSum = (arr, targetNum) => {
    // create an empty obj to save key-value pairs when looping over an array
    const obj = {}

    // loop over the arr
    for (let i = 0; i < arr.length; i++) {
        // let current element
        let current = arr[i]
        // calculate another number 
        const diff = targetNum - current
        // if diff is found, return an array of diff and current num
        if (diff in obj) {
            return [diff, current]
        }
        // if diff is not in obj, save the key as the current number and value as index
        obj[current] = i
    }
    // return false if there is nothing can add up to target
    return false;
}


// const test = arr => {
//     for (let i = 0; i < arr.length; i++) {
//         console.log(i)
//     }

// }



const arr = [1, 2, 3, 4, 5, 4, 3, 2, 1]
const num = 7
console.log(twoSum(arr, num))
// test(arr)