const express = require("express");

const cors = require('cors');

require("dotenv").config();

const db = require("./utils/database");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://127.0.0.1:5500', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// app.use((request, response, next)=>{
//    response.setHeader('Access-Control-Allow-Origin',"*");
//    response.setHeader('Access-Control-Allow-Headers',
//    "*");
//    response.setHeader('Access-Control-Allow-Methods',"*")

//    next();
// });

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
