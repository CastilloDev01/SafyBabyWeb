const user = document.getElementById("input-user");
const pwd = document.getElementById("input-pwd");
const login = document.getElementById("login");
const error = document.getElementById("error");
const loader = document.getElementById("loader");

function createError(msg){
    console.log("Error: "+ msg);
    error.style.display = "flex";

    error.innerHTML = `
        <div class="error-img">
            <img src="img/error.svg" alt="...">
        </div>
        
        <div class="error-msg">
            <span>${msg}</span>
        </div>
    `
    loader.style.display = "none";
    login.style.display = "block";
}

login.addEventListener("click", function(){
    loader.style.display = "block";
    login.style.display = "none";

    fetch('https://safybabyapp-default-rtdb.firebaseio.com/v1/devices/'+ user.value + '/pwd.json')
        .then(response => response.json())
        .then(pwd_from_base => {
            console.log(pwd_from_base == pwd.value);
            
            if (pwd_from_base) {
                if (pwd.value == pwd_from_base) {
                    localStorage.setItem("user-safy-baby", user.value);
                    window.location.href = "./home.html";
                    error.style.display = "none";
                } else {
                    createError("Contraseña incorrecta");
                }
            } else {
                createError("No existe ese usuario, verifica que los datos sean correctos");
            }
        })
        .catch(error => {
            // Manejo de errores
            createError("Hubo un error en la base de datos, intentelo más tarde");
            console.error('Error:', error);

            loader.style.display = "none";
            login.style.display = "block";
        });
})

