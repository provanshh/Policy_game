/*  logical operators : 
        - perform logical operations like 
        - AND(&&) 
            - returns true if all the operands are true 
            - true && true => true
            - true && false => false
            - false && true => false
            - false && false => false

        - OR(||) 
            - returns true if one of the operands is true 
            - true || true => true
            - true || false => true
            - false || true => true
            - false || false => false

        - NOT(!)
            - converts operator to boolean & returns flipped value 
*/



let x = 5
let y = 10

// logical AND(&&)
console.log(x>0 && y>0)
console.log(x>0 && y<0)
console.log(x<0 && y>0)
console.log(x<0 && y<0)

console.log("-----------------------")

// logical OR(||)
console.log(x>0 || y>0)
console.log(x>0 || y<0)
console.log(x<0 || y>0)
console.log(x<0 || y<0)

console.log("-----------------------")

// logical NOT(!)
let a = true
let b = false

console.log(!a)
console.log(!b)




