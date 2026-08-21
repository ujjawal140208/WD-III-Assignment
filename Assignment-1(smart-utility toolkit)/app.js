const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

logger("Checking number");

console.log(isEven(10));
console.log(isEven(7));

logger("Done");