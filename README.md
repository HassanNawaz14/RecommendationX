# 🎬 RecommendationX

**RecommendationX** is a smart, browser-based movie recommender system that allows users to rate popular movies and receive personalized recommendations — all without signing in.

🔗 **Live Demo**: [https://recommendationx-production.up.railway.app](https://recommendationx-production.up.railway.app)

---

## 💡 Features

- ⭐ Rate popular movies (0 to 5 stars)
- 🤖 Get personalized movie recommendations using **Cosine Similarity**
- 📊 Ratings stored persistently across users
- 🌐 Built using pure JavaScript and Node.js (No frameworks!)
- 🔒 TMDb API key hidden via environment variables on the server

---

## 🧠 How It Works

1. Users rate movies (locally in the browser).
2. Ratings are submitted and stored in a JSON database.
3. A **Cosine Similarity algorithm** compares the user’s ratings to all existing users.
4. Top matches are used to recommend unseen movies based on collaborative filtering.

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js (`http`, `fs`, `path`)
- **Data Source**: [TMDb API](https://www.themoviedb.org/documentation/api)
- **Storage**: JSON file-based storage
- **Hosting**: Railway

---

## 🚀 Getting Started (for Developers)

### Prerequisites

- Node.js installed
- TMDb API Key

### Installation

```bash
git clone https://github.com/your-username/recommendationx.git
cd recommendationx
npm install
```

### Run Locally

```bash
# Create a .env file with your TMDb key
echo TMDB_KEY=your_api_key > .env

# Start the server
node server.js
```

Then visit: [http://localhost:3000](http://localhost:3000)

---

## 📦 Folder Structure

```
├── public/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── about&guide.html
├── server.js
├── fsUtils.js
├── ratings.json (generated on deploy)
├── .env (not committed)
```

---

## 🙋 Author

👤 **Hassan** — Data Science Student at FAST NUCES, Lahore

- 🔗 [GitHub Profile](https://github.com/HassanNawaz14)
- 📧 [Add your email/contact here if you like]

---

## 📄 License

This project is licensed under the MIT License.

---

## ⭐ Show Your Support

If you found this useful, consider:

- ⭐ Starring the repo
- 🔁 Sharing with your friends
- 🧠 Rate as musch movies as you can on production!

---

> Built with logic, tradition, and a passion for clean code.
