const sky = document.getElementById("sky");

// DAY ↔ NIGHT SWITCH
setInterval(() => {
    sky.classList.toggle("night");
}, 5000);

// CLICK SIGNAL
function goToTrack() {
    window.location.href = "track.html";
}




const API = "http://localhost:5000/api/users";

/* REGISTER */
function registerUser(e) {
    e.preventDefault();

    console.log("Register function called"); // debug

    const API = "http://localhost:5000/api/users";

    const data = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    fetch(API + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        console.log(result);
        alert(result.message);

        // redirect after success
        if (result.message === "User Registered") {
            window.location.href = "login.html";
        }
    })
    .catch(err => {
        console.error(err);
        alert("Registration failed");
    });
}

/* LOGIN */
async function loginUser(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch("http://localhost:5000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        console.log("LOGIN RESPONSE:", data);

        if (data.message === "Login Successful") {

            // ✅ STORE USER LOGIN DATA
            localStorage.setItem("userId", data.id);   // 🔥 MOST IMPORTANT
            localStorage.setItem("userName", data.name); // optional

            alert("Login successful");

            window.location.href = "index.html";

        } else {
            alert(data.message);
        }

    } catch (err) {
        console.error(err);
        alert("Login failed");
    }
}