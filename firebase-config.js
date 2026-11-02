// Firebase Configuration for project 'kanan-at-work'
// Project ID: kanan-at-work | Project Number: 525221350820

export const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "kanan-at-work.firebaseapp.com",
  projectId: "kanan-at-work",
  storageBucket: "kanan-at-work.appspot.com",
  messagingSenderId: "525221350820",
  appId: "1:525221350820:web:abcdef123456"
};

// Check if credentials have been replaced with real Firebase Web API key
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("YOUR_API_KEY");
};
