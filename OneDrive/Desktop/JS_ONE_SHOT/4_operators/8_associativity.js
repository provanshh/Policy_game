/*  Operator Associativity : 
        - it determines the order in which operators of same precedence are evaluated 
        - left to right
        - right to left (only => exponentiation, assignment)
*/


// left to right
let ans = 4 - 2 - 1
console.log(ans)

// right to left => 3**2 first then 2**9 
let res = 2 ** 3 ** 2
console.log(res)