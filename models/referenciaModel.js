const connection = require("../config/dbConfig");

const ReferenciaModel = {
  listar(contenidoId, callback) {
    let sql = `
      SELECT id, contenido_id, titulo, url, autor, fecha_consulta,
             estado, creado_en, actualizado_en
      FROM referencias_contenido
      WHERE estado = TRUE
    `;
    const valores = [];

    if (contenidoId !== null) {
      sql += " AND contenido_id = ?";
      valores.push(contenidoId);
    }

    sql += " ORDER BY creado_en DESC";

    connection.query(sql, valores, callback);
  },

  buscarPorId(id, callback) {
    const sql = `
      SELECT id, contenido_id, titulo, url, autor, fecha_consulta,
             estado, creado_en, actualizado_en
      FROM referencias_contenido
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], (error, resultados) => {
      if (error) return callback(error);
      callback(null, resultados[0] || null);
    });
  },

  crear(datos, callback) {
    const sql = `
      INSERT INTO referencias_contenido
        (contenido_id, titulo, url, autor, fecha_consulta)
      VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [
        datos.contenido_id,
        datos.titulo,
        datos.url,
        datos.autor,
        datos.fecha_consulta,
      ],
      (error, resultado) => {
        if (error) return callback(error);
        this.buscarPorId(resultado.insertId, callback);
      }
    );
  },

  actualizar(id, datos, callback) {
    const sql = `
      UPDATE referencias_contenido
      SET contenido_id = ?, titulo = ?, url = ?, autor = ?, fecha_consulta = ?
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(
      sql,
      [
        datos.contenido_id,
        datos.titulo,
        datos.url,
        datos.autor,
        datos.fecha_consulta,
        id,
      ],
      (error) => {
        if (error) return callback(error);
        this.buscarPorId(id, callback);
      }
    );
  },

  desactivar(id, callback) {
    const sql = `
      UPDATE referencias_contenido
      SET estado = FALSE
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], callback);
  },
};

module.exports = ReferenciaModel;