const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Ensure DB connects on serverless invocations
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.use(cors());
app.use(express.json());

// Root route fallback
app.get('/', (req, res) => {
  res.status(200).json({ status: 'success', message: 'EventPulse API is running' });
});

app.use('/health', healthRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api', announcementRoutes);

app.use(errorMiddleware);

module.exports = app;