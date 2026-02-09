// assets/js/components/pages/contact.js
/**
 * Formulario de Contacto - BEM
 * Validación, envío y feedback mejorados
 */

/* ========================================
   DOM ELEMENTS (BEM)
   ======================================== */

const DOM = {
  form: null,
  inputs: {},
  button: null,
  successMessage: null,
  errorElements: {}
};

/* ========================================
   CONFIGURACIÓN
   ======================================== */

const CONFIG = {
  enterpriseEmail: 'contacto@ixelartesanias.com',
  minNameLength: 3,
  minMessageLength: 10,
  phoneLength: 10,
  successMessageDuration: 5000
};

/* ========================================
   INICIALIZACIÓN
   ======================================== */

function initContactForm() {
  // Obtener elementos del DOM
  DOM.form = document.getElementById('contact-form');
  
  if (!DOM.form) {
    console.warn('Formulario de contacto no encontrado');
    return;
  }

  DOM.inputs = {
    name: DOM.form.querySelector('#name'),
    phone: DOM.form.querySelector('#phone'),
    email: DOM.form.querySelector('#email'),
    message: DOM.form.querySelector('#message')
  };

  DOM.button = DOM.form.querySelector('.contact-form__button');
  DOM.successMessage = document.getElementById('success-message');

  // Obtener elementos de error
  Object.keys(DOM.inputs).forEach(key => {
    DOM.errorElements[key] = DOM.form.querySelector(`[data-error="${key}"]`);
  });

  // Event listeners
  setupEventListeners();
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

function setupEventListeners() {
  // Submit del formulario
  DOM.form.addEventListener('submit', handleSubmit);

  // Validación en tiempo real
  Object.entries(DOM.inputs).forEach(([name, input]) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });

  // Permitir solo números en teléfono
  DOM.inputs.phone.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });
}

/* ========================================
   MANEJO DE SUBMIT
   ======================================== */

async function handleSubmit(event) {
  event.preventDefault();

  // Validar formulario completo
  const isValid = validateForm();
  
  if (!isValid) {
    showFormError('Por favor, corrige los errores antes de enviar');
    return;
  }

  // Obtener datos del formulario
  const formData = getFormData();

  // Cambiar estado del botón a "enviando"
  setButtonLoading(true);

  try {
    // Simular envío (en producción, aquí iría tu API)
    await sendFormData(formData);

    // Éxito
    showSuccessMessage();
    resetForm();
    
  } catch (error) {
    console.error('Error enviando formulario:', error);
    showFormError('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
  } finally {
    setButtonLoading(false);
  }
}

/* ========================================
   VALIDACIÓN
   ======================================== */

/**
 * Valida todo el formulario
 */
function validateForm() {
  let isValid = true;

  Object.values(DOM.inputs).forEach(input => {
    if (!validateField(input)) {
      isValid = false;
    }
  });

  return isValid;
}

/**
 * Valida un campo individual
 */
function validateField(input) {
  const value = input.value.trim();
  const name = input.name;

  // Limpiar errores previos
  clearFieldError(input);

  // Validar campo vacío
  if (!value) {
    showFieldError(input, 'Este campo es obligatorio');
    return false;
  }

  // Validaciones específicas
  switch (name) {
    case 'name':
      if (value.length < CONFIG.minNameLength) {
        showFieldError(input, `El nombre debe tener al menos ${CONFIG.minNameLength} caracteres`);
        return false;
      }
      break;

    case 'phone':
      if (!validatePhone(value)) {
        showFieldError(input, `El teléfono debe tener ${CONFIG.phoneLength} dígitos`);
        return false;
      }
      break;

    case 'email':
      if (!validateEmail(value)) {
        showFieldError(input, 'Por favor, ingresa un correo válido');
        return false;
      }
      break;

    case 'message':
      if (value.length < CONFIG.minMessageLength) {
        showFieldError(input, `El mensaje debe tener al menos ${CONFIG.minMessageLength} caracteres`);
        return false;
      }
      break;
  }

  // Si pasa todas las validaciones
  markFieldAsValid(input);
  return true;
}

/**
 * Valida formato de email
 */
function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
}

/**
 * Valida formato de teléfono
 */
