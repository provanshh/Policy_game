/*  Function Return : 
        - can be used to return the value wheh the fn is called
        - return statement denotes that fn has ended
        - any code after return is not executed
*/


function add(a,b){
    return a+b
    // will not be executed since return is encountered already
    a*b 
}

let ans = add(19,20)
console.log(ans)

// function returning another function

function fn1(x){
    function fn2(y){
        return x * y
    }
    return fn2
}

let res = fn1(2)
console.log(res)
let res1 = res(3)
console.log(res1)

let result = fn1(2)(3)
console.log(result)