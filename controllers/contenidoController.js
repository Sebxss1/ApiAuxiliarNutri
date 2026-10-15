const ContenidoModel = require("../models/contenidoModel");
const CategoriaModel = require("../models/categoriaModel");

function convertirId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarContenido(body) {
  if (!body || typeof body.titulo !== "string") {
    return "El campo titulo es obligatorio y debe ser texto.";
  }

  if (!body.titulo.trim() || body.titulo.trim().length > 180) {
    return "El titulo debe tener entre 1 y 180 caracteres.";
  }

  const categoriaId = convertirId(body.categoria_id);
  if (!categoriaId) {
    return "categoria_id debe ser un número entero positivo.";
  }

  if (
    body.resumen !== undefined &&
    body.resumen !== null &&
    typeof body.resumen !== "string"
  ) {
    return "El resumen debe ser texto o null.";
  }

  if (typeof body.resumen === "string" && body.resumen.length > 500) {
    return "El resumen no puede superar los 500 caracteres.";
  }

  if (typeof body.contenido !== "string" || !body.contenido.trim()) {
    return "El campo contenido es obligatorio y debe ser texto.";
  }

  return null;
}

function obtenerDatos(body) {
  return {
    categoria_id: Number(body.categoria_id),
    titulo: body.titulo.trim(),
    resumen:
      typeof body.resumen === "string" && body.resumen.trim()
        ? body.resumen.trim()
        : null,
    contenido: body.contenido.trim(),
  };
}

function responderErrorBaseDatos(res, error) {
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      mensaje: "Ya existe un contenido con ese título en esa categoría.",
    });
  }

  console.error("Error de base de datos:", error.message);

  return res.status(500).json({
    mensaje: "Ocurrió un error al consultar la base de datos.",
  });
}

function verificarCategoriaActiva(categoriaId, callback) {
  CategoriaModel.buscarPorId(categoriaId, callback);
}

const ContenidoController = {
  listar(req, res) {
    let categoriaId = null;

    if (req.query.categoria_id !== undefined) {
      categoriaId = convertirId(req.query.categoria_id);

      if (!categoriaId) {
        return res.status(400).json({
          mensaje: "categoria_id debe ser un número entero positivo.",
        });
      }
    }

    ContenidoModel.listar(categoriaId, (error, resultados) => {
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

    ContenidoModel.buscarPorId(id, (error, contenido) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!contenido) {
        return res.status(404).json({
          mensaje: "Contenido no encontrado.",
        });
      }

      res.json(contenido);
    });
  },

  crear(req, res) {
    const errorValidacion = validarContenido(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const datos = obtenerDatos(req.body);

    verificarCategoriaActiva(datos.categoria_id, (error, categoria) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!categoria) {
        return res.status(400).json({
          mensaje: "La categoría no existe o está desactivada.",
        });
      }

      ContenidoModel.crear(datos, (error, contenido) => {
        if (error) return responderErrorBaseDatos(res, error);
        res.status(201).json(contenido);
      });
    });
  },

  actualizar(req, res) {
    const id = convertirId(req.params.id);

    if (!id) {
      return res.status(400).json({
        mensaje: "El id debe ser un número entero positivo.",
      });
    }

    const errorValidacion = validarContenido(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const datos = obtenerDatos(req.body);

    ContenidoModel.buscarPorId(id, (error, existente) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!existente) {
        return res.status(404).json({
          mensaje: "Contenido no encontrado.",
        });
      }

      verificarCategoriaActiva(datos.categoria_id, (error, categoria) => {
        if (error) return responderErrorBaseDatos(res, error);

        if (!categoria) {
          return res.status(400).json({
            mensaje: "La categoría no existe o está desactivada.",
          });
        }

        ContenidoModel.actualizar(id, datos, (error, contenido) => {
          if (error) return responderErrorBaseDatos(res, error);

          if (!contenido) {
            return res.status(404).json({
              mensaje: "Contenido no encontrado.",
            });
          }

          res.json(contenido);
        });
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

    ContenidoModel.desactivar(id, (error, resultado) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Contenido no encontrado o ya desactivado.",
        });
      }

      res.json({ mensaje: "Contenido desactivado correctamente." });
    });
  },
};

module.exports = ContenidoController;