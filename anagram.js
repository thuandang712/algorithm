// // Anagram algorithm

// algorithm should return a true / false (boolean) as to if you could make 
// ransom note out of magazine text.

const anagram = (source, note) => {

    // turn str into array
    const sourceArr = source.split(" ")
    const noteArr = note.split(" ")
    
    // store key/value pairs of source array
    const sourceObj = makeObj(sourceArr) 
 
    // return true / false 
    for (let i of noteArr) {
        if (!sourceObj[i]) {
            return false
        }
        sourceObj[i]--
    }
    return true
}

// make obj function
const makeObj = (arr) => {
    const obj = {}
    arr.forEach(ele => {
        !obj[ele] ? obj[ele] = 1 : obj[ele]++
    })
    return obj
}


const magazineText = "this is the text I am given."
const note = "this is the text text"
console.log(anagram(magazineText, note))