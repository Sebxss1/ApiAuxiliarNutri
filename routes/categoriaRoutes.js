const express = require("express");
const CategoriaController = require("../controllers/categoriaController");

const router = express.Router();

router.get("/", CategoriaController.listar);
router.get("/:id", CategoriaController.buscarPorId);
router.post("/", CategoriaController.crear);
router.put("/:id", CategoriaController.actualizar);
router.delete("/:id", CategoriaController.desactivar);

module.exports = router;