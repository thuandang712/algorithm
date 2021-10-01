const isPalindrom = (x) => {
    const str = x.toString()

    let rev = ''
    for (let i = str.length - 1; i >= 0; i--) {
        rev = rev + str[i]
    }
    return str === rev
}
const x = -123
console.log(isPalindrom(x));