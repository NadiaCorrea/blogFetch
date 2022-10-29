//Creación de usuarios con validación de diferentes campos. 

//validación de campos
const inputUserName = document.querySelector('#userName');
const inputLastName = document.querySelector('#userLastName');
const inputNick = document.querySelector('#nick');
const form = document.querySelector('#addUsers');
const addButton = document.querySelector("#add");
const retButton = document.querySelector('#goMain');
const outputDiv = document.querySelector('#outputUsers');

retButton.addEventListener('click', goMain);

function goMain(){
    history.back();
};


form.addEventListener('input', function (e) {
    console.log(e.target.id);
    switch (e.target.id) {
        case 'userName':
            //console.log("nombre");
            validateName();
            break;
        case 'userLastName':
            //console.log("apellido");
            validateLastName();
            break;
        case 'nick':
            //console.log("nick");
            validateNick();
            break;
    }
});

addButton.addEventListener('click', function (e){
    e.preventDefault();
    outputDiv.innerHTML="";
    let isNameValid = validateName(),
        isLastNameValid = validateLastName(),
        isNickValid = validateNick();
    let isFormValid = isNameValid && isLastNameValid && isNickValid;
    //console.log(isFormValid);
    if(isFormValid){
        // creo los atributos
        let uName = inputUserName.value + " " + inputLastName.value;
        let nickname = inputNick.value; 
        // creo un usuario con los valores obtenidos del formulario
        let user = {user:uName, nick:nickname} 
        
        //si es válido se hace el post en users

        fetch('http://localhost:3000/users', {
            method: 'POST', 
            body: JSON.stringify(user),// los datos que enviamos al servidor en el 'send'
            headers:{'Content-Type': 'application/json'} }) 
            
            .then(response => {
                if (response.ok) {
                    outputDiv.innerHTML = "Usuario añadido";
                    form.reset();
                    setTimeout(clearOutputDiv, 3000);
                return response.json();
                
            }
            return Promise.reject(response) }) 
            
            .catch(err => {muestraError(err);}); 
    }
});


function clearOutputDiv() {
    outputDiv.innerHTML = "";
}

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {console.log("Ocurrió un error o se abortó la conexión");} 
}

function validateName() {
    let valid = false;
    const min = 3,
          max = 20;
        console.log(inputUserName);
    const name = inputUserName.value.trim();
    const span = document.querySelector('#spanName');
    if (!isBetween(name.length, min, max)) {
        span.innerHTML = `El nombre debe tener entre ${min} y ${max} caracteres.`;
    } else {
        valid = true;
        span.innerHTML ="";
    }
    return valid;
};

function validateLastName(){
    let valid = false;
    const min = 3,
          max = 30;
    const lastName = inputLastName.value.trim();
    const span = document.querySelector('#spanLastName');
    if (!isBetween(lastName.length, min, max)) {
        span.innerHTML = `Los apellidos deben tener entre ${min} y ${max} caracteres.`;
    } else {
        valid = true;
        span.innerHTML = "";
    }
    return valid;
}

function validateNick(){
    let valid = false;
    const min = 3,
          max = 10;
    const nick = inputNick.value.trim();
    const span = document.querySelector('#spanNick');
    if (!isBetween(nick.length, min, max)){
        span.innerHTML = `El nombre de usuario debe tener entre ${min} y ${max} caracteres.`;
    } else {
        valid = true;
        span.innerHTML = "";
    }
    return valid;
}

function isBetween (length, min, max){
    if (length < min || length > max){
       return false; 
    } else{
        return true;
    }    
};