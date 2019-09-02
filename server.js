const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Init Middleware
//app.use(bodyParser.json()); //use to be this
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
//require points to the server file that has route
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


//If there is no PORT env set it will default to port 5000
const PORT = process.env.PORT || 5000;

//templet litteral 
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));