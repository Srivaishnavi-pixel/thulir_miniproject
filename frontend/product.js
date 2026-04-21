document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("productForm");

    if (!form) {
        console.error("productForm not found");
        return;
    }

    /* ================= IMAGE PREVIEW ================= */
    const fileInput = form.querySelector('input[type="file"]');
    const preview = document.createElement("img");

    preview.style.width = "100%";
    preview.style.marginTop = "10px";
    preview.style.display = "none";
    preview.style.borderRadius = "8px";

    fileInput.parentNode.appendChild(preview);

    fileInput.addEventListener("change", function (e) {
        const file = e.target.files[0];

        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        }
    });

    /* ================= SUBMIT ================= */
    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const vendorId = localStorage.getItem("vendorId");

        console.log("Vendor ID:", vendorId); // 🔍 DEBUG

        if (!vendorId) {
            alert("Please login first");
            window.location.href = "vendor-login.html";
            return;
        }

        const formData = new FormData(form);

        // 🔥 IMPORTANT
        formData.append("vendorId", vendorId);

        try {
            const res = await fetch(
    `http://localhost:5000/api/products/add?vendorId=${vendorId}`,  // ✅ IMPORTANT
    {
        method: "POST",
        body: formData
    }
);

            const result = await res.json();

            console.log("SERVER RESPONSE:", result); // 🔍 DEBUG

            if (!res.ok) {
                throw new Error(result.message || "Failed to add product");
            }

            alert(result.message || "Product added successfully");

            form.reset();
            preview.style.display = "none";

            // redirect after short delay
            setTimeout(() => {
                window.location.href = "shop.html";
            }, 800);

        } catch (err) {
            console.error("ADD PRODUCT ERROR:", err);
            alert("Failed to add product. Check backend.");
        }

    });

});