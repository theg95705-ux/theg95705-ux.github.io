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
// FIREBASE AUTH IMPORTS
// ==========================================

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


const githubProvider =
new GithubAuthProvider();







// ==========================================
// ADMIN SECURITY SETTINGS
// ==========================================


const adminEmail =
"theg95705@gmail.com";


let isAdmin = false;







// ==========================================
// GET HTML ELEMENTS
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
// GITHUB LOGIN BUTTON
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
                "GitHub login successful:",
                result.user.email
            );



        }


        catch(error){


            console.log(
                "GitHub login failed:",
                error.message
            );


        }


    });


}








// ==========================================
// CHECK IF USER IS ADMIN
// ==========================================


onAuthStateChanged(
auth,
(user)=>{


    if(
        user &&
        user.email === adminEmail
    ){


        isAdmin = true;



        console.log(
            "ADMIN VERIFIED:",
            user.email
        );


    }


    else{


        isAdmin = false;



        console.log(
            "No admin access"
        );



        if(adminOverlay){


            adminOverlay.style.display =
            "none";


        }


    }


});
// ==========================================
// VEHICLE ADMIN SYSTEM
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


            let id =
            item.id;


            let data =
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






            if(nameElement){


                nameElement.innerText =
                data.name;


            }






            if(valueElement){


                valueElement.innerText =
                "$" +
                Number(data.value)
                .toLocaleString();


            }






            if(demandElement){


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



    }


    catch(error){


        console.log(
            "Loading vehicles failed:",
            error
        );


    }


}







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



        // BLOCK NON ADMINS

        if(!isAdmin){


            console.log(
                "Admin access denied"
            );


            return;


        }






        selectedCard =
        card;





        let id =
        card.dataset.id;








        // LOAD CURRENT VALUES



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





    });


});
// ==========================================
// SAVE VEHICLE BUTTON
// ==========================================


if(saveBtn){


saveBtn.addEventListener(
"click",
async()=>{



    // BLOCK NON ADMINS

    if(!isAdmin){


        console.log(
            "Save blocked - not admin"
        );


        return;


    }






    if(!selectedCard){


        return;


    }







    let id =
    selectedCard.dataset.id;







    // ==========================================
    // IMAGE UPLOAD
    // ==========================================


    let imageURL =
    vehicleImage.value;





    const imageUpload =
    document.getElementById(
        "imageUpload"
    );







    if(
        imageUpload &&
        imageUpload.files[0]
    ){



        try{



            let imageFile =
            imageUpload.files[0];



            let imageRef =
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




        }



        catch(error){


            console.log(
                "Image upload failed:",
                error
            );


        }



    }










    // ==========================================
    // UPDATE WEBSITE DISPLAY
    // ==========================================



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









    // ==========================================
    // SAVE TO FIRESTORE
    // ==========================================


    let vehicleData = {


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
            "Firestore save failed:",
            error
        );


    }









    if(adminOverlay){


        adminOverlay.style.display =
        "none";


    }





    selectedCard =
    null;



});


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


    selectedCard =
    null;



});


}








// ==========================================
// CLICK OUTSIDE ADMIN PANEL TO CLOSE
// ==========================================


if(adminOverlay){


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


}









// ==========================================
// SYSTEM LOADED
// ==========================================


console.log(
"Car Values Admin System Loaded With GitHub Verification"
);
