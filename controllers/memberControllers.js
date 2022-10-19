const Member = require("../models/member");
const { cloudinary } = require("../utility/cloudinary");

const { validationResult } = require("express-validator");

exports.getAllMembers = async (req, res, next) => {
  try {
    const members = await Member.find().select("-password");
    res.status(200).json({ members });
  } catch (err) {
    next(err);
  }
};

exports.getSingleMember = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    const member = await Member.findById(memberId).select("-password");
    if (member) res.status(200).json({ member: { ...member._doc } });
  } catch (err) {
    next(err);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    if(req.memberId !== memberId) return res.status(401).json({message: "Can't update another member"})
    if (!req.body.password) return res.status(401).json("Provide a password");
    const member = await Member.findById(memberId);
    const edited = await member.updateMember(req.body);
    edited && res.status(200).json({ message: "Edited successfully", edited });
  } catch (err) {
    next(err);
  }
};

// exports.deleteContact = async (req, res, next) => {
//     try {
//         const contactId = req.params.contactId;
//         const user = await User.findById(req.userId);
//         const newContacts = await user.deleteContact(contactId.toString());
//         if(!newContacts) res.status(400).json("This contact can't be found");
//         if(newContacts) res.status(200).json({message: "contact deleted successfully", newContacts })
//       } catch (err) {
//         next(err);
//       }
// };

exports.updateMemberProfilePix = async (req, res, next) => {
  try {
    const memberId = req.params.memberId;
    const image = req.body.image;
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      upload_preset: "church_media",
    });
    const member = await Member.findById(memberId);
    const result = await member.updateProfilePix(uploadedResponse.secure_url, uploadedResponse.public_id);
    result &&
      res.status(201).json({ message: "Profile picture updated successfully", img: uploadedResponse.secure_url });
  } catch (err) {
    next(err);
  }
};
