/*  Private Methods: 
        - accessible only within the class
        - cannot call the private methods outside of that class 
        - by default methods of a class are public
        - to make methods private, we need to start the method name with hash(#)
*/  

class Person{
    constructor(firstName, lastName){
        this.firstName = firstName
        this.lastName = lastName
    }

    // now this is private so cannot be accessed outside class 
    #fullname(){
        return this.firstName + " " + this.lastName
    }

    // to make this accessible 
    display(){
        console.log(this.#fullname())
    }

}


const person1 = new Person("Vansh", "Singla")

// cannot be used to fullname being a private function 
// console.log(person1.fullname())
person1.display()