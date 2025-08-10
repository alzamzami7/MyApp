// استيراد اللازم من Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

// إعداد Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAGdh40AO3JvX1WQ3IfMFgSoDzTixmnCCA",
    authDomain: "azapp-61227.firebaseapp.com",
    projectId: "azapp-61227",
    storageBucket: "azapp-61227.firebasestorage.app",
    messagingSenderId: "1023006420463",
    appId: "1:1023006420463:web:0e3b09aed5473efd381a1a"
};

// تهيئة التطبيق
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const adminEmail = "alzamzami607@icloud.com";

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await checkAccess(userCredential.user);
    } catch (error) {
        document.getElementById("login-message").innerText = "خطأ: " + error.message;
    }
}

async function logout() {
    await signOut(auth);
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
    document.getElementById("admin-panel").style.display = "none";
}

async function checkAccess(user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if ((!docSnap.exists() && user.email !== adminEmail) || (docSnap.exists() && !docSnap.data().access && user.email !== adminEmail)) {
        document.getElementById("login-message").innerHTML =
            "تم تقييد وصولك. تواصل مع المسؤول على واتساب: <a href='https://wa.me/967730102760'>730102760</a>";
        await signOut(auth);
        return;
    }

    document.getElementById("user-email").innerText = user.email;
    document.getElementById("main-screen").style.display = "block";
    document.getElementById("login-screen").style.display = "none";

    if (user.email === adminEmail) {
        document.getElementById("admin-panel").style.display = "block";
        await loadUsers();
    }
}

async function loadUsers() {
    const snapshot = await getDocs(collection(db, "users"));
    const list = document.getElementById("users-list");
    list.innerHTML = "";
    snapshot.forEach(doc => {
        const data = doc.data();
        const li = document.createElement("li");
        li.textContent = data.email + " - " + (data.access ? "مسموح" : "ممنوع");
        list.appendChild(li);
    });
}

onAuthStateChanged(auth, user => {
    if (user) {
        checkAccess(user);
    } else {
        document.getElementById("main-screen").style.display = "none";
        document.getElementById("login-screen").style.display = "block";
        document.getElementById("admin-panel").style.display = "none";
    }
});
