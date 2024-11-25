const router = require("express").Router();
const userController = require("../controller/userController");
const reservaController = require("../controller/reservaController")

router.post("/usuario/", userController.createUser);
router.delete("/usuario/:id", userController.deleteUser);
router.put("/usuario/", userController.updateUser);
router.get("/usuario/", userController.getAllUsers);
router.post("/usuariologin/", userController.loginUser);

router.post("/reserva/", reservaController.createReserva);
router.delete("/reserva/:id", reservaController.deleteReserva);
router.put("/reserva/", reservaController.updateReserva);
router.get("/reserva", reservaController.getAllReserva);


module.exports = router;