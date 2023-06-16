const mode_btn = document.getElementById("mode");
const URL_DB = "https://safybabyapp-default-rtdb.firebaseio.com/v1/devices/" + localStorage.getItem("user-safy-baby");

const timeToReload = 1000;
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const movement = document.getElementById("movement");
const gasLevel = document.getElementById("gas-lvl");
const sound = document.getElementById("sound");

var switchsStatus = {
    "mode":false // The index should be ID's value
}

function setSwitchsColorsWithStatus(switchObj, enabled){
    const allSwitchs = document.getElementsByClassName("option");

    for(i=0; i < allSwitchs.length; i++){
        const btnName = allSwitchs[i].id;
        const switchObj = allSwitchs[i].querySelector(".switch-btn");
        const background = switchObj.querySelector(".switch-background");
        const switchCircle = switchObj.querySelector(".switch");

        if(switchsStatus[btnName]){
            background.style.backgroundColor = "rgb(0 231 109)";
            switchCircle.style.animationName = "on";
        } else {
            background.style.backgroundColor = "#ff0000";
            switchCircle.style.animationName = "off";
        }
    }
}

var pressed = false;
mode_btn.addEventListener("click", async function(){
    if (pressed) {return}
    pressed = true

    var txt = "familiar";
    if (!switchsStatus.mode) {
        txt = "dream";
    } 

    console.log(txt)

    fetch(URL_DB + ".json", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "mode":txt
        })
      })
    .then(function(){
        pressed = false
        refreshData();
    })
    .catch(function(){
        pressed = false
    })
})

document.getElementById("sing-off").addEventListener("click", function(){
    localStorage.clear();
    window.location.href = "./home.html";
})

function refreshData() {
    fetch(URL_DB + ".json", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error en la petición');
          }
        })
        .then(data => {
            // Establecer el modo sueño según la base de datos
            switchsStatus.mode = (data.mode == "dream");
            setSwitchsColorsWithStatus();
            
            // Colocar los parámetros de SafyBaby en el portal
            temperature.innerHTML = `Temperatura: ${data.temperature} °C`;
            humidity.innerHTML = `Humedad: ${data.humidity}%`;

            if (data.gasLevel > 30) {
                gasLevel.innerHTML = `Nivel de gas: Hay un gas desconocido! (${data.gasLevel})`;
            } else {
                gasLevel.innerHTML = `Nivel de gas: Nada grave (${data.gasLevel})`;
            }


            if(data.isMoving){
                movement.innerHTML = `Estatus de sensor de movimiento: Hay movimiento!`;
            } else {
                movement.innerHTML = `Estatus de sensor de movimiento: No hay movimiento`;
            }
            
            if(data.soundLevel > 25){
                sound.innerHTML = `Sensor de sonido: Hay ruido!`;
            } else {
                sound.innerHTML = `Sensor de sonido: No hay ruido`;
            }

            data = null;
        })
        .catch(error => {
            console.log(error);
        });
}
refreshData();

var canReload = true;
var intervalId = setInterval(function() {
    // Código que se ejecutará cada 2 segundos
    if (canReload) {
        refreshData();
    }
}, 2000)

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState != 'visible') {return canReload = false;}
    refreshData();
    canReload = true;
});
