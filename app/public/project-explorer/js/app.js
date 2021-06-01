let path = window.location.href;

//async function for get api
let asyncfunction = async function(url){

    let response = await fetch(url);
    if(response.status != 200){
        throw new Error("something went wrong!!!");
    }
    let data = await response.json();
    return data;

}


//async function post api
let asyncfunctionpost = async function(url, postData){
    let response = await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: postData
    });
    if(response.status != 200){
        let errorsFromServer = true;
        let serverData = await response.json();
        return {errorsFromServer, serverData}
    }else{
        let errorsFromServer = false;
        let serverData = await response.json();
        return {errorsFromServer, serverData}
    } 
    
}




let program = document.querySelector("#Program");
let graduationYear = document.querySelector("#graduationYear");
let signup = document.querySelector("#signupForm")
let loginForm = document.querySelector('#loginForm')


window.onload = function(){
    if(path.includes("register.html")){
               // fetching grad year and programs
    
        document.querySelector('#alertErrors').style.display = "none";

        asyncfunction('/api/programs').then(data => {
            data.forEach(item => program.innerHTML += `<option value="${item}">${item}</option>`)
        }).catch(err => console.log(err.message))

        asyncfunction('/api/graduationYears').then(data => {
            data.forEach(item => graduationYear.innerHTML += `<option value="${item}">${item}</option>`)
        }).catch(err => console.log(err.message))

    }

    //user login 
    if(path.includes("index.html") || path.includes("viewproject.html") || path.includes("createproject.html") || path.includes("editproject.html") || path.includes("profile.html") || path.includes("search.html")){

        let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

        document.querySelector('#logoutlink').style.display = "none";
        document.querySelector('#username').style.display = "none";

        console.log(cookie);
        if(cookie.length > 0){ // If a cookie still exists 

            let cookieName = cookie[0].trim().split('=')[1];

            if(cookieName != ''){
                asyncfunction(`/api/users/${cookieName}`)
                .then(data => {

                    let greeting = `Hi, ${data.firstname}`;

                    document.querySelector('#signuplink').style.display = "none";
                    document.querySelector('#loginlink').style.display = "none";

                    document.querySelector('#username').innerHTML = greeting;

                    document.querySelector('#username').style.display = "block";
                    document.querySelector('#logoutlink').style.display = "block";

                })
            }
        }

    }// creatproject page
    if(path.includes("createproject.html")){

        let cookie = document.cookie.split(';').filter(item => item.trim().startsWith("uid"));

        if(cookie.length > 0){ // If a cookie still exists 

            let cookieName = cookie[0].trim().split('=')[1];

            if(cookieName == ''){
                window.location.href = "/project-explorer/login.html"; // Redirect to login.html
                
            }
        }else{
            window.location.href = "/project-explorer/login.html"; // Redirect to login.html
        }
    }

    if(path.includes("index.html")){

        let showcase = document.querySelector('.showcase');

        asyncfunction('/api/projects')
        .then(data => {
                
            data.forEach((item, index) => {

                if(index <= 3){

                    showcase.innerHTML += 
                    
                    `<div class="card" style="width: 16rem; margin-right: 10px">
                        <div class="card-body"><h5 class="card-title"><a href="viewproject.html?id=${item.id}">${item.name}</a></h5>
                            <h6 class="card-subtitle mb-2 text-muted">${item.authors.join(', ')}</h6>
                            <p class="card-text">${item.abstract}</p>
                            <div class="d-flex flex-row">${item.tags.join(' ')}</div>
                        </div>
                    </div>` ;   
            
                }

            });
        

        });

    }

    if(path.includes("viewproject.html")){

        let params = new URLSearchParams(document.location.search.substring(1));
        let projectId = params.get("id");

        asyncfunction (`/api/projects/${projectId}`)
        .then(data => {
 
            console.log(data.name);
            document.querySelector("#project_name").innerHTML = `<h2>${data.name.toUpperCase()}</h2>`;
            document.querySelector("#project_abstract").innerHTML = `<p>${data.abstract}</p>`;
            data.authors.forEach((author,index) => {

                if(index == data.authors.length - 1){
                    document.querySelector("#project_authors").innerHTML += `<div>${author}</div>`;
                }else{
                    document.querySelector("#project_authors").innerHTML += `<div>${author}</div><hr/>`;
                }

            });



            document.querySelector('#project_tags').innerHTML = data.tags.join(' ');
            
            asyncfunction (`/api/users/${data.createdBy}`)
            .then(data => {
                //console.log(data)
                document.querySelector("#project_author").innerHTML = `${data.firstname} ${data.lastname}`;
            })

        });
        

    }

}


