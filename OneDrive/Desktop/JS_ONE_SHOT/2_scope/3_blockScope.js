/* 
    Block scope 
        - variables & functions declared are visible within the block of code
        - group of statment enclosed inside curly braces {}
*/

function example(){
    if(true){
        let x = "I am inside scope"
        console.log(x)
    }
    // not accessible since out of block scope => reference error 
    // console.log(x)
}

example()