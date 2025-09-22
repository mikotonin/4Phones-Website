/* =========================================================
   4Phones - Client-side JS
   - Menu/button hover effects (mouseover/mouseout)
   - Form validation for Register and Contact pages
   - Footer year auto-update
   ========================================================= */

/** Apply hover effects to links and buttons via JS events */
(function attachHoverEffects(){
  const hoverables = [
    ...document.querySelectorAll('.menu-link'),
    ...document.querySelectorAll('button'),
    ...document.querySelectorAll('.btn')
  ];
  hoverables.forEach(el => {
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
})();

/** Put the current year in the footer */
(function setYear(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* =============== VALIDATION HELPERS =================== */
/** Returns true if string has only letters (and spaces). */
function isAlpha(value){ return /^[A-Za-z ]+$/.test(value); }
/** Returns true if string has only letters, numbers, and spaces. */
function isAlnumSpace(value){ return /^[A-Za-z0-9 ]+$/.test(value); }
/** Returns true if email looks valid. */
function isEmail(value){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }
/** Show error text next to a field by id. */
function setError(id, message){
  const small = document.getElementById(id + '-err');
  if (small){ small.textContent = message || ''; }
}

/* =============== REGISTER PAGE VALIDATION ============== */
/**
 * Validate “Username”: required, 6–20 chars, no special characters.
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
 * Validate Name: optional in spec? We'll require non-empty (3–50), no special chars.
 * @param {HTMLInputElement} el
 * @returns {boolean}
 */
function validateGeneralName(el, label='Name', min=3, max=50){
  const v = el.value.trim();
  if (!v) return setError(el.id, `${label} is required`), false;
  if (v.length < min || v.length > max) return setError(el.id, `${min} to ${max} characters`), false;
  if (!isAlpha(v)) return setError(el.id, 'Letters and spaces only'), false;
  setError(el.id, ''); return true;
}

/** Validate email (required). */
function validateEmail(el){
  const v = el.value.trim();
  if (!v) return setError(el.id, 'Email is required'), false;
  if (!isEmail(v)) return setError(el.id, 'Enter a valid email'), false;
  setError(el.id, ''); return true;
}

/** Validate password length 8–12. */
function validatePassword(el){
  const v = el.value;
  if (!v) return setError(el.id, 'Password is required'), false;
  if (v.length < 8 || v.length > 12) return setError(el.id, '8 to 12 characters'), false;
  setError(el.id, ''); return true;
}

/** Validate confirm password matches password. */
function validateConfirmPassword(el, pwdId='reg-password'){
  const v = el.value, base = document.getElementById(pwdId)?.value || '';
  if (!v) return setError(el.id, 'Confirm your password'), false;
  if (v !== base) return setError(el.id, 'Passwords do not match'), false;
  setError(el.id, ''); return true;
}

/** Validate address/suburb generic: 3–50, no special chars. */
function validateAddressLike(el, label='This field'){
  const v = el.value.trim();
  if (!v) return setError(el.id, `${label} is required`), false;
  if (v.length < 3 || v.length > 50) return setError(el.id, '3 to 50 characters'), false;
  if (!isAlnumSpace(v)) return setError(el.id, 'Letters, numbers and spaces only'), false;
  setError(el.id, ''); return true;
}

/** Validate postcode exactly 4 chars, numbers only. */
function validatePostcode(el){
  const v = el.value.trim();
  if (!/^\d{4}$/.test(v)) return setError(el.id, 'Exactly 4 digits'), false;
  setError(el.id, ''); return true;
}

/** Validate phone 8–10 chars, numbers only. */
function validatePhone(el){
  const v = el.value.trim();
  if (!/^\d{8,10}$/.test(v)) return setError(el.id, '8 to 10 digits'), false;
  setError(el.id, ''); return true;
}

/** Register form handler */
function handleRegisterSubmit(e){
  const f = e.target;
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
  const gender = f['reg-gender'].value;
  const state = f['reg-state'].value;
  setError('reg-gender', gender ? '' : 'Select a gender');
  setError('reg-state', state ? '' : 'Select a state');

  if (!ok || !gender || !state) e.preventDefault();
}

/* =============== CONTACT PAGE VALIDATION ============== */
/** Contact: Name 6–20 no special chars (letters only), Email, Phone 8–10 digits, Message >10 chars */
function handleContactSubmit(e){
  const f = e.target;
  const ok = [
    (function(){
      const el = f['con-name']; const v = el.value.trim();
      if (!v) return setError(el.id, 'Name is required'), false;
      if (v.length < 6 || v.length > 20) return setError(el.id, '6 to 20 characters'), false;
      if (!isAlpha(v)) return setError(el.id, 'Letters and spaces only'), false;
      setError(el.id,''); return true;
    })(),
    validateEmail(f['con-email']),
    validatePhone(f['con-phone']),
    (function(){
      const el = f['con-message']; const v = el.value.trim();
      if (v.length <= 10) return setError(el.id, 'Must be more than 10 characters'), false;
      setError(el.id,''); return true;
    })()
  ].every(Boolean);

  if (!ok) e.preventDefault();
}

/* =============== BOOTSTRAP LISTENERS ================== */
document.addEventListener('DOMContentLoaded', () => {
  const regForm = document.getElementById('register-form');
  if (regForm){ regForm.addEventListener('submit', handleRegisterSubmit); }

  const conForm = document.getElementById('contact-form');
  if (conForm){ conForm.addEventListener('submit', handleContactSubmit); }
});
