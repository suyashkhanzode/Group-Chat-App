const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Chat = sequelize.define('chat',{
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

module.exports = Chat;