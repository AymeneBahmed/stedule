import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "aymendd3131@gmail.com",
    pass: "sxzlplhhsqfpgmpi",
  },
});

export async function sendEmailVerificationMail(email: string, otp: string) {
  await transporter.sendMail({
    from: "Study Schedule <aymendd3131@gmail.com>",
    to: email,
    subject: "Verify your account",
    html: `Here is your verification code: <strong>${otp}</strong>`,
  });
}

export async function sendDeleteUserVerificationMail(
  email: string,
  url: string,
) {
  await transporter.sendMail({
    from: "Study Schedule <aymendd3131@gmail.com>",
    to: email,
    subject: "Verify deletion",
    html: `Click here to delete your account: <strong>${url}</strong>`,
  });
}

export async function sendNewEmailVerificationMail(
  newEmail: string,
  token: string,
) {
  await transporter.sendMail({
    from: "Study Schedule <aymendd3131@gmail.com>",
    to: newEmail,
    subject: "Verify new email",
    html: `Click here to change your email: <strong>${process.env.APP_URL}/verify-email/new-email?token=${token}</strong>`,
  });
}
