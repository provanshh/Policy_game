/*  loops : 
        - they are used to repeat a block of code
*/


for(let i=1; i<=10; i++){
    console.log(i, "time")
}
console.log("------------------------")



let coding = ["Javascript", "react", "angular", "hrml", "css"]
for(let i=0; i<coding.length; i++){
    console.log(coding[i])
}
console.log("------------------------")



for(let i=1; i<=3; i++){
    console.log("OuterLoop " + i)

    for(let j=1; j<=3; j++){
        console.log("InnerLoop " + j)
    }
    console.log(" ")

}
console.log("------------------------")
