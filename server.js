const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');

const app = express();
dotenv.config();

app.use(cors());

mongoose
  .connect(MONGODB)
  .then(() => console.log("Connected to DB"))
  .catch((err) => (err) => console.log(err.message));


const PORT = process.env.PORT || 3300;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));