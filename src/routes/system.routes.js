const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// API to shutdown the computer
router.post('/shutdown', (req, res) => {
    // Basic security check: verify if it's an admin (optional, depends on frontend logic)
    // For now, let's just execute it as requested.

    // Only execute on Windows
    if (process.platform !== 'win32') {
        return res.json({
            success: false,
            message: "Perintah Shutdown hanya tersedia saat sistem dijalankan secara lokal di PC Windows."
        });
    }

    console.log("Shutdown command received. Tablet will shut down in 10 seconds.");

    // Send response first so the frontend knows it was successful
    res.json({ success: true, message: "Perintah shutdown diterima. Tablet akan mati dalam 10 detik." });

    // Execute shutdown command for Windows
    exec('shutdown /s /t 10', (error, stdout, stderr) => {
        if (error) {
            console.error(`Shutdown Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Shutdown Stderr: ${stderr}`);
            return;
        }
        console.log(`Shutdown Stdout: ${stdout}`);
    });
});

module.exports = router;
