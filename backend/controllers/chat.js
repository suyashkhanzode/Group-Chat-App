const Chat = require("../models/chat");
const User = require("../models/user");

exports.addChat = (req, res, next) => {
  debugger;
  const message = req.body.message;
  const userId = req.user.id;
  Chat.create({
    message: message,
    userId: userId,
  })
    .then((result) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      res.status(500).json({ status: false });
    });
};

exports.getChats = (req, res, next) => {
  Chat.findAll({
    include: {
      model: User,

      attributes: ["name"],
    },
  })
    .then((result) => [res.status(200).json({ chats: result })])
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
