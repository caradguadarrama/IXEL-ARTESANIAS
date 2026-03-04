// inicio de sesion para el admin
const admin = {
    email: "pao@gmail.com",
    password: "Admin123@",
    rol: "admin",
    nombre: "Administrador"
};

//cambio entre login y registro
function toggleForm() {
    const container = document.getElementById("container");
    if (container.classList.contains("login-mode")) {
        container.classList.remove("login-mode");
        container.classList.add("register-mode");
    } else {
        container.classList.remove("register-mode");
        container.classList.add("login-mode");
    }
}

//validación contraseña y correo

const emailInputs = document.querySelectorAll('input[name="email"]');

emailInputs.forEach(input => {
    input.addEventListener('blur', function () {
        const regex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
        const errorElement = this.parentElement.querySelector('.error-message');

        if (!regex.test(this.value)) {
            if (errorElement) {
                errorElement.textContent = "Correo inválido";
            }
            this.style.borderColor = "red";
        } else {
            if (errorElement) {
                errorElement.textContent = "";
            }
            this.style.borderColor = "green";
        }
    });
});

const passwordInputs = document.querySelectorAll('input[name="password"]');

passwordInputs.forEach(input => {
    input.addEventListener('blur', function () {

        const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
        const errorElement = this.parentElement.querySelector('.error-message');

        if (!regex.test(this.value)) {
            if (errorElement) {
                errorElement.textContent = "Mínimo 7 caracteres, 1 mayúscula y 1 símbolo";
            }
            this.style.borderColor = "red";
        } else {
            if (errorElement) {
                errorElement.textContent = "";
            }
            this.style.borderColor = "green";
        }
    });
});

//Guardar datos en JSON

function handleForm(formSelector, label) {
    const form = document.querySelector(formSelector);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        console.log(label);
        console.log(JSON.stringify(data, null, 2));
    });
}

handleForm('.form', 'LOGIN DATA');
handleForm('.form2', 'REGISTER DATA');

//simulación backend
function showMessage(form, message, type = "error") {
    const prev = form.querySelector(".form-message");
    if (prev) prev.remove();
    const msg = document.createElement("p");
    msg.className = `form-message ${type}`;  
    msg.textContent = message;
    form.appendChild(msg);
    setTimeout(() => msg.remove(), 4000);
}
const registerForm = document.querySelector('.form2');
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find(user => user.email === data.email);
    if (exists) {
        showMessage(registerForm, "El usuario ya existe.", "error");
        return;
    }
    users.push(data);
    localStorage.setItem("users", JSON.stringify(users));
    console.log("Usuarios guardados:", users);
    showMessage(registerForm, "Registro exitoso. ¡Bienvenido!", "success");
});

const loginForm = document.querySelector('.form');
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.email === data.email);

    if (data.email == admin.email && data.password === admin.password){
        localStorage.setItem("currentUser", JSON.stringify(admin ));
        showMessage(loginForm, "Bienvenida, Paola", "success");
        setTimeout(() => {window.location.href = "pages/admin/products.html"}, 1200);
        return;
    }
    if (!user || user.password !== data.password) {
        showMessage(loginForm, "Correo o contraseña incorrectos.", "error");
        return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user));
    console.log("Usuario logueado:", user);
    showMessage(loginForm, "Iniciando sesión...", "success");
    setTimeout(() => { window.location.href = "/index.html"; }, 1200);
    });

