// ==========================================
// VEHICLE VALUES
// SCRIPT.JS
// PART 1 - FIREBASE SETUP
// ==========================================

console.clear();

console.log("=================================");
console.log("Vehicle Values Starting...");
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
    getAuth,
    signInWithEmailAndPassword,
    signOut,
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

const auth = getAuth(app);

console.log("Firebase Connected");

// ==========================================
// ADMIN SETTINGS
// ==========================================

const ADMIN_EMAIL = "theg95705@gmail.com".toLowerCase();

let currentUser = null;
let isAdmin = false;
let selectedCard = null;

// ==========================================
// HTML ELEMENTS
// ==========================================

// Login

const loginOverlay = document.getElementById("loginOverlay");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginBtn = document.getElementById("loginBtn");
const loginCancelBtn = document.getElementById("loginCancelBtn");
const loginError = document.getElementById("loginError");

// Admin Panel

const adminOverlay = document.getElementById("adminOverlay");

const vehicleName = document.getElementById("vehicleName");
const vehicleValue = document.getElementById("vehicleValue");
const vehicleDemand = document.getElementById("vehicleDemand");
const vehicleImage = document.getElementById("vehicleImage");
const vehicleLimited = document.getElementById("vehicleLimited");

// Buttons

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const logoutBtn = document.getElementById("logoutBtn");

// ==========================================
// CARD CONTAINER
// ==========================================

const cardsContainer = document.querySelector(".cards");

// ==========================================
// APP STARTUP
// ==========================================

console.log("HTML Loaded");
console.log("Waiting for Authentication...");
console.log("System Ready");
// ==========================================
// PART 2 - AUTHENTICATION SYSTEM
// ==========================================

// ==========================================
// AUTH STATE
// ==========================================

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if (!user) {

        isAdmin = false;

        logoutBtn.style.display = "none";

        console.log("No user logged in.");

        return;

    }

    console.log("Logged in as:", user.email);

    if (
        user.email &&
        user.email.toLowerCase() === ADMIN_EMAIL
    ) {

        isAdmin = true;

        logoutBtn.style.display = "inline-flex";

        loginOverlay.style.display = "none";

        console.log("==============================");
        console.log("ADMIN ACCESS GRANTED");
        console.log("==============================");

        await loadVehicles();

    }
    else {

        isAdmin = false;

        logoutBtn.style.display = "none";

        console.log("Not an admin account.");

    }

});

// ==========================================
// LOGIN
// ==========================================

loginBtn.addEventListener("click", async () => {

    loginError.style.display = "none";

    const email = loginEmail.value.trim().toLowerCase();

    const password = loginPassword.value;

    if (!email || !password) {

        loginError.textContent =
            "Please enter your email and password.";

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

        loginEmail.value = "";

        loginPassword.value = "";

    }
    catch (error) {

        console.error(error);

        loginError.textContent =
            "Incorrect email or password.";

        loginError.style.display = "block";

    }

    loginBtn.disabled = false;

    loginBtn.textContent = "Sign In";

});

// ==========================================
// LOG OUT
// ==========================================

