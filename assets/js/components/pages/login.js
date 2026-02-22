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

        console.log(label);
        console.log(JSON.stringify(data, null, 2));
    });
}

handleForm('.form', 'LOGIN DATA');
handleForm('.form2', 'REGISTER DATA');

//validación contraseña 
const passwordInput = document.getElementById('password');

passwordInput.addEventListener('blur', function () {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{7,}$/;
  if (!regex.test(this.value)) {
    alert("La contraseña debe tener al menos 7 caracteres, una mayúscula y un carácter especial.");
  }
});