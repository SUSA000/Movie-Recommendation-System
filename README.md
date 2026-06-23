# 🎬 AI-Powered Movie Recommendation System

<img width="1536" height="1024" alt="movie-rec" src="https://github.com/user-attachments/assets/889a46e9-c687-4dc4-8fd0-489c2a57cd58" />


A full-stack, microservice-based web application that combines the **MERN stack** with a **Python/Flask Machine Learning engine**. It fetches live trending movies using the TMDB API, allows users to securely save favorites to a MongoDB cloud database, and features a custom content-based filtering algorithm to suggest visually and contextually similar movies.

## ✨ Features
* **🤖 AI Matchmaker:** A custom content-based recommendation engine built with Scikit-learn (Cosine Similarity) that returns 5 hyper-relevant movie suggestions.
* **🔐 Secure Authentication:** Full user login and registration system using JWT (JSON Web Tokens) and bcrypt password hashing.
* **🍿 Live API Integration:** Real-time fetching of trending movies and high-resolution posters via the TMDB API.
* **💾 Cloud Watchlist:** Users can save movies to their personal profile, stored securely in MongoDB Atlas.
* **💅 Modern UI/UX:** Fully responsive React frontend featuring custom CSS Grid layouts and premium Glassmorphism styling.

## 🚀 Tech Stack

**Architecture:** Microservices (Node.js API + Python Flask ML API)

* **Frontend:** React (Vite), React Router, Custom CSS
* **Primary Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose
* **Machine Learning Backend:** Python, Flask, Pandas, Scikit-learn
* **External APIs:** The Movie Database (TMDB) API

## 📂 Project Structure
```text
Movie-Recommendation-System/
│
├── frontend/           # React UI & Client-side routing
├── backend/            # Node.js/Express API & MongoDB Schemas
└── ml-backend/         # Python/Flask API & Pickle Models
