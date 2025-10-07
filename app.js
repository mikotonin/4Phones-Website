console.log("app.js loaded ✅");
/* =========================================================
   4Phones - Client-side JS (with full JSDoc)
   - Hover effects for links/buttons
   - Form validation for Register and Contact pages
   - Footer year auto-update
   ========================================================= */

/**
 * Apply hover effects to links and buttons via JS events.
 * Adds temporary bg/text colors on mouseover and restores them on mouseout.
 * Targets elements with .menu-link, button, and .btn.
 * @returns {void}
 */
function attachHoverEffects(){
  const hoverables = [
    ...document.querySelectorAll('.menu-link'),
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('.btn')
  ];
  hoverables.forEach((el) => {
    el.addEventListener('mouseover', () => {
      el.dataset._bg = el.style.backgroundColor || '';
      el.dataset._color = el.style.color || '';
      el.style.backgroundColor = '#0a55c8';
      el.style.color = '#ffffff';
    });
    el.addEventListener('mouseout', () => {
      el.style.backgroundColor = el.dataset._bg || '';
      el.style.color = el.dataset._color || '';
    });
  });
}

/**
 * Put the current year into an element with id="year", if present.
 * @returns {void}
 */
function setFooterYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
}

/* ================= VALIDATION HELPERS ================== */

/**
 * Check if a value contains only letters and spaces.
 * @param {string} value
 * @returns {boolean}
 */
function isAlpha(value){
  return /^[A-Za-z ]+$/.test(value);
}

/**
 * Check if a value contains letters, numbers, and spaces only.
 * @param {string} value
 * @returns {boolean}
 */
function isAlnumSpace(value){
  return /^[A-Za-z0-9 ]+$/.test(value);
}

/**
 * Basic email format check.
 * @param {string} value
 * @returns {boolean}
 */
