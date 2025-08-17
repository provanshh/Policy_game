/*  prototype inheritance : 
        - we can use prototype to add prop & methods to a constructor function
        - objects inherit the properties & methods from a prototype 
*/  

function Person (fName, lName){
    this.firstName = fName
    this.lastName = lName
}

// we cannot directly add prop or methods inside constructor fn like : 
// Person.age = 34
// so use prototype

Person.prototype.gender = "Male"

const person1 = new Person("Elon", "Musk")
const person2 = new Person("Bill", "Gates")

console.log(person1)
console.log(person2)

// when printed both objects, newly added property in the prototype will be 
// availabe inside the prototype (inside console)
// this prototype property is inherited by all the objects 

console.log(person1.gender)
console.log(person2.gender)

// prototype properties are not available in the objects created 
// but still they can be accessed and available inside prototype object



