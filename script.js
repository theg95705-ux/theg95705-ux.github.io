// ==========================================
// VEHICLE ADMIN SYSTEM
// UPDATED VERSION
// PART 1 - FIREBASE SETUP & AUTH
// ==========================================

console.clear();

console.log("=================================");
console.log("Vehicle Admin System Starting...");
console.log("=================================");


// ==========================================
// FIREBASE IMPORTS
// ==========================================

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


import {
    getFirestore,
    collection,
    getDocs,
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";



// ==========================================
// FIREBASE CONFIG
// ==========================================

const firebaseConfig = {

    apiKey:
    "AIzaSyCzyyZcuQsR19fsHnffGV0L2LCQ-RRuaGw",

    authDomain:
    "admin-pannel-268a9.firebaseapp.com",

    projectId:
    "admin-pannel-268a9",

    storageBucket:
    "admin-pannel-268a9.firebasestorage.app",

    messagingSenderId:
    "619934011757",

    appId:
    "1:619934011757:web:8b4b98362df5f932fc0a64"

};



// ==========================================
// START FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

const auth = getAuth(app);


console.log("Firebase Connected");



// ==========================================
// ADMIN SETTINGS
// ==========================================

// Change this if your Firebase email is different

const ADMIN_EMAIL =
"theg95705@gmail.com".toLowerCase();



let isAdmin = false;

let currentUser = null;

let selectedCard = null;



// ==========================================
// HTML ELEMENTS
// ==========================================

const adminOverlay =
document.getElementById("adminOverlay");


const loginOverlay =
document.getElementById("loginOverlay");


const loginEmail =
document.getElementById("loginEmail");


const loginPassword =
document.getElementById("loginPassword");


const loginBtn =
document.getElementById("loginBtn");


const loginCancelBtn =
document.getElementById("loginCancelBtn");


const loginError =
document.getElementById("loginError");



const vehicleName =
document.getElementById("vehicleName");


const vehicleValue =
document.getElementById("vehicleValue");


const vehicleDemand =
document.getElementById("vehicleDemand");


const vehicleImage =
document.getElementById("vehicleImage");


const imageUpload =
document.getElementById("imageUpload");



const saveBtn =
document.getElementById("saveBtn");


const cancelBtn =
document.getElementById("cancelBtn");



console.log("HTML Loaded");



// ==========================================
// FIREBASE AUTH STATE
// ==========================================

onAuthStateChanged(auth, (user)=>{


    currentUser = user;



    if(!user){

        isAdmin = false;

        console.log(
        "No user logged in"
        );

        return;

    }



    console.log(
    "Logged in:",
    user.email
    );


    console.log(
    "UID:",
    user.uid
    );



    if(
        user.email &&
        user.email.toLowerCase()
        === ADMIN_EMAIL
    ){

        isAdmin = true;


        console.log(
        "================================="
        );

        console.log(
        "ADMIN ACCESS GRANTED"
        );

        console.log(
        "================================="
        );


    } else {


        isAdmin = false;


        console.log(
        "ADMIN ACCESS DENIED"
        );


    }


});
// ==========================================
// PART 2 - LOGIN SYSTEM & LOAD VEHICLES
// ==========================================


// ==========================================
// LOGIN BUTTON
// ==========================================

loginBtn.addEventListener("click", async ()=>{


    loginError.style.display = "none";


    const email =
    loginEmail.value.trim();


    const password =
    loginPassword.value;



    if(!email || !password){


        loginError.textContent =
        "Please enter email and password.";


        loginError.style.display =
        "block";


        return;

    }



    loginBtn.disabled = true;

    loginBtn.textContent =
    "Signing In...";



    try{


        const result =
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );



        console.log(
        "Login successful:",
        result.user.email
        );



        loginEmail.value = "";

        loginPassword.value = "";



    }


    catch(error){


        console.error(
        "Login Error:",
        error
        );



        if(error.code ===
        "auth/invalid-credential"){


            loginError.textContent =
            "Wrong email or password.";


        }


        else{


            loginError.textContent =
            error.message;


        }



        loginError.style.display =
        "block";


    }



    loginBtn.disabled = false;


    loginBtn.textContent =
    "Sign In";


});





