
// impure 
function reverseImpure(str) {
    // reverse quite complicated

    const n = str.length - 1
    const mid = Math.floor(n / 2)

    for (let i = 0; i < mid; i++) {
        // swapping element
        let temp = str[i]
        str[i] = str[n - i]
        str[n - i] = temp

    }
    return str

}

let str = 'something'
//           i       n
// 'gomethins'
// 'gnmethios'
console.log(reverseImpure(str));
console.log(str)