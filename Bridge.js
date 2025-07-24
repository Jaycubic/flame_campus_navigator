const WebSocket = require('ws');
const HID = require('node-hid');

// Configuration
const SERVER_URL = 'wss://studenttracking.in:5173';
const HUION_VID = 0x256C; // Huion Vendor ID (replace with your tablet's VID)
const HUION_PID = 0x006E; // Huion Product ID (replace with your tablet's PID, e.g., H420)

// Connect to WebSocket server
const ws = new WebSocket(SERVER_URL);

// Initialize HID device
let device;
try {
  device = new HID.HID(HUION_VID, HUION_PID);
  console.log('Huion tablet connected');
} catch (err) {
  console.error('Error connecting to Huion tablet:', err);
  process.exit(1);
}

ws.on('open', () => {
  console.log('Connected to server');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err);
});

// Capture tablet input
device.on('data', (data) => {
  // Example: Parse X, Y coordinates and pressure (adjust based on your tablet's data format)
  const x = data.readUInt16LE(2); // Example offset for X coordinate
  const y = data.readUInt16LE(4); // Example offset for Y coordinate
  const pressure = data.readUInt16LE(6); // Example offset for pressure
  const signatureData = { x, y, pressure, timestamp: Date.now() };

  // Send data to server if connected
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'signature',
      sessionId: 'unique-session-id', // Replace with dynamic session ID
      data: signatureData
    }));
  }
});

device.on('error', (err) => {
  console.error('HID error:', err);
});

// Handle WebSocket messages (e.g., session initialization)
ws.on('message', (message) => {
  const msg = JSON.parse(message);
  if (msg.type === 'init-session') {
    // Store session ID or other initialization data
    console.log('Session initialized:', msg.sessionId);
  }
});

// Cleanup on exit
process.on('SIGINT', () => {
  device.close();
  ws.close();
  process.exit();
});