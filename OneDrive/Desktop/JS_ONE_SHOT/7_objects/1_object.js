/*  objects
        - non primitive data type that allows to store multiple collections of data
        - let and const both used to declare objects
        - key value pairs are called properties
        - when we declare a fn as a value in key value pair, then its known as 'methods'
*/

const person = {
    firstName : "Vansh",
    "lastName" : "Singla",
    "space var" : 45,
    age : 34
}

console.log(person)
console.log(typeof person)

console.log(person.firstName)
console.log(person["lastName"])
console.log(person["firstName"])
console.log(person["age"])