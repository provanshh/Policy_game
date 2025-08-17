/*  JS constructor function : 
        - it is used to create objects
        - constructor fn is similar to regular func, but its good practice to capitalize the first letter of constructor fn
        - 
*/

const person = {
    first : "vansh",
    last : "singla"
}

// we need to create many similar objects like person
// hence we'll use constructor fn


function Person(){
    this.first = "vansh",
    this.last = "singla"
}

// constructor fn should only be called with a 'new' operator 
// we can use 'new' operator to create an object from constructor fn 


// creating an object using constructor fn using 'new' 
const person1 = new Person()

// since multiple objects can be created using constructor fn (by new keyword only)
const person2 = new Person()
const person3 = new Person()

console.log(person1)
console.log(person2)

// Note : when a new object is created using constructor fn => this keyword refers to the newly created object and other keys like first, last are just added as properties



