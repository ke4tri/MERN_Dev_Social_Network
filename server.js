const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//If there is no PORT env set it will default to port 5000
const PORT = process.env.PORT || 5000;

//templet litteral 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));