// Prototype Inheritance => adding a new method 

function Person (fName, lName){
    this.firstName = fName
    this.lastName = lName
}

Person.prototype.getFullName = function(){
    return this.firstName + " " + this.lastName
}

const person1 = new Person("Elon", "Musk")
const person2 = new Person("Bill", "Gates")

console.log(person1)
console.log(person2) 

// person1 and person2 is inherting the prototype of the constructor function
console.log(person1.getFullName())
console.log(person2.getFullName())


