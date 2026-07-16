// ==========================================
// CAR VALUES ADMIN SYSTEM
// ==========================================


// Selected vehicle card
let selectedCard = null;


// Get elements

const adminOverlay = document.getElementById("adminOverlay");

const vehicleName = document.getElementById("vehicleName");

const vehicleValue = document.getElementById("vehicleValue");

const vehicleDemand = document.getElementById("vehicleDemand");

const vehicleImage = document.getElementById("vehicleImage");


const saveBtn = document.getElementById("saveBtn");

const cancelBtn = document.getElementById("cancelBtn");





// ==========================================
// LOAD SAVED VEHICLES
// ==========================================


window.onload = function(){


    for(let i = 1; i <= 6; i++){


        let savedVehicle = localStorage.getItem("vehicle" + i);


        if(savedVehicle){


            let data = JSON.parse(savedVehicle);



            document.getElementById(`name${i}`).innerText =
            data.name;



            document.getElementById(`value${i}`).innerText =
            "$" + Number(data.value).toLocaleString();



            document.getElementById(`demand${i}`).innerText =
            data.demand + "/10";



            if(data.image){

                document.getElementById(`image${i}`).src =
                data.image;

            }


        }


    }


};







// ==========================================
// OPEN ADMIN PANEL
// ==========================================


const cards = document.querySelectorAll(".card");



cards.forEach(card => {



    card.addEventListener("click", function(){



        selectedCard = card;



        let id = card.dataset.id;




        // Load current information


        vehicleName.value =
        document.getElementById(`name${id}`).innerText;



        vehicleValue.value =
        document.getElementById(`value${id}`)
        .innerText
        .replace("$","")
        .replace(/,/g,"");



        vehicleDemand.value =
        document.getElementById(`demand${id}`)
        .innerText
        .replace("/10","");




        vehicleImage.value =
        document.getElementById(`image${id}`).src || "";




        adminOverlay.style.display = "flex";



    });



});







// ==========================================
// SAVE BUTTON
// ==========================================


saveBtn.addEventListener("click", function(){



    if(!selectedCard){

        return;

    }




    let id = selectedCard.dataset.id;





    // Update name


    document.getElementById(`name${id}`).innerText =
    vehicleName.value;





    // Update value


    let formattedValue =
    Number(vehicleValue.value)
    .toLocaleString();



    document.getElementById(`value${id}`).innerText =
    "$" + formattedValue;





    // Update demand


    document.getElementById(`demand${id}`).innerText =
    vehicleDemand.value + "/10";





    // Update image


    if(vehicleImage.value.trim() !== ""){


        document.getElementById(`image${id}`).src =
        vehicleImage.value;


    }





    // Save to local storage


    let vehicleData = {


        name: vehicleName.value,


        value: vehicleValue.value,


        demand: vehicleDemand.value,


        image: vehicleImage.value


    };





    localStorage.setItem(

        "vehicle" + id,

        JSON.stringify(vehicleData)

    );







    // Close panel


    adminOverlay.style.display = "none";


    selectedCard = null;



});








// ==========================================
// CANCEL BUTTON
// ==========================================


cancelBtn.addEventListener("click", function(){



    adminOverlay.style.display = "none";


    selectedCard = null;



});








// ==========================================
// CLICK OUTSIDE CLOSE
// ==========================================


adminOverlay.addEventListener("click", function(event){



    if(event.target === adminOverlay){


        adminOverlay.style.display = "none";


        selectedCard = null;


    }


});
<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyCzyyZcuQsR19fsHnffGV0L2LCQ-RRuaGw",
    authDomain: "admin-pannel-268a9.firebaseapp.com",
    projectId: "admin-pannel-268a9",
    storageBucket: "admin-pannel-268a9.firebasestorage.app",
    messagingSenderId: "619934011757",
    appId: "1:619934011757:web:8b4b98362df5f932fc0a64"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
</script>
