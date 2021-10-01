// Given a string of random numbers, write an algo that returns the most repeated element in the string
// const mostCommon = (str) => {
//     if (str.length === 0) {
//         return 'empty string'
//     } 
//     if (isNaN(str)) {
//         return 'not a string of numbers'
//     }

//     const obj = {}

//     // turn str to an array
//     const arr = str.split('')  // O(n)

//     // loop thru each element in the array
//     arr.forEach( ele => {   // O(n)
//         !obj[ele] ? obj[ele] = 1 : obj[ele]++
//     })

//     // get an array of keys
//     let keys = Object.keys(obj) // O(n)

//     // use reduce method to loop thru each key and compare values of each keys
//     let result = keys.reduce( (prevKey, curKey) =>  obj[prevKey] > obj[curKey] ? prevKey : curKey ) // O(n)

//     return result
// }

// let str = '1240195025984712341111123434347777777777777777788182394719283571923857118923651892737651083651873567777777777777777734343434623895555555555555512342134'
// console.log(mostCommon(str))

// p = 0, c = 1 => obj[0] = 2 > obj[1] = 10 ? => p = 1
// p = 1, c = 2 => obj[1] = 10 > obj[2] = 7 ? => p = 1
// p = 1, c = 3 => obj[1] = 10 > obj[3] = 11 ? => p = 3
// p = 3, c = 4 => obj[3] = 11 > obj[4] = 12 ? => p = 4 
// p = 4, c = 5 => obj[4] = 12 > obj[5] = 16 ? => p = 5
// p = 5, c = 6 => obj[5] = 16 > obj[6] = 1 ? => p = 5
// p = 5, c = 7 => obj[5] = 16 > obj[7] = 35 ? => p = 7
// p = 7, c = 8 => obj[7] = 35 > obj[8] = 2 ? => p = 7
// p = 7, c = 9 => obj[7] = 35 > obj[9] = 3 ? => p = 7
// 4 O(n) == O(n) ?


// Given a string of random numbers, write an algo that returns the most repeated element in the string

const mostCommon = str => {
    const obj = makeObj(str)
    let max = 0;
    let result = null

    for (let key in obj) {
        if (obj[key] > max) {
            max = obj[key]
            result = key
        }
    }

    return result
}

const makeObj = str => {
    const obj = {}
    for (let num of str) {
        !obj[num] ? obj[num] = 1 : obj[num]++
    }
    return obj
}

const str = '1240195025984712341111123434347777777777777777788182394719283571923857118923651892737651083651873567777777777777777734343434623895555555555555512342134'
console.log(mostCommon(str))