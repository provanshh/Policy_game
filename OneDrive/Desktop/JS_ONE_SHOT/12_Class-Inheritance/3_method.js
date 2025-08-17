/*  Method or Property Overriding: 
        - If the parent class and child class has the same method or property name. 
        - In this case, when we will call the method or property of an Object of the child class 
        - It will override the method or property of the parent class.
        - This is known as method overriding or shadowing method
*/  

class Person{
    constructor(name){
        this.name = name
    }
    greet(){
        console.log("Hello Person " + this.name)
    }
}

class Student extends Person{
    greet(){
        console.log("Hello Student " + this.name)
    }
}

const student1 = new Student("Peter")
student1.greet()


