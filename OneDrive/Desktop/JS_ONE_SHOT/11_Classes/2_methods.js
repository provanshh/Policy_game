/*  JS Class Methods: 
        - we can add any no of methods in JS class  
*/  


// creating classes 
class Person{
    // this constructor method initialize the value of object
    constructor(name,age){
        this.name = name
        this.age = age
    }
    greet(){
        return "Hello " + this.name
    }
    changeName(newName){
        this.name = newName
    }
}

// greet method will be seen inside the prototype (console)
const person1 = new Person("Elon Musk",52)
const person2 = new Person("Bill Gates",60)

console.log(person1)
console.log(person1.greet())

console.log(person2)
console.log(person2.greet())

person1.changeName("Vansh")
console.log(person1.name)

