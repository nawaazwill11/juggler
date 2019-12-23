"use strict";

const urllib = require('urllib');

// gets html string from url
function getHTML(url, callback) {
    urllib.request(url, function(error, data, response) {
        if (error) return callback(error);
        callback(null, data.toString('utf-8'));
    }); 
}

module.exports = { getHTML }