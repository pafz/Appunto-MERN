const express = require("express");
const DoubtController = require("../controllers/DoubtController");
const { authentication, isTeacher, isStudent } = require("../middleware/authentication");

const router = express.Router();

router.post("/", authentication, DoubtController.createDoubt);

router.put("/doubts", authentication, isTeacher, DoubtController.updateDoubt);
router.put("/id/:_id", authentication, isTeacher, DoubtController.updateDoubtById);
router.put("/update/:topic", authentication, isTeacher, DoubtController.updateDoubtByTopic);
router.put("/resolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsResolved);
router.put("/unresolved/:doubtId", authentication, isStudent, DoubtController.markDoubtAsUnresolved);

router.get("/page/doubts", authentication, isTeacher, DoubtController.getAllDoubtsPagination);
router.get("/all/all", authentication, isTeacher, DoubtController.getEverything);

router.delete("/doubts/:doubtId", authentication, DoubtController.deleteDoubt);

module.exports = router;
