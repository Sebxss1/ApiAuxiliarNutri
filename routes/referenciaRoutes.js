const express = require("express");
const ReferenciaController = require("../controllers/referenciaController");

const router = express.Router();

router.get("/", ReferenciaController.listar);
router.get("/:id", ReferenciaController.buscarPorId);
router.post("/", ReferenciaController.crear);
router.put("/:id", ReferenciaController.actualizar);
router.delete("/:id", ReferenciaController.desactivar);

module.exports = router;