// ==========================================
// CANCEL LOGIN
// ==========================================

loginCancelBtn.addEventListener(
"click",
()=>{


    loginOverlay.style.display =
    "none";


    loginPassword.value =
    "";


    loginError.style.display =
    "none";


});





// ==========================================
// CLOSE LOGIN OUTSIDE CLICK
// ==========================================

loginOverlay.addEventListener(
"click",
(event)=>{


    if(event.target === loginOverlay){


        loginOverlay.style.display =
        "none";


    }


});





// ==========================================
// LOAD VEHICLES FROM FIRESTORE
// ==========================================

async function loadVehicles(){


    try{


        const snapshot =
        await getDocs(
            collection(db,"vehicles")
        );



        snapshot.forEach(
        (vehicle)=>{


            const id =
            vehicle.id;


            const data =
            vehicle.data();



            const name =
            document.getElementById(
            `name${id}`
            );


            const value =
            document.getElementById(
            `value${id}`
            );


            const demand =
            document.getElementById(
            `demand${id}`
            );


            const image =
            document.getElementById(
            `image${id}`
            );



            if(name){

                name.textContent =
                data.name || "Car Name";

            }



            if(value){

                value.textContent =
                "$" +
                Number(
                data.value || 0
                )
                .toLocaleString();

            }



            if(demand){

                demand.textContent =
                (data.demand || 0)
                + "/10";

            }



            if(image && data.image){

                image.src =
                data.image;

            }



        });



        console.log(
        "Vehicles Loaded"
        );


    }


    catch(error){


        console.error(
        "Vehicle loading failed:",
        error
        );


    }


}




// Load when script starts

loadVehicles();





// ==========================================
// OPEN VEHICLE EDITOR
// ==========================================

function openVehicleEditor(card){


    selectedCard = card;


    const id =
    card.dataset.id;



    const name =
    document.getElementById(
    `name${id}`
    );


    const value =
    document.getElementById(
    `value${id}`
    );


    const demand =
    document.getElementById(
    `demand${id}`
    );


    const image =
    document.getElementById(
    `image${id}`
    );



    vehicleName.value =
    name ? name.textContent : "";



    vehicleValue.value =
    value
    ?
    value.textContent
    .replace("$","")
    .replace(/,/g,"")
    :
    "";



    vehicleDemand.value =
    demand
    ?
    demand.textContent
    .replace("/10","")
    :
    "10";



    vehicleImage.value =
    image && image.src
    ?
    image.src
    :
    "";



    adminOverlay.style.display =
    "flex";


    console.log(
    "Editing vehicle:",
    id
    );


}





// ==========================================
// VEHICLE CARD CLICK
// ==========================================

document
.querySelectorAll(".card")
.forEach((card)=>{


    card.addEventListener(
    "click",
    ()=>{


        if(!isAdmin){


            selectedCard =
            card;


            loginOverlay.style.display =
            "flex";


            loginEmail.focus();


            return;


        }



        openVehicleEditor(card);


    });


});
// ==========================================
// PART 3 - SAVE VEHICLES & IMAGE UPLOAD
// ==========================================



// ==========================================
// SAVE BUTTON
// ==========================================

