const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const ratingsPath = isProduction
  ? '/app/data/ratings.json' // Railway volume mount
  : path.join(__dirname, 'ratings.json'); // Local dummy file

function readRatings() {
  try {
    if (!fs.existsSync(ratingsPath)) return { users: [] };
    const data = fs.readFileSync(ratingsPath, 'utf8').trim();
    return data ? JSON.parse(data) : { users: [] };
  } catch (err) {
    console.error('Error reading ratings:', err);
    return { users: [] };
  }
}

function writeRatings(data) {
  try {
    fs.writeFileSync(ratingsPath, JSON.stringify(data, null, 2));
    console.log('Updated ratings!');
  } catch (err) {
    console.error('Error writing ratings:', err);
  }
}

module.exports = { readRatings, writeRatings };