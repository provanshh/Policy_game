/*  Anonymous Functions : 
        - functions that are not declared with a name
*/

// function expression
let sum = function(x,y){
    return x+y
}

console.log(sum(20,40));



// another way to write anonymous fn
(
function(){
    console.log("This is an anonymous function")
}
)();