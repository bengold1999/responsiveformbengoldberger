import { validateField, getFieldLabel } from './validate.js';

console.log('✅ main.js loaded successfully');

const form = document.getElementById('contact-form');
const errorSummary = document.getElementById('error-summary');
const errorSummaryList = errorSummary?.querySelector('.error-summary-list');
const successModal = document.getElementById('success-modal');
const modalCloseBtn = successModal?.querySelector('.modal-close');
const headerCloseBtn = document.querySelector('.header-bar .close-btn');

const touchedFields = new Set();

function getErrorElement(inputEl) {
  const errorId = inputEl.getAttribute('aria-describedby');
  return errorId ? document.getElementById(errorId) : null;
}

function getFieldContainer(inputEl) {
  return inputEl.closest('.form-field');
}

function getLabelElement(inputEl) {
  const container = getFieldContainer(inputEl);
  return container?.querySelector('.form-label') || null;
}

function updateLabelVisibility(inputEl) {
  const container = getFieldContainer(inputEl);
  if (!container) return;
  
  const hasValue = inputEl.value.trim().length > 0;
  container.classList.toggle('has-value', hasValue);
}

function showValidState(inputEl) {
  const container = getFieldContainer(inputEl);
  if (container) {
    container.classList.add('is-valid');
    container.classList.remove('has-error');
  }
  
  const validIcon = container?.querySelector('.input-valid-icon');
  if (validIcon) {
    validIcon.removeAttribute('hidden');
  }
}

function hideValidState(inputEl) {
  const container = getFieldContainer(inputEl);
  if (container) {
    container.classList.remove('is-valid');
  }
  
  const validIcon = container?.querySelector('.input-valid-icon');
  if (validIcon) {
    validIcon.setAttribute('hidden', '');
  }
}

function showFieldError(inputEl, message) {
  const container = getFieldContainer(inputEl);
  const errorEl = getErrorElement(inputEl);

  if (container) {
    container.classList.add('has-error');
    container.classList.remove('is-valid');
  }

  inputEl.setAttribute('aria-invalid', 'true');

  if (errorEl) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  const validIcon = container?.querySelector('.input-valid-icon');
  if (validIcon) {
    validIcon.setAttribute('hidden', '');
  }
  
  updateLabelVisibility(inputEl);
}

function clearFieldError(inputEl, showValid = false) {
  const container = getFieldContainer(inputEl);
  const errorEl = getErrorElement(inputEl);
  const isCheckbox = inputEl.type?.toLowerCase() === 'checkbox';
  const hasValue = isCheckbox ? inputEl.checked : inputEl.value.trim().length > 0;

  if (container) {
    container.classList.remove('has-error');
    if (showValid && hasValue) {
      container.classList.add('is-valid');
    } else {
      container.classList.remove('is-valid');
    }
  }

  inputEl.removeAttribute('aria-invalid');

  if (errorEl) {
    errorEl.textContent = '';
    errorEl.hidden = true;
  }

  const validIcon = container?.querySelector('.input-valid-icon');
  if (validIcon && !isCheckbox) {
    if (showValid && hasValue) {
      validIcon.removeAttribute('hidden');
    } else {
      validIcon.setAttribute('hidden', '');
    }
  }
  
  if (!isCheckbox) {
    updateLabelVisibility(inputEl);
  }
}

function validateAndUpdateField(inputEl, showValidState = true) {
  const result = validateField(inputEl);

  if (result.valid) {
    clearFieldError(inputEl, showValidState);
  } else {
    showFieldError(inputEl, result.message);
  }

  return result.valid;
}

function getValidatableFields() {
  if (!form) return [];
  
  return Array.from(form.querySelectorAll('input, select')).filter(el => {
    const type = el.type?.toLowerCase();
    if (type === 'checkbox') {
      return el.hasAttribute('required') || el.getAttribute('aria-required') === 'true';
    }
    return type !== 'hidden' && type !== 'submit' && type !== 'button';
  });
}

function validateAllFields() {
  const fields = getValidatableFields();
  const invalidFields = [];

  fields.forEach(field => {
    const isValid = validateAndUpdateField(field, true);
    if (!isValid) {
      invalidFields.push(field);
    }
  });

  return {
    isValid: invalidFields.length === 0,
    invalidFields,
  };
}

