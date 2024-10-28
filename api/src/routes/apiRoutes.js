const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/user/", userController.createUser);
router.delete("/user/:id", userController.deleteUser);
router.put("/user", userController.updateUser);
router.get("/user/", userController.getAllUsers);
router.post("/userlogin/", userController.loginUser);

module.exports = router;