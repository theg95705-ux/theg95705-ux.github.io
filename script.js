// ==========================================
// FIREBASE IMPORTS
// ==========================================

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
    GithubAuthProvider,
    signInWithPopup,
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
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);


const db = getFirestore(app);


const storage = getStorage(app);


const auth = getAuth(app);


const githubProvider = new GithubAuthProvider();





// ==========================================
// ADMIN SECURITY
// ==========================================


// Your GitHub ID
// We will confirm Firebase UID after login

const adminUID = "304339676";


let isAdmin = false;





// ==========================================
// HTML ELEMENTS
// ==========================================


const adminOverlay =
document.getElementById(
    "adminOverlay"
);


const githubLogin =
document.getElementById(
    "githubLogin"
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


const saveBtn =
document.getElementById(
    "saveBtn"
);


const cancelBtn =
document.getElementById(
    "cancelBtn"
);





// ==========================================
// GITHUB LOGIN
// ==========================================


if(githubLogin){


    githubLogin.addEventListener(
        "click",
        async()=>{


            try{


                const result =
                await signInWithPopup(
                    auth,
                    githubProvider
                );



                console.log(
                    "GitHub Login Successful"
                );
                const result = await signInWithPopup(
    auth,
    githubProvider
);


console.log("Firebase UID:", result.user.uid);

console.log(
    "GitHub UID:",
    result.user.providerData[0].uid
);

console.log(
    "Email:",
    result.user.email



                console.log(
                    "Firebase UID:",
                    result.user.uid
                );



                console.log(
                    "GitHub ID:",
                    result.user.providerData[0].uid
                );



            }


            catch(error){


                console.log(
                    "GitHub Login Error:",
                    error.message
                );


            }


        }
    );


}







// ==========================================
// CHECK ADMIN LOGIN
// ==========================================


onAuthStateChanged(
    auth,
    (user)=>{


        if(user){


            console.log(
                "Logged in user:",
                user.uid
            );


            console.log(
                "Provider ID:",
                user.providerData[0]?.uid
            );



            // TEMPORARY CHECK
            // Change after we confirm UID


            if(
                user.providerData[0]?.uid == adminUID
            ){


                isAdmin = true;


                console.log(
                    "ADMIN ACCESS GRANTED"
                );


            }


            else{


                isAdmin = false;


                console.log(
                    "NOT ADMIN"
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






            if(nameElement && data.name){


                nameElement.innerText =
                data.name;


            }






            if(valueElement && data.value){


                valueElement.innerText =
                "$" +
                Number(data.value)
                .toLocaleString();


            }






            if(demandElement && data.demand){


                demandElement.innerText =
                data.demand +
                "/10";


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





// Load saved vehicles on page start

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
// SAVE VEHICLE BUTTON
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
                        "Image upload failed:",
                        error
                    );


                }


            }









            // ==================================
            // UPDATE WEBSITE
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
            // SAVE TO FIRESTORE
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
// SYSTEM STARTED
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
    "GitHub Authentication Enabled"
);


console.log(
    "================================="
);
