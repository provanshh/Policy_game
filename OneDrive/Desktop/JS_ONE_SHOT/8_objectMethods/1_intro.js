/*  Object Methods: 
        - is an object property that contains a fn definition 
*/

const person = {
    firstName : "Elon",
    lastName : "Musk",
    greet : function greet(){
        console.log("I am inside object")
    },
    anony : function(){
        console.log("I am anonymous fn - without fn name")
    }
}

person.greet()
person.anony()


console.log("--------------------------------")


const person1 = {
    firstName : "Elon",
    lastName : "Musk",
}

function greety(){
    console.log("Hi I am greety")
}

person1.greeting = greety;
person1.greeting()
console.log(person1)


console.log("--------------------------------")


const person2 = {
    firstName : "Elon",
    lastName : "Musk",
    greets(){
        console.log("Hi I am greety inside obj2")
    }
}

person2.greets()
