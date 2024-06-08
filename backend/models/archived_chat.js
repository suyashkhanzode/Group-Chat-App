const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const ArchivedChat = sequelize.define('archived_chat',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
    message :{
        type :Sequelize.STRING,
       
    },
    files :{
        type : Sequelize.STRING
    }
});

module.exports = ArchivedChat;