if(path.includes("register.html")){
// the  signup button
    signup.addEventListener('submit', function(e){

        e.preventDefault();

        let data = {
            firstname: signup.firstName.value,
            lastname: signup.lastName.value,
            email: signup.email.value,
            password: signup.password.value,
            matricNumber: signup.matricNumber.value,
            program: signup.program.value,
            graduationYear: signup.graduationYear.value
        }

        data = JSON.stringify(data);

        asyncfunctionpost('/api/register', data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){
                document.querySelector('#alertErrors').style.display = "block";
                serverData.errors.forEach(error => {
                    document.querySelector('#alertErrors').innerHTML += `<div>${error}</div>`
                })
            }else{
                let name = "uid";
                let value = serverData.data.id;
                let maxAge = 60 * 60 * 24 * 100;

                document.cookie = `${name}=${value};path=/;max-age=${maxAge};`;
                window.location.href = "/project-explorer/index.html"
                
            }
        })
        .catch(err => console.log(err))

       

    })


}

if(path.includes("login.html")){
    //login page button


    loginForm.addEventListener('submit', function(e){

        e.preventDefault();
        let data = {

            email: loginForm.email.value,
            password: loginForm.password.value
        }

        data = JSON.stringify(data);

        asyncfunctionpost('/api/login', data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){
                document.querySelector('#alertErrors').innerHTML = `<div>Invalid email/password</div>`;
                document.querySelector('#alertErrors').style.display = "block";
            }else{
                let name = "uid";
                let value = serverData.data.id;
                let maxAge = 60 * 60 * 24 * 100;

                document.cookie = `${name}=${value};path=/;max-age=${maxAge};`;
                window.location.href = "/project-explorer/index.html"
            }

        }) .catch(err => console.log(err))
    })
}

//logout path
if(path.includes("index.html") || path.includes("viewproject.html") || path.includes("createproject.html") || path.includes("editproject.html") || path.includes("profile.html") || path.includes("search.html")){
    let logout = document.querySelector('#logoutlink');

    logout.addEventListener('click', function(e){

        e.preventDefault();
        document.cookie = `uid=;path=/;expires=Thu, 01 Jan 1970T00:00:00Z;`;
        window.location.href = "/project-explorer/index.html"

    });

}

if(path.includes("createproject.html")){

    let createProjectForm = document.querySelector('#createProjectForm');

    createProjectForm.addEventListener('submit', function(e){

        e.preventDefault();

        let authorValues = createProjectForm.authors.value.trim().split(',');
        let tagsvalue = createProjectForm.tags.value.trim().split(",");



        let data = {

            name: createProjectForm.name.value,
            abstract: createProjectForm.abstract.value,
            authors: authorValues,
            tags: tagsvalue,
           
        }

        data = JSON.stringify(data);
        console.log(data)

        asyncfunctionpost("/api/projects", data)
        .then(({errorsFromServer, serverData}) => {
            if(errorsFromServer){
                document.querySelector('#alertErrors').style.display = "block";
                serverData.errors.forEach(error => {
                    document.querySelector('#alertErrors').innerHTML += `<div>${error}</div>`})
            }else{
                window.location.href = "/project-explorer/index.html";
            }
        })
    
    })
}
