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
