# 🏛️ CivicAI - Smart Civic Issue Reporting Platform

CivicAI is a modern, full-stack web application designed to empower citizens to report local civic issues (such as potholes, street light failures, garbage dumps, and water supply issues) seamlessly. Powered by Generative AI, the platform automatically categorizes issues, extracts key details, and dispatches direct email notifications to relevant authorities.

---

## ✨ Key Features

- 📸 **Smart Image Analysis:** Upload photos of civic problems and let AI parse context automatically.
- 🤖 **Gemini AI Integration:** Automated issue classification, priority assessment, and structured complaint generation.
- 📍 **Location Tagging:** Precise geo-location capture for prompt ground action by local municipal bodies.
- ✉️ **Automated Email Notifications:** Instant email routing to designated department heads via SendGrid integration.
- 🔒 **Secure Authentication:** User signup, login, and protected routing with JWT authentication.
- 📊 **Interactive Dashboard:** Track reported issue status from submission to resolution.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Tailwind CSS
- Lucide React Icons

**Backend:**
- Node.js & Express.js
- Google Gemini API (`@google/genai`)
- SendGrid Mail API

**Database & Storage:**
- MongoDB Atlas (Mongoose ODM)

---

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have Node.js and npm installed on your system.

### 1. Clone the Repository
```bash
git clone [https://github.com/JoseSamuvel/CivicAI.git](https://github.com/JoseSamuvel/CivicAI.git)
cd CivicAI