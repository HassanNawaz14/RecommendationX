const fs = require('fs');
const path = require('path');

const ratingsPath = path.join(__dirname, 'ratings.json');

// 🔹 Read ratings.json
function readRatings() {
    try {
        if (!fs.existsSync(ratingsPath)) {
            return { users: [] }; // No file yet
        }
        const data = fs.readFileSync(ratingsPath, 'utf8').trim();
        if (!data) {
            return { users: [] }; // Empty file
        }
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading ratings.json:', err);
        return { users: [] }; // Fallback
    }
}

// 🔹 Write ratings.json
function writeRatings(data) {
    try {
        fs.writeFileSync(ratingsPath, JSON.stringify(data, null, 2));
        console.log('ratings.json updated!');
    } catch (err) {
        console.error('Error writing ratings.json:', err);
    }
}

module.exports = { readRatings, writeRatings };
