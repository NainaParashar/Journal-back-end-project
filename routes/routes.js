const express= require('express');

const usersControllers = require("../controllers/usersController");
const journalsControllers = require("../controllers/journalsController");
const publishControllers = require("../controllers/publishController");
const feedControllers = require("../controllers/feedController");
const auth = require("../middleware/auth");

const router = express.Router()

router.get("/users",usersControllers.userController.getAll)
router.post("/users",usersControllers.userController.create)
router.delete("/users/:id",usersControllers.userController.delete)
router.post("/users/login",usersControllers.loginController.login)


router.get("/journals",auth,journalsControllers.journalController.getAll)
router.get("/journals/relations",auth,journalsControllers.journalController.getAllJournalRealations)
router.post("/journals",auth,journalsControllers.journalController.create)
router.delete("/journals/:id",auth,journalsControllers.journalController.delete)
router.put("/journals/:id",auth,journalsControllers.journalController.update)

router.get("/publish/",auth,publishControllers.publishController.getAll)
router.post("/publish/:id",auth,publishControllers.publishController.publish)
router.delete("/publish/:id",auth,publishControllers.publishController.delete)

router.get("/feed/",auth,feedControllers.feedController.getAll)

module.exports = router;