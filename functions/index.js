const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Fetch email credentials from Firebase environment configuration
const emailUser = functions.config().email.user;
const emailPass = functions.config().email.pass;

// Configure nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass, // Use the app-specific password here
  },
});

exports.sendEmailOnFormSubmission = functions.firestore
    .document("formSubmissions/{docId}")
    .onCreate((snap, context) => {
      const newValue = snap.data(); // The new form submission data

      // Set up the email content
      const mailOptions = {
        from: emailUser,
        to: emailUser, // Send the email to yourself
        subject: "New Form Submission Received",
        html: `
                <h2>New Form Submission Details</h2>
                <p><strong>Name:</strong> ${newValue.name}</p>
                <p><strong>Phone:</strong> ${newValue.phone}</p>
                <p><strong>Address:</strong> ${newValue.address}</p>
                <p><strong>City:</strong> ${newValue.city}</p>
                <p><strong>Product:</strong> ${newValue.productTitle}</p>
                <p><strong>Quantity:</strong> ${newValue.quantity}</p>
                <p><strong>Price:</strong> ${newValue.price} MAD</p>
            `,
      };

      // Send the email
      return transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
    });
