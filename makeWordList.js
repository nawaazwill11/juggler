"use strict";

const fs = require('fs');

// checks if wordlist exists
function listExists() {
    if (fs.readdirSync('.').indexOf('wordlist.txt') === -1) return false;
    return true;
}

// create a wordlist file on the disk
function makeList(data, callback) {
    let words_string = data.join(',');
    fs.writeFile('wordlist.txt', words_string, function (error) {
        if (error) return callback(error);
        callback(null, `Word list made with ${data.length} words.`);
    });
}

// return wordlist content
function getList(callback) {
    console.log('Getting list');
    fs.readFile('wordlist.txt', 'utf8', function (error, data) {
        if (error) return callback(error);
        console.log(data);
        callback(null, data);
    })
}

// returns matches with primary and secondary patterns.
function getMatches(html, primary_pattern, secondary_pattern, callback) {
    let matches = [] 
    let first_match = html.match(primary_pattern);
    if (!first_match) return callback('No matches found.');
    // if first match passes
    first_match.forEach(item => {
        let match = item.match(secondary_pattern); // second regex pass
        if (match) {
            matches.push(...match)
        }
    });
    callback(null, matches);
}

module.exports = { getMatches, makeList, getList, listExists }