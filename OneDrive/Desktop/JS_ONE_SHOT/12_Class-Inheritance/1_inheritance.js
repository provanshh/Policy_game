/*  Class Inheritance: 
        - allows you to create new class on basis of already existing class 
        - using class inheritance, a class can inherit all the methods and properties of another class 
        - it is a useful feature that allows code reusability
        - we use extends keyword 
*/  


class Person{
    constructor(name){
        this.name = name
    }
    greet(){
        console.log("Hello " + this.name)
    }
}

class Student extends Person{
}

const student1 = new Student("Peter")
student1.greet()



