// The fs module provides an API for interacting with the file system
var fs     = require('fs');
// the following  http module is used to serve http request
var http   = require('http');
// This line is from the Node.js HTTPS documentation. HTTPS is the HTTP protocol over TLS/SSL
var https  = require('https');
// The path module provides utilities for working with file and directory paths
var path   = require("path");
// The os module provides a number of operating system-related utility methods.
var os     = require('os');
// os.networkInterfaces() method returns an object containing only network interfaces that have been assigned a network address.
var ifaces = os.networkInterfaces();

var httpPort = 8080;
var httpsPort = 8081;

// Self-Signed Certificates for HTTPS connection using following command
 // cmd: openssl ssh-keygen -t rsa -b 4096 -f privkey.pem
var privateKey  = fs.readFileSync('./../certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./../certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};


// Express.js is a framework used for Node and it is most commonly used as a web application for node js
var express = require('express');
var app = express();
const ejs= require('ejs');  // for embedded javascript templating  // html with plain javascript

app.set('view engine','ejs');
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

/**
 *  Show in the console the URL access for other devices in the network
 */
Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {

            return;
        }
        console.log("");
        console.log("Chat Server is ready on port :", httpsPort);
        if (alias >= 1) {
            console.log("Multiple ipv4 addreses were found ... ");
                 } else {

        }
        alias++;
    });
});

// Allow access from all the devices of the network (as long as connections are allowed by the firewall)
var LANAccess = "0.0.0.0";
// For http
httpServer.listen(httpPort, LANAccess);
// For https
httpsServer.listen(httpsPort, LANAccess);

app.get('/', function (req, res) {
    res.render(path.join(__dirname+'/index.ejs'));
});

// Expose the css and js content as "contents"
app.use('/contents/', express.static('./source'));


