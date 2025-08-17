// nested objects => object inside object

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

console.log(person)
console.log(person.address.zipcode)