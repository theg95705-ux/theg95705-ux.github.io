// ==========================================
// VEHICLE ADMIN SYSTEM
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

// NEW LOGOUT BUTTON
const logoutBtn = document.getElementById("logoutBtn");

console.log("HTML Loaded");

// ==========================================
// FIREBASE AUTH STATE
// ==========================================

onAuthStateChanged(auth, (user) => {

    currentUser = user;

    if (!user) {

        isAdmin = false;

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }

        console.log("No user logged in");

        return;
    }

    console.log("Logged in:", user.email);
    console.log("UID:", user.uid);

    if (
        user.email &&
        user.email.toLowerCase() === ADMIN_EMAIL
    ) {

        isAdmin = true;

        if (logoutBtn) {
            logoutBtn.style.display = "block";
        }

        loginOverlay.style.display = "none";

        console.log("=================================");
        console.log("ADMIN ACCESS GRANTED");
        console.log("Admin editing enabled");
        console.log("=================================");

    } else {

        isAdmin = false;

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }

        console.log("ADMIN ACCESS DENIED");

    }

});
// ==========================================
// PART 2 - LOGIN SYSTEM & ADMIN CONTROLS
// ==========================================

// ==========================================
// LOGIN BUTTON
// ==========================================

loginBtn.addEventListener("click", async () => {

    loginError.style.display = "none";

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email || !password) {

        loginError.textContent = "Please enter your email and password.";
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

        loginOverlay.style.display = "none";

        console.log("Login successful.");

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
// LOG OUT BUTTON
// ==========================================

logoutBtn.addEventListener("click", async () => {

    const logout = confirm(
        "Are you sure you want to log out?"
    );

    if (!logout) return;

    await logoutAdmin();

});

// ==========================================
// CANCEL LOGIN
// ==========================================

loginCancelBtn.addEventListener("click", () => {

    loginOverlay.style.display = "none";

    loginEmail.value = "";
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

    if (event.key === "Control") {

        ctrlPressed = true;

    }

    if (event.key === "Alt") {

        altPressed = true;

    }

    if (
        ctrlPressed &&
        altPressed &&
        event.key === "ArrowRight"
    ) {

        console.log("Opening admin login...");

        loginOverlay.style.display = "flex";

        loginEmail.focus();

    }

});

document.addEventListener("keyup", (event) => {

    if (event.key === "Control") {

        ctrlPressed = false;

    }

    if (event.key === "Alt") {

        altPressed = false;

    }

});

// ==========================================
// VEHICLE CLICK HANDLER
// ==========================================

document.querySelectorAll(".card").forEach((card) => {

    card.addEventListener("click", () => {

        if (!isAdmin) {

            console.log("Viewing vehicle");

            return;

        }

        openVehicleEditor(card);

    });

});

console.log("Login System Ready");
// ==========================================
// PART 3 - VEHICLE LOADING & EDITOR
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

            const name = document.getElementById(`name${id}`);
            const value = document.getElementById(`value${id}`);
            const demand = document.getElementById(`demand${id}`);
            const image = document.getElementById(`image${id}`);

            if (name) {
                name.textContent = data.name || "Car Name";
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

        console.log("Vehicles loaded.");

    }
    catch (error) {

        console.error("Vehicle Load Error:", error);

    }

}

// ==========================================
// OPEN EDITOR
// ==========================================

function openVehicleEditor(card) {

    if (!isAdmin) return;

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

    imageUpload.value = "";

    adminOverlay.style.display = "flex";

    console.log("Editing vehicle:", id);

}

// ==========================================
// SAVE VEHICLE
// ==========================================

saveBtn.addEventListener("click", async () => {

    if (!isAdmin) {

        alert("Admin access required.");
        return;

    }

    if (!selectedCard) {

        alert("Please select a vehicle first.");
        return;

    }

    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";

    try {

        const id = selectedCard.dataset.id;

        let imageURL = vehicleImage.value.trim();

        // Upload new image

        if (
            imageUpload.files &&
            imageUpload.files.length > 0
        ) {

            const file = imageUpload.files[0];

            const imageRef = ref(
                storage,
                `vehicles/${id}_${Date.now()}_${file.name}`
            );

            console.log("Uploading image...");

            await uploadBytes(
                imageRef,
                file
            );

            imageURL =
                await getDownloadURL(imageRef);

            console.log("Image uploaded.");

        }

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

        // Update page immediately

        document.getElementById(`name${id}`).textContent =
            vehicleData.name;

        document.getElementById(`value${id}`).textContent =
            "$" + vehicleData.value.toLocaleString();

        document.getElementById(`demand${id}`).textContent =
            vehicleData.demand + "/10";

        document.getElementById(`image${id}`).src =
            imageURL;

        adminOverlay.style.display = "none";

        selectedCard = null;

        imageUpload.value = "";

        alert("Vehicle saved successfully!");

        console.log("Vehicle updated:", id);

    }
    catch (error) {

        console.error("Save Error:", error);

        alert(error.message);

    }

    saveBtn.disabled = false;
    saveBtn.textContent = "Save";

});

// ==========================================
// INITIAL LOAD
// ==========================================

loadVehicles();

console.log("Vehicle System Ready");
// ==========================================
// PART 4 - FINAL CONTROLS & LOGOUT
// ==========================================

// ==========================================
// CANCEL EDIT
// ==========================================

cancelBtn.addEventListener("click", () => {

    adminOverlay.style.display = "none";

    selectedCard = null;

    imageUpload.value = "";

});

// ==========================================
// CLOSE EDITOR WHEN CLICKING OUTSIDE
// ==========================================

adminOverlay.addEventListener("click", (event) => {

    if (event.target === adminOverlay) {

        adminOverlay.style.display = "none";

        selectedCard = null;

        imageUpload.value = "";

    }

});

// ==========================================
// LOG OUT
// ==========================================

async function logoutAdmin() {

    try {

        await signOut(auth);

        console.log("Logged out");

        isAdmin = false;
        currentUser = null;
        selectedCard = null;

        adminOverlay.style.display = "none";
        loginOverlay.style.display = "none";

        logoutBtn.style.display = "none";

        imageUpload.value = "";

        alert("You have been logged out.");

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

window.logoutAdmin = logoutAdmin;

// ==========================================
// DEBUG
// ==========================================

window.debugAdmin = () => {

    console.log("========== ADMIN ==========");

    console.log("Current User:", currentUser);
    console.log("Email:", currentUser?.email);
    console.log("Is Admin:", isAdmin);
    console.log("Selected Card:", selectedCard);

    console.log("===========================");

};

// ==========================================
// PAGE LOADED
// ==========================================

window.addEventListener("load", () => {

    console.log("=================================");
    console.log("Vehicle Admin System Loaded");
    console.log("CTRL + ALT + RIGHT ARROW");
    console.log("=================================");

});

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

console.log("System Ready");
