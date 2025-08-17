/*  Getters & Setters : 
        - we can use the same method as getter and setter
*/  


class Person{
    constructor(name,age){
        this.name = name
        this.age = age
    }
    set personName(newName){
        this.name = newName 
    }
    get personName(){
        return this.name 
    }
}

const person1 = new Person("Elon Musk",52)
console.log(person1.personName)
person1.name = "Vansh S"
console.log(person1.personName)

