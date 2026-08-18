const http = require('http');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Server } = require('socket.io');
const swaggerUi = require('swagger-ui-express');

const swaggerDocument = require('./swagger.json');
const connectDB = require('./config/db');
const Message = require('./models/Message');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');


dotenv.config();
connectDB()
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

app.use(cors());
app.use(express.json());

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

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_room', (eventId) => {
    socket.join(eventId);
  });

  socket.on('send_announcement', async ({ eventId, senderId, content }) => {
    try {
      const message = await Message.create({ event: eventId, sender: senderId, content });
      const populatedMessage = await message.populate('sender', 'name role');
      io.to(eventId).emit('announcement', populatedMessage);
    } catch (err) {
      console.error('[Socket.io] Error:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`EventPulse Server running on port ${PORT}`);
});

module.exports = app;