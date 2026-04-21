const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/place", async (req, res) => {
    try {
        const { email, name, productDetails } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate an Ethereal test account (Free developer tool)
        let testAccount = await nodemailer.createTestAccount();

        // Create a transporter using the test account
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });

        // Send the email
        let info = await transporter.sendMail({
            from: '"Thulir Organics 🌿" <noreply@thulirorganics.com>',
            to: email, // Email provided by the user on the checkout page
            subject: "Order Placed Successfully! 🎉",
            text: `Hello ${name || 'Customer'},\n\nYour order has been placed successfully!\n\nProduct Details:\n${productDetails}\n\nThank you for shopping with Thulir Organics!`,
            html: `<h3>Hello ${name || 'Customer'},</h3>
                   <p>Your order has been placed successfully!</p>
                   <p><strong>Product Details:</strong><br/>${productDetails.replace(/\n/g, '<br/>')}</p>
                   <p>Thank you for shopping with <b>Thulir Organics</b>! 🌿</p>`,
        });

        console.log("=========================================");
        console.log("📧 EMAIL SENT!");
        console.log("To see the email, click this link:");
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        console.log("=========================================");

        res.json({ message: "Order placed and email sent successfully!" });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ message: "Failed to send email" });
    }
});

module.exports = router;
