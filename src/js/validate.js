export function isRequired(value) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function isValidEmail(value) {
  if (!isRequired(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(value).trim());
}

export function isValidPhone(value) {
  if (!isRequired(value)) return false;
  
  const trimmed = String(value).trim();
  const validCharsRegex = /^[\d\s\-+()]+$/;
  if (!validCharsRegex.test(trimmed)) return false;
  
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 9 && digitsOnly.length <= 15;
}

const ERROR_MESSAGES = {
  required: 'שדה חובה',
  email: 'כתובת מייל לא תקינה',
  phone: 'מספר טלפון לא תקין (9-15 ספרות)',
  checkbox: 'יש לאשר את התנאים',
};

const FIELD_LABELS = {
  fullName: 'שם מלא',
  phone: 'נייד',
  email: 'מייל',
  showroom: 'אולם תצוגה',
  marketingConsent: 'אישור תנאים',
};

export function validateField(inputEl) {
  const value = inputEl.value;
  const name = inputEl.name || inputEl.id;
  const isRequiredField = inputEl.hasAttribute('required') || inputEl.getAttribute('aria-required') === 'true';
  const type = inputEl.type || inputEl.tagName.toLowerCase();

  if (type === 'checkbox') {
    if (isRequiredField && !inputEl.checked) {
      return { valid: false, message: ERROR_MESSAGES.checkbox };
    }
    return { valid: true, message: '' };
  }

  if (isRequiredField && !isRequired(value)) {
    return { valid: false, message: ERROR_MESSAGES.required };
  }

  if (!isRequired(value)) {
    return { valid: true, message: '' };
  }

  if (type === 'email' || name === 'email') {
    if (!isValidEmail(value)) {
      return { valid: false, message: ERROR_MESSAGES.email };
    }
  }

  if (type === 'tel' || name === 'phone') {
    if (!isValidPhone(value)) {
      return { valid: false, message: ERROR_MESSAGES.phone };
    }
  }

  return { valid: true, message: '' };
}

export function getFieldLabel(fieldName) {
  return FIELD_LABELS[fieldName] || fieldName;
}
