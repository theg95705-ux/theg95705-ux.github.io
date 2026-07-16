console.log("SCRIPT FILE STARTED");
// ==========================================
// FIREBASE IMPORTS
// ==========================================
console.log("SCRIPT.JS LOADED FROM GITHUB PAGES");

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";


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


import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";




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




// ==========================================
// START FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);


const auth = getAuth(app);




// ==========================================
// ADMIN SETTINGS
// ==========================================

const adminEmail = "theg95705@gmail.com";


let isAdmin = false;




// ==========================================
// HTML ELEMENTS
// ==========================================

const adminOverlay =
document.getElementById("adminOverlay");


const vehicleName =
document.getElementById("vehicleName");


const vehicleValue =
document.getElementById("vehicleValue");


const vehicleDemand =
document.getElementById("vehicleDemand");


const vehicleImage =
document.getElementById("vehicleImage");


const saveBtn =
document.getElementById("saveBtn");


const cancelBtn =
document.getElementById("cancelBtn");




// ==========================================
// CHECK FIREBASE LOGIN
// ==========================================

onAuthStateChanged(
    auth,
    (user)=>{


        if(user){


            console.log(
                "Logged in:",
                user.email
            );



            if(
                user.email === adminEmail
            ){

                isAdmin = true;


                console.log(
                    "ADMIN ACCESS GRANTED"
                );


            }

            else{


                isAdmin = false;


                console.log(
                    "ADMIN ACCESS DENIED"
                );


            }


        }

        else{


            isAdmin = false;


            console.log(
                "No user logged in"
            );


        }


    }
);
// ==========================================
// VEHICLE SYSTEM
// ==========================================

let selectedCard = null;




// ==========================================
// LOAD VEHICLES FROM FIREBASE
// ==========================================

async function loadVehicles(){

    try{


        const snapshot =
        await getDocs(
            collection(db,"vehicles")
        );



        snapshot.forEach((item)=>{


            const id =
            item.id;


            const data =
            item.data();



            const nameElement =
            document.getElementById(
                `name${id}`
            );


            const valueElement =
            document.getElementById(
                `value${id}`
            );


            const demandElement =
            document.getElementById(
                `demand${id}`
            );


            const imageElement =
            document.getElementById(
                `image${id}`
            );





            if(
                nameElement &&
                data.name
            ){

                nameElement.innerText =
                data.name;

            }




            if(
                valueElement &&
                data.value
            ){

                valueElement.innerText =
                "$" +
                Number(data.value)
                .toLocaleString();

            }




            if(
                demandElement &&
                data.demand
            ){

                demandElement.innerText =
                data.demand + "/10";

            }




            if(
                imageElement &&
                data.image
            ){

                imageElement.src =
                data.image;

            }


        });



        console.log(
            "Vehicles loaded from Firebase"
        );


    }


    catch(error){


        console.log(
            "Vehicle loading error:",
            error
        );


    }


}




// ==========================================
// START VEHICLE LOADING
// ==========================================

loadVehicles();




// ==========================================
// OPEN ADMIN PANEL
// ==========================================

const cards =
document.querySelectorAll(
    ".card"
);



cards.forEach(
    (card)=>{


        card.addEventListener(
            "click",
            ()=>{


                if(!isAdmin){


                    console.log(
                        "Admin access denied"
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






                if(name){

                    vehicleName.value =
                    name.innerText;

                }




                if(value){

                    vehicleValue.value =
                    value.innerText
                    .replace("$","")
                    .replace(/,/g,"");

                }




                if(demand){

                    vehicleDemand.value =
                    demand.innerText
                    .replace("/10","");

                }




                if(image){

                    vehicleImage.value =
                    image.src;

                }





                if(adminOverlay){

                    adminOverlay.style.display =
                    "flex";

                }



            }

        );


    }

);
// ==========================================
// SAVE VEHICLE
// ==========================================

if(saveBtn){

    saveBtn.addEventListener(
        "click",
        async()=>{


            if(!isAdmin){


                console.log(
                    "Save blocked - not admin"
                );


                return;


            }




            if(!selectedCard){


                console.log(
                    "No vehicle selected"
                );


                return;


            }





            const id =
            selectedCard.dataset.id;




            let imageURL =
            vehicleImage.value;






            // ==================================
            // IMAGE UPLOAD
            // ==================================

            const imageUpload =
            document.getElementById(
                "imageUpload"
            );



            if(
                imageUpload &&
                imageUpload.files.length > 0
            ){


                try{


                    const imageFile =
                    imageUpload.files[0];



                    const imageRef =
                    ref(
                        storage,
                        "cars/" +
                        Date.now() +
                        "-" +
                        imageFile.name
                    );



                    await uploadBytes(
                        imageRef,
                        imageFile
                    );



                    imageURL =
                    await getDownloadURL(
                        imageRef
                    );



                    console.log(
                        "Image uploaded"
                    );


                }


                catch(error){


                    console.log(
                        "Image upload error:",
                        error
                    );


                }


            }








            // ==================================
            // UPDATE PAGE
            // ==================================

            const nameElement =
            document.getElementById(
                `name${id}`
            );


            const valueElement =
            document.getElementById(
                `value${id}`
            );


            const demandElement =
            document.getElementById(
                `demand${id}`
            );


            const imageElement =
            document.getElementById(
                `image${id}`
            );





            if(nameElement){

                nameElement.innerText =
                vehicleName.value;

            }





            if(valueElement){

                valueElement.innerText =
                "$" +
                Number(vehicleValue.value)
                .toLocaleString();

            }





            if(demandElement){

                demandElement.innerText =
                vehicleDemand.value +
                "/10";

            }





            if(
                imageElement &&
                imageURL
            ){

                imageElement.src =
                imageURL;

            }







            // ==================================
            // SAVE FIRESTORE
            // ==================================

            const vehicleData = {


                name:
                vehicleName.value,


                value:
                vehicleValue.value,


                demand:
                vehicleDemand.value,


                image:
                imageURL


            };







            try{


                await setDoc(

                    doc(
                        db,
                        "vehicles",
                        id
                    ),

                    vehicleData

                );



                console.log(
                    "Vehicle saved successfully"
                );


            }


            catch(error){


                console.log(
                    "Firestore save error:",
                    error
                );


            }






            if(adminOverlay){

                adminOverlay.style.display =
                "none";

            }



            selectedCard = null;



        }

    );

}
// ==========================================
// CANCEL BUTTON
// ==========================================

if(cancelBtn){

    cancelBtn.addEventListener(
        "click",
        ()=>{


            if(adminOverlay){

                adminOverlay.style.display =
                "none";

            }



            selectedCard = null;



            console.log(
                "Admin panel closed"
            );


        }

    );

}






// ==========================================
// CLOSE PANEL WHEN CLICKING OUTSIDE
// ==========================================

if(adminOverlay){

    adminOverlay.addEventListener(
        "click",
        (event)=>{


            if(
                event.target === adminOverlay
            ){


                adminOverlay.style.display =
                "none";



                selectedCard = null;



                console.log(
                    "Admin panel closed"
                );


            }


        }

    );

}






// ==========================================
// SYSTEM START
// ==========================================

console.log(
    "================================="
);


console.log(
    "Vehicle Admin System Loaded"
);


console.log(
    "Firebase Connected"
);


console.log(
    "Email Authentication Enabled"
);


console.log(
    "Admin Email:",
    adminEmail
);


console.log(
    "================================="
);
