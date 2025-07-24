// list-hid.js
const HID = require('node-hid');

// HID.devices() returns an array of all connected HID devices.
// We filter for anything whose manufacturer or product contains “HUION”
const devices = HID.devices().filter(d =>
  (d.manufacturer || '').toLowerCase().includes('huion')
  || (d.product || '').toLowerCase().includes('huion')
);

if (devices.length === 0) {
  console.log('No Huion devices found. Here are all HID devices:\n', HID.devices());
} else {
  console.log('Found Huion devices:\n', devices);
}
