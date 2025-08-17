/*  Class Expression : 
        - provides an alternative way to define a new class 
        - similar to fn exp, but it uses class keyword instead of function keyword 
        - can be named or unnamed
        - if named => name can be used to refer the class later
        - if unnamed => only be referred by the variable that they are assigned to
*/  


let Person = class{
    constructor(name){
        this.name = name
    }
    getName(){
        return this.name
    }
}

const person1 = new Person("Vansh Singla")
console.log(person1)