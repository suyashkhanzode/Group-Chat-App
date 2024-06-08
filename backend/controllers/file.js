const AWS = require('aws-sdk');
const Chat = require("../models/chat");

const uploadFile = async (data, fileName) => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: 'public-read',
    };

    s3.upload(params, (err, s3Response) => {
      if (err) {
        reject(err);
      } else {
        resolve(s3Response.Location);
      }
    });
  });
};

exports.setURL = async (req, res, next) => {
  try {
    const files = req.files;
    const fileUrls = [];

    for (const file of files) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const fileUrl = await uploadFile(file.buffer, fileName);
      fileUrls.push(fileUrl);
    }

    // Assuming you have a groupId and userId from the request to associate with the chat message
    const groupId = req.params.groupId;
    const userId = req.user.id;

    // Save the message and files to the database
    const chat = await Chat.create({
      message: '', // If message is optional
      files: JSON.stringify(fileUrls),
      groupId: groupId,
      userId: userId,
    });

    res.status(200).json({ chat });
  } catch (error) {
    console.error('Error in setURL:', error);
    res.status(500).json({ error: error.message });
  }
};
