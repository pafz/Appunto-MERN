const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { authentication, isTeacher } = require("../middleware/authentication");
const upload = require("../middleware/upload");

router.post("/", UserController.register);
router.post("/avatar", authentication, upload.single("image"), UserController.addAvatar);
router.post("/login", UserController.login);
router.get("/id/:_id", authentication, UserController.findUser);
router.get("/name/:name", authentication, UserController.getUserByName);
router.put("/id/:_id", isTeacher, UserController.addPoints);
router.get("/", authentication, UserController.userAndDoubts);
router.get("/confirm", UserController.userConfirm);

router.delete("/logout", authentication, UserController.logout);

module.exports = router;
