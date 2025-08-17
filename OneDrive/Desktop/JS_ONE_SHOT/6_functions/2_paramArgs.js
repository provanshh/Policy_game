/*  Parameters and Arguments : 
        - parameters are variables declared inside fn definition
        - arguments are values that are passed to fn when it is called 

        - we can pass less or no arguments while calling the fn
        - if we pass less args, then rest of param will be 'undefined'
        - if we pass more args, then more args will be ignored
*/


// paramters(inside fn definition) => first, last
function greet(first,last){
    console.log("Hello " + first + " " + last)
}

// arguments(inside fn call) => "vansh", "singla", 100, 200
greet("vansh", "singla")
greet(100, 200)
greet("vansh")
greet()
greet("vansh", "singla", "amulya")