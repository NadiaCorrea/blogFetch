/*Vamos a crear un pequeño blog que permita comentarios, 
para ello tendremos que crear un servidor con json-server con las “tablas” users, posts y comments. 
Crearemos las siguientes páginas: 
● Creación de usuarios con validación de diferentes campos. -- FALTA REFACTORIZAR LOS MENSAJES 
● Lista de posts con título y autor. 
● Post con título, contenido y autor. Además se mostrarán los comentarios 
y nos permitirá añadir nuevos comentarios, 
pudiendo seleccionar el autor como queramos. 
● EXTRA: página para añadir nuevos post, permitirá seleccionar el autor mediante un campo select.
*/

const list = document.getElementById("postList");
//Lista de posts con título y autor. 

fetch('http://localhost:3000/posts') //solicito los post 
    .then (response => response.json()) //obtengo la respuesta
// proceso los datos que recibo del .then anterior
    .then (posts =>{
        for (let post of posts){
            fetch('http://localhost:3000/users/' + post.authorId)//solicito el autor del id 
                .then(response => response.json()) // obtengo al autor 
                .then(autor =>{
                    let userName= autor.user;
                    console.log(userName);
                    let newList = document.createElement("li");
                    let newLink = document.createElement("a");
                    newLink.setAttribute("href", "post.html?id=" + post.id);
                    let iPost = document.createTextNode("Título: " + post.title + " Autor: " + userName);
                    newLink.appendChild(iPost);
                    newLink.id= "post_" + post.id;
                    newList.appendChild(newLink);
                    list.appendChild(newList);  
                })
                .catch(err => {muestraError(err);}); 
        }})

    .catch(error => {muestraError(error);}); 

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {console.log("Ocurrió un error o se abortó la conexión");} 
};





