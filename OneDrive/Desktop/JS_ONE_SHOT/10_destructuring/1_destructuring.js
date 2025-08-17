/*  Object Destructuring :
        - is a feature that allows you to extract the properties of an object into variables 

        - useful for assigning the properties of an object to variables in a single statement 
*/  

const person = {
    firstName : "Elon",
    lastName : "Musk"
}

// earlier we used to do this to extract the prop from an object 
let fname = person.firstName
let lname = person.lastName

// now 
let {firstName: fName , lastName: lName} = person
console.log(fName)
console.log(lName)

// syntax 2 
let {firstName , lastName, age, gender="M"} = person
console.log(firstName)
console.log(lastName)
console.log(age)                        // no value so undefined
console.log(gender)                     // default value : M 

