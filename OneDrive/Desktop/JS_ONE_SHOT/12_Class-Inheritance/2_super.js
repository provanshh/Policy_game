/*  Super() Method: 
        - used inside a child class denotes its parent class 
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
    constructor(name){
        // super refers to the parent class (Person)
        // it will pass name argument in the parent class 
        super(name)
    }
}

const student1 = new Student("Peter")
student1.greet()



