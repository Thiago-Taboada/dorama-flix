// FIREBASE AND EXTRA VALIDATIONS
document.addEventListener("DOMContentLoaded", async function () {
    firebase.auth().onAuthStateChanged(async function (user) {
        const restrictedBodies = document.querySelectorAll(".restricted");
        const loginPage = window.location.href.endsWith("index.html");
        var exitBtn = document.getElementById("exit-btn");



        if (user) {
            const fbuser = firebase.auth().currentUser;
            const logged_uid = fbuser.uid;
            const logged_user_name = await getUserName(logged_uid);
            exitBtn.title = logged_user_name;

            restrictedBodies.forEach((body) => {
                body.style.display = "block";
            });
        } else {
            restrictedBodies.forEach((body) => {
                body.style.display = "none";
            });
        }

        if (!user && !loginPage) {
            window.location.href = "index.html";
        }
    });
});

// const firebaseConfig = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     databaseURL: "",
//     messagingSenderId: "",
//     appId: "",
//     measurementId: "",
// };

const firebaseConfig = {
    apiKey: "AIzaSyDrLvy384Zgqli1ru50VuoZhL2qu69GC6g",
    authDomain: "cineflix-4b1aa.firebaseapp.com",
    projectId: "cineflix-4b1aa",
    storageBucket: "cineflix-4b1aa.appspot.com",
    databaseURL: "https://cineflix-4b1aa-default-rtdb.firebaseio.com/",
    messagingSenderId: "542686761142",
    appId: "1:542686761142:web:5cd7a5976705ae594a1617",
    measurementId: "G-FM4XWCE8VE",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database();
var storage = firebase.storage();
const errorMessage = document.getElementById("error-message");
const formPassword = document.getElementById("password");
var loginElements = document.getElementsByClassName('login');
var recoverElements = document.getElementsByClassName('recover');
var registerElements = document.getElementsByClassName('register');
const formType = document.querySelectorAll(
    ".form_content_container .change_form"
);
formType.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.id;
        if (id === 'frm-to-register') {
            hideElements(loginElements)
            hideElements(recoverElements)
            formPassword.style.display = 'block';
            showElements(registerElements)
        } else if (id === 'frm-to-login') {
            hideElements(recoverElements)
            hideElements(registerElements)
            formPassword.style.display = 'block';
            showElements(loginElements)
        } else if (id === 'frm-to-recover') {
            hideElements(registerElements)
            hideElements(loginElements)
            formPassword.style.display = 'none';
            showElements(recoverElements)
        }

        function hideElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'none';
            }
        }
        function showElements(elements) {
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = 'block';
            }
        }
    });
});


function toggleForm(formType) {
    const loginElements = document.getElementsByClassName('login');
    const registerElements = document.getElementsByClassName('register');
    const recoverButton = document.getElementById('recover-button');

    for (let i = 0; i < loginElements.length; i++) {
        loginElements[i].style.display = formType === 'login' ? 'block' : 'none';
    }

    for (let i = 0; i < registerElements.length; i++) {
        registerElements[i].style.display = formType === 'register' ? 'block' : 'none';
    }

    recoverButton.style.display = formType === 'recover' ? 'block' : 'none';
}


function register() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var nome = document.getElementById("nome").value;
    var user_name = document.getElementById("user_name").value;
    var dt_nasc = document.getElementById("dt_nasc").value;
    errorMessage.style.display = "none";

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log("Email ou senha estão incorretos!!");
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }
    if (validate_name(nome) == false || validate_username(user_name) == false) {
        console.log("Um ou mais campos estão incorretos!!");
        errorMessage.innerHTML = "Um ou mais campos estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }

    if (validate_dt(dt_nasc) == false) {
        errorMessage.innerHTML =
            "Você precisa ter no mínimo 18 anos para poder criar uma conta!!";
        errorMessage.style.display = "block";
        return;
    }

    auth.createUserWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;

            user.sendEmailVerification();
        })
        .then(function () {
            var user = auth.currentUser;

            var database_ref = database.ref();

            var user_data = {
                email: email,
                nome: nome,
                user_name: user_name,
                dt_nasc: dt_nasc,
                last_login: Date.now(),
                isAdmin: false,
            };

            database_ref.child("users/" + user.uid).set(user_data);

            alert("Usuário cadastrado! Verifique seu email para ativar sua conta.");
            var elementToClick = document.getElementById('frm-to-login');
            elementToClick.click();
        })
        .catch(function (error) {
            getErrorMessage(error);
            console.log(error);
        });
}


