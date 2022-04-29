const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');
const userRoutes = require('./routes/register');

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

app.use('/', userRoutes);


//Error handling logic
app.use((err,req,res,next) => {
    const status = err.status || 500;
    res.status(status).json({message: err.message})
});

mongoose
  .connect(MONGODB)
  .then(() => console.log("Connected to DB"))
  .catch((err) => (err) => console.log(err.message));


const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));