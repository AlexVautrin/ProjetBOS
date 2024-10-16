require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const DB_USERNAME = encodeURIComponent(process.env.DB_USERNAME);
const DB_PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);
const DB_CLUSTER = process.env.DB_CLUSTER;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


//Connect to MongoDB ESEO building
mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}.mongodb.net`)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//Connect to MongoDB local

