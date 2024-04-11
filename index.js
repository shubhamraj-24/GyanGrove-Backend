const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors=require('cors');
corsConfig={
    origin:"*",
    credential:true,
    methods:["GET","POST","PUT","DELETE"]
};


require('dotenv').config();

const app = express();
app.options("",cors(corsConfig));
app.use(cors(corsConfig));
app.use(bodyParser.json());

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

// Data Creation API Endpoint
app.post('/events/add', async (req, res) => {
    try {
        const { event_name, city_name, date, time, latitude, longitude } = req.body;

        // Check if any required field is empty
        if (!event_name || !city_name || !date || !time || !latitude || !longitude) {
            return res.status(400).json({ error: 'Please enter all the required details' });
        }

        const event = new Event(req.body);
        await event.save();
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Data Finder API Endpoint to find events based on latitude, longitude, and date
app.get('/events/find', async (req, res) => {
    try {
        const { latitude, longitude, date } = req.query;

        if (!latitude || !longitude || !date) {
            return res.status(400).json({ error: 'Please enter all the necessary params. ' });
        }

        const endDate = new Date(date);
        endDate.setDate(endDate.getDate() + 14);

        const events = await Event.find({
            date: { $gte: new Date(date), $lte: endDate }
        });

        if (events.length === 0) {
            return res.status(404).json({ error: 'No events found for the provided criteria' });
        }

        const eventDetails = await Promise.all(events.map(async event => {
            try {
                const [weather, distance] = await Promise.all([
                    getWeather(event.city_name, event.date),
                    getDistance(latitude, longitude, event.latitude, event.longitude)
                ]);
                return {
                    event_name: event.event_name,
                    city_name: event.city_name,
                    date: event.date.toISOString().split('T')[0],
                    weather,
                    distance_km: distance
                };
            } catch (error) {
                console.error('Error processing event details:', error.message);
                // Return default values or handle error based on requirements
                return {
                    event_name: event.event_name,
                    city_name: event.city_name,
                    date: event.date.toISOString().split('T')[0],
                    weather: 'Unknown',
                    distance_km: -1
                };
            }
        }));

        eventDetails.sort((a, b) => new Date(a.date) - new Date(b.date));

        const page = req.query.page ? parseInt(req.query.page) : 1;
        const pageSize = 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = page * pageSize;
        const paginatedEvents = eventDetails.slice(startIndex, endIndex);

        res.status(200).json({
            events: paginatedEvents,
            page,
            pageSize,
            totalEvents: eventDetails.length,
            totalPages: Math.ceil(eventDetails.length / pageSize)
        });
    } catch (error) {
        console.error('Error finding events:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Function to retrieve weather information from the Weather API
async function getWeather(cityName, date) {
    try {
        const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Weather?code=KfQnTWHJbg1giyB_Q9Ih3Xu3L9QOBDTuU5zwqVikZepCAzFut3rqsg==&city=${cityName}&date=${date.toISOString().split('T')[0]}`);
        return response.data.weather;
    } catch (error) {
        console.error('Error getting weather:', error.message);
        return 'Unknown'; // Return 'Unknown' if weather data is not available
    }
}

// Function to calculate distance between two coordinates using the Distance Calculation API
async function getDistance(latitude1, longitude1, latitude2, longitude2) {
    try {
        const response = await axios.get(`https://gg-backend-assignment.azurewebsites.net/api/Distance?code=IAKvV2EvJa6Z6dEIUqqd7yGAu7IZ8gaH-a0QO6btjRc1AzFu8Y3IcQ==&latitude1=${latitude1}&longitude1=${longitude1}&latitude2=${latitude2}&longitude2=${longitude2}`);
        return response.data.distance;
    } catch (error) {
        console.error('Error calculating distance:', error.message);
        return -1; // Return -1 if distance calculation fails
    }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