function isEmail(value){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Show an error message for a field by its id.
 * Expects a <small id="FIELDID-err"> node to exist.
 * @param {string} id - The input element id (e.g., "reg-username").
 * @param {string} [message] - Error text to display; empty to clear.
 * @returns {void}
 */
function setError(id, message){
  const small = document.getElementById(id + '-err');
  if (small){ small.textContent = message || ''; }
}

/* =============== REGISTER PAGE VALIDATION ============== */

/**
 * Validate “Username”: required, 6–20 chars, letters/numbers/spaces only.
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validateUsername(el){
  const v = el.value.trim();
  if (!v) return setError(el.id, 'Username is required'), false;
  if (v.length < 6 || v.length > 20) return setError(el.id, '6 to 20 characters'), false;
  if (!isAlnumSpace(v)) return setError(el.id, 'Letters and numbers only'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate a general name field (First name / Surname / Name).
 * Required; length range; letters/spaces only.
 * @param {HTMLInputElement} el
 * @param {string} [label='Name']
 * @param {number} [min=3]
 * @param {number} [max=50]
 * @returns {boolean}
 */
function validateGeneralName(el, label='Name', min=3, max=50){
  const v = el.value.trim();
  if (!v) return setError(el.id, `${label} is required`), false;
  if (v.length < min || v.length > max) return setError(el.id, `${min} to ${max} characters`), false;
  if (!isAlpha(v)) return setError(el.id, 'Letters and spaces only'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate email (required + format).
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validateEmail(el){
  const v = el.value.trim();
  if (!v) return setError(el.id, 'Email is required'), false;
  if (!isEmail(v)) return setError(el.id, 'Enter a valid email'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate password length 8–12.
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validatePassword(el){
  const v = el.value;
  if (!v) return setError(el.id, 'Password is required'), false;
  if (v.length < 8 || v.length > 12) return setError(el.id, '8 to 12 characters'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate confirm password matches a base password field.
 * @param {HTMLInputElement} el - Confirm password input element.
 * @param {string} [pwdId='reg-password'] - The id of the base password field.
 * @returns {boolean}
 */
function validateConfirmPassword(el, pwdId='reg-password'){
  const v = el.value;
  const base = /** @type {HTMLInputElement|null} */ (document.getElementById(pwdId))?.value || '';
  if (!v) return setError(el.id, 'Confirm your password'), false;
  if (v !== base) return setError(el.id, 'Passwords do not match'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate address-like fields (Address/Suburb): required, 3–50, letters/numbers/spaces.
 * @param {HTMLInputElement} el
 * @param {string} [label='This field']
 * @returns {boolean}
 */
function validateAddressLike(el, label='This field'){
  const v = el.value.trim();
  if (!v) return setError(el.id, `${label} is required`), false;
  if (v.length < 3 || v.length > 50) return setError(el.id, '3 to 50 characters'), false;
  if (!isAlnumSpace(v)) return setError(el.id, 'Letters, numbers and spaces only'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate postcode: exactly 4 digits.
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validatePostcode(el){
  const v = el.value.trim();
  if (!/^\d{4}$/.test(v)) return setError(el.id, 'Exactly 4 digits'), false;
  setError(el.id, ''); return true;
}

/**
 * Validate phone: 8–10 digits.
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validatePhone(el){
  const v = el.value.trim();
  if (!/^\d{8,10}$/.test(v)) return setError(el.id, '8 to 10 digits'), false;
  setError(el.id, ''); return true;
}

/**
 * Register form submit handler. Validates all fields,
 * sets error messages, and prevents submit if any rule fails.
 * Also requires Gender and State to be selected (non-empty value).
 * @param {SubmitEvent} e
 * @returns {void}
 */
function handleRegisterSubmit(e){
  const f = /** @type {HTMLFormElement} */ (e.target);

  const ok = [
    validateGeneralName(f['reg-name'], 'Name', 3, 50),
    validateUsername(f['reg-username']),
    validateEmail(f['reg-email']),
    validatePassword(f['reg-password']),
    validateConfirmPassword(f['reg-confirm']),
    validateGeneralName(f['reg-firstname'], 'First name', 3, 20),
    validateGeneralName(f['reg-surname'], 'Surname', 3, 20),
    validateAddressLike(f['reg-address'], 'Address'),
    validateAddressLike(f['reg-suburb'], 'Suburb'),
    validatePostcode(f['reg-postcode']),
    validatePhone(f['reg-phone'])
  ].every(Boolean);

  // Gender & State required
  const gender = f['reg-gender']?.value || '';
  const state  = f['reg-state']?.value || '';
  setError('reg-gender', gender ? '' : 'Select a gender');
  setError('reg-state',  state  ? '' : 'Select a state');

  if (!ok || !gender || !state) e.preventDefault();
}

/* =============== CONTACT PAGE VALIDATION ============== */

/**
 * Contact form submit handler. Validates:
 * - Name 6–20 letters/spaces
 * - Email format
 * - Phone 8–10 digits
 * - Message > 10 chars
 * Prevents submission if any rule fails.
 * @param {SubmitEvent} e
 * @returns {void}
 */
function handleContactSubmit(e){
  const f = /** @type {HTMLFormElement} */ (e.target);

  const ok = [
    (function(){
      /** @type {HTMLInputElement} */
      const el = f['con-name']; const v = el.value.trim();
      if (!v) return setError(el.id, 'Name is required'), false;
      if (v.length < 6 || v.length > 20) return setError(el.id, '6 to 20 characters'), false;
      if (!isAlpha(v)) return setError(el.id, 'Letters and spaces only'), false;
      setError(el.id,''); return true;
    })(),
    validateEmail(f['con-email']),
    validatePhone(f['con-phone']),
    (function(){
      /** @type {HTMLTextAreaElement} */
      const el = f['con-message']; const v = el.value.trim();
      if (v.length <= 10) return setError(el.id, 'Must be more than 10 characters'), false;
      setError(el.id,''); return true;
    })()
  ].every(Boolean);

  if (!ok) e.preventDefault();
}

/**
 * Wire up page listeners after DOM is ready:
 * - Hover effects
 * - Footer year
 * - Register and Contact form submit handlers
 * @returns {void}
 */
function init4PhonesUI(){
  attachHoverEffects();
  setFooterYear();

  const regForm = document.getElementById('register-form');
  if (regForm){ regForm.addEventListener('submit', handleRegisterSubmit); }

  const conForm = document.getElementById('contact-form');
  if (conForm){ conForm.addEventListener('submit', handleContactSubmit); }
}

document.addEventListener('DOMContentLoaded', init4PhonesUI);
