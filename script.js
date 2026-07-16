// ==========================================
// FIREBASE IMPORTS
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";



// ==========================================
// FIREBASE CONFIG
// ==========================================


const firebaseConfig = {

    apiKey: "AIzaSyCzyyZcuQsR19fsHnffGV0L2LCQ-RRuaGw",

    authDomain: "admin-pannel-268a9.firebaseapp.com",

    projectId: "admin-pannel-268a9",

    storageBucket: "admin-pannel-268a9.firebasestorage.app",

    messagingSenderId: "619934011757",

    appId: "1:619934011757:web:8b4b98362df5f932fc0a64"

};



const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);





// ==========================================
// CAR VALUES ADMIN SYSTEM
// ==========================================


let selectedCard = null;




// ==========================================
// GET ELEMENTS
// ==========================================


const adminOverlay = document.getElementById("adminOverlay");


const vehicleName = document.getElementById("vehicleName");


const vehicleValue = document.getElementById("vehicleValue");


const vehicleDemand = document.getElementById("vehicleDemand");


const vehicleImage = document.getElementById("vehicleImage");


const saveBtn = document.getElementById("saveBtn");


const cancelBtn = document.getElementById("cancelBtn");





// ==========================================
// LOAD VEHICLES FROM FIREBASE
// ==========================================


async function loadVehicles(){


    const snapshot = await getDocs(
        collection(db,"vehicles")
    );


    snapshot.forEach((item)=>{


        let id = item.id;


        let data = item.data();



        document.getElementById(`name${id}`).innerText =
        data.name;



        document.getElementById(`value${id}`).innerText =
        "$" + Number(data.value).toLocaleString();



        document.getElementById(`demand${id}`).innerText =
        data.demand + "/10";



        if(data.image){


            document.getElementById(`image${id}`).src =
            data.image;


        }



    });


}



loadVehicles();
// ==========================================
// OPEN ADMIN PANEL
// ==========================================


const cards = document.querySelectorAll(".card");



cards.forEach(card => {


    card.addEventListener("click", function(){


        selectedCard = card;


        let id = card.dataset.id;



        // Load current vehicle information


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
// SAVE BUTTON - FIREBASE
// ==========================================


saveBtn.addEventListener("click", async function(){



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






    // ==========================================
    // IMAGE UPLOAD
    // ==========================================


    let imageURL = vehicleImage.value;



    const imageUpload =
    document.getElementById("imageUpload");



    if(imageUpload && imageUpload.files[0]){


        let imageFile =
        imageUpload.files[0];



        let imageRef =
        ref(
            storage,
            "cars/" + Date.now() + "-" + imageFile.name
        );



        await uploadBytes(
            imageRef,
            imageFile
        );



        imageURL =
        await getDownloadURL(imageRef);



        document.getElementById(`image${id}`).src =
        imageURL;


    }





    // ==========================================
    // SAVE TO FIRESTORE
    // ==========================================


    let vehicleData = {


        name: vehicleName.value,


        value: vehicleValue.value,


        demand: vehicleDemand.value,


        image: imageURL


    };




    await setDoc(

        doc(db,"vehicles",id),

        vehicleData

    );




    console.log("Saved to Firebase");




    // Close admin panel


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
// CLICK OUTSIDE ADMIN PANEL CLOSE
// ==========================================


adminOverlay.addEventListener("click", function(event){


    if(event.target === adminOverlay){


        adminOverlay.style.display = "none";


        selectedCard = null;


    }


});







// ==========================================
// FINISHED
// ==========================================


console.log("Car Values Admin System Loaded");
