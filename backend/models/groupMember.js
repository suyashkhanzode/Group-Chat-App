const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const GroupMember = sequelize.define('group_member',{});

module.exports = GroupMember;