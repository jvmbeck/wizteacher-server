import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from "cors";
import { buildAttendanceEmail } from './emailTemplate.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
});

app.post("/send-email", async (req, res) => {
  try {
    const { className, to, students } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const date  = new Date().toLocaleDateString();

    const htmlContent = buildAttendanceEmail({ className, date, students });

    await transporter.sendMail({
      from: `"João Vitor" <${process.env.EMAIL_USER}>`,
      to: to || "joaobeck@grupobstech.com.br",
      subject: `Relatório de Presença - ${className} (${date})`,
      html: htmlContent,
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email", error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));