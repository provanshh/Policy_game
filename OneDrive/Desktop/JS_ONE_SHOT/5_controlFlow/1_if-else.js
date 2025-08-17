/*  conditional statements : 
        - used to execute diff actions based on diff conditions
        - if, else, else if
*/


// if condition 
if(true){
    console.log("executed")
}
console.log("-----------------------")

let age = 20
if(age>18){
    console.log("You are adult")
}
console.log("-----------------------")



let country = "india"
if(age>18 && country=="india"){
    console.log("you are eligible for license")
}
console.log("-----------------------")



// else condition 
age = 16
if(age>18){
    console.log("You are adult")
}
else{
    console.log("your are minor")
}
console.log("-----------------------")


// if else condition 
age = 17
if(age>=18){
    console.log("You are adult")
}
else if (age>=16){
    console.log("You are a teenager")
}
else{
    console.log("your are minor")
}
console.log("-----------------------")
