const express = require("express");
const { body } = require("express-validator");
const multer = require("multer");
const path = require("path");

const member = require("../models/member");
const isAuth = require("../Middlewares/auth");
const memberControllers = require("../controllers/memberControllers");

const router = express.Router();

router.post(
  "/profilePixUpload/:memberId",
  isAuth,
  memberControllers.updateMemberProfilePix
);

router.get("/getallmembers", isAuth, memberControllers.getAllMembers);

router.get(
  "/getsinglemember/:memberId",
  isAuth,
  memberControllers.getSingleMember
);

router.patch(
  "/updatemember/:memberId",
  isAuth,
  memberControllers.updateMember
);

// router.delete(
//   "/deletecontact/:contactId",
//   isAuth,
//   memberControllers.deleteContact
// );

// router.delete("/deleteallcontacts/", isAuth, memberControllers.deleteAllContacts);

// router.delete("/logout", memberControllers.logout)

module.exports = router;
