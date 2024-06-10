const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./utils/database");
const path = require("path");
const app = express();

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

app.use(express.json());

const corsOptions = {
  origin: "http://localhost",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "./frontend")));





// Import models
const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const group_member = require("./models/groupMember");
const ArchivedChat = require('./models/archived_chat')

// Define associations
User.hasMany(Chat, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Chat.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

Group.hasMany(Chat, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Chat.belongsTo(Group, { onDelete: "CASCADE", onUpdate: "CASCADE" });

User.hasMany(Group, { onDelete: "CASCADE", onUpdate: "CASCADE" });
Group.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

User.belongsToMany(Group, {
  through: group_member,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Group.belongsToMany(User, {
  through: group_member,
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat")(io);
const groupRoute = require("./routes/group");
const adminRoute = require("./routes/admin");
const fileRoute = require("./routes/file");

app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/group", groupRoute);
app.use("/admin", adminRoute);
app.use("/file", fileRoute);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend", "index.html"));
});

const PORT = process.env.PORT || 3000;

db.sync()
  .then(() => {
    http.listen(PORT, () => {
      console.log(`Server Started At ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
