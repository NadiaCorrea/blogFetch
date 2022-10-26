const url = new URLSearchParams(location.search);
//console.log(url);
const idParam = url.get('id');
//console.log(idParam);

//obtener título y id del autor del post pasandole el id del post
const peticionPost = new XMLHttpRequest();
peticionPost.open('GET', `http://localhost:3000/posts/${idParam}`);
peticionPost.send();

peticionPost.addEventListener('load', function() {
    if(peticionPost.status ===200){
        let post = JSON.parse(peticionPost.responseText);
        let postId = post.id;
        //let postDate = post.date; 
        let postAuthorId = post.authorId; // id del autor del post
        //let postTitle = post.title; 

        //obtener el span resultado del div del título y mostrar el título
        let divTitle = document.querySelector('#title span');
        divTitle.innerHTML = post.title;// título del post
        //obtener el span resultado del div fecha de publicación y mostrar fecha del post
        let divDate = document.querySelector('#date span');
        divDate.innerHTML = post.date; //fecha del post 

        //obtener nick del author del post pasando como parametro el id del autor
        const petitionAuthorPost = new XMLHttpRequest();
        petitionAuthorPost.open('GET', `http://localhost:3000/users/${postAuthorId}`);
        petitionAuthorPost.send();

        petitionAuthorPost.addEventListener('load', function(){
            if(petitionAuthorPost.status===200){
                let postUser = JSON.parse(petitionAuthorPost.responseText);
                //console.log(postUser);
                //const postUserNick = postUser.nick;
                let divAuthor = document.querySelector('#author span');
                divAuthor.innerHTML = postUser.nick; // nick del autor del post 
                //console.log(postUserNick); 
            }else{
                muestraError();
            }
        });

        //obtener comentarios pasando como parámetro el post id
        const peticionComments = new XMLHttpRequest();
        peticionComments.open('GET', `http://localhost:3000/comments?postId=${postId}`);//para solicitar algún parametro diferente al id ?
        peticionComments.send();

        peticionComments.addEventListener('load', function(){
            if(peticionComments.status===200){
                let comments = JSON.parse(peticionComments.responseText);
                //console.log(comments);//es una colección 
                //obtener el span resultado del div comentario
                let divComments = document.querySelector('#comments span');
                let ulComments = document.createElement('ul'); // creo lista para añadir los comentarios

                for(let comment of comments){
                    let liComments = document.createElement('li'); // elementos de la lista de comentarios
                    let commentAuthorId = comment.authorId;
                    //console.log(commentAuthorId);
                    const peticionAuthorComment =new XMLHttpRequest();
                    peticionAuthorComment.open('GET', `http://localhost:3000/users/${commentAuthorId}`);
                    peticionAuthorComment.send();

                    let ulComment = document.createElement('ul');
                    let liContent  = document.createElement('li'); 
                    let liTimestamp  = document.createElement('li');
                    
                    let content = document.createTextNode("Comentario: " + comment.content);//contenido del comentario
                    let dateT = document.createTextNode("Fecha y hora: " + comment.timeStamp);//fechay hora del comentario

                    liContent.appendChild(content);
                    liTimestamp.appendChild(dateT);

                    ulComment.appendChild(liContent);
                    ulComment.appendChild(liTimestamp);
            
                    peticionAuthorComment.addEventListener('load',function(){
                        //console.log('entra comentario');
                        if(peticionAuthorComment.status===200){
                            let authorComment = JSON.parse(peticionAuthorComment.responseText);
                            console.log(authorComment); 
                            let liAuthor  = document.createElement('li'); 
                            let authorCommentNick = document.createTextNode("Autor: " + authorComment.nick); //autor del comentario
                            liAuthor.appendChild(authorCommentNick);
                            ulComment.appendChild(liAuthor);
                            //console.log(authorCommentNick);
                        }else{
                            muestraError();
                        }
                    });

                    liComments.appendChild(ulComment);
                    ulComments.appendChild(liComments);
                    //console.log(content);
                    //console.log(dateT);
                }
                divComments.appendChild(ulComments);

            }else{
                muestraError();
            }

        });

        //console.log(post);
        //console.log(postDate);
        //console.log(postAuthorId);
        //console.log(postTitle);
        
    }else{
        muestraError();
    }

});


peticionPost.addEventListener(' error', muestraError); 
peticionPost.addEventListener(' abort', muestraError); 
peticionPost.addEventListener(' timeout', muestraError); 

function muestraError() {
    if (this.status) {
        console.log("Error "+this.status+" ("+this.statusText+") en la petición");
    } else {console.log("Ocurrió un error o se abortó la conexión");} 
}
