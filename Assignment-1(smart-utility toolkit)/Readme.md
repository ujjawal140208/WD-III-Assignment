# Smart Utility Toolkit

This project is made for Lab Assignment 1 of Web Dev III.

It is made using Node.js core modules.

## Features

- Calculator using process.argv
- Custom modules
- Basic HTTP server
- File manager using fs
- Random dice using crypto

## Technologies

- Node.js
- JavaScript
- Node.js Core Modules

## Modules Used

- process
- http
- fs
- crypto

## Project Structure

smart-utility-toolkit/

    calculator.js
    app.js
    server.js
    fileManager.js
    dice.js
    test.txt
    README.md

    modules/
        isEven.js
        logger.js

## Calculator

Run:

node calculator.js add 10 5

Output:

15

Other operations:

node calculator.js sub 10 5

node calculator.js multi 10 5

node calculator.js div 10 5

## Custom Module

The project contains an isEven module.

Run:

node app.js

## HTTP Server

Run:

node server.js

Open:

http://localhost:3000/

Available routes:

/
 /about
 /contact

Invalid routes show a 404 message.

## File Manager

The file manager uses the fs module.

Operations used:

- Create File
- Read File
- Update File
- Delete File

Methods used:

- writeFile()
- readFile()
- appendFile()
- unlink()

## Dice Generator

The dice generator uses the crypto module.

Run:

node dice.js

It generates a random number from 1 to 6.

## Restrictions

No external npm packages were used.

No Express.js was used.

No database was used.

Only Node.js built-in modules are used.

## Author

Ujjawal Tiwari