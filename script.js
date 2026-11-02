// ==========================================================================
// Kanan Jain — Portfolio Interactivity & Firebase Backend Integration
// Modular Firebase SDK v10 (CDN)
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

// Initialize Firebase if valid configuration exists
let db = null;
if (isFirebaseConfigured()) {
  try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    console.info('Firebase successfully initialized for live inquiries.');
  } catch (error) {
    console.warn('Firebase initialization notice:', error.message);
  }
} else {
  console.info('Running in local staging mode. Populate firebase-config.js with your project credentials.');
}

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // Mobile Navigation Drawer Toggle
  // ==========================================================================
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================================================
  // Header Elevation on Scroll
  // ==========================================================================
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================================================
  // Contact Form Handling with Firebase Backend
  // ==========================================================================
  const inquiryForm = document.getElementById('inquiry-form');
  const submitBtn = document.getElementById('submit-btn');
  const statusBox = document.getElementById('form-status');

  // Input elements
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const orgInput = document.getElementById('form-org');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');

  // Error spans
  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const messageError = document.getElementById('message-error');

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function clearErrors() {
    [nameError, emailError, messageError].forEach(el => {
      if (el) {
        el.textContent = '';
        el.classList.remove('visible');
      }
    });
    if (statusBox) {
      statusBox.style.display = 'none';
      statusBox.className = 'form-status';
    }
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const organization = orgInput.value.trim();
      const subject = subjectInput.value.trim();
      const message = messageInput.value.trim();

      let hasError = false;

      if (!name || name.length < 2) {
        nameError.textContent = 'Please provide a valid full name.';
        nameError.classList.add('visible');
        hasError = true;
      }

      if (!email || !validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email address.';
        emailError.classList.add('visible');
        hasError = true;
      }

      if (!message || message.length < 10) {
        messageError.textContent = 'Please provide message details of at least 10 characters.';
        messageError.classList.add('visible');
        hasError = true;
      }

      if (hasError) return;

      // Loading State
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Transmitting to Ledger...</span>`;

      const payload = {
        name,
        email,
        organization: organization || 'Direct Contact',
        subject: subject || 'General System Inquiry',
        message,
        clientTimestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      try {
        if (db) {
          // Live Firebase Firestore write
          await addDoc(collection(db, 'inquiries'), {
            ...payload,
            serverTimestamp: serverTimestamp()
          });

          statusBox.textContent = 'Thank you. Your message has been recorded directly to the Firestore inquiry registry. I will review it shortly.';
          statusBox.className = 'form-status success';
          statusBox.style.display = 'block';
          inquiryForm.reset();
        } else {
          // Local staging fallback
          const localKey = 'kanan_inquiries_staging';
          const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
          existing.push(payload);
          localStorage.setItem(localKey, JSON.stringify(existing));

          statusBox.innerHTML = `
            <strong>Inquiry recorded successfully in staging environment.</strong><br>
            To stream directly to your live database, paste your Firebase project keys into <code>firebase-config.js</code>.
          `;
          statusBox.className = 'form-status success';
          statusBox.style.display = 'block';
          inquiryForm.reset();
        }
      } catch (err) {
        console.error('Submission failure:', err);
        statusBox.textContent = 'Transmission encounter: Unable to write to the ledger. You can reach me directly at kananjn45@gmail.com.';
        statusBox.className = 'form-status error';
        statusBox.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

});
