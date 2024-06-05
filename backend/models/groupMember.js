const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const GroupMember = sequelize.define('group_member',{isAdmin :{
    type : Sequelize.BOOLEAN,
    defaultValue : false
} });

module.exports = GroupMember;