const express = require("express");
const ContenidoController = require("../controllers/contenidoController");

const router = express.Router();

router.get("/", ContenidoController.listar);
router.get("/:id", ContenidoController.buscarPorId);
router.post("/", ContenidoController.crear);
router.put("/:id", ContenidoController.actualizar);
router.delete("/:id", ContenidoController.desactivar);

module.exports = router;