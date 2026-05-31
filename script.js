/**
 * NYWASA — Coming Soon Landing Page
 * script.js
 *
 * Contents:
 *   1. Launch Date Configuration
 *   2. Countdown Timer
 *   3. Email Form Handling
 *   4. Email Storage (localStorage log)
 *   5. Free Email Service Integrations (Formspree / EmailJS)
 *   6. Footer Year
 *   7. Init
 */


/* ================================================================
   1. LAUNCH DATE CONFIGURATION
   ================================================================
   REPLACE: Change this date to your actual planned launch date.
   Format:  'YYYY-MM-DDTHH:MM:SS'
   Example: '2025-12-25T00:00:00' = Christmas Day 2025 midnight
   ================================================================ */
const LAUNCH_DATE = new Date('2026-01-15T00:00:00').getTime();


/* ================================================================
   2. COUNTDOWN TIMER
   ================================================================ */
const countdownElements = {
  days:    document.getElementById('days'),
  hours:   document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
};

/**
 * Pads a number to 2 digits, e.g. 5 → "05"
 */
function pad(n) {
  return String(n).padStart(2, '0');
}

/**
 * Triggers a brief CSS tick animation on a countdown card number.
 * Only fires when the value actually changes to avoid constant animation.
 */
function animateTick(el, newValue, prevValue) {
  if (newValue !== prevValue) {
    el.classList.remove('tick');
    // Force reflow to restart animation
    void el.offsetWidth;
    el.classList.add('tick');
  }
}

// Store previous values to detect changes
let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

