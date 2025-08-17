/*  this keyword: 
        - used to access the other prop of an obj within a method of same obj  
        - A 'method' is a function that is a property of an object. 
        - method can have a name, but the key distinction is -> it's part of an object.

        - this keyword is not a variable, we cannot change its value
*/

const person = {
    firstName : "Elon",
    lastName : "Musk",
    greet : function(){
        // this refers to the same object (person here)
        console.log("Hello "+ this.firstName)
    },
    getFullName : function(){
        return this.firstName + " " + this.lastName 
    }
}


// access the prop of an object outside the object 
person.greet()
console.log(person.getFullName())


// NOTE : 'this' keyword can be used out of the  method also but it will refer to the other object 

