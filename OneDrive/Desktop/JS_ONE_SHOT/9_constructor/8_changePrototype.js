/*  Changing prototype value :
        - if a prototype value is changed, then all the new objects will have changed property value 

        - All the previously created objects will have previous value
*/  

function Person (){
    this.name = "Elon Musk"
}
Person.prototype.age = 35

const person1 = new Person() 

// changing prototype value 
Person.prototype = {age: 52}

const person2 = new Person() 

console.log(person1.age)
console.log(person2.age)