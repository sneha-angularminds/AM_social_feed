const express = require('express');
const dotenv = require('dotenv');
// const path = require('path')
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { MONGODB } = require('./config');
const userRoutes = require('./routes/register');
const postRoutes = require('./routes/posts');
// const auth = require('./middleware/auth')

const app = express();
dotenv.config();

app.use(cors());
// app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads'));
app.use('/posts', express.static('posts'));
app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/post', postRoutes);

//Error handling logic
app.use((err,req,res,next) => {
    const status = err.status || 500;
    res.status(status).json({message: err.message})
});

mongoose
  .connect(MONGODB)
  .then(() => console.log("Connected to DB"))
  .catch((err) => (err) => console.log(err.message));


const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));