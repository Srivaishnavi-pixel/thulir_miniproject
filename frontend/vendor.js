/* ================= HAMBURGER MENU ================= */
function openMenu() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("overlay").style.display = "block";
}

function closeMenu() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("overlay").style.display = "none";
}

function goAddProduct() {
    window.location.href = "add-product.html";
}

function sellOffline() {
    alert("Offline selling coming soon");
}

/* ================= MAIN JS ================= */
document.addEventListener("DOMContentLoaded", function () {

    console.log("JS READY");

    const API = "http://localhost:5000/api/vendors";

    /* ================= REGISTER ================= */
    const registerForm = document.getElementById("vendorForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            console.log("REGISTER FORM SUBMITTED");

            const formData = new FormData(registerForm);

            try {
                const res = await fetch(API + "/register", {
                    method: "POST",
                    body: formData
                });

                const result = await res.json();

                console.log("REGISTER RESPONSE:", result);

                if (result.message) {
                    alert("Registered Successfully!\nYour ID: " + result.registrationId);

                    registerForm.reset();

                    // ✅ Redirect to login page
                    setTimeout(() => {
                        window.location.href = "vendor-login.html";
                    }, 1500);
                } else {
                    alert("Registration failed");
                }

            } catch (err) {
                console.error("REGISTER ERROR:", err);
                alert("Server error during registration");
            }
        });
    }

    /* ================= LOGIN ================= */
    window.vendorLogin = async function (e) {
        e.preventDefault();

        const email = document.getElementById("email")?.value;
        const password = document.getElementById("password")?.value;

        if (!email || !password) {
            alert("Please enter email and password");
            return;
        }

        try {
            const res = await fetch(API + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const result = await res.json();

            console.log("LOGIN RESPONSE:", result);

            alert(result.message);

            if (result.message === "Login Successful") {

                // ✅ Save vendor details
                localStorage.setItem("vendorName", result.name);
                localStorage.setItem("vendorId", result.id);

                // ✅ Redirect to dashboard
                window.location.href = "vendor.html";
            }

        } catch (err) {
            console.error("LOGIN ERROR:", err);
            alert("Login failed");
        }
    };

});