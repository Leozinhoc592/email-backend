require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, relatorio, registros } = req.body;

  if (!to || !relatorio || !registros) {
    return res.status(400).json({ success: false, error: "Faltando email, relatório ou registros" });
  }

  try {
    const dadosJSON = JSON.stringify({ relatorio, registros }, null, 2);

    const msg = {
      to,
      from: 'Leozinhoc592@gmail.com',
      subject: 'Relatório do Paciente',
      text: 'Segue em anexo o relatório completo em JSON.',
      attachments: [
        {
          content: Buffer.from(dadosJSON).toString('base64'),
          filename: 'relatorio_completo.json',
          type: 'application/json',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
