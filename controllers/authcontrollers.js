const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const gravtar = require("gravatar");
require("dotenv/config");
const { validationResult } = require("express-validator");

const saltRound = process.env.SALT_ROUND;
const jwt_secret = process.env.JWT_SECRET;

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     type: "OAuth2",
//     user: process.env.MAIL_USER,
//     pass: process.env.MAIL_PASSWORD,
//     clientId: process.env.OAUTH_CLIENTID,
//     clientSecret: process.env.OAUTH_CLIENT_SECRET,
//     refreshToken: process.env.OAUTH_REFRESH_TOKEN,
//   },
// });

exports.postSignup = async (req, res, next) => {
  // let { name, email, password } = req.body;
  try {
    const {
      fullName,
      phoneNumber,
      whatsappNumber,
      email,
      password,
      homeAddress,
      occupation,
      officeAddress,
      NOK,
      prayerRequest,
      gender,
      department
    } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error(errors.array()[0].msg);
      error.statusCode = 401;
      throw error;
    }

    let SALT = await bcrypt.genSalt(+saltRound);
    let hashedPassword = await bcrypt.hash(password, SALT);
    if (!hashedPassword) {
      let error = new Error("Hashing password failed");
      throw error;
    }

    let member = new Member({
      username: email.split("@")[0],
      fullName,
      phoneNumber,
      whatsappNumber,
      email,
      password: hashedPassword,
      homeAddress,
      occupation,
      officeAddress,
      NOK,
      prayerRequest,
      gender,
      profilePicture: "",
      publicID: "",
      roles: ["member"],
      departments:{major: department, otherDepts:[]}
    });
    await member.save();
    // transporter.sendMail(
    //   {
    //     from: "phonebookapp@gmail.com",
    //     to: email,
    //     subject: "Signup successfull",
    //     text: `Hello ${userName}, we are glad to have you here, 
    //   we hope you enjoy this application`,
    //   },
    //   (err) => {
    //     if (err) return console.log(err);
    //     console.log("message sent to email address");
    //   }
    // );
    console.log(member)
    return res.status(201).json({ message: "Account Created Successfully", member });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error(errors.array()[0].msg);
      error.statusCode = 400;
      throw error;
    }
    const member = await Member.findOne({ email: email }).select("-password");
    const token = jwt.sign({ memberId: member._id }, jwt_secret, {
      expiresIn: "24h",
    });
    return res.json({ token, member, message: "Login Successfull..." });
  } catch (err) {
    next(err);
  }
};
