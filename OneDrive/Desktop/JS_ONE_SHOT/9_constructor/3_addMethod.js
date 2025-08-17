/*  adding properties inside the parameterized constructor function 
        - simply done using previous syntax 
*/


function Person(first,  last){
    this.firstName = first,
    this.lastName = last
}

const person1 = new Person("Elon", "Musk")
const person2 = new Person("Elon", "Musk")
console.log(person1)

person1.age = 52
console.log(person1)    
console.log(person2.age)            // undefined 

person2.greet = function(){
     console.log("I am a method of obj person2 created outside")
}

person2.greet()







