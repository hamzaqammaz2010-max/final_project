const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const Message = require('./models/Message');

dotenv.config();
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on('join_room', (eventId) => {
    socket.join(eventId);
    console.log(`[Socket.io] Client ${socket.id} joined room: ${eventId}`);
  });

  socket.on('send_announcement', async ({ eventId, senderId, content }) => {
    try {
      const message = await Message.create({
        event: eventId,
        sender: senderId,
        content
      });
      const populatedMessage = await message.populate('sender', 'name role');

      io.to(eventId).emit('announcement', populatedMessage);
      console.log(`[Socket.io] Broadcast announcement sent to event room: ${eventId}`);
    } catch (err) {
      console.error('[Socket.io] Error broadcasting announcement:', err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`EventPulse Server running on port ${PORT}`);
  });
}

module.exports = server;