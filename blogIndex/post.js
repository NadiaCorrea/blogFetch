const url = new URLSearchParams(location.search);
//console.log(url);
const idParam = url.get('id');
//console.log(idParam);
const backButton = document.getElementById('goBack');

backButton.addEventListener('click', ()=> {history.back();});

function loadPosts(){
    let deletedComments = document.querySelector('#comments span');
    deletedComments.innerHTML = "";

//Obtener título, fecha de publicación y id del autor del post pasando como parámetro el id del post
fetch('http://localhost:3000/posts/' + idParam)
    .then(response => response.json()) //obtengo el post
    //proceso el post
    .then(post =>{
        let postId = post.id; //id del post
        let postAuthorId = post.authorId; // id del autor del post
        //obtener el span resultado del div del título y mostrar el título
        let divTitle = document.querySelector('#title span');
        divTitle.innerHTML = post.title;// título del post
        //obtener el span resultado del div fecha de publicación y mostrar fecha del post
        let divDate = document.querySelector('#date span');
        divDate.innerHTML = post.date; //fecha del post 

        //obtener nick del author del post pasando como parametro el id del autor
        fetch('http://localhost:3000/users/' + postAuthorId)
            .then(response => response.json())
            .then(user => {
                let divAuthor = document.querySelector('#author span');
                divAuthor.innerHTML = user.nick; // nick del autor del post 
            })
            .catch(error => {muestraError(error);});
        
        //obtener comentarios pasando como parámetro el post id
        fetch('http://localhost:3000/comments?postId=' + postId)
            .then(response => response.json())//obtengo comentarios
            .then(comments => {
                //obtener el span resultado del div comentario
                let divComments = document.querySelector('#comments span');
                // creo lista para añadir los comentarios
                let ulComments = document.createElement('ul'); //listado de comentarios

                for(let comment of comments){
                    // elementos de la lista de comentarios
                    let liComments = document.createElement('li'); // cada comentario con su información
                    let commentAuthorId = comment.authorId; 
                    let ulComment = document.createElement('ul'); // lista del comentario
                    let liContent  = document.createElement('li'); // comentario
                    let liTimestamp  = document.createElement('li'); // timestamp
                    let content = document.createTextNode("Comentario: " + comment.content);//contenido del comentario
                    let dateT = document.createTextNode("Fecha y hora: " + comment.timeStamp);//fechay hora del comentario
                    liContent.appendChild(content);
                    liTimestamp.appendChild(dateT);
        
                    ulComment.appendChild(liContent);
                    ulComment.appendChild(liTimestamp);
        
                    fetch('http://localhost:3000/users/' + commentAuthorId)
                        .then(response => response.json())
                        .then(userOfComent => {
                            let nick = userOfComent.nick;
                            let liAuthor  = document.createElement('li');
                            let authorCommentNick = document.createTextNode("Autor: " + nick); //nick del autor del comentario
                            liAuthor.appendChild(authorCommentNick);
                            ulComment.appendChild(liAuthor);
                        })
                        .catch(error => {muestraError(error);});
                    liComments.appendChild(ulComment);
                    ulComments.appendChild(liComments);
                }
                divComments.appendChild(ulComments);
            })
            .catch(error => {muestraError(error);});
    })

    // capturo cualquier error y lo muestro
    .catch(error => {muestraError(error);});
}

loadPosts();

// obtengo todos los elementos para añadir nuevo comentario
const textArea = document.querySelector('#newComment');
const addCommentButton = document.querySelector('#add');
const spanResult = document.querySelector('#addButton span');
const selectUsers = document.querySelector('#usuarios');

//muestra usuarios como opciones en el select
fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
        for ( let user of users){
            let option = document.createElement('option');
            option.setAttribute("value", user.id); // value es el id del usuario que necictaré para añadir el comentario
            let content = document.createTextNode(user.nick);
            option.appendChild(content);
            selectUsers.appendChild(option);
        }
    })
    .catch(error => {muestraError(error);});

addCommentButton.addEventListener('click', addComment);

function addComment(event){
    event.preventDefault();

    if(textArea.value !== ""){
        let content = textArea.value;
        let date = new Date();
        let timeStamp =
            date.getUTCFullYear() + "-" +
            ("0" + (date.getUTCMonth()+1)).slice(-2) + "-" +
            ("0" + date.getUTCDate()).slice(-2) + " " +
            ("0" + date.getUTCHours()).slice(-2) + ":" +
            ("0" + date.getUTCMinutes()).slice(-2) + ":" +
            ("0" + date.getUTCSeconds()).slice(-2);
        let usID = selectUsers.value;
        let commentToAdd = {"content": content, 
            "authorId": usID, 
            "postId": idParam, 
            "timeStamp": timeStamp};
        fetch('http://localhost:3000/comments', {
            method: 'POST', 
            body: JSON.stringify(commentToAdd),// los datos que enviamos al servidor en el 'send'
            headers:{'Content-Type': 'application/json'}})
            .then(response => {
                if(response.ok){
                    textArea.value ="";
                    selectUsers.value = -1;
                    spanResult.innerHTML = "Comentario añadido";
                    setTimeout(clearSpanResult, 3000);
                    loadPosts();
                    return response.json();
                }
                return Promise.reject(response);
            })
            .catch(error => { muestraError(error);});
    }

}

function clearSpanResult (){
    spanResult.innerHTML = "";
}

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {console.log("Ocurrió un error o se abortó la conexión");} 
}
