const fs = require("fs");

fs.writeFile("test.txt","Hello Node.js",(err) => {

    if(err){
        console.log("Error");
    }
    else{
        console.log("File Created");
    }

});

fs.readFile("test.txt","utf8",(err,data) => {

    if(err){
        console.log("Error");
    }
    else{
        console.log(data);
    }

});

fs.appendFile("test.txt","\nLearning fs module",(err) => {

    if(err){
        console.log("Error");
    }
    else{
        console.log("File Updated");
    }

});

fs.unlink("test.txt",(err) => {

    if(err){
        console.log("Error");
    }
    else{
        console.log("File Deleted");
    }

});