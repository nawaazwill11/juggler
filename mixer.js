"use strict";
const fs = require('fs');

// generates a random word list of count length
function generateRandom(count, callback) {
    try {
        let file = fs.readFileSync('wordlist.txt', 'utf8');
        let word_list = file.split(',')
        let rand_words = [];
        let max = word_list.length;
        let min = 0;
        for (let i = 0; i < count; i++) {
            let rand_index = Math.floor(Math.random() * (max - min + 1)) + min;
            rand_words.push(word_list[rand_index]);
        }
        callback(null, rand_words);
    }
    catch (error) {
        callback(error);
    }
}

module.exports = { generateRandom };