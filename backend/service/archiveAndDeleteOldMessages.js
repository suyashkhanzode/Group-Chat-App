const Sequelize = require('sequelize');
const Chat = require('../models/chat');
const ArchivedChat = require('../models/archived_chat');
const sequelize = require('../utils/database');


async function archiveAndDeleteMessages() {
    try {

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 1); 

        
        const messagesToArchive = await Chat.findAll({
            where: {
                createdAt: {
                    [Sequelize.Op.lt]: cutoffDate,
                },
            },
        });

       
        await sequelize.transaction(async (t) => {
            
            await ArchivedChat.bulkCreate(messagesToArchive.map((msg) => ({
                message: msg.message,
                files: msg.files,
                createdAt: msg.createdAt,
                updatedAt: msg.updatedAt,
            })), { transaction: t });

          
            await Chat.destroy({
                where: {
                    createdAt: {
                        [Sequelize.Op.lt]: cutoffDate,
                    },
                },
                transaction: t,
            });
        });

        console.log(`Successfully archived and deleted messages older than ${cutoffDate}`);
    } catch (error) {
        console.error('Error archiving and deleting messages:', error);
    } finally {
       
        await sequelize.close();
    }
}

archiveAndDeleteMessages();
