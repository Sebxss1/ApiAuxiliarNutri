const CategoriaModel = require("../models/categoriaModel");

function convertirId(valor) {
  const id = Number(valor);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

function validarCategoria(body) {
  if (!body || typeof body.nombre !== "string") {
    return "El campo nombre es obligatorio y debe ser texto.";
  }

  const nombre = body.nombre.trim();

  if (nombre.length === 0 || nombre.length > 100) {
    return "El nombre debe tener entre 1 y 100 caracteres.";
  }

  if (
    body.descripcion !== undefined &&
    body.descripcion !== null &&
    typeof body.descripcion !== "string"
  ) {
    return "La descripción debe ser texto o null.";
  }

  if (typeof body.descripcion === "string" && body.descripcion.length > 500) {
    return "La descripción no puede superar los 500 caracteres.";
  }

  return null;
}

function obtenerDatos(body) {
  return {
    nombre: body.nombre.trim(),
    descripcion:
      typeof body.descripcion === "string" && body.descripcion.trim() !== ""
        ? body.descripcion.trim()
        : null,
  };
}

function responderErrorBaseDatos(res, error) {
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      mensaje: "Ya existe una categoría con ese nombre.",
    });
  }

  console.error("Error de base de datos:", error.message);

  return res.status(500).json({
    mensaje: "Ocurrió un error al consultar la base de datos.",
  });
}

const CategoriaController = {
  listar(req, res) {
    CategoriaModel.listar((error, resultados) => {
      if (error) return responderErrorBaseDatos(res, error);

      res.json(resultados);
    });
  },

  buscarPorId(req, res) {
    const id = convertirId(req.params.id);

    if (!id) {
      return res.status(400).json({
        mensaje: "El id debe ser un número entero positivo.",
      });
    }

    CategoriaModel.buscarPorId(id, (error, categoria) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!categoria) {
        return res.status(404).json({
          mensaje: "Categoría no encontrada.",
        });
      }

      res.json(categoria);
    });
  },

  crear(req, res) {
    const errorValidacion = validarCategoria(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    CategoriaModel.crear(obtenerDatos(req.body), (error, categoria) => {
      if (error) return responderErrorBaseDatos(res, error);

      res.status(201).json(categoria);
    });
  },

  actualizar(req, res) {
    const id = convertirId(req.params.id);

    if (!id) {
      return res.status(400).json({
        mensaje: "El id debe ser un número entero positivo.",
      });
    }

    const errorValidacion = validarCategoria(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    CategoriaModel.buscarPorId(id, (error, categoriaExistente) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!categoriaExistente) {
        return res.status(404).json({
          mensaje: "Categoría no encontrada.",
        });
      }

      CategoriaModel.actualizar(id, obtenerDatos(req.body), (error, categoria) => {
        if (error) return responderErrorBaseDatos(res, error);

        if (!categoria) {
          return res.status(404).json({
            mensaje: "Categoría no encontrada.",
          });
        }

        res.json(categoria);
      });
    });
  },

  desactivar(req, res) {
    const id = convertirId(req.params.id);

    if (!id) {
      return res.status(400).json({
        mensaje: "El id debe ser un número entero positivo.",
      });
    }

    CategoriaModel.desactivar(id, (error, resultado) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Categoría no encontrada o ya desactivada.",
        });
      }

      res.json({
        mensaje: "Categoría desactivada correctamente.",
      });
    });
  },
};

module.exports = CategoriaController;