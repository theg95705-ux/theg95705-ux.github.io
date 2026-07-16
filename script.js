// ==========================================
// VEHICLE ADMIN SYSTEM
// PART 1 - FIREBASE & LOGIN
// ==========================================

console.clear();

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

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginCancelBtn = document.getElementById("loginCancelBtn");
const loginError = document.getElementById("loginError");

const vehicleName = document.getElementById("vehicleName");
const vehicleValue = document.getElementById("vehicleValue");
const vehicleDemand = document.getElementById("vehicleDemand");
const vehicleImage = document.getElementById("vehicleImage");

const imageUpload = document.getElementById("imageUpload");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

// ==========================================
// CHECK HTML
// ==========================================

console.log("Checking page...");

[
    adminOverlay,
    adminPanel,
    loginOverlay,
    loginBtn,
    saveBtn,
    cancelBtn
].forEach(element => {

    if (!element) {

        console.error("Missing HTML element.");

    }

});

console.log("HTML Check Complete");

// ==========================================
// FIREBASE LOGIN STATE
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (!user) {

        isAdmin = false;

        console.log("No user logged in.");

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
        console.log("Received:", user.email);
        console.log("=================================");

    }

});

// ==========================================
// LOGIN BUTTON
// ==========================================

loginBtn.addEventListener("click", async () => {

    loginError.style.display = "none";

    const email = loginEmail.value.trim().toLowerCase();

    const password = loginPassword.value;

    if (!email || !password) {

        loginError.textContent = "Enter your email and password.";

        loginError.style.display = "block";

        return;

    }

    loginBtn.disabled = true;

    loginBtn.textContent = "Signing In...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginOverlay.style.display = "none";

        loginEmail.value = "";

        loginPassword.value = "";

    }

    catch (error) {

        console.error(error);

        loginError.textContent = error.message;

        loginError.style.display = "block";

    }

    loginBtn.disabled = false;

    loginBtn.textContent = "Sign In";

});

// ==========================================
// CLOSE LOGIN
// ==========================================

loginCancelBtn.addEventListener("click", () => {

    loginOverlay.style.display = "none";

    loginPassword.value = "";

    loginError.style.display = "none";

});

// ==========================================
// CLOSE WHEN CLICKING OUTSIDE
// ==========================================

loginOverlay.addEventListener("click", (event) => {

    if (event.target === loginOverlay) {

        loginOverlay.style.display = "none";

        loginError.style.display = "none";

    }

});

console.log("Authentication Ready");
// ==========================================
// PART 2 - LOAD VEHICLES & OPEN ADMIN PANEL
// ==========================================

// Load all vehicles from Firestore
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

            if (name) {
                name.textContent = data.name || "Unknown";
            }

            if (value) {
                value.textContent =
                    "$" + Number(data.value || 0).toLocaleString();
            }

            if (demand) {
                demand.textContent =
                    (data.demand || 0) + "/10";
            }

            if (image && data.image) {
                image.src = data.image;
            }

        });

        console.log("Vehicles Loaded");

    }

    catch (error) {

        console.error("Error loading vehicles:", error);

    }

}

loadVehicles();

// ==========================================
// OPEN ADMIN PANEL
// ==========================================

function openVehicleEditor(card) {

    selectedCard = card;

    const id = card.dataset.id;

    vehicleName.value =
        document.getElementById(`name${id}`).textContent;

    vehicleValue.value =
        document.getElementById(`value${id}`)
            .textContent
            .replace("$", "")
            .replace(/,/g, "");

    vehicleDemand.value =
        document.getElementById(`demand${id}`)
            .textContent
            .replace("/10", "");

    vehicleImage.value =
        document.getElementById(`image${id}`).src;

    adminOverlay.style.display = "flex";

    console.log("Opened editor for vehicle", id);

}

// ==========================================
// CLICK A VEHICLE
// ==========================================

document.querySelectorAll(".card").forEach((card) => {

    card.addEventListener("click", () => {

        // Not logged in?
        if (!isAdmin) {

            selectedCard = card;

            loginOverlay.style.display = "flex";

            loginEmail.focus();

            return;

        }

        // Already logged in
        openVehicleEditor(card);

    });

});

// ==========================================
// AFTER LOGIN OPEN THE PANEL
// ==========================================

onAuthStateChanged(auth, (user) => {

    if (!user) return;

    if (user.email.toLowerCase() !== ADMIN_EMAIL) return;

    isAdmin = true;

    if (selectedCard) {

        openVehicleEditor(selectedCard);

    }

});

