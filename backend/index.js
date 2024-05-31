const express = require("express");

require("dotenv").config();

const db = require("./utils/database");

const app = express();

const User = require('./models/user');

const userRoute = require('./routes/user');

app.use('/user',userRoute);


const PORT = process.env.PORT | 3000;


db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started At ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
