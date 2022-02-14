"use strict";
/**
 * =======================
 * App Dependencies
 * =======================
 */
const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const mongoose = require("mongoose");


/**
 * =======================
 * Env Variables
 * =======================
 */
const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL;
/**
 * =======================
 * Express App Middleware
 * - Middleware are requests checkpoints
 * - These checkpoints handel request operations such as:
 *  - enable cors in the request header
 *  - Decoding the json body request for post request
 * =======================
 */
app.use(express.json()); // it will decode the post body request data
app.use(cors());
/**
 * =======================
 * Require Controllers
 * =======================
 */
const { getAllVisitors, cache, getVisitors } = require('./Controller/visit.controller')
const { getAllUsers } = require('./Controller/user.controller')
const { getAllClients } = require('./Controller/client.controller')

/**
 * =======================
 * Connect to Mongo DB
 * =======================
 */
mongoose.connect(`${MONGO_DB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Connected to database ");
    })
    .catch((err) => {
        console.error(`Error connecting to the database. \n${err}`);
    });

/**
* =======================
* End Point
* =======================
*/

app.get("/", (req, res) => res.send("<h1> Welcome to our server 😊<h1>")); // Proof Of Life Route
app.get("/getAllVisitors", getAllVisitors);
app.get("/less-visited-clients-per-day", cache, getVisitors);
app.get("/getAllClients", getAllClients);
app.get("/getAllUsers", getAllUsers);

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