function validatePhone(phone) {
  return phone.length === CONFIG.phoneLength && /^\d+$/.test(phone);
}

/* ========================================
   UI FEEDBACK
   ======================================== */

/**
 * Muestra error en un campo
 */
function showFieldError(input, message) {
  input.classList.add('contact-form__input--error');
  input.classList.remove('contact-form__input--success');

  const errorElement = DOM.errorElements[input.name];
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Limpia el error de un campo
 */
function clearFieldError(input) {
  input.classList.remove('contact-form__input--error');

  const errorElement = DOM.errorElements[input.name];
  if (errorElement) {
    errorElement.textContent = '';
  }
}

/**
 * Marca un campo como válido
 */
function markFieldAsValid(input) {
  input.classList.add('contact-form__input--success');
  input.classList.remove('contact-form__input--error');
}

/**
 * Limpia todos los errores
 */
function clearAllErrors() {
  Object.values(DOM.inputs).forEach(input => {
    input.classList.remove('contact-form__input--error', 'contact-form__input--success');
  });

  Object.values(DOM.errorElements).forEach(el => {
    if (el) el.textContent = '';
  });

  hideFormError();
}

/**
 * Muestra error general del formulario
 */
function showFormError(message) {
  // Crear o actualizar mensaje de error general
  let errorDiv = DOM.form.querySelector('.contact-form__general-error');
  
  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'contact-form__general-error';
    DOM.form.insertBefore(errorDiv, DOM.form.firstChild);
  }

  errorDiv.textContent = message;
  errorDiv.style.display = 'block';

  // Scroll al error
  errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Oculta error general del formulario
 */
function hideFormError() {
  const errorDiv = DOM.form.querySelector('.contact-form__general-error');
  if (errorDiv) {
    errorDiv.style.display = 'none';
  }
}

/**
 * Muestra mensaje de éxito
 */
function showSuccessMessage() {
  if (DOM.successMessage) {
    DOM.successMessage.style.display = 'block';

    // Scroll suave hacia el mensaje
    DOM.successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Ocultar después de un tiempo
    setTimeout(() => {
      DOM.successMessage.style.display = 'none';
    }, CONFIG.successMessageDuration);
  }
}

/**
 * Cambia estado del botón a loading
 */
function setButtonLoading(isLoading) {
  if (!DOM.button) return;

  if (isLoading) {
    DOM.button.disabled = true;
    DOM.button.dataset.originalText = DOM.button.textContent;
    DOM.button.textContent = 'Enviando...';
    DOM.button.classList.add('contact-form__button--loading');
  } else {
    DOM.button.disabled = false;
    DOM.button.textContent = DOM.button.dataset.originalText || 'Enviar';
    DOM.button.classList.remove('contact-form__button--loading');
  }
}

/* ========================================
   UTILIDADES
   ======================================== */

/**
 * Obtiene datos del formulario
 */
function getFormData() {
  return {
    name: DOM.inputs.name.value.trim(),
    phone: DOM.inputs.phone.value.trim(),
    email: DOM.inputs.email.value.trim(),
    message: DOM.inputs.message.value.trim()
  };
}

/**
 * Resetea el formulario
 */
function resetForm() {
  DOM.form.reset();
  clearAllErrors();
}

/**
 * Envía los datos del formulario
 * En producción, esto haría un fetch a tu API
 */
async function sendFormData(data) {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // OPCIÓN 1: Enviar a tu backend (RECOMENDADO)
  /*
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Error en el servidor');
  }

  return await response.json();
  */

  // OPCIÓN 2: Abrir mailto (fallback temporal)
  openMailto(data);

  return { success: true };
}

/**
 * Abre cliente de correo como fallback
 */
function openMailto(data) {
  const subject = 'Contacto desde Ixel Artesanías';
  const body = `
Nombre: ${data.name}
Email: ${data.email}
Teléfono: ${data.phone}

Mensaje:
${data.message}
  `.trim();

  const mailtoLink = `mailto:${CONFIG.enterpriseEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  
  window.location.href = mailtoLink;
}

/* ========================================
   INIT
   ======================================== */

document.addEventListener('DOMContentLoaded', initContactForm);