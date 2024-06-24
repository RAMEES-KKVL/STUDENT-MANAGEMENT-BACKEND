import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
})


// Function for sending otp 
async function sendOtpEmail(email: string , otp: number) {

    // OTP Template
    const template = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to EduSync</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 30px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                            text-align: center;
                        }
                        p {
                            color: #666;
                            margin-bottom: 20px;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #007bff;
                            text-align: center;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            color: #999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Welcome to EduSync!</h1>
                        <p>Dear User,</p>
                        <p>We are delighted to welcome you to EduSync, your one-stop platform for seamless learning and collaboration!</p>
                        <p>To verify your account and unlock all the amazing features, enter the following One-Time Password (OTP):</p>
                        <p class="otp">${otp}</p>
                        <p>For any questions or assistance, feel free to reach out to our friendly support team at edusync@gmail.com.</p>
                        <p>Excited to have you on board!</p>
                        <p>Best Regards,<br/>The EduSync Team</p>
                    </div>
                </body>
                </html>
            `;

    const mailOptions = {
        from : process.env.email,
        to : email,
        subject : "Welcome to EduSync - Complete Your Registration!",
        html : template
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error: any) {
        console.error("Error sending OTP : ", error);
    }
}

export default sendOtpEmail
