require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to } = req.body;

const msg = {
  to,
  from: 'Leozinhoc592@gmail.com',
  subject: 'Teste Email',
  text: 'Oi, testando envio!',
  html: '<p>Oi, testando envio!</p>',
};


  try {
    await sgMail.send(msg);
    console.log('Email enviado com sucesso!');
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
