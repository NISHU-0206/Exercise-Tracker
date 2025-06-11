# 🏋️ Exercise Tracker API

A full-stack JavaScript application built with **Node.js**, **Express**, and **MongoDB**, completing the freeCodeCamp API & Microservices "Exercise Tracker" challenge. Users can create an account, log exercises, and retrieve exercise history with optional filters.

---

## 🛠 Technologies Used

- **Node.js** & **Express** – Backend server and API routing  
- **MongoDB** & **Mongoose** – Database and ODM  
- **dotenv** – Environment variable management  
- **CORS** – Cross-Origin Resource Sharing support  
- **Body-parser** *(built-in Express middleware)* – Parsing form and JSON data  
- **Bootstrap 5** – Front-end layout and styling  
- **Curl / Postman** – Local API testing

---
## 📁 Project Structure

exercise-tracker/
├─ models/
│ ├─ user.js # User schema (username, _id)
│ └─ exercise.js # Exercise schema (userId, description, duration, date)
├─ routes/
│ └─ userRoutes.js # API endpoint handlers
├─ public/
│ └─ index.html # Front-end interface using Bootstrap
├─ server.js # App setup, DB connection, middleware
├─ .env # Environment variables (not committed)
└─ README.md # Project documentation
