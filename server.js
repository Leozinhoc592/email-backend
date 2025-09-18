require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, dados } = req.body;

  const msg = {
    to: to,
    from: 'Leozinhoc592@gmail.com',
    subject: 'Relatório do Paciente',
    text: `Dados: ${dados}`,
    html: `<p>Dados: ${dados}</p>`,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));