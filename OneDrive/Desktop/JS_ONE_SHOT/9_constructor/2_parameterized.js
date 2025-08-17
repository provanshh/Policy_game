/*  parameterized constructor function 
        - parameterized : since it has paramater
        - constructor fn : since function created with prop
        - objects only created via new keyword 
        - this always refers to the current object 
        - if used constructor fn, then this points to current new object created 
*/


function Person(first,  last){
    this.firstName = first,
    this.lastName = last
}

const person1 = new Person("Elon", "Musk")
const person2 = new Person("Bill", "Gates")

console.log(person1)
console.log(person2)




