/*      for in loop :
            - allows you to access each prop and value of an object without knowing the 
              specific name of the property 
            - prints the keys 
*/

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

// print the key
for (let prop in person){
    console.log(prop)
}

console.log("----------------")

// print the value 
for (let prop in person){
    console.log(person[prop])
}

console.log("----------------")

// print both key value  
for (let prop in person){
    console.log(prop + ": " + person[prop])
}



