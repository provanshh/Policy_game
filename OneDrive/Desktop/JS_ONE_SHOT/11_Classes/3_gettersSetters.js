/*  Getters & Setters : 
        - they are special methods in JS that allow you to control how prop
        are accessed and modified. 

        - defined using 'get' and 'set' keyword
        
        - getter is a method that is called when a property is accessed. it can be used to do things like validate value of property or convert it into a diff format

        - setter is called when a prop is modified. it can be used to do things like update the value of property or perform some other actions.
*/  


class Person{
    constructor(name,age){
        this.name = name
        this.age = age
    }
    get greet(){
        return "Hello " + this.name
    }
    set changeName(newname){
        this.name = newname 
    }
}

const person1 = new Person("Elon Musk",52)


// earlier (get)
// console.log(person1.greet())

// since get keyword used so no need of () while calling methods
console.log(person1.greet)


// earlier (set)
// person1.changeName("Vansh")

person1.changeName = "Vansh Singla"
console.log(person1.name)


