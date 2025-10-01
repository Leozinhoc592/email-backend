require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sgMail = require('@sendgrid/mail');

const app = express();
app.use(cors());
app.use(express.json());

console.log('SENDGRID_API_KEY carregada?', !!process.env.SENDGRID_API_KEY);


app.post('/send-email', async (req, res) => {
  const { to, dados } = req.body;

  console.log('Recebido pedido para:', to);

const msg = {
  to: to,
  from: 'Leozinhoc592@gmail.com',
  subject: 'Relatório do Paciente',
  text: `Dados: ${JSON.stringify(dados, null, 2)}`,
  html: `<pre>Dados: ${JSON.stringify(dados, null, 2)}</pre>`,
};


  try {
    console.log('Enviando email...');
    await sgMail.send(msg);
    console.log('Email enviado com sucesso!');
    res.json({ success: true });
  } catch (error) {
    console.error(' Erro detalhado:');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    if (error.response) {
      console.error('Resposta SendGrid:', error.response.body);
    }
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));