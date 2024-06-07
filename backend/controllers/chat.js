const { verifyToken } = require("../middleware/auth");
const Chat = require("../models/chat");
const User = require("../models/user");
const { Op } = require('sequelize');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinGroup', (groupId) => {
      socket.join(groupId);
      console.log(`User joined group: ${groupId}`);
    });

    socket.on('sendMessage', async ({ groupId, message }) => {
      try {
        
        const user = await verifyToken(socket.handshake.auth.Authorization)
       
        const newMessage = await Chat.create({
          message: message,
          userId: user.id,
          groupId: groupId
        });

        const fullMessage = await Chat.findOne({
          where: { id: newMessage.id },
          include: {
            model: User,
            attributes: ['name']
          }
        });
        

        io.to(groupId).emit('newMessage', {
          id: fullMessage.id,
          user: { id: fullMessage.user.id, name: fullMessage.user.name },
          message: fullMessage.message,
          timestamp: fullMessage.createdAt
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on('getMessage', async ({ groupId }) => {
      try {
        
        const messages = await Chat.findAll({
          where: { groupId },
          include: { model: User, attributes: ['name'] },
          order: [['createdAt', 'ASC']]
        });
        socket.emit('receiveNewMessages', messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return {
    addChat: async (req, res, next) => {
      try {
        const message = req.body.message;
        const userId = req.user.id;
        const groupId = req.params.groupId;
        await Chat.create({ message, userId, groupId });
        res.status(201).json({ status: true });
      } catch (error) {
        res.status(500).json({ status: false, error: error.message });
      }
    },

    getChats: async (req, res, next) => {
      try {
        const lastMessageId = req.query.lastMessageId;
        const groupId = req.params.groupId;
        let whereCondition = { groupId };

        if (lastMessageId) {
          whereCondition.id = { [Op.gt]: lastMessageId };
        }

        const chats = await Chat.findAll({
          where: whereCondition,
          include: { model: User, attributes: ["name"] },
          order: [['createdAt', 'ASC']]
        });
        res.status(200).json({ chats });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  };
};
