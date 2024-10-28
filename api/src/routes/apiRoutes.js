const router = require("express").Router();
const userController = require("../controller/userController");

router.post("/usuario/", userController.createUser);
router.delete("/usuario/:id", userController.deleteUser);
router.put("/usuario/", userController.updateUser);
router.get("/usuario/", userController.getAllUsers);
router.post("/usuariologin/", userController.loginUser);

module.exports = router;