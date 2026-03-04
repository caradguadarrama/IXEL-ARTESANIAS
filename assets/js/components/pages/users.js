document.getElementById("account").addEventListener("click", function(event) {
    console.log("account");

    showForms("account");
});

document.getElementById("session").addEventListener("click", function(event) {
    console.log("session");

    showForms("session");
});

document.getElementById("address").addEventListener("click", function(event) {
    console.log("address");

    showForms("address");
});

document.getElementById("delivery").addEventListener("click", function(event) {
    console.log("delivery");

    showForms("delivery");
});

async function showForms(elementId){
    let formContainer = document.getElementById("user-forms");
    let body;
    let fileName;

    switch(elementId){
        case "account":
            fileName = `/pages/users/${elementId}.html`;
            body = await getHtmlBody(fileName);
            break;
        
        case "session":
            fileName = `/pages/users/${elementId}.html`;
            body = await getHtmlBody(fileName);
            break;

        case "address":
            fileName = `/pages/users/${elementId}.html`;
            body = await getHtmlBody(fileName);
            break;

        case "delivery":
            fileName = `/pages/users/${elementId}.html`;
            body = await getHtmlBody(fileName);
            break;

        default:
            console.log("No se encontró el elemento especificado");
    }

    console.log("body");

    formContainer.innerHTML = body;

    if(elementId == "session") {
        addAlert();
    }
}

async function getHtmlBody(htmlDoc) {
    try {
        const response = await fetch(htmlDoc);
        if (!response.ok) {
            console.error("Archivo no encontrado");
        }

        const htmlText = await response.text();
        return htmlText;

    } catch (error) {
        console.error("Error", error);
    }
}

function addAlert() {
    document.getElementById("remove").addEventListener("click", function(event) {
    event.preventDefault();
    console.log("remove");
    let isConfirmed = confirm(`Esta acción no se puede revertir. ¿Estás seguro de continuar?`);
    if (isConfirmed) {

        // AGREGAR MÉTODO PARA HACER FETCH A BACKEND
        
    }
});
}

showForms("account");