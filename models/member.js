const mongoose = require("mongoose");
const fs = require("fs");
const bcrypt = require('bcrypt');
require('dotenv/config');
const {cloudinary} = require("../utility/cloudinary")

const Schema = mongoose.Schema;

const memberSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    NOK: {
      type: String,
      required: true,
    },
    prayerRequest: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    publicID: {
      type: String,
    },
    roles: {
      type: Array,
      default: ['member']
    },
    departments: {
      major:{type: String, required: true},
      otherDepts: {type: Array}
    }
  },
  { timestamps: true }
);

memberSchema.methods.updateMember = async function (updateObj) {
  const SALT = await bcrypt.genSalt(+process.env.SALT_ROUND)
  const password = await bcrypt.hash(updateObj.password, SALT);
    Object.assign(this, {...updateObj, password, username: updateObj.email.split("@")[0], departments: {major: updateObj.department, otherDepts: []}})
    await this.save();
    const newData = {}
    for(const keys in this._doc) {
      if(keys === "password") continue
      newData[keys] = this[keys]
    }
    return newData
}

memberSchema.methods.updateProfilePix = async function (pictureURL, public_id) {
  this.publicID !== "" && await cloudinary.uploader.destroy(this.publicID, (err, result) => {
    if(err) return false;
  })
  this.profilePicture = pictureURL;
  this.publicID = public_id;
  return this.save()
}

module.exports = mongoose.model("Member", memberSchema);
