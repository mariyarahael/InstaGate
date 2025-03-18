const nodemailer = require('nodemailer'); 
 
// Configure transporter 
const transporter = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
 user: 'your-email@gmail.com', 
 password: 'your-app-password' 
  } 
}); 
 
// Function to send notification when gate pass is requested 
async function notifyParent(studentId, parentEmail, requestDetails) {
  const mailOptions = { 
 from: 'hostel@example.com', 
 to: parentEmail, 
 subject: 'Gate Pass Approval Required', 
 text: `Your ward has requested a gate pass. Please login to approve: 
http://localhost:5000/login`, 
 html: `<p>Your ward has requested a gate pass with the following details:</p> 
        <p>Date: ${requestDetails.date}</p> 
        <p>Time: ${requestDetails.time}</p> 
        <p>Reason: ${requestDetails.reason}</p> 
        <p><a href="http://localhost:5000/login">Login to approve</a></p>` 
  }; 
 
  try { 
 await transporter.sendMail(mailOptions); 
 console.log('Email sent successfully'); 
  } catch (error) { 
 console.error('Error sending email:', error); 
  }
}






// Function to notify students when their request is approved or rejected
async function notifyStudent(studentEmail, status) {
  const mailOptions = {
      from: "hostel@example.com",
      to: studentEmail,
      subject: `Your Gate Pass Request has been ${status}`,
      text: `Your gate pass request has been ${status}.`,
      html: `<p>Your gate pass request has been <strong>${status}</strong>.</p>`
  };

  try {
      await transporter.sendMail(mailOptions);
      console.log(`📢 Notification sent to student: ${studentEmail}`);
  } catch (error) {
      console.error("❌ Error sending student notification:", error);
  }
}

//module.exports = { notifyParent, notifyStudent };


