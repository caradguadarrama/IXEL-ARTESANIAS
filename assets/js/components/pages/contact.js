// assets/js/components/pages/contact.js

/**
 * Manejo del formulario de contacto
 */

// Elementos del DOM
let form;
let inputs;
let successMessage;

/**
 * Inicializa el formulario de contacto
 */
function initContactForm() {
    form = document.getElementById('contact-form');
    
    if (!form) return;

    inputs = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        message: form.querySelector('#message')
    };

    successMessage = document.getElementById('success-message');

    // Event listeners
    form.addEventListener('submit', handleSubmit);

    // Validación en tiempo real
    Object.values(inputs).forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

/**
 * Maneja el envío del formulario
 * @param {Event} event - Evento de submit
 */
async function handleSubmit(event) {
    event.preventDefault();

    // Validar todos los campos
    const isValid = validateForm();

    if (!isValid) {
        return;
    }

    // Obtener datos del formulario
    const formData = {
        name: inputs.name.value.trim(),
        email: inputs.email.value.trim(),
        message: inputs.message.value.trim(),
        timestamp: new Date().toISOString()
    };

    // Deshabilitar botón mientras se envía
    const submitButton = form.querySelector('.contact-form__submit');
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    try {
        // Simular envío (aquí conectarás con tu backend después)
        await sendContactForm(formData);

        // Mostrar mensaje de éxito
        showSuccessMessage();

        // Limpiar formulario
        form.reset();
        clearAllErrors();

    } catch (error) {
        console.error('Error al enviar el formulario:', error);
        alert('Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Enviar Mensaje';
    }
}

/**
 * Simula el envío del formulario (reemplazar con API real)
 * @param {Object} data - Datos del formulario
 * @returns {Promise}
 */
function sendContactForm(data) {
    return new Promise((resolve) => {
        // Guardar en localStorage temporalmente
        const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
        contacts.push(data);
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Simular delay de red
        setTimeout(() => {
            console.log('Formulario enviado:', data);
            resolve();
        }, 1000);
    });
}

/**
 * Valida todo el formulario
 * @returns {boolean} - true si es válido
 */
function validateForm() {
    let isValid = true;

    Object.values(inputs).forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Valida un campo individual
 * @param {HTMLElement} input - Input a validar
 * @returns {boolean} - true si es válido
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
            if (value.length < 3) {
                showFieldError(input, 'El nombre debe tener al menos 3 caracteres');
                return false;
            }
            if (!/^[a-záéíóúñ\s]+$/i.test(value)) {
                showFieldError(input, 'El nombre solo puede contener letras');
                return false;
            }
            break;

        case 'email':
            if (!isValidEmail(value)) {
                showFieldError(input, 'Por favor, ingresa un correo válido');
                return false;
            }
            break;

        case 'message':
            if (value.length < 10) {
                showFieldError(input, 'El mensaje debe tener al menos 10 caracteres');
                return false;
            }
            if (value.length > 500) {
                showFieldError(input, 'El mensaje no puede exceder 500 caracteres');
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
 * @param {string} email - Email a validar
 * @returns {boolean}
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Muestra error en un campo
 * @param {HTMLElement} input - Input con error
 * @param {string} message - Mensaje de error
 */
function showFieldError(input, message) {
    input.classList.add('contact-form__input--error');
    input.classList.remove('contact-form__input--success');

    const errorElement = form.querySelector(`[data-error="${input.name}"]`);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Limpia el error de un campo
 * @param {HTMLElement} input - Input a limpiar
 */
function clearFieldError(input) {
    input.classList.remove('contact-form__input--error');
    
    const errorElement = form.querySelector(`[data-error="${input.name}"]`);
    if (errorElement) {
        errorElement.textContent = '';
    }
}

/**
 * Marca un campo como válido
 * @param {HTMLElement} input - Input válido
 */
function markFieldAsValid(input) {
    input.classList.add('contact-form__input--success');
    input.classList.remove('contact-form__input--error');
}

/**
 * Limpia todos los errores del formulario
 */
function clearAllErrors() {
    Object.values(inputs).forEach(input => {
        input.classList.remove('contact-form__input--error', 'contact-form__input--success');
    });

    const errorElements = form.querySelectorAll('.contact-form__error');
    errorElements.forEach(el => el.textContent = '');
}

/**
 * Muestra el mensaje de éxito
 */
function showSuccessMessage() {
    if (successMessage) {
        successMessage.style.display = 'block';

        // Ocultar después de 5 segundos
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 5000);

        // Scroll suave hacia el mensaje
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initContactForm);