/*      - scopes in JS refer to visibilty of variable and function within a program 
        - 3 scopes : global, function, block
    
        Global scope :
            - it is the outermost scope in JS  
            - variables & functions declared are visible from anywhere in the progam
*/

var x = "I am in the outermost scope"

function example(){
    console.log(x)
}

example()               // due to fn call
console.log(x)          // due to global scope


// Function Scope 