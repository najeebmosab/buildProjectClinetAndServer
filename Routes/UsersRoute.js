const express = require("express");
const router = express.Router();
const {getUsers, getOneUser, addUser, deleteUser, updateUser } = require("../Controllers/UsersController");
// get all users
router.get("/", getUsers);

// get one users
router.get("/:id", getOneUser);

// add users
router.post("/", addUser);

// delete users
router.delete("/:id",deleteUser);

// update users
router.put("/:id", updateUser);

module.exports = router;