# 🌍 MoodMap – AI-Based Mood Travel & Activity Recommender

MoodMap is an intelligent web application that analyzes a user's mood and suggests personalized places, activities, and experiences based on how they feel.

---

## ✨ Features

* 🧠 AI Mood Detection using LLM (OpenAI API)
* 📍 Location-based recommendations
* 💰 Budget-friendly suggestions
* ⏳ Time-based activity planning
* 🗺️ Smart itinerary generation
* 🎯 Clean and interactive UI (React)

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML, CSS, JavaScript

### Backend

* Node.js
* Express.js

### AI Integration

* OpenAI API (for mood analysis)

---

## 📁 Project Structure

moodmap/
├── frontend/   # React app (UI)
├── backend/    # Node.js server (API + AI logic)
├── .gitignore
├── README.md

---

## ⚙️ Installation & Setup

### 1. Clone the repository

git clone https://github.com/your-username/moodmap.git

cd moodmap

---

### 2. Setup Backend

cd backend

npm install

Create a `.env` file and add:

OPENAI_API_KEY=your_api_key_here

Start server:
npm start

---

### 3. Setup Frontend

cd ../frontend

npm install

Start frontend:
npm start

---

## 🔗 How It Works

1. User enters mood, budget, time, and location
2. Backend sends mood input to OpenAI API
3. AI detects emotional state
4. Based on mood, system maps categories (e.g., stress → cafes, parks, spa)
5. Recommendations are generated and displayed on UI

---

## 🚀 Future Enhancements

* 🌐 Live map integration (Google Maps API)
* 🤖 Chat-based AI assistant
* ❤️ Mood history tracking
* 📱 Mobile responsive improvements
* ☁️ Deployment on AWS / Vercel

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 👩‍💻 Author

Diya Turamandi

---
