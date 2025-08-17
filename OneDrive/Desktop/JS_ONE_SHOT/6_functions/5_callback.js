/*  Callback Functions : 
        - function passed as an argument to another function
        - it can run after another function has finished
*/

function display(res){
    console.log(res)
}

function add(num1, num2, myCallBack){
    let sum = num1 + num2
    myCallBack(sum)
}

add(10,20,display)