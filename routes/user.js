const express = require("express");
const { requireSignin, userById } = require("../middleware/auth");
const { allUser, getUser, updateUser, deleteUser, userPhoto } = require("../controllers/user");

const router = express.Router();

router.get("/users", allUser);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, updateUser);
router.delete("/user/:userId", requireSignin, deleteUser);
router.get("/user/photo/:userId", userPhoto);

router.param("userId", userById);

module.exports = router;
