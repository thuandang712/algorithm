// write a function that returns the greatest product of 4 consecutive numbers

function greatestFour(str) {
    let maxProduct = 0
    const arr = str.split('').map((elem) => {
        return parseInt(elem)
    })


    for (let i = 0; i <= arr.length - 4; i++) {
        let current = arr[i]
        let currentProduct = current * arr[i + 1] * arr[i + 2] * arr[i + 3]
        if (currentProduct > maxProduct) {
            maxProduct = currentProduct
            currentProduct = 0
        }
    }

    return maxProduct
}


const str = '123456789'
// [1,2,3,4,5,6,7,8,9]
//            i  
console.log(greatestFour(str))