logoutBtn.addEventListener("click", async () => {

    const confirmLogout =
        confirm("Are you sure you want to log out?");

    if (!confirmLogout) return;

    try {

        await signOut(auth);

        adminOverlay.style.display = "none";

        loginOverlay.style.display = "none";

        selectedCard = null;

        isAdmin = false;

        currentUser = null;

        logoutBtn.style.display = "none";

        console.log("Logged Out");

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

});

// ==========================================
// CLOSE LOGIN PANEL
// ==========================================

loginCancelBtn.addEventListener("click", () => {

    loginOverlay.style.display = "none";

    loginPassword.value = "";

    loginError.style.display = "none";

});

// ==========================================
// CLICK OUTSIDE LOGIN PANEL
// ==========================================

loginOverlay.addEventListener("click", (event) => {

    if (event.target === loginOverlay) {

        loginOverlay.style.display = "none";

    }

});

// ==========================================
// SECRET ADMIN SHORTCUT
// CTRL + ALT + RIGHT ARROW
// ==========================================

let ctrlPressed = false;
let altPressed = false;

document.addEventListener("keydown", (event) => {

    if (event.key === "Control")
        ctrlPressed = true;

    if (event.key === "Alt")
        altPressed = true;

    if (

        ctrlPressed &&
        altPressed &&
        event.key === "ArrowRight"

    ) {

        loginOverlay.style.display = "flex";

        loginEmail.focus();

        console.log("Admin Login Opened");

    }

});

document.addEventListener("keyup", (event) => {

    if (event.key === "Control")
        ctrlPressed = false;

    if (event.key === "Alt")
        altPressed = false;

});

console.log("Authentication Ready");
// ==========================================
// PART 3 - VEHICLE SYSTEM
// ==========================================

// ==========================================
// LOAD VEHICLES
// ==========================================

async function loadVehicles() {

    try {

        const snapshot = await getDocs(
            collection(db, "vehicles")
        );

        snapshot.forEach((vehicle) => {

            const id = vehicle.id;
            const data = vehicle.data();

            const card = document.querySelector(
                `.card[data-id="${id}"]`
            );

            if (!card) return;

            // -------------------------
            // Name
            // -------------------------

            document.getElementById(`name${id}`).textContent =
                data.name || "Unknown Vehicle";

            // -------------------------
            // Value
            // -------------------------

            document.getElementById(`value${id}`).textContent =
                "$" +
                Number(data.value || 0).toLocaleString();

            // -------------------------
            // Demand
            // -------------------------

            document.getElementById(`demand${id}`).textContent =
                (data.demand || 0) + "/10";

            // -------------------------
            // Image
            // -------------------------

            document.getElementById(`image${id}`).src =
                data.image || "";

            // -------------------------
            // LIMITED VEHICLE
            // -------------------------

            const badge =
                document.getElementById(`limitedBadge${id}`);

            if (data.limited === true) {

                card.classList.add("limited");

                if (badge)
                    badge.style.display = "flex";

            } else {

                card.classList.remove("limited");

                if (badge)
                    badge.style.display = "none";

            }

        });

        console.log("Vehicles Loaded");

    }
    catch (error) {

        console.error("Vehicle Load Error");

        console.error(error);

    }

}

// ==========================================
// OPEN EDITOR
// ==========================================

document.querySelectorAll(".card").forEach((card) => {

    card.addEventListener("click", () => {

        if (!isAdmin)
            return;

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

        // -------------------------
        // Limited Switch
        // -------------------------

        vehicleLimited.checked =
            card.classList.contains("limited");

        adminOverlay.style.display = "flex";

        console.log("Editing Vehicle:", id);

    });

});

// ==========================================
// CANCEL EDIT
// ==========================================

cancelBtn.addEventListener("click", () => {

    adminOverlay.style.display = "none";

    selectedCard = null;

});

// ==========================================
// CLICK OUTSIDE PANEL
// ==========================================

adminOverlay.addEventListener("click", (event) => {

    if (event.target === adminOverlay) {

        adminOverlay.style.display = "none";

        selectedCard = null;

    }

});

console.log("Vehicle Editor Ready");
// ==========================================
// PART 4 - SAVE, DEBUG & STARTUP
// ==========================================

// ==========================================
// SAVE VEHICLE
// ==========================================

saveBtn.addEventListener("click", async () => {

    if (!isAdmin) {

        alert("Admin access required.");

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

        const vehicleData = {

            name: vehicleName.value.trim(),

            value: Number(vehicleValue.value),

            demand: Number(vehicleDemand.value),

            image: vehicleImage.value.trim(),

            limited: vehicleLimited.checked

        };

        await setDoc(

            doc(db, "vehicles", id),

            vehicleData

        );

        // ===========================
        // UPDATE CARD
        // ===========================

        document.getElementById(`name${id}`).textContent =
            vehicleData.name;

        document.getElementById(`value${id}`).textContent =
            "$" +
            vehicleData.value.toLocaleString();

        document.getElementById(`demand${id}`).textContent =
            vehicleData.demand + "/10";

        document.getElementById(`image${id}`).src =
            vehicleData.image;

        const badge =
            document.getElementById(`limitedBadge${id}`);

        if (vehicleData.limited) {

            selectedCard.classList.add("limited");

            if (badge)
                badge.style.display = "flex";

        }
        else {

            selectedCard.classList.remove("limited");

            if (badge)
                badge.style.display = "none";

        }

        adminOverlay.style.display = "none";

        selectedCard = null;

        console.log("Vehicle Saved:", id);

        alert("Vehicle saved successfully!");

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

    saveBtn.disabled = false;
    saveBtn.textContent = "Save";

});

// ==========================================
// DEBUG COMMANDS
// ==========================================

window.debugAdmin = () => {

    console.log("========== ADMIN ==========");

    console.log("Current User:", currentUser);
    console.log("Email:", currentUser?.email);
    console.log("Admin:", isAdmin);
    console.log("Selected Card:", selectedCard);

    console.log("===========================");

};

window.refreshVehicles = async () => {

    console.clear();

    console.log("Refreshing Vehicles...");

    await loadVehicles();

};

// ==========================================
// GLOBAL ERRORS
// ==========================================

window.addEventListener("error", (event) => {

    console.error("JavaScript Error");

    console.error(event.message);

    console.error(event.filename);

    console.error(event.lineno);

});

window.addEventListener("unhandledrejection", (event) => {

    console.error("Unhandled Promise");

    console.error(event.reason);

});

// ==========================================
// PAGE LOADED
// ==========================================

window.addEventListener("load", () => {

    console.log("=================================");
    console.log("Vehicle Values Loaded");
    console.log("Firebase Connected");
    console.log("Admin Shortcut:");
    console.log("CTRL + ALT + RIGHT ARROW");
    console.log("=================================");

});

console.log("System Ready");
