// write a function that finds all pairs within an array that multiply together to a given product. Return an array of arrays showing all pairs. 

const pair = (numbers, product) => {
    const result = []
    const obj = {}

    // loop through numbers array
    for (let i = 0; i < numbers.length; i++) {
        let current = numbers[i]
        let diff = product / current

        if (diff in obj) {
            result.push([current, diff])
        }
        obj[current] = i
    }

    return result
}

const product = 10
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(pair(numbers, product)); // => [[2,5], [10, 1]]