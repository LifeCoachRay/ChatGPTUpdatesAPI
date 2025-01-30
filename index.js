const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// In-memory storage for tracking updates
let knownUpdates = [];

// Function to fetch updates from ChatGPT's API or a relevant source
const fetchUpdates = async () => {
    try {
        // Replace this URL with an actual source (OpenAI docs, GitHub, etc.)
        const response = await axios.get('https://api.example.com/chatgpt/updates'); 
        
        if (response.data && Array.isArray(response.data.updates)) {
            return response.data.updates;
        } else {
            console.warn("Unexpected API response format");
            return [];
        }
    } catch (error) {
        console.error('Error fetching updates:', error.message);
        return [];
    }
};

// Function to monitor and detect new updates
const monitorUpdates = async () => {
    const updates = await fetchUpdates();

    updates.forEach(update => {
        const isNewUpdate = !knownUpdates.some(u => u.version === update.version);

        if (isNewUpdate) {
            knownUpdates.push(update);
            sendAlert(update); // Notify the user of the new update
        }
    });
};

// Alerting logic (Email, SMS, Webhook, etc.)
const sendAlert = (update) => {
    console.log(`🚨 New ChatGPT Update Detected: Version ${update.version}`);
    console.log(`📌 Features: ${update.features ? update.features.join(', ') : "No details provided."}`);
    
    // Add Email, Webhook, or Push Notification logic here.
};

// Start monitoring every 10 minutes (adjust interval as needed)
setInterval(monitorUpdates, 10 * 60 * 1000);

// API Endpoint to get all tracked updates
app.get('/api/chatgpt/updates', (req, res) => {
    res.json({ updates: knownUpdates });
});

// API Endpoint to force check for updates
app.get('/api/chatgpt/check', async (req, res) => {
    await monitorUpdates();
    res.json({ message: "Manual update check completed", knownUpdates });
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 ChatGPT Update Monitor API is running on http://localhost:${port}`);
});