saveBtn.addEventListener(
"click",
async ()=>{


    if(!isAdmin){


        alert(
        "Admin access required."
        );


        return;


    }



    if(!selectedCard){


        alert(
        "No vehicle selected."
        );


        return;


    }



    saveBtn.disabled =
    true;


    saveBtn.textContent =
    "Saving...";



    try{


        const id =
        selectedCard.dataset.id;



        let imageURL =
        vehicleImage.value.trim();





        // ==================================
        // UPLOAD IMAGE
        // ==================================

        if(
            imageUpload.files &&
            imageUpload.files.length > 0
        ){



            const file =
            imageUpload.files[0];



            console.log(
            "Uploading image..."
            );



            const imageRef =
            ref(
                storage,
                "vehicles/" +
                id +
                "_" +
                Date.now() +
                "_" +
                file.name
            );



            await uploadBytes(
                imageRef,
                file
            );



            imageURL =
            await getDownloadURL(
                imageRef
            );



            console.log(
            "Image uploaded"
            );


        }





        // ==================================
        // CREATE VEHICLE DATA
        // ==================================

        const vehicleData = {


            name:
            vehicleName.value.trim(),


            value:
            Number(
                vehicleValue.value
            ),


            demand:
            Number(
                vehicleDemand.value
            ),


            image:
            imageURL


        };





        // ==================================
        // SAVE FIRESTORE
        // ==================================

        await setDoc(

            doc(
                db,
                "vehicles",
                id
            ),

            vehicleData

        );



        console.log(
        "Vehicle saved:",
        id
        );






        // ==================================
        // UPDATE PAGE
        // ==================================

        const name =
        document.getElementById(
        `name${id}`
        );


        const value =
        document.getElementById(
        `value${id}`
        );


        const demand =
        document.getElementById(
        `demand${id}`
        );


        const image =
        document.getElementById(
        `image${id}`
        );



        if(name){

            name.textContent =
            vehicleData.name;

        }



        if(value){

            value.textContent =
            "$" +
            vehicleData.value
            .toLocaleString();

        }



        if(demand){

            demand.textContent =
            vehicleData.demand +
            "/10";

        }



        if(image && imageURL){

            image.src =
            imageURL;

        }





        // ==================================
        // CLOSE PANEL
        // ==================================

        adminOverlay.style.display =
        "none";


        selectedCard =
        null;


        imageUpload.value =
        "";



        alert(
        "Vehicle saved successfully!"
        );


    }



    catch(error){


        console.error(
        "SAVE ERROR:",
        error
        );



        alert(
        "Save failed:\n" +
        error.message
        );


    }



    saveBtn.disabled =
    false;


    saveBtn.textContent =
    "Save";


});
// ==========================================
// PART 4 - STARTUP, DEBUG & ERROR HANDLING
// ==========================================


// ==========================================
// CLOSE ADMIN PANEL WHEN CLICKING OUTSIDE
// ==========================================

adminOverlay.addEventListener(
"click",
(event)=>{


    if(event.target === adminOverlay){


        adminOverlay.style.display =
        "none";


        selectedCard =
        null;


    }


});





// ==========================================
// PAGE STARTUP
// ==========================================

window.addEventListener(
"load",
()=>{


    console.log(
    "================================="
    );


    console.log(
    "Vehicle Admin System Loaded"
    );


    console.log(
    "Admin Email:",
    ADMIN_EMAIL
    );


    console.log(
    "Firebase Connected"
    );


    console.log(
    "Firestore Connected"
    );


    console.log(
    "Storage Connected"
    );


    console.log(
    "================================="
    );


});





// ==========================================
// GLOBAL ERROR LOGGER
// ==========================================

window.addEventListener(
"error",
(event)=>{


    console.error(
    "JavaScript Error:"
    );


    console.error(
    event.message
    );


    console.error(
    "File:",
    event.filename
    );


    console.error(
    "Line:",
    event.lineno
    );


});





// ==========================================
// PROMISE ERROR LOGGER
// ==========================================

window.addEventListener(
"unhandledrejection",
(event)=>{


    console.error(
    "Unhandled Promise Error:"
    );


    console.error(
    event.reason
    );


});





// ==========================================
// DEBUG TOOL
// ==========================================

window.debugAdmin =
()=>{


    console.log(
    "========== ADMIN DEBUG =========="
    );


    console.log(
    "Current User:",
    currentUser
    );


    console.log(
    "User Email:",
    currentUser?.email
    );


    console.log(
    "User UID:",
    currentUser?.uid
    );


    console.log(
    "Is Admin:",
    isAdmin
    );


    console.log(
    "Selected Vehicle:",
    selectedCard
    );


    console.log(
    "================================="
    );


};





// ==========================================
// AUTO LOAD WHEN LOGIN CHANGES
// ==========================================

if(currentUser){


    loadVehicles();


}





console.log(
"Script Loaded Successfully"
);
