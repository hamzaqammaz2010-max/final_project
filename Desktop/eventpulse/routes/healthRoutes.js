const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'OK',
    server: 'Running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
