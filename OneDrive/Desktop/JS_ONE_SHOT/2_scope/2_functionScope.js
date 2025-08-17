/*  Function scope :
        - it is created when a function is declared
        - variables & functions declared are visible within that function
*/

function example(){
        var x = "I am inside function"
        console.log(x)
}

example()
// console.log(x)             // reference error => x not defined 