/*  Default Parameters : 
        - parameters that have a default value
        - if args are not passed to a fn, then default value will be used
*/


function sum(x,y){
    console.log("sum: " + (x+y))
}

sum(10,20)
sum("vansh", "singla")
sum(10)                     // Nan => 10 + undefined is not a number 
console.log("--------------------------")


function sum1(x,y=0){
    console.log("sum: " + (x+y))
}

sum1(10)
sum1(10,50)