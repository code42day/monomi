var connect = require('connect');
var http = require('http');
var monomi = require("./lib/monomi");

var app = connect();

app.use(monomi.detectBrowserType());
app.use(function(request, response) {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('Hello World, ');
        response.end('and thanks for using a ' + request.monomi.browserType + ' browser');
    }
);

http.createServer(app).listen(8080);
console.log('Listening on http://localhost:8080');
