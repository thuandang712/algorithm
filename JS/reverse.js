// takes in a string - returns a boolean on weather that string is a palendrom or not


// using built in js methods
function pal(str) {
    const rev = str.split('').reverse().join('')
    return str === rev ? true : false
}

// more programitc approach
function pal2(str) {
    let rev = ''
    // if array, it would be rev = []

    for(let i = str.length - 1; i >= 0; i--) {
        let current = str[i]
        rev = rev += current
        // if you do with array, use .push
    }

    return str === rev
}

const str = 'racecar' 
console.log(pal2(str))