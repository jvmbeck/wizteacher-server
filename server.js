import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from "cors";
import { Resend } from 'resend';
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

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-email', async (req, res) => {
    const { className, students, to } = req.body;

    // students is an array of objects with name and status properties
    if (!className || !students) {
        return res.status(400).send('Missing required fields: className, students');
    }
    
    try {
        const date = new Date().toLocaleDateString();
        const subject = `Relatório de Presença - ${className} - ${date}`;
        const htmlContent = buildAttendanceEmail({ className, date, students });

        const {data, error} = await resend.emails.send({
            from: 'João Vitor <jmadridbeck@gmail.com>',
            to: to || "joaobeck@grupobstech.com.br",
            subject: subject,
            html: htmlContent
        });

        if (error) {
            console.error("Resend API error:", error);
            return res.status(500).send(`Error sending email: ${error.message}`);
        }

    res.status(200).send(`Email sent: ${data.id}`);
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send(`Error sending email: ${error}`); 
    }
    
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));