function updateErrorSummary(invalidFields) {
  if (!errorSummary || !errorSummaryList) return;

  if (invalidFields.length === 0) {
    errorSummary.hidden = true;
    errorSummaryList.innerHTML = '';
    return;
  }

  errorSummaryList.innerHTML = invalidFields
    .map(field => {
      const fieldName = field.name || field.id;
      const label = getFieldLabel(fieldName);
      const errorEl = getErrorElement(field);
      const message = errorEl?.textContent || 'שדה לא תקין';
      return `<li><a href="#${field.id}">${label}: ${message}</a></li>`;
    })
    .join('');

  errorSummary.hidden = false;
}

function handleInput(event) {
  const input = event.target;
  
  updateLabelVisibility(input);
  
  const isTouched = touchedFields.has(input.id || input.name);
  
  if (isTouched) {
    validateAndUpdateField(input, true);
  } else {
    const result = validateField(input);
    if (result.valid && input.value.trim()) {
      showValidState(input);
    } else {
      hideValidState(input);
    }
  }
}

function handleBlur(event) {
  const input = event.target;
  touchedFields.add(input.id || input.name);
  validateAndUpdateField(input, true);
}

function handleSubmit(event) {
  event.preventDefault();

  getValidatableFields().forEach(field => {
    touchedFields.add(field.id || field.name);
  });

  const { isValid, invalidFields } = validateAllFields();
  
  updateErrorSummary(invalidFields);

  if (!isValid) {
    if (invalidFields.length > 0) {
      invalidFields[0].focus();
      
      if (errorSummary && !errorSummary.hidden) {
        errorSummary.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    return;
  }

  showSuccessModal();
}

function showSuccessModal() {
  if (!successModal) return;
  
  successModal.hidden = false;
  document.body.style.overflow = 'hidden';
  modalCloseBtn?.focus();
  successModal.addEventListener('keydown', trapFocus);
}

function resetForm() {
  if (!form) return;
  
  // Reset the form (clears all input values)
  form.reset();
  
  // Clear touched fields tracking
  touchedFields.clear();
  
  // Clear error summary
  if (errorSummary) {
    errorSummary.hidden = true;
    if (errorSummaryList) {
      errorSummaryList.innerHTML = '';
    }
  }
  
  // Reset all field states (validation, labels, icons)
  const fields = getValidatableFields();
  fields.forEach(field => {
    const container = getFieldContainer(field);
    if (container) {
      container.classList.remove('has-error', 'is-valid', 'has-value');
    }
    
    field.removeAttribute('aria-invalid');
    
    const errorEl = getErrorElement(field);
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.hidden = true;
    }
    
    const validIcon = container?.querySelector('.input-valid-icon');
    if (validIcon) {
      validIcon.setAttribute('hidden', '');
    }
  });
}

function hideSuccessModal() {
  if (!successModal) return;
  
  successModal.hidden = true;
  document.body.style.overflow = '';
  successModal.removeEventListener('keydown', trapFocus);
  
  // Reset the form when closing the success modal
  resetForm();
  
  form?.querySelector('input')?.focus();
}

function trapFocus(event) {
  if (event.key !== 'Tab' || !successModal) return;

  const focusableElements = successModal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstEl = focusableElements[0];
  const lastEl = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstEl) {
    event.preventDefault();
    lastEl?.focus();
  } else if (!event.shiftKey && document.activeElement === lastEl) {
    event.preventDefault();
    firstEl?.focus();
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape' && successModal && !successModal.hidden) {
    hideSuccessModal();
  }
}

function init() {
  if (!form) {
    console.warn('Contact form not found');
    return;
  }

  const fields = getValidatableFields();

  fields.forEach(field => {
    const isCheckbox = field.type?.toLowerCase() === 'checkbox';
    
    if (isCheckbox) {
      field.addEventListener('change', (e) => {
        touchedFields.add(field.id || field.name);
        validateAndUpdateField(field, true);
      });
    } else {
      field.addEventListener('input', handleInput);
      field.addEventListener('blur', handleBlur);
      
      if (field.tagName.toLowerCase() === 'select') {
        field.addEventListener('change', (e) => {
          updateLabelVisibility(e.target);
          handleBlur(e);
        });
      }
      
      updateLabelVisibility(field);
    }
  });

  form.addEventListener('submit', handleSubmit);

  modalCloseBtn?.addEventListener('click', hideSuccessModal);
  
  successModal?.addEventListener('click', (event) => {
    if (event.target === successModal) {
      hideSuccessModal();
    }
  });

  document.addEventListener('keydown', handleEscapeKey);

  headerCloseBtn?.addEventListener('click', () => {
    resetForm();
  });

  errorSummaryList?.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (link) {
      event.preventDefault();
      const targetId = link.getAttribute('href')?.replace('#', '');
      const targetField = targetId ? document.getElementById(targetId) : null;
      targetField?.focus();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
