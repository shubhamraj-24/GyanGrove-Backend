const mongoose = require('mongoose');
const axios = require('axios');
const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});
const db = mongoose.connection;

const eventSchema = new mongoose.Schema({
    event_name: String,
    city_name: String,
    date: Date,
    time: String,
    latitude: Number,
    longitude: Number
});

const Event = mongoose.model('Event', eventSchema);

async function ingestData() {
    try {
       
        // Read CSV file
        const csvFilePath = path.join(__dirname, 'dataset.csv'); // Path to your CSV file
        const csvData = fs.readFileSync(csvFilePath, 'utf-8');

        // Parse CSV data
        const parsedData = Papa.parse(csvData, { header: true }).data;

        // Insert parsed data into MongoDB
        await Event.insertMany(parsedData);
        console.log('Data ingestion completed successfully.');
    } catch (error) {
        console.error('Error ingesting data:', error.message);
    } finally {
        db.close();
    }
}

ingestData();
