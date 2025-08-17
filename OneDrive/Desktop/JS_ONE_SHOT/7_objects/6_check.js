// check if property exists in the object

const person = {
    firstName : "Elon",
    "lastName" : "Musk",
    age : 34, 
    address : {
        street : "Tesla Road",
        city : "Austin",
        zipcode : 718383
    }
}

console.log("age" in person)
console.log("address" in person)
console.log("zipcode" in person)