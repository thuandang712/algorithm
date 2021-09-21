const splitter1 = (arr, num) => {
    if (num <= 0) return 'num not valid'

    const result = []

    for (let i = 0; i < arr.length; i+=num) {
        let res = arr.slice(i, i+num)
        result.push(res)
    }

    return result
}


function splitter2(arr, num) {
    let result = []

    for(let i = 0; i < arr.length; i++) {
        let elem = arr[i]
        let last = result[result.length - 1]
        if(!last || last.length === num) {
            result.push([elem])
        } else {
            last.push(elem)
        }
    }
    return result
}

const randomArray = () => {
    const arr = []
    for(let i=0; i<= 10000; i++) {
        arr.push(Math.floor(Math.random() * 100))
    }
    return arr
}

const arr = randomArray()
const num = 10

const t0 = performance.now();

splitter1(arr, num)

const t1 = performance.now();
console.log(`Call to splitter took ${t1 - t0} milliseconds.`)

// 2 => [ [ 1, 2 ], [ 3, 4 ], [ 5, 6 ], [ 7, 7 ], [ 8, 9 ] ]

// 4 => [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 7 ], [ 8, 9 ] ]

// 1 => [
//     [ 1 ], [ 2 ], [ 3 ],
//     [ 4 ], [ 5 ], [ 6 ],
//     [ 7 ], [ 7 ], [ 8 ],
//     [ 9 ]
//   ]