// ==========================================
// CLOSE ADMIN PANEL
// ==========================================

adminOverlay.addEventListener("click", (event) => {

    if (event.target === adminOverlay) {

        adminOverlay.style.display = "none";

        selectedCard = null;

    }

});

console.log("Vehicle System Ready");
// ==========================================
// PART 3 - SAVE VEHICLE
// ==========================================

saveBtn.addEventListener("click", async () => {

    if (!isAdmin) {

        alert("You are not an admin.");

        return;

    }

    if (!selectedCard) {

        alert("No vehicle selected.");

        return;

    }

    saveBtn.disabled = true;

    saveBtn.textContent = "Saving...";

    try {

        const id = selectedCard.dataset.id;

        let imageURL = vehicleImage.value.trim();

        // ==================================
        // Upload image if one was selected
        // ==================================

        if (imageUpload.files.length > 0) {

            const file = imageUpload.files[0];

            console.log("Uploading image...");

            const storageRef = ref(

                storage,

                `cars/${id}-${Date.now()}-${file.name}`

            );

            await uploadBytes(storageRef, file);

            imageURL = await getDownloadURL(storageRef);

            console.log("Image Uploaded");

        }

        // ==================================
        // Vehicle object
        // ==================================

        const vehicleData = {

            name: vehicleName.value.trim(),

            value: Number(vehicleValue.value),

            demand: Number(vehicleDemand.value),

            image: imageURL

        };

        // ==================================
        // Save to Firestore
        // ==================================

        await setDoc(

            doc(db, "vehicles", id),

            vehicleData

        );

        console.log("Saved to Firestore");

        // ==================================
        // Update page immediately
        // ==================================

        document.getElementById(`name${id}`).textContent =
            vehicleData.name;

        document.getElementById(`value${id}`).textContent =
            "$" + vehicleData.value.toLocaleString();

        document.getElementById(`demand${id}`).textContent =
            vehicleData.demand + "/10";

        if (imageURL !== "") {

            document.getElementById(`image${id}`).src =
                imageURL;

        }

        // ==================================
        // Close panel
        // ==================================

        adminOverlay.style.display = "none";

        selectedCard = null;

        imageUpload.value = "";

        alert("Vehicle Saved!");

    }

    catch (error) {

        console.error(error);

        alert("Save Failed.\n\nCheck the browser console.");

    }

    saveBtn.disabled = false;

    saveBtn.textContent = "Save";

});

// ==========================================
// CANCEL BUTTON
// ==========================================

cancelBtn.addEventListener("click", () => {

    adminOverlay.style.display = "none";

    selectedCard = null;

    imageUpload.value = "";

});

// ==========================================
// LOGOUT FUNCTION
// ==========================================

async function logoutAdmin() {

    try {

        await signOut(auth);

        isAdmin = false;

        selectedCard = null;

        console.log("Logged Out");

    }

    catch (error) {

        console.error(error);

    }

}

console.log("Save System Ready");
// ==========================================
// PART 4 - FINAL STARTUP
// ==========================================

// Reload vehicles after login
onAuthStateChanged(auth, (user) => {

    if (user) {

        console.log("Authentication Ready");
        console.log("Logged in:", user.email);

        loadVehicles();

    } else {

        console.log("Not logged in");

    }

});

// ==========================================
// WINDOW LOADED
// ==========================================

window.addEventListener("load", () => {

    console.log("=================================");
    console.log("Vehicle Admin System Loaded");
    console.log("=================================");

    console.log("Admin Email:", ADMIN_EMAIL);

    console.log("Firebase Ready");

    console.log("Firestore Ready");

    console.log("Storage Ready");

    console.log("Authentication Ready");

    console.log("=================================");

});

// ==========================================
// GLOBAL ERROR LOGGER
// ==========================================

window.addEventListener("error", (event) => {

    console.error("JavaScript Error:");

    console.error(event.message);

    console.error(event.filename);

    console.error("Line:", event.lineno);

});

// ==========================================
// UNHANDLED PROMISES
// ==========================================

window.addEventListener("unhandledrejection", (event) => {

    console.error("Unhandled Promise:");

    console.error(event.reason);

});

// ==========================================
// OPTIONAL DEBUG
// ==========================================

window.debugAdmin = () => {

    console.log("========== DEBUG ==========");

    console.log("Current User:", currentUser);

    console.log("Is Admin:", isAdmin);

    console.log("Selected Card:", selectedCard);

    console.log("===========================");

};

// ==========================================
// END
// ==========================================

console.log("Script Loaded Successfully");
