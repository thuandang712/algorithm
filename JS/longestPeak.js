// Write a function that takes in an array of integers and returns the length of the longest peak in the array

function longestPeak(arr) {
    let longest = 0
    let up = 0
    let down = 0  
    let i = 0

    while (i < arr.length) {
        let current = arr[i]
        let next = arr[i+1]
        // compare current and next
        if ( (down > 0 && current < next) || current === next) {
            up = down = 0
        } 
        if (current < next) {
            up++
        } 
        if (current > next) {
            down++
        }
        if (up > 0 && down > 0 && longest < up + down + 1) {
            longest = up + down + 1
        }
        i++
    }
    return longest
    // RETURN LENGTH OF LONGEST PEAK
}


// [3,1,2,8,6,7] => peak
// [8, 4, 9] => Not peak
// [1,2,3] => Not peak
        //  i i+1
const arr = [1,2,3,4,3,4,2,1] // 5
const arr2 = [1,2,3,4,5,5,4,3,2,1] // 0
const arr3 = [1,2,3,4,3,2,6] // 6
const arr4 = [1,2,3]
console.log(longestPeak(arr4)) 