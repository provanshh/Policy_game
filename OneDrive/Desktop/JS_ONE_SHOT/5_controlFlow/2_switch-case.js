/*  conditional statements : 
        - switch statement is a conditional statement that is used to execute 
          a block of code based on the value of an expression
*/


let ans = 42
ans = []

switch (typeof ans) {
    case "number":
        console.log("number")
        break;

    case "string":
        console.log("string")
        break;

    case "boolean":
        console.log("boolean")
        break;

    default:
        console.log("other")
        break;
}



console.log("-------------------------------")


let dayName = 4

switch (dayName) {
    case 1:
        dayName = "Sunday"
        break;
    case 2:
        dayName = "Monday"
        break;
    case 3:
        dayName = "Tuesday"
        break;
    case 4:
        dayName = "Wednesday"
        break;
    case 5:
        dayName = "Thursday"
        break;
    case 6:
        dayName = "Friday"
        break;
    case 7:
        dayName = "Saturday"
        break;

    default:
        dayName = "Invalid Number Input"
        break;
}

console.log("Day is " + dayName)