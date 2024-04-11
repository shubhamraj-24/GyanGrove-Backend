# Event Management API

## Overview

This is a RESTful API built with Express.js and MongoDB for managing events. It provides endpoints for creating events, searching for events based on location and date, and retrieving weather information and distance for each event.

## Tech Stack

- **Express.js**: Minimal and flexible Node.js web application framework
- **MongoDB**: NoSQL database for storing event data
- **Mongoose**: MongoDB object modeling for Node.js
- **Axios**: Promise-based HTTP client for making requests to external APIs
- **dotenv**: Module for loading environment variables from a `.env` file

## Setup

### Prerequisites

- Node.js installed on your machine
- MongoDB instance running locally or accessible via a connection URL

### Installation

1. Clone the repository from the GitHub link.<br>
   git clone https://github.com/shubhamraj-24/GyanGrove-Backend/tree/1a67e460dc72fb2166e4b2497fdc90e19e5b374b
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file and add the necessary environment variables, such as the MongoDB connection URL and the port number.
4. Run the application using `npm start`.

### API Endpoints
- `GET /`: Returns a welcome message indicating that the server is running.
- `POST /events/add`: Creates a new event with the provided details. Requires the following parameters in the request body: event_name, city_name, date, time, latitude, longitude.
- `GET /events/find`: Finds events based on latitude, longitude, and date. Requires the following query parameters: latitude, longitude, date. Optionally, you can specify the page parameter for pagination.
