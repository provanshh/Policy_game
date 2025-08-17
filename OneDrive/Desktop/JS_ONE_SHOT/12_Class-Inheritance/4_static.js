/*  Static Methods: 
        - they are bound to a class, and not to an instance of a class
        - you cannot call a static method on an object
        - it can be called only on class 
*/  

class Person{
    constructor(name){
        this.name = name
    }
    // now this cannot be called on the object created using Person class 
    static greet(){
        console.log("Hello")
    }
}

const person1 = new Person("Peter")


// person1.greet()                      // this will not work => static is used 
Person.greet()
