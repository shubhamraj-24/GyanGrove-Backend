# Event Management API

## Overview

This is a RESTful API built with Express.js and MongoDB for managing events. It provides endpoints for creating events, searching for events based on location and date, and retrieving weather information and distance for each event.

Hosted on vercel, sample event finder request : https://gyan-grove-backend.vercel.app/events/find?latitude=40.7128&longitude=-74.0060&date=2024-03-14&page=1

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
 ```json
   git clone https://github.com/shubhamraj-24/GyanGrove-Backend.git
```
2. Run `npm install` to install the required dependencies.
3. Create a `.env` file and add the necessary environment variables, such as the MongoDB connection URL and the port number.
4. Run the application using `npm start`.

## API Endpoints

### 1. Root Directory

- **GET /**
  - **Description**: Returns a welcome message indicating that the server is running.
  - **Request**:
    - **Method**: GET
    - **Endpoint**: /
  - **Response**:
    - **Status Code**: 201 (Created)
    - **Body**:
      ```json
      {
        "message": "Welcome to Root Directory"
      }
      ```

### 2. Data Creation API Endpoint

- **POST /events/add**
  - **Description**: Creates a new event with the provided details.
  - **Request**:
    - **Method**: POST
    - **Endpoint**: /events/add
    - **Body**:
      ```json
      {
        "event_name": "Event Name",
        "city_name": "City Name",
        "date": "YYYY-MM-DD",
        "time": "HH:MM",
        "latitude": 0.0,
        "longitude": 0.0
      }
      ```
  - **Response**:
    - **Success**:
      - **Status Code**: 201 (Created)
      - **Body**:
        ```json
        {
          "message": "Event added successfully",
          "event": {
            "_id": "event_id",
            "event_name": "Event Name",
            "city_name": "City Name",
            "date": "YYYY-MM-DD",
            "time": "HH:MM",
            "latitude": 0.0,
            "longitude": 0.0,
            "__v": 0
          }
        }
        ```
    - **Error**:
      - **Status Code**: 400 (Bad Request) or 500 (Internal Server Error)
      - **Body**:
        ```json
        {
          "error": "Please enter all the required details"
        }
        ```

### 3. Data Finder API Endpoint

- **GET /events/find**
  - **Description**: Finds events based on latitude, longitude, and date.
  - **Request**:
    - **Method**: GET
    - **Endpoint**: /events/find
    - **Query Parameters**:
      - latitude: Latitude of the location (required)
      - longitude: Longitude of the location (required)
      - date: Date to search events (required, format: YYYY-MM-DD)
      - page: Page number for pagination (optional)
  - **Response**:
    - **Success**:
      - **Status Code**: 200 (OK)
      - **Body**:
        ```json
        {
          "events": [
            {
              "event_name": "Event Name",
              "city_name": "City Name",
              "date": "YYYY-MM-DD",
              "weather": "Weather Information",
              "distance_km": Distance in Kilometers
            },
            ...
          ],
          "page": Current Page Number,
          "pageSize": Page Size,
          "totalEvents": Total Number of Events,
          "totalPages": Total Number of Pages
        }
        ```
    - **Error**:
      - **Status Code**: 400 (Bad Request), 404 (Not Found), or 500 (Internal Server Error)
      - **Body**:
        ```json
        {
          "error": "Error message"
        }
        ```

## Contributing<br>
 Contributions are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
