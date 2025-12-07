const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Store aggregated data
let metrics = {
  totalReceived: 0,
  lastValue: null,
  values: [], // Keep last 100 values for chart
  timestamps: [], // Keep last 100 timestamps
  average: 0,
  min: null,
  max: null,
  clientCounts: {} // Track data from different clients
};

// Endpoint for Core to send aggregated data
app.post('/data', (req, res) => {
  const data = req.body;
  console.log('Received data from Core:', data);

  // Update metrics
  if (data.value !== undefined) {
    metrics.totalReceived++;
    metrics.lastValue = data.value;
    
    // Add to history (keep last 100 points)
    metrics.values.push(data.value);
    metrics.timestamps.push(new Date().toISOString());
    
    if (metrics.values.length > 100) {
      metrics.values.shift();
      metrics.timestamps.shift();
    }

    // Update statistics
    if (metrics.min === null || data.value < metrics.min) {
      metrics.min = data.value;
    }
    if (metrics.max === null || data.value > metrics.max) {
      metrics.max = data.value;
    }

    // Calculate average
    const sum = metrics.values.reduce((a, b) => a + b, 0);
    metrics.average = sum / metrics.values.length;

    // Track client source if provided
    if (data.clientId) {
      metrics.clientCounts[data.clientId] = (metrics.clientCounts[data.clientId] || 0) + 1;
    }

    // Emit to all connected clients
    io.emit('data', {
      value: data.value,
      timestamp: new Date().toISOString(),
      metrics: {
        totalReceived: metrics.totalReceived,
        average: metrics.average,
        min: metrics.min,
        max: metrics.max,
        clientCounts: metrics.clientCounts
      }
    });
  }

  res.json({ status: 'ok' });
});

// Endpoint to get current metrics
app.get('/metrics', (req, res) => {
  res.json({
    ...metrics,
    history: {
      values: metrics.values,
      timestamps: metrics.timestamps
    }
  });
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Send current metrics to newly connected client
  socket.emit('metrics', {
    ...metrics,
    history: {
      values: metrics.values,
      timestamps: metrics.timestamps
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Visualizer server running on http://0.0.0.0:${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});

