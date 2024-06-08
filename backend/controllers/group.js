const { Sequelize, Transaction } = require('sequelize');
const Group = require('../models/group');
const GroupMember = require('../models/groupMember');
const sequelize = require('../utils/database'); 

exports.addGroup = async (req, res, next) => {
  const name = req.body.name;
  const userId = req.user.id;

  const t = await sequelize.transaction();

  try {
    const group = await Group.create({
      name: name,
      userId: userId
    }, { transaction: t });

    await GroupMember.create({
      userId: userId,
      groupId: group.id,
      isAdmin : true
    }, { transaction: t });

    await t.commit();

    res.status(201).json({ status: true });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.getGroup = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const groupMembers = await GroupMember.findAll({
      where: {
        userId: userId
      }
    });

    const groupIds = groupMembers.map(member => member.groupId);

    const groups = await Group.findAll({
      where: {
        id: groupIds
      }
    });
   debugger;
    res.status(200).json({ result: groups });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
