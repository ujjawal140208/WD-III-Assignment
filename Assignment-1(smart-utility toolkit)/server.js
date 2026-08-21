const http = require("http");

const server = http.createServer((req,res) => {

    if(req.url == "/"){
        res.end("Welcome to Node Server");
    }

    else if(req.url == "/about"){
        res.end("About Page");
    }

    else if(req.url == "/contact"){
        res.end("Contact Page");
    }

    else{
        res.statusCode = 404;
        res.end("404 Page Not Found");
    }

});

server.listen(3000, () => {
    console.log("Server running on port 3000");
});