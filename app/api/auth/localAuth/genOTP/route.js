import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import User from "@/models/User";
import Username from "@/app/[username]/page";
export async function POST(request) {
  try {
    const { name, receiverEmail } = await request.json();

    // create a transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    const userExist = await User.findOne({ email: receiverEmail });
    if (userExist) {
      return NextResponse.json({ message: "Your account already exists" });
    }

    // create a user under the status of verifying
    const newUser = await User.create({
      name: "pending",
      Username: "pending",
      email: receiverEmail,
      otp, // Store OTP in the user document
      status: "verifying",
    });

    // Configure Email Data
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: receiverEmail, // The recipient of the email
      subject: `OTP signup:`,
      text: `
        Name: ${name}
        Email: ${receiverEmail}
        Message: Use this OTP to SignUp ${otp}
      `,
    };

    // send email
    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: "Email sent successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { message: "Failed to send email." },
      { status: 500 }
    );
  }
}
