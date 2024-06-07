const Group = require("../models/group");
const GroupMember = require("../models/groupMember");
const User = require("../models/user");
const sequelize = require("../utils/database");

exports.addMember = async (req, res, next) => {
   const email = req.body.email;
   const groupId = req.params.groupId;
   const t = await sequelize.transaction();
 
   try {
     const user = await User.findOne({ where: { email: email } });
 
     if (!user) {
       t.commit();
       return res.status(400).json({ message: "User with given email not found" });
     }
 
     const isMember = await GroupMember.findOne({
       where: { userId: user.id, groupId: groupId },
     });
 
     if (isMember) {
       t.commit();
       return res
         .status(400) 
         .json({ message: "User with given email already member of group" });
     }
 
     
     await GroupMember.create(
       { userId: user.id, groupId: groupId },
       { transaction: t }
     );
 
     t.commit();
     res.status(201).json({ message: "Member added Successfully" }); // 201 for created
   } catch (error) {
     await t.rollback();
     res.status(500).json({ message: "Something went wrong" });
   }
 };

exports.removeUser = async (req, res, next) => {
  const email = req.body.email;
  const groupId = req.params.groupId;
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      t.commit();
      return res.status(400).json({ message: "User with given email not found" });
    }

   

    const isMember = await GroupMember.findOne({
      where: { userId: user.id, groupId: groupId },
    });

    
    if (!isMember) {
      t.commit();
     return   res
        .status(400)
        .json({ message: "User with given email not member of group" });
    }
    
    await isMember.destroy({ transaction: t });
    t.commit();
    res.status(200).json({ message: "Deleted Succefully" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.promoteAdmin = async (req, res, next) => {
  const email = req.body.email;
  const groupId = req.params.groupId;
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      t.commit();
      return res.status(400).json({ message: "User with given email not found" });
    }

    const isMember = await GroupMember.findOne({
      where: { userId: user.id, groupId: groupId },
    });
    if (!isMember) {
      t.commit();
      return res
        .status(400)
        .json({ message: "User with given email not member of group" });
    }

    await isMember.update({ isAdmin: true }, { where: { userId: user.id } });
    t.commit();
    res.status(200).json({ message: "Promoted To Admin" });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.isAdmin = async (req,res,next) =>{
     const  userId = req.user.id;
     const groupId = req.params.groupId;

     try {
      const member = await GroupMember.findOne({
         where: { userId: userId, groupId: groupId },
       });
       if(!member)
       {
          return res.status(200).json({isAdmin : false}) 
       }
       return res.status(200).json({isAdmin : member.isAdmin}) 
     } catch (error) {
       
      res.status(500).json({ message: "Something went wrong" });
     }
     

    
}