function updateCountdown() {
  const now  = Date.now();
  const diff = LAUNCH_DATE - now;

  if (diff <= 0) {
    // Launch date has passed — show zeros and stop
    Object.values(countdownElements).forEach(el => {
      el.textContent = '00';
    });
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const formatted = {
    days:    pad(days),
    hours:   pad(hours),
    minutes: pad(minutes),
    seconds: pad(seconds),
  };

  // Update DOM only on change + animate
  Object.keys(formatted).forEach(key => {
    const el    = countdownElements[key];
    const value = formatted[key];
    if (value !== prevValues[key]) {
      animateTick(el, value, prevValues[key]);
      el.textContent = value;
      prevValues[key] = value;
    }
  });
}

// Run immediately, then every second
updateCountdown();
const countdownInterval = setInterval(updateCountdown, 1000);


/* ================================================================
   3. EMAIL FORM HANDLING
   ================================================================ */

const emailInput   = document.getElementById('emailInput');
const submitBtn    = document.getElementById('submitBtn');
const emailError   = document.getElementById('emailError');
const emailSuccess = document.getElementById('emailSuccess');
const emailForm    = document.getElementById('emailForm');

/**
 * Basic but solid email format validator.
 * Uses a regex that catches the vast majority of invalid addresses.
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(String(email).toLowerCase().trim());
}

function setError(msg) {
  emailError.textContent = msg;
  emailInput.setAttribute('aria-invalid', 'true');
}

function clearError() {
  emailError.textContent = '';
  emailInput.removeAttribute('aria-invalid');
}

function showSuccess() {
  emailForm.querySelector('.email-form__row').style.display = 'none';
  emailError.style.display = 'none';
  emailSuccess.style.display = 'flex';

  // Update aria
  emailSuccess.setAttribute('aria-live', 'polite');
}

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Saving…';
    submitBtn.setAttribute('aria-busy', 'true');
  } else {
    submitBtn.classList.remove('loading');
    submitBtn.querySelector('.btn-text').textContent = 'Notify Me';
    submitBtn.removeAttribute('aria-busy');
  }
}

/**
 * Main submission handler — called by the button onclick.
 * Choose ONE of the three integration methods below and
 * comment out the others.
 */
async function handleEmailSubmit() {
  const email = emailInput.value.trim();

  // Validate
  clearError();
  if (!email) {
    setError('Please enter your email address.');
    emailInput.focus();
    return;
  }
  if (!isValidEmail(email)) {
    setError('Please enter a valid email address.');
    emailInput.focus();
    return;
  }

  setLoading(true);

  // Always log to localStorage (works on GitHub Pages with zero config)
  saveEmailLocally(email);

  /* ============================================================
     CHOOSE YOUR EMAIL INTEGRATION METHOD
     Uncomment exactly ONE block below.
     ============================================================ */

  /* ------ METHOD A: Formspree (Recommended for GitHub Pages) ------
   * Free tier: 50 submissions/month, no backend needed.
   * Setup:
   *   1. Go to https://formspree.io and create a free account.
   *   2. Create a new form → copy your form endpoint ID.
   *   3. Replace 'YOUR_FORM_ID' below with that ID.
   * Formspree will:
   *   - Email you each submission
   *   - Store a spreadsheet of emails in your dashboard
   *   - Optional: connect to Mailchimp / ConvertKit for automation
   * ---------------------------------------------------------------- */
  // REPLACE: 'YOUR_FORM_ID' with your Formspree form ID
  await submitViaFormspree(email, 'YOUR_FORM_ID');


  /* ------ METHOD B: EmailJS (Free, client-side only) --------------
   * Free tier: 200 emails/month.
   * Setup:
   *   1. Go to https://www.emailjs.com → create account
   *   2. Add an Email Service (Gmail, Outlook, etc.)
   *   3. Create an Email Template
   *   4. Get your Public Key, Service ID, and Template ID
   * ---------------------------------------------------------------- */
  // Uncomment and fill in your EmailJS credentials:
  // await submitViaEmailJS(email, {
  //   publicKey:  'YOUR_EMAILJS_PUBLIC_KEY',
  //   serviceId:  'YOUR_EMAILJS_SERVICE_ID',
  //   templateId: 'YOUR_EMAILJS_TEMPLATE_ID',
  // });


  /* ------ METHOD C: Netlify Forms (if hosted on Netlify) ----------
   * Zero config — just add netlify attribute to your form in HTML.
   * No JS needed. See: https://docs.netlify.com/forms/setup/
   * If using Netlify, delete the email-form__row div's button onclick
   * and use a standard <form method="POST" netlify> instead.
   * ---------------------------------------------------------------- */
}


/* ================================================================
   4. LOCAL EMAIL STORAGE
   ================================================================
   Stores submitted emails in the browser's localStorage.
   This creates a lightweight local log that persists on the same
   device/browser — useful as a backup alongside your main service.

   To read stored emails in the browser console, run:
     JSON.parse(localStorage.getItem('nywasa_signups'))
   ================================================================ */
function saveEmailLocally(email) {
  try {
    const existing = JSON.parse(localStorage.getItem('nywasa_signups') || '[]');
    // Avoid duplicate entries
    if (!existing.find(entry => entry.email === email)) {
      existing.push({
        email:     email,
        timestamp: new Date().toISOString(),
        source:    'coming_soon_page',
      });
      localStorage.setItem('nywasa_signups', JSON.stringify(existing));
    }
  } catch (e) {
    console.warn('[NYWASA] Could not save email locally:', e);
  }
}


/* ================================================================
   5a. FORMSPREE INTEGRATION
   ================================================================ */
async function submitViaFormspree(email, formId) {
  /* If the form ID hasn't been configured yet, show success anyway
     (dev/preview mode — remove this check before going live) */
  if (formId === 'YOUR_FORM_ID') {
    console.info('[NYWASA] Formspree form ID not set — running in demo mode.');
    setLoading(false);
    showSuccess();
    return;
  }

  try {
    const response = await fetch(`https://formspree.io/f/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':       'application/json',
      },
      body: JSON.stringify({ email: email, _subject: 'New NYWASA Early Access Signup' }),
    });

    const data = await response.json();

    setLoading(false);

    if (response.ok) {
      showSuccess();
    } else {
      const msg = (data.errors || []).map(e => e.message).join(', ') || 'Something went wrong. Please try again.';
      setError(msg);
    }
  } catch (err) {
    console.error('[NYWASA] Formspree error:', err);
    setLoading(false);
    // Still show success locally so user experience isn't broken
    showSuccess();
  }
}


/* ================================================================
   5b. EMAILJS INTEGRATION
   ================================================================ */
async function submitViaEmailJS(email, { publicKey, serviceId, templateId }) {
  /* Load EmailJS SDK dynamically so it only loads when used */
  if (typeof emailjs === 'undefined') {
    await loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js');
    emailjs.init(publicKey);
  }

  try {
    await emailjs.send(serviceId, templateId, {
      user_email:  email,
      to_email:    'hello@nywasa.com',    // REPLACE: your receiving email
      brand_name:  'NYWASA',
      reply_to:    email,
    });
    setLoading(false);
    showSuccess();
  } catch (err) {
    console.error('[NYWASA] EmailJS error:', err);
    setLoading(false);
    setError('Submission failed. Please try again shortly.');
  }
}

/** Helper: dynamically load an external script */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script  = document.createElement('script');
    script.src    = src;
    script.async  = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Failed to load: ${src}`));
    document.head.appendChild(script);
  });
}


/* ================================================================
   6. KEYBOARD & UX ENHANCEMENTS
   ================================================================ */

// Allow Enter key in email input to trigger submit
if (emailInput) {
  emailInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleEmailSubmit();
    }
  });

  // Clear error as user types
  emailInput.addEventListener('input', clearError);
}


/* ================================================================
   7. FOOTER — DYNAMIC YEAR
   ================================================================ */
const yearEl = document.getElementById('currentYear');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* ================================================================
   8. INIT LOG (remove or keep for debugging)
   ================================================================ */
console.log(
  '%cNYWASA',
  'color:#C9A66B;font-family:Georgia,serif;font-size:28px;font-style:italic;',
  '\nThe Art of Gifting — Coming Soon'
);
