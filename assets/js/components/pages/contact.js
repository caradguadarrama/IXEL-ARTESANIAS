document.getElementById("forms").addEventListener("submit", function(event) {

    event.preventDefault();

    let name = document.getElementById("name").value;

    let phone = document.getElementById("phone").value;

    let email = document.getElementById("exampleInputEmail1").value;

    let message = document.getElementById("message").value;

    if(validateEmail(email) && validatePhone(phone)) {

        sendEmail(email, name, phone, message);

    } else {

        alert("El email o el teléfono no son válidos");

    }

})

function validateEmail(email) {

    let regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regexEmail.test(email);

}

function validatePhone(phone) {

    let phoneNumber = Number(phone);
    return !isNaN(phoneNumber) && phone.length == 10;

}

function sendEmail(email, name, phone, message) {

    const enterpriseEmail = "email@email.com";
    let subject = "Contacto Ixel";
    let body = `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}\nMensaje:\n${message}`;
    window.open(`mailto:${enterpriseEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);

}