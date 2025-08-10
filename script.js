// إعداد Firebase
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const adminEmail = "alzamzami607@icloud.com";

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
        checkAccess(userCredential.user);
    })
    .catch(error => {
        document.getElementById("login-message").innerText = "خطأ: " + error.message;
    });
}

function logout() {
    auth.signOut();
    document.getElementById("main-screen").style.display = "none";
    document.getElementById("login-screen").style.display = "block";
}

function checkAccess(user) {
    db.collection("users").doc(user.uid).get().then(doc => {
        if (!doc.exists && user.email !== adminEmail) {
            document.getElementById("login-message").innerHTML =
                "تم تقييد وصولك. تواصل مع المسؤول على واتساب: <a href='https://wa.me/967730102760'>730102760</a>";
            auth.signOut();
            return;
        }

        document.getElementById("user-email").innerText = user.email;
        document.getElementById("main-screen").style.display = "block";
        document.getElementById("login-screen").style.display = "none";

        if (user.email === adminEmail) {
            document.getElementById("admin-panel").style.display = "block";
            loadUsers();
        }
    });
}

function loadUsers() {
    db.collection("users").get().then(snapshot => {
        const list = document.getElementById("users-list");
        list.innerHTML = "";
        snapshot.forEach(doc => {
            const li = document.createElement("li");
            li.textContent = doc.data().email + " - " + (doc.data().access ? "مسموح" : "ممنوع");
            list.appendChild(li);
        });
    });
}

auth.onAuthStateChanged(user => {
    if (user) {
        checkAccess(user);
    }
});
