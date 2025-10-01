require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, relatorio } = req.body;

  if (!to || !relatorio) {
    return res.status(400).json({ success: false, error: "Faltando email ou relatório" });
  }

  try {
 
    const relatorioJSON = JSON.stringify(relatorio, null, 2);

    const msg = {
      to,
      from: 'Leozinhoc592@gmail.com',
      subject: 'Relatório do Paciente',
      text: 'Segue em anexo o relatório em JSON.',
      attachments: [
        {
          content: Buffer.from(relatorioJSON).toString('base64'),
          filename: 'relatorio.json',
          type: 'application/json',
          disposition: 'attachment',
        },
      ],
    };

    await sgMail.send(msg);
    console.log('Email enviado com sucesso para:', to);
    res.json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
