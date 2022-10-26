/*Vamos a crear un pequeño blog que permita comentarios, 
para ello tendremos que crear un servidor con json-server con las “tablas” users, posts y comments. 
Crearemos las siguientes páginas: 
● Creación de usuarios con validación de diferentes campos. -- FALTA REFACTORIZAR LOS MENSAJES 
● Lista de posts con título y autor. 
● Post con título, contenido y autor. Además se mostrarán los comentarios y nos permitirá añadir nuevos comentarios, 
pudiendo seleccionar el autor como queramos. 
● EXTRA: página para añadir nuevos post, permitirá seleccionar el autor mediante un campo select.
*/
const list = document.getElementById("postList");
const peticion = new XMLHttpRequest();
//Lista de posts con título y autor. 
peticion.open('GET', 'http://localhost:3000/posts');
// console.log("entra");
peticion.send(); 

peticion.addEventListener('load', function() {
    // console.log("entra1");
    if (peticion.status===200) {
        let postsJ=JSON.parse(peticion.responseText);
        // console.log(postsJ);

        for (let post of postsJ){
            // console.log("entra3");
            // let id = ;
            // console.log(id);
            //console.log(post.title);
            const peticionUsers = new XMLHttpRequest();
            peticionUsers.open('GET', `http://localhost:3000/users/${post.authorId}`);
            peticionUsers.send();
            peticionUsers.addEventListener('load', function(){
                if(peticionUsers.status === 200){
                    let user = JSON.parse(peticionUsers.responseText);
                    //console.log(user);
                    let userName= user.user;
                    // console.log(userName);
                    let newList = document.createElement("li");
                    let newLink = document.createElement("a");
                    newLink.setAttribute("href", "post.html?id=" + post.id);
                    let iPost = document.createTextNode("Título: " + post.title + " Autor: " + userName);
                    newLink.appendChild(iPost);
                    newLink.id= "post_" + post.id;
                    newList.appendChild(newLink);
                    list.appendChild(newList);  
                } else {
                    muestraError();
                } 
            }); 
        }
    } else {
        muestraError();
    } 
});

peticion.addEventListener(' error', muestraError); 
peticion.addEventListener(' abort', muestraError); 
peticion.addEventListener(' timeout', muestraError); 

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {console.log("Ocurrió un error o se abortó la conexión");} 
}