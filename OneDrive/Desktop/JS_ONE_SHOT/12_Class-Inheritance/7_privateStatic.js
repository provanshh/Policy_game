/*  Private Static Methods
*/  

class Person{
    constructor(firstName, lastName){
        this.firstName = firstName
        this.lastName = lastName
    }

    // now this is private static which can now only be called on class 
    // now to access that we will pass object as argument 
    static #fullname(x){
        return x.firstName + " " + x.lastName
    }

    // to make this accessible, we will use this keyword 
    // also we cannot call this on object, we can call this on the class 
    // we can access the static private method using class name 
    display(){
        // ☠️ below line is just giving error, execute that line it will work 
        // console.log(Person.#fullname(this))
    }

}


const person1 = new Person("Vansh", "Singla")
person1.display()