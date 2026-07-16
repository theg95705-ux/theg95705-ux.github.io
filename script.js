// ==========================================
// SCRIPT START
// ==========================================

console.log("=================================");
console.log("Vehicle Admin System Starting...");
console.log("=================================");

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

console.log("Firebase Connected");

// ==========================================
// ADMIN SETTINGS
// ==========================================

const ADMIN_EMAIL = "theg95705@gmail.com".toLowerCase();

let isAdmin = false;

let currentUser = null;

let selectedCard = null;

// ==========================================
// HTML ELEMENTS
// ==========================================

const adminOverlay = document.getElementById("adminOverlay");
const adminPanel = document.getElementById("adminPanel");

const loginOverlay = document.getElementById("loginOverlay");

const vehicleName = document.getElementById("vehicleName");
const vehicleValue = document.getElementById("vehicleValue");
const vehicleDemand = document.getElementById("vehicleDemand");
const vehicleImage = document.getElementById("vehicleImage");

const imageUpload = document.getElementById("imageUpload");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginCancelBtn = document.getElementById("loginCancelBtn");
const loginError = document.getElementById("loginError");

// ==========================================
// CHECK REQUIRED HTML
// ==========================================

console.log("Checking HTML...");

if (!adminOverlay) console.error("Missing adminOverlay");
if (!loginOverlay) console.error("Missing loginOverlay");
if (!saveBtn) console.error("Missing saveBtn");
if (!cancelBtn) console.error("Missing cancelBtn");

console.log("HTML Check Complete");

// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (!user) {

        isAdmin = false;

        console.log("No user logged in");

        return;

    }

    console.log("Logged in as:", user.email);

    if (user.email.toLowerCase() === ADMIN_EMAIL) {

        isAdmin = true;

        console.log("=================================");
        console.log("ADMIN ACCESS GRANTED");
        console.log("=================================");

    } else {

        isAdmin = false;

        console.log("=================================");
        console.log("ADMIN ACCESS DENIED");
        console.log("Expected:", ADMIN_EMAIL);
        console.log("Got:", user.email);
        console.log("=================================");

    }

});
// ==========================================
// OPEN LOGIN PANEL
// CTRL + RIGHT ARROW
// ==========================================

document.addEventListener("keydown", (event) => {

    if (event.ctrlKey && event.key === "ArrowRight") {

        event.preventDefault();

        if (isAdmin) {

            alert("You are already logged in as Admin.");

            return;

        }

        if (loginOverlay) {

            loginOverlay.style.display = "flex";

            if (loginEmail) {

                loginEmail.focus();

            }

        }

    }

});

// ==========================================
// LOGIN BUTTON
// ==========================================

if (loginBtn) {

    loginBtn.addEventListener("click", async () => {

        if (loginError) {

            loginError.style.display = "none";

        }

        const email = loginEmail.value.trim().toLowerCase();

        const password = loginPassword.value;

        if (email === "" || password === "") {

            loginError.innerText = "Enter your email and password.";

            loginError.style.display = "block";

            return;

        }

        try {

            loginBtn.disabled = true;

            loginBtn.innerText = "Signing In...";

            const credential = await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

            console.log("Login Successful");

            console.log("User:", credential.user.email);

            loginOverlay.style.display = "none";

            loginEmail.value = "";

            loginPassword.value = "";

            loginBtn.innerText = "Sign In";

            loginBtn.disabled = false;

        }

        catch (error) {

            console.error(error);

            loginBtn.innerText = "Sign In";

            loginBtn.disabled = false;

            let message = "Login failed.";

            switch (error.code) {

                case "auth/invalid-email":
                    message = "Invalid email.";
                    break;

                case "auth/user-not-found":
                    message = "Email not found.";
                    break;

                case "auth/wrong-password":
                    message = "Wrong password.";
                    break;

                case "auth/invalid-credential":
                    message = "Wrong email or password.";
                    break;

                case "auth/too-many-requests":
                    message = "Too many attempts. Try again later.";
                    break;

            }

            loginError.innerText = message;

            loginError.style.display = "block";

        }

    });

}

// ==========================================
// CANCEL LOGIN
// ==========================================

if (loginCancelBtn) {

    loginCancelBtn.addEventListener("click", () => {

        loginOverlay.style.display = "none";

        loginError.style.display = "none";

        loginPassword.value = "";

    });

}

// ==========================================
// CLOSE LOGIN IF CLICK OUTSIDE
// ==========================================

if (loginOverlay) {

    loginOverlay.addEventListener("click", (event) => {

        if (event.target === loginOverlay) {

            loginOverlay.style.display = "none";

            loginError.style.display = "none";

        }

    });

}

// ==========================================
// OPTIONAL LOGOUT
// ==========================================

async function logoutAdmin() {

    try {

        await signOut(auth);

        isAdmin = false;

        alert("Logged out.");

    }

    catch (error) {

        console.error(error);

    }

}
// ==========================================
// VEHICLE SYSTEM
// ==========================================

let selectedCard = null;

// ==========================================
// LOAD VEHICLES
// ==========================================

async function loadVehicles() {

    try {

        const snapshot = await getDocs(collection(db, "vehicles"));

        snapshot.forEach((docSnap) => {

            const id = docSnap.id;

            const data = docSnap.data();

            const name = document.getElementById(`name${id}`);
            const value = document.getElementById(`value${id}`);
            const demand = document.getElementById(`demand${id}`);
            const image = document.getElementById(`image${id}`);

            if (name && data.name) {

                name.textContent = data.name;

            }

            if (value && data.value) {

                value.textContent =
                    "$" + Number(data.value).toLocaleString();

            }

            if (demand && data.demand) {

                demand.textContent =
                    data.demand + "/10";

            }

            if (image && data.image) {

                image.src = data.image;

            }

        });

        console.log("Vehicles loaded.");

    }

    catch (error) {

        console.error("Vehicle load failed:", error);

    }

}

loadVehicles();

// ==========================================
// OPEN ADMIN PANEL
// ==========================================

document.querySelectorAll(".card").forEach((card) => {

    card.addEventListener("click", () => {

        if (!isAdmin) {

            alert(
                "You must login first.\n\nPress CTRL + → then login."
            );

            return;

        }

        selectedCard = card;

        const id = card.dataset.id;

        const name =
            document.getElementById(`name${id}`);

        const value =
            document.getElementById(`value${id}`);

        const demand =
            document.getElementById(`demand${id}`);

        const image =
            document.getElementById(`image${id}`);

        if (name) {

            vehicleName.value =
                name.textContent;

        }

        if (value) {

            vehicleValue.value =
                value.textContent
                    .replace("$", "")
                    .replace(/,/g, "");

        }

        if (demand) {

            vehicleDemand.value =
                demand.textContent.replace("/10", "");

        }

        if (image) {

            vehicleImage.value =
                image.src;

        }

        adminOverlay.style.display = "flex";

        console.log(
            "Opened editor for vehicle",
            id
        );

    });

});

// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

adminOverlay.addEventListener("click", (event) => {

    if (event.target === adminOverlay) {

        adminOverlay.style.display = "none";

        selectedCard = null;

    }

});
// ==========================================
// SAVE VEHICLE
// ==========================================

if (saveBtn) {

    saveBtn.addEventListener("click", async () => {

        if (!isAdmin) {

            alert("Admin login required.");

            return;

        }

        if (!selectedCard) {

            alert("No vehicle selected.");

            return;

        }

        const id = selectedCard.dataset.id;

        let imageURL = vehicleImage.value.trim();

        try {

            // -----------------------------
            // Upload image if one selected
            // -----------------------------

            if (imageUpload && imageUpload.files.length > 0) {

                const file = imageUpload.files[0];

                const imageRef = ref(
                    storage,
                    `cars/${id}-${Date.now()}-${file.name}`
                );

                await uploadBytes(imageRef, file);

                imageURL = await getDownloadURL(imageRef);

                console.log("Image uploaded.");

            }

            // -----------------------------
            // Save to Firestore
            // -----------------------------

            const vehicleData = {

                name: vehicleName.value.trim(),

                value: Number(vehicleValue.value),

                demand: Number(vehicleDemand.value),

                image: imageURL

            };

            await setDoc(

                doc(db, "vehicles", id),

                vehicleData

            );

            // -----------------------------
            // Update page immediately
            // -----------------------------

            document.getElementById(`name${id}`).textContent =
                vehicleData.name;

            document.getElementById(`value${id}`).textContent =
                "$" + vehicleData.value.toLocaleString();

            document.getElementById(`demand${id}`).textContent =
                vehicleData.demand + "/10";

            if (imageURL) {

                document.getElementById(`image${id}`).src =
                    imageURL;

            }

            console.log("Vehicle saved successfully.");

            adminOverlay.style.display = "none";

            selectedCard = null;

            alert("Vehicle saved!");

        }

        catch (error) {

            console.error("Save failed:", error);

            alert("Save failed. Check the browser console.");

        }

    });

}

// ==========================================
// CANCEL BUTTON
// ==========================================

if (cancelBtn) {

    cancelBtn.addEventListener("click", () => {

        adminOverlay.style.display = "none";

        selectedCard = null;

    });

}

// ==========================================
// STARTUP
// ==========================================

console.log("=================================");
console.log("Vehicle Admin System Loaded");
console.log("Firebase Connected");
console.log("Authentication Ready");
console.log("=================================");
