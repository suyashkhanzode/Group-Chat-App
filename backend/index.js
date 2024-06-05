const express = require("express");
const cors = require('cors');
require("dotenv").config();
const db = require("./utils/database");

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Import models
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const group_member = require('./models/groupMember');

// Define associations
User.hasMany(Chat, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Chat.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });

Group.hasMany(Chat, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Chat.belongsTo(Group, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.hasMany(Group, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Group.belongsTo(User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' });

User.belongsToMany(Group, { through: group_member, onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Group.belongsToMany(User, { through: group_member, onDelete: 'CASCADE', onUpdate: 'CASCADE' });


const userRoute = require('./routes/user');
const chatRoute = require('./routes/chat');
const groupRoute = require('./routes/group');
const adminRoute = require('./routes/admin');


app.use('/user', userRoute);
app.use('/chat', chatRoute);
app.use('/group', groupRoute);
app.use('/admin',adminRoute);

const PORT = process.env.PORT || 3000;

db.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started At ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
