const ReferenciaModel = require("../models/referenciaModel");
const ContenidoModel = require("../models/contenidoModel");

function convertirId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function esFechaValida(fecha) {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const fechaConvertida = new Date(`${fecha}T00:00:00.000Z`);
  return fechaConvertida.toISOString().slice(0, 10) === fecha;
}

function validarReferencia(body) {
  if (!body || typeof body.titulo !== "string") {
    return "El campo titulo es obligatorio y debe ser texto.";
  }

  if (!body.titulo.trim() || body.titulo.trim().length > 180) {
    return "El titulo debe tener entre 1 y 180 caracteres.";
  }

  if (!convertirId(body.contenido_id)) {
    return "contenido_id debe ser un número entero positivo.";
  }

  if (typeof body.url !== "string" || !body.url.trim()) {
    return "El campo url es obligatorio.";
  }

  if (body.url.trim().length > 700) {
    return "La URL no puede superar los 700 caracteres.";
  }

  try {
    const url = new URL(body.url.trim());

    if (!["http:", "https:"].includes(url.protocol)) {
      return "La URL debe comenzar con http:// o https://.";
    }
  } catch {
    return "Debes ingresar una URL válida.";
  }

  if (
    body.autor !== undefined &&
    body.autor !== null &&
    typeof body.autor !== "string"
  ) {
    return "El autor debe ser texto o null.";
  }

  if (typeof body.autor === "string" && body.autor.length > 150) {
    return "El autor no puede superar los 150 caracteres.";
  }

  if (
    body.fecha_consulta !== undefined &&
    body.fecha_consulta !== null &&
    !esFechaValida(body.fecha_consulta)
  ) {
    return "fecha_consulta debe tener el formato YYYY-MM-DD.";
  }

  return null;
}

function obtenerDatos(body) {
  return {
    contenido_id: Number(body.contenido_id),
    titulo: body.titulo.trim(),
    url: body.url.trim(),
    autor:
      typeof body.autor === "string" && body.autor.trim()
        ? body.autor.trim()
        : null,
    fecha_consulta: body.fecha_consulta || null,
  };
}

function responderErrorBaseDatos(res, error) {
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      mensaje: "Esa URL ya está registrada para este contenido.",
    });
  }

  console.error("Error de base de datos:", error.message);

  return res.status(500).json({
    mensaje: "Ocurrió un error al consultar la base de datos.",
  });
}

function verificarContenidoActivo(contenidoId, callback) {
  ContenidoModel.buscarPorId(contenidoId, callback);
}

const ReferenciaController = {
  listar(req, res) {
    let contenidoId = null;

    if (req.query.contenido_id !== undefined) {
      contenidoId = convertirId(req.query.contenido_id);

      if (!contenidoId) {
        return res.status(400).json({
          mensaje: "contenido_id debe ser un número entero positivo.",
        });
      }
    }

    ReferenciaModel.listar(contenidoId, (error, resultados) => {
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

    ReferenciaModel.buscarPorId(id, (error, referencia) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!referencia) {
        return res.status(404).json({
          mensaje: "Referencia no encontrada.",
        });
      }

      res.json(referencia);
    });
  },

  crear(req, res) {
    const errorValidacion = validarReferencia(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const datos = obtenerDatos(req.body);

    verificarContenidoActivo(datos.contenido_id, (error, contenido) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!contenido) {
        return res.status(400).json({
          mensaje: "El contenido no existe o está desactivado.",
        });
      }

      ReferenciaModel.crear(datos, (error, referencia) => {
        if (error) return responderErrorBaseDatos(res, error);
        res.status(201).json(referencia);
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

    const errorValidacion = validarReferencia(req.body);

    if (errorValidacion) {
      return res.status(400).json({ mensaje: errorValidacion });
    }

    const datos = obtenerDatos(req.body);

    ReferenciaModel.buscarPorId(id, (error, referenciaExistente) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (!referenciaExistente) {
        return res.status(404).json({
          mensaje: "Referencia no encontrada.",
        });
      }

      verificarContenidoActivo(datos.contenido_id, (error, contenido) => {
        if (error) return responderErrorBaseDatos(res, error);

        if (!contenido) {
          return res.status(400).json({
            mensaje: "El contenido no existe o está desactivado.",
          });
        }

        ReferenciaModel.actualizar(id, datos, (error, referencia) => {
          if (error) return responderErrorBaseDatos(res, error);

          if (!referencia) {
            return res.status(404).json({
              mensaje: "Referencia no encontrada.",
            });
          }

          res.json(referencia);
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

    ReferenciaModel.desactivar(id, (error, resultado) => {
      if (error) return responderErrorBaseDatos(res, error);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          mensaje: "Referencia no encontrada o ya desactivada.",
        });
      }

      res.json({ mensaje: "Referencia desactivada correctamente." });
    });
  },
};

module.exports = ReferenciaController;