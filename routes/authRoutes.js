const express = require("express");
const { body } = require("express-validator");
const bcrypt = require('bcrypt')

const Member = require("../models/member");
const authController = require("../controllers/authcontrollers");

const router = express.Router();

router.put(
  "/signup",
  [
    body("fullName", "Name must not be empty!").not().isEmpty(),
    body("phoneNumber")
      .isMobilePhone()
      .withMessage("Must be a mobile number"),
      body("whatsappNumber")
      .isMobilePhone()
      .withMessage("Must be a mobile number"),
    body("email", "Invalid email address")
      .normalizeEmail()
      .isEmail()
      .notEmpty()
      .custom(async (value, { req }) => {
        const existingUser = await Member.findOne({ email: value });
        if (existingUser) {
          let error = new Error(
            "This email address already exists."
          );
          error.statusCode = 400;
          throw error;
        }
        if(value === "") {
          let error = new Error("Email address must be provided");
          error.statusCode = 400;
          throw error;
        }
        return true
      }),
      body("password", "Password must be at least 8 characters").not().isEmpty()
      .isLength({ min: 8 })
      .custom(async (value, { req }) => {
        if(value === "") throw new Error("password must not be empty!");
        return true
      }),
      body("confirmPassword", "Password must be at least 8 characters")
      .custom(async (value, { req }) => {
        if(value !== req.body.password) throw new Error("passwords must be equal!");
        return true
      }),
      body("homeAddress", "Address is required").not().isEmpty(),
      body("occupation", "Occupation is required").not().isEmpty(),
      body("officeAddress", "Office address is required").not().isEmpty(),
      body("NOK", "Next of Kin is required").not().isEmpty(),
      body("prayerRequest", "Please put a prayer request").not().isEmpty(),
      body("gender", "Gender field is required").not().isEmpty(),
      body("department", "Please choose a department").not().isEmpty(),
  ],
  authController.postSignup
);

router.post("/login", [
  body("email")
  .custom(async (value, { req }) => {
    const user = await Member.findOne({email: value});
    if ( !user ) {
      let error = new Error("No member with this email was found!")
      error.statusCode = 400;
      throw error
    }
    return true
  }),
  body("password")
  .custom(async (value, { req }) => {
    const member = await Member.findOne({email: req.body.email});
    const doMatch = await bcrypt.compare(value, member.password);
    if(!doMatch) throw new Error("Incorrect password!")
    return true
  }),
], authController.postLogin);

// router.post('/login', authController.returnToken)

module.exports = router;