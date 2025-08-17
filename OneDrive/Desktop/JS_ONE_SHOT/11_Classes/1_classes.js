/*  Classes : 
        - one of the feature introduced in ES6 version 
        - template for creating objects 
        - advised to keep the name of class first Letter in Capitalize

        - creating objects using constructor function : 
            function Person(names,ages){
                // here this is pointing to current constructor fn 
                this.name = names
                this.age = ages
            }

            const person1 = new Person("Elon Musk",52)
            console.log(person1)
*/  


// creating classes 
class Person{
    // this constructor method initialize the value of object
    constructor(name,age){
        this.name = name
        this.age = age
    }
}

const person1 = new Person("Elon Musk",52)
const person2 = new Person("Bill Gates",60)
console.log(person1)
console.log(person2)
