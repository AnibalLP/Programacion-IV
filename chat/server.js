const port = 3001;

const http = require("http"),
    serve = http.createServer((req, resp)=>{
        resp.writeHead(200, {'content-type':'text/plain'});
        resp.end("HOla Mundo desde Nodej");
    }).listen(port, ()=>{
        console.log("Nodejs ejecuntandose en el puerto", port);
    });