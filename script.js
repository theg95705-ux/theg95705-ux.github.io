// ==========================================
// VEHICLE ADMIN SYSTEM
// FULL UPDATED VERSION
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

const app =
initializeApp(firebaseConfig);


const db =
getFirestore(app);


const storage =
getStorage(app);


const auth =
getAuth(app);


console.log(
"Firebase Connected"
);



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
document.getElementById(
"adminOverlay"
);


const loginOverlay =
document.getElementById(
"loginOverlay"
);


const loginEmail =
document.getElementById(
"loginEmail"
);


const loginPassword =
document.getElementById(
"loginPassword"
);


const loginBtn =
document.getElementById(
"loginBtn"
);


const loginCancelBtn =
document.getElementById(
"loginCancelBtn"
);


const loginError =
document.getElementById(
"loginError"
);



const vehicleName =
document.getElementById(
"vehicleName"
);


const vehicleValue =
document.getElementById(
"vehicleValue"
);


const vehicleDemand =
document.getElementById(
"vehicleDemand"
);


const vehicleImage =
document.getElementById(
"vehicleImage"
);


const imageUpload =
document.getElementById(
"imageUpload"
);



const saveBtn =
document.getElementById(
"saveBtn"
);


const cancelBtn =
document.getElementById(
"cancelBtn"
);



console.log(
"HTML Loaded"
);



// ==========================================
// FIREBASE AUTH STATE
// ==========================================

onAuthStateChanged(
auth,
(user)=>{


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
        "Admin editing enabled"
        );


        console.log(
        "Click a vehicle to edit"
        );


        console.log(
        "================================="
        );


        if(selectedCard){

            openVehicleEditor(
            selectedCard
            );

        }



    }
    else{


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
    loginEmail.value.trim()
    .toLowerCase();



    const password =
    loginPassword.value;



    if(!email || !password){


        loginError.textContent =
        "Enter your email and password.";


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



        console.log(
        "Login successful"
        );



        loginEmail.value =
        "";


        loginPassword.value =
        "";



        // DO NOT OPEN PANEL HERE
        // Firebase auth state will handle it


    }



    catch(error){


        console.error(
        "Login Error:",
        error
        );



        if(
            error.code ===
            "auth/invalid-credential"
        ){


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
// CLICK OUTSIDE LOGIN
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
        "Opening Admin Login"
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
// VEHICLE CARD CLICK SYSTEM
// ONLY ADMINS CAN EDIT
// ==========================================

document
.querySelectorAll(".card")
.forEach((card)=>{


    card.addEventListener(
    "click",
    ()=>{


        if(isAdmin){


            openVehicleEditor(
            card
            );


        }
        else{


            console.log(
            "Not admin - vehicle view only"
            );


        }


    });


});





console.log(
"Login System Ready"
);
// ==========================================
// PART 3 - VEHICLE LOADING, EDITOR & SAVE
// ==========================================


// ==========================================
// LOAD VEHICLES FROM FIRESTORE
// ==========================================

async function loadVehicles(){


    try{


        const snapshot =
        await getDocs(
            collection(
                db,
                "vehicles"
            )
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
                data.name ||
                "Car Name";

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
        "Vehicle Load Error:",
        error
        );


    }


}





// ==========================================
// OPEN VEHICLE EDITOR
// ==========================================

function openVehicleEditor(card){


    if(!isAdmin){


        console.log(
        "Not admin"
        );


        return;


    }



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
    name ?
    name.textContent :
    "";



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





        // ===============================
        // IMAGE UPLOAD
        // ===============================

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
        "Vehicle saved:",
        id
        );





        // UPDATE DISPLAY


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
        "Vehicle saved!"
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





// Initial vehicle load

loadVehicles();


console.log(
"Vehicle System Ready"
);
// ==========================================
// PART 4 - FINAL CONTROLS, DEBUG & STARTUP
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
// LOGOUT FUNCTION
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
        "Logout Error:",
        error
        );


    }


}



window.logoutAdmin =
logoutAdmin;





// ==========================================
// DEBUG COMMAND
// USE IN CONSOLE:
// debugAdmin()
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
    "Selected Vehicle:",
    selectedCard
    );


    console.log(
    "================================="
    );


};





// ==========================================
// AUTH STATE RECHECK
// ==========================================

onAuthStateChanged(
auth,
(user)=>{


    currentUser =
    user;



    if(user){


        console.log(
        "Session active:",
        user.email
        );


        if(
            user.email &&
            user.email.toLowerCase()
            === ADMIN_EMAIL
        ){


            isAdmin =
            true;



            console.log(
            "Admin session restored"
            );


        }


        loadVehicles();


    }
    else{


        isAdmin =
        false;



        console.log(
        "No active session"
        );


    }


});





// ==========================================
// PAGE LOAD MESSAGE
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
    "Admin Shortcut:"
    );


    console.log(
    "CTRL + ALT + RIGHT ARROW"
    );


    console.log(
    "================================="
    );


});





// ==========================================
// GLOBAL ERROR HANDLER
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
// PROMISE ERROR HANDLER
// ==========================================

window.addEventListener(
"unhandledrejection",
(event)=>{


    console.error(
    "Unhandled Promise:"
    );


    console.error(
    event.reason
    );


});





console.log(
"Script Loaded Successfully"
);