function login() {
    email = document.getElementById("email").value;
    password = document.getElementById("password").value;
    errorMessage.style.display = "none";

    if (validate_email(email) == false || validate_password(password) == false) {
        console.log("Email ou senha estão incorretos!!");
        errorMessage.innerHTML = "Email ou senha estão incorretos!!";
        errorMessage.style.display = "block";
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function (userCredential) {
            var user = userCredential.user;

            if (user && user.emailVerified) {
                var database_ref = database.ref();

                var user_data = {
                    last_login: Date.now(),
                };
                database_ref.child("users/" + user.uid).update(user_data);
                console.log("Fazendo login!!");
                window.location.href = "home.html";
            } else if (user) {
                // Usuario autenticado pero correo electrónico no verificado
                console.log("Por favor, verifique seu email antes de fazer o login.");
                errorMessage.innerHTML = "Por favor, verifique seu email antes de fazer o login.";
                errorMessage.style.display = "block";
                auth.signOut();
            }
        })
        .catch(function (error) {
            getErrorMessage(error);
        });
}


function logout() {
    auth
        .signOut()
        .then(function () {
            window.location.href = "index.html";
        })
        .catch(function (error) {
            console.log("Logout Error:", error);
        });
}

function recover() {
    const email = document.getElementById("email").value;

    if (validate_email(email)) {
        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert("Foi enviado um e-mail de redefinição de senha. Por favor, verifique a sua caixa de entrada.");
                errorMessage.innerHTML = "Foi enviado um e-mail de redefinição de senha. Por favor, verifique a sua caixa de entrada.";
                errorMessage.style.display = "block";
            })
            .catch((error) => {
                getErrorMessage(error)
                alert("Erro ao enviar o email de redefinição.");
            });
    } else {
        alert("Por favor, insira um endereço de e-mail válido.");
        errorMessage.innerHTML = "Insira um endereço de e-mail válido.";
        errorMessage.style.display = "block";
    }
}

function getUserName(uid) {
    return new Promise((resolve, reject) => {
        var userRef = database.ref('users/' + uid);

        userRef.once('value')
            .then(function (snapshot) {
                var userData = snapshot.val();
                if (userData && userData.user_name) {
                    var userName = userData.user_name;
                    resolve(userName);
                } else {
                    console.error('Não foi encontrada nenhuma informação sobre o UID:', uid);
                    reject('Usuário não encontrado');
                }
            })
            .catch(function (error) {
                console.error('Error:', error);
                reject(error);
            });
    });
}

function getErrorMessage(error) {
    let msg;
    if (error.code == "auth/user-not-found") {
        msg = "Usuário nao encontrado";
    }
    if (error.code == "auth/internal-error") {
        msg = "Verifique os campos e tente novamente!";
    }
    if (error.code == "auth/email-already-in-use") {
        msg = "Este email ja esta em uso!";
    }
    if (error.code == "auth/too-many-requests") {
        msg = "O acesso a esta conta foi temporariamente desativado devido a muitas tentativas de login mal-sucedidas.";
    }
    console.log(error.code)
    console.log(error.message)

    errorMessage.innerHTML = msg;
    errorMessage.style.display = "block";
}

// Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
        return true;
    } else {
        return false;
    }
}

function validate_password(password) {
    if (password == null) {
        return false;
    }

    if (password.length < 6) {
        return false;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
        return false;
    }

    if (/\s/.test(password)) {
        return false;
    }

    return true;
}

function validate_dt(dateOfBirth) {
    if (dateOfBirth == null) {
        return false;
    }

    var dob = new Date(dateOfBirth);

    var currentDate = new Date();

    var age = currentDate.getFullYear() - dob.getFullYear();

    if (
        currentDate.getMonth() < dob.getMonth() ||
        (currentDate.getMonth() === dob.getMonth() &&
            currentDate.getDate() < dob.getDate())
    ) {
        age--;
    }

    if (age >= 18 || age <= 120) {
        return true;
    }

    return false;
}

function validate_name(name) {
    if (name.length < 6) {
        return false;
    }

    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return false;
    }

    return true;
}

function validate_username(user_name) {
    if (user_name == null) {
        return false;
    }

    if (/\s/.test(user_name)) {
        return false;
    }

    if (user_name.length < 6) {
        return false;
    }

    return true;
}
