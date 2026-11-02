# Kanan Jain — Personal Portfolio

A modern, high-craft personal portfolio built with React 18, Tailwind CSS, and Firebase. Designed with organic, human-centered earth tones, flowing and approachable copywriting, and zero unicode emojis.

---

## Design System & Palette

Crafted with natural earth tones inspired by Color Hunt:

- **Base Canvas:** `#FEFAF3` (Warm Alabaster / Linen)
- **Soft Accent:** `#F6E2E9` (Blush Petal)
- **Secondary Tone:** `#B8CFB3` (Silky Sage)
- **Primary Brand Ink:** `#84A282` (Muted Evergreen / Moss) & `#4D684B` (Deep Forest)
- **High-Contrast Text:** `#1C241E` / `#2C382F`
- **Typography:** Newsreader (Editorial Serif) + Plus Jakarta Sans (Clean Sans) + JetBrains Mono (Technical Monospace)
- **Constraint:** Strictly zero unicode emojis. Built with structured typography and minimalist vector icons (FontAwesome).

---

## Key Highlights & Featured Projects

1. **ORCA-Intel — Safe Sea Navigation for Fishermen**
   - **Role:** Team Leader (BitVerse 404)
   - **Honor:** Smart India Hackathon 2026 Nominee (ISRO Problem Statement #26176)
   - **Tech:** Flutter, Python, FastAPI, SQLite, Bhashini Voice AI. 100% works offline with 15-minute advance border warnings.

2. **Awaaz Mobile — Real-Time Sign Language Interpreter**
   - **Honor:** Top 6 Finalist, Dextrix Hackathon (Feb 2026)
   - **Tech:** Flutter, MediaPipe 21-point tracking, TensorFlow Lite, Python, Chaquopy. On-device real-time gesture-to-speech.

3. **SETU — Smart Soundbox Assistant for Retailers**
   - **Honor:** Paytm Build for India Hackathon
   - **Tech:** Python, Sarvam Voice AI, FastAPI, LangGraph, Vision OCR. Multilingual instant dispute verification under 3 seconds.

4. **Raksha — Zero-Internet Emergency Mesh Network**
   - **Honor:** Top 15 Finalist, Nexhack (Sept 2026)
   - **Tech:** Android, BLE 5.0, Wi-Fi Direct, AES-256. Encrypted peer-to-peer phone mesh for emergency dead-zones.

5. **Cognify — Adaptive Learning Companion for Kids**
   - **Honor:** Matrix Hackathon (April 2026)
   - **Tech:** React.js, Firebase, OpenCV, Python. Real-time engagement and frustation tracking for neurodivergent learners.

6. **BingeBuddy — Real-Time Watch Party**
   - **Tech:** React.js, JavaScript, Node.js, Socket.IO, MongoDB. Synchronized video streaming with live chat.

---

## Deploying to a New Firebase Project

To deploy this portfolio to your own Firebase project:

### 1. Install & Log In to Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Connect Your Firebase Project
```bash
firebase use --add
```
Select your new Firebase project from the list and give it an alias (e.g. `default`).

### 3. (Optional) Connect Realtime Firestore Contact Form
In `firebase-config.js`, update your Firebase web app configuration:
```javascript
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Deploy Live
```bash
firebase deploy --only hosting
```

---

## File Structure

```text
Portfolio/
├── assets/
│   ├── favicon.ico
│   ├── Kanan_Jain_Resume.pdf
│   ├── orca-architecture.png
│   ├── profile.png
│   └── screen.png
├── app.jsx              # Complete React application with Hero particle system
├── firebase-config.js   # Firebase configuration & initialization check
├── firebase.json        # Firebase Hosting & Firestore rules configuration
├── firestore.rules      # Secure write-only rules for contact inquiries
├── index.html           # SPA entry point with React, Babel & Tailwind CDN
├── .gitignore           # Git ignore for local Firebase cache
└── README.md            # Project documentation
```
