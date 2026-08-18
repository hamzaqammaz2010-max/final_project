const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const app = require('./app');
const Message = require('./models/Message');

dotenv.config();

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

// Run server listener locally only
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`EventPulse Server running on port ${PORT}`);
  });
}

module.exports = server;