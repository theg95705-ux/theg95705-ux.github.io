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



        // If a vehicle was selected before login
        if(selectedCard){

            openVehicleEditor(selectedCard);

        }



    } else {


        isAdmin = false;


        console.log(
        "ADMIN ACCESS DENIED"
        );


    }


});
// ==========================================
// PART 2 - LOGIN SYSTEM + ADMIN HOTKEY
// ==========================================


// ==========================================
// LOGIN BUTTON
// ==========================================

loginBtn.addEventListener(
"click",
async ()=>{


    loginError.style.display =
    "none";



    const email =
    loginEmail.value.trim();



    const password =
    loginPassword.value;



    if(!email || !password){


        loginError.textContent =
        "Enter email and password.";


        loginError.style.display =
        "block";


        return;


    }



    loginBtn.disabled =
    true;


    loginBtn.textContent =
    "Signing In...";



    try{


        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );



        loginEmail.value =
        "";


        loginPassword.value =
        "";



        loginOverlay.style.display =
        "none";



    }



    catch(error){


        console.error(
        "Login Error:",
        error
        );



        if(error.code === "auth/invalid-credential"){


            loginError.textContent =
            "Incorrect email or password.";


        }

        else {


            loginError.textContent =
            error.message;


        }



        loginError.style.display =
        "block";


    }



    loginBtn.disabled =
    false;


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
// ADMIN LOGIN HOTKEY
// CTRL + ALT + RIGHT ARROW
// ==========================================

let ctrlPressed = false;

let altPressed = false;



document.addEventListener(
"keydown",
(event)=>{


    if(event.key === "Control"){


        ctrlPressed = true;


    }



    if(event.key === "Alt"){


        altPressed = true;


    }



    if(
        ctrlPressed &&
        altPressed &&
        event.key === "ArrowRight"
    ){



        console.log(
        "Admin login opened"
        );



        loginOverlay.style.display =
        "flex";



        loginEmail.focus();



    }


});





document.addEventListener(
"keyup",
(event)=>{


    if(event.key === "Control"){


        ctrlPressed = false;


    }



    if(event.key === "Alt"){


        altPressed = false;


    }


});





// ==========================================
// VEHICLE CARDS
// NOW DISPLAY ONLY
// ==========================================

document
.querySelectorAll(".card")
.forEach((card)=>{


    card.addEventListener(
    "click",
    ()=>{


        console.log(
        "Vehicle viewed:",
        card.dataset.id
        );


        // No admin login here anymore


    });


});
// ==========================================
// PART 3 - VEHICLE SYSTEM & SAVE
// ==========================================


// ==========================================
// LOAD VEHICLES FROM FIRESTORE
// ==========================================

async function loadVehicles(){


    try{


        const snapshot =
        await getDocs(
            collection(db,"vehicles")
        );



        snapshot.forEach((vehicle)=>{


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
        "Loading Vehicles Failed:",
        error
        );


    }


}



// Load vehicles

loadVehicles();





// ==========================================
// OPEN VEHICLE EDITOR
// ==========================================

function openVehicleEditor(card){


    selectedCard =
    card;



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
    image?.src || "";



    adminOverlay.style.display =
    "flex";



    console.log(
    "Editing vehicle:",
    id
    );


}






// ==========================================
// SAVE VEHICLE
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





        // IMAGE UPLOAD

        if(
            imageUpload.files &&
            imageUpload.files.length > 0
        ){


            const file =
            imageUpload.files[0];



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


        }





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





        await setDoc(

            doc(
            db,
            "vehicles",
            id
            ),

            vehicleData

        );



        console.log(
        "Saved:",
        vehicleData
        );





        // UPDATE SCREEN


        document.getElementById(
        `name${id}`
        ).textContent =
        vehicleData.name;



        document.getElementById(
        `value${id}`
        ).textContent =
        "$" +
        vehicleData.value
        .toLocaleString();



        document.getElementById(
        `demand${id}`
        ).textContent =
        vehicleData.demand +
        "/10";



        if(imageURL){


            document.getElementById(
            `image${id}`
            ).src =
            imageURL;


        }




        adminOverlay.style.display =
        "none";


        selectedCard =
        null;


        imageUpload.value =
        "";



        alert(
        "Vehicle Saved!"
        );


    }



    catch(error){


        console.error(
        "Save Error:",
        error
        );


        alert(
        error.message
        );


    }



    saveBtn.disabled =
    false;


    saveBtn.textContent =
    "Save";


});
// ==========================================
// PART 4 - FINAL SYSTEM
// ==========================================


// ==========================================
// CANCEL EDIT BUTTON
// ==========================================

cancelBtn.addEventListener(
"click",
()=>{


    adminOverlay.style.display =
    "none";


    selectedCard =
    null;


    imageUpload.value =
    "";


});





// ==========================================
// CLOSE ADMIN PANEL OUTSIDE CLICK
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
// LOGOUT ADMIN
// ==========================================

async function logoutAdmin(){


    try{


        await signOut(auth);


        isAdmin =
        false;


        currentUser =
        null;


        selectedCard =
        null;



        console.log(
        "Admin logged out"
        );


    }


    catch(error){


        console.error(
        "Logout failed:",
        error
        );


    }


}





// Make logout available in console

window.logoutAdmin =
logoutAdmin;





// ==========================================
// AUTO RELOAD VEHICLES AFTER LOGIN
// ==========================================

onAuthStateChanged(
auth,
(user)=>{


    if(user){


        console.log(
        "User authenticated:",
        user.email
        );


        loadVehicles();


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
    "Admin:",
    ADMIN_EMAIL
    );


    console.log(
    "Ready"
    );


    console.log(
    "================================="
    );


});





// ==========================================
// ERROR LOGGER
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
    "Promise Error:"
    );


    console.error(
    event.reason
    );


});





// ==========================================
// ADMIN DEBUG TOOL
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
    "Email:",
    currentUser?.email
    );


    console.log(
    "UID:",
    currentUser?.uid
    );


    console.log(
    "Is Admin:",
    isAdmin
    );


    console.log(
    "Selected Card:",
    selectedCard
    );


    console.log(
    "================================="
    );


};





console.log(
"Script Loaded Successfully"
);
