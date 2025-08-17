let x = 10

if(x>5){
    let y = 20
    console.log(y)
}

// cannot access out of the scope (let is block scope) => reference error
// console.log(y)


const a = 10
console.log(a)

// cannot reassign due to const => typeError 
a = 5
console.log(a)