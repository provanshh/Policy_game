/*  JS object prototype : 
        - every fn & obj has its own property called prototype 
        - prototype is also an object 
        - hence prototype has its own prototype
        - this creates a prototype chain
*/  


// when this will be printed inside console, it will print obj, and prototype also  
const person= {
    name : 'Elon'
}

console.log(person)
