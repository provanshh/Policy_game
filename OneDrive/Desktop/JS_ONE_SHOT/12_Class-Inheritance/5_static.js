/*  Static Methods: 
        - if you want to use object's properties inside the static method, then 
        you can pass object as parameter 
*/  

class Person{
    constructor(name){
        this.name = name
    }
    static greet(x){
        console.log("Hello " + x.name)
    }
}

const person1 = new Person("Peter")
Person.greet(person1)
