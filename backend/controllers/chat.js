const Chat = require("../models/chat");
const User = require("../models/user");
const { Op } = require('sequelize');

exports.addChat = (req, res, next) => {
  debugger;
  const message = req.body.message;
  const userId = req.user.id;
  const groupId = req.params.groupId;
  Chat.create({
    message: message,
    userId: userId,
    groupId : groupId
  })
    .then((result) => {
      res.status(201).json({ status: true });
    })
    .catch((err) => {
      res.status(500).json({ status: false });
    });
};


exports.getChats = (req, res, next) => {

  const lastMessageId = req.query.lastMessageId;
  const groupId = req.params.groupId;
  let whereCondition = { groupId };

  if (lastMessageId) {
    whereCondition.id = {
      [Op.gt]: lastMessageId
    };
  }

  Chat.findAll({
    where: whereCondition,
    include: {
      model: User,
      attributes: ["name"],
    },
    order: [['createdAt', 'ASC']]
  })
    .then((result) => {
      res.status(200).json({ chats: result });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
};

  
