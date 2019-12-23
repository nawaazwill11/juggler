"use strict";

const fs = require('fs');
const fetch = require('./fetch');
const mwl = require('./makeWordList');
const server = require('http').createServer();
const formidable = require('formidable');
const mixer = require('./mixer');
let server_active = false;

function main(callback) {
    if (!mwl.listExists()) {
        // create a new wordlist
        fetch.getHTML('https://pairedlife.com/friendship/badass-nicknames', function (error, html) {
            if (error) return callback(error);
            // if html string is returned successfully
            let primary_match = new RegExp(/>[a-z]+</, 'ig');
            let secondary_match = new RegExp(/[a-z]+/, 'ig');
            // get matches using the above patterns
            mwl.getMatches(html, primary_match, secondary_match, function (error, matches) {
                if (error) return callback(error);
                // finally, make a wordlist
                mwl.makeList(matches, function (error, message) {
                    if (error) return callback(error);
                    console.log(message);
                    callback();
                });
            });
        });
    }
    else {
        // else dont
        console.log('Using existing wordlist.');
        callback();
    }
}

function runServer() {
    main(function (error) {
        if (error) {
            console.log(error);
            server_active = false;
            return;
        }
        server_active = true;   
    })
    server.on('request', function (request, response) {
        if (server_active) {
            if(request.url === '/' && request.method === 'GET') {
                response.writeHead(200, {'Content-Type': 'text/html'})
                fs.createReadStream('index.html').pipe(response);
            }
            else if (request.url === '/' && request.method === 'POST') {
                let form = new formidable.IncomingForm();
                form.parse(request);
                form.on('field', function (name, count) {
                    if (name === 'count') {
                        if (!count.match(/[0-9]+/)) {
                            response.writeHead(500, {'Content-Type': 'text/plain'});
                            response.end(JSON.stringify({error: 'NaN.'}));
                            return;
                        }
                        count = Number(count);
                        if (count <= 0) {
                            response.writeHead(500, {'Content-Type': 'text/plain'});
                            response.end(JSON.stringify({error: 'Count too low.'}));
                            return;
                        }
                        mixer.generateRandom(count, function (error, words) {
                            if (error) {
                                console.log(error);
                                response.writeHead(500, {'Content-Type': 'text/plain'});
                                response.end(JSON.stringify({error: error}));
                            }
                            response.writeHead(200, {'Content-Type': 'text/plain'});
                            response.end(JSON.stringify({words: words}));
                        })
                    }
                    else {
                        console.log('Low count');
                    }
                });
            }
            else {
                response.writeHead(301, {'Content-Type': 'text/plain'});
                fs.createReadStream('redirect.html').pipe(response);
            }
        }
        else {
            response.writeHead(500, {'Content-Type': 'text/html'});
            response.end(`<h1>Server Error</h1><br><h3>Could not start server</h3><a href="/">Retry?</a>`);
            return;
        }
    });
    server.listen(8000);
}
runServer();