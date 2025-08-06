const fs = require('fs');
const path = require('path');

// Store in /app/data/ratings.json when running on Railway
const ratingsPath = process.env.RAILWAY_ENVIRONMENT ? '/app/data/ratings.json' : path.join(__dirname, 'ratings.json');

// 🔹 Read ratings.json
function readRatings() {
    try {
        if (!fs.existsSync(ratingsPath)) {
            return { users: [] };
        }
        const data = fs.readFileSync(ratingsPath, 'utf8').trim();
        if (!data) {
            return { users: [] };
        }
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading ratings.json:', err);
        return { users: [] };
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
