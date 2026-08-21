let op = process.argv[2];
let a = Number(process.argv[3]);
let b = Number(process.argv[4]);

if(op == "add"){
    console.log(a+b);
}
else if(op == "sub"){
    console.log(a-b);
}
else if(op == "multi"){
    console.log(a*b);
}
else if(op == "div"){
    console.log(a/b);
}
else{
    console.log("Invalid operation");
}