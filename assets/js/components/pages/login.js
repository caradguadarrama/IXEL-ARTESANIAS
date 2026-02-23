function toggleForm(){

    const container = document.getElementById("container");

    if(container.classList.contains("login-mode")){
        container.classList.remove("login-mode");
        container.classList.add("register-mode");
    }else{
        container.classList.remove("register-mode");
        container.classList.add("login-mode");
    }

}


//función para extraer los datos del formulario y convertirlo en json
function handleForm(formSelector, label) {
    const form = document.querySelector(formSelector);

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        localStorage.setItem(label, JSON.stringify(data));

        console.log(label);
        console.log(JSON.stringify(data, null, 2));
    });
}

handleForm('.form', 'LOGIN DATA');
handleForm('.form2', 'REGISTER DATA');

//validación contraseña 
const passwordInput = document.getElementById('password');

if(passwordInput){
    passwordInput.addEventListener('blur', function () {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
    if (!regex.test(this.value)) {
        alert("La contraseña debe tener al menos 7 caracteres, una mayúscula y un carácter especial.");
    }
    });
}

//guardar info y que el registro e inicio de sesión sea funcional 

const registerForm = document.querySelector('.form2');

registerForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const formData = new FormData(registerForm);
    const data = Object.fromEntries(formData.entries());

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.email === data.email);

    if (exists) {
        alert("El usuario ya existe");
        return;
    }
    users.push(data);

    localStorage.setItem("users", JSON.stringify(users));

    console.log("Usuarios guardados:", users);

    alert("Registro exitoso");

    toggleForm(); // volver a login
});

const loginForm = document.querySelector('.form');

loginForm.addEventListener("submit", (e) => {

    e.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries());

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(user => user.email === data.email);

    if (!user || user.password !== data.password) {
        alert("Credenciales incorrectas");
        return;
    }
    localStorage.setItem("currentUser", JSON.stringify(user)); // guardar sesión

    console.log("Usuario logueado:", user);
    window.location.href = "/index.html";// REDIRECCIÓN
});