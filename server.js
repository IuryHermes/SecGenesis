require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importar rotas
const authRoutes = require('./src/routes/auth.routes');
const eventRoutes = require('./src/routes/event.routes');
const guestRoutes = require('./src/routes/guest.routes');
const qrcodeRoutes = require('./src/routes/qrcode.routes');
const checkinRoutes = require('./src/routes/checkin.routes');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/guests', guestRoutes);
app.use('/api/qrcodes', qrcodeRoutes);
app.use('/api/checkins', checkinRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API SecGenesis funcionando!' });
});

// Conexão com o MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secgenesis', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Conectado ao MongoDB');
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
    process.exit(1);
  });
