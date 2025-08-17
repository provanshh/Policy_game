/*  adding method inside constructor function 
        - this time adding directly inside the constructor function 
*/


function Person(first,  last){
    this.firstName = first,
    this.lastName = last,
    this.getFullName = function(){
        return this.firstName + " " + this.lastName
    }
}

const person1 = new Person("Elon", "Musk")
console.log(person1.getFullName())


/*  this method has 1 drawback : 
        - since method is defined inside the constructor fn
        - so when all the new objects will be created
        - they will have this method getFullName which may not be needed
        - to resolve this, we use "prototype" of the object
        - so that all objects created from this const fn will share the same method
        - else they'll be sharing separate methods, which is not memory efficient
*/


