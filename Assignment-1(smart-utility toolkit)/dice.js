const crypto = require("crypto");

for(let i=1;i<=5;i++){

    let dice = crypto.randomInt(1,7);

    console.log("Roll",i,":",dice);

}