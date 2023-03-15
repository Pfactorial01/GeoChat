const router = require('express').Router();
const { register, login, setAvatar, getAllUsers, logOut } = require("../controllers/userController")

router.post("/register", register)
router.post("/login", login)
router.post("/setAvatar/:userId", setAvatar)
router.get("/allusers/:userId", getAllUsers)
router.get("/logout/:id", logOut);

module.exports = router;