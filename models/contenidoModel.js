const connection = require("../config/dbConfig");

const ContenidoModel = {
  listar(categoriaId, callback) {
    let sql = `
      SELECT id, categoria_id, titulo, resumen, contenido,
             estado, creado_en, actualizado_en
      FROM contenidos_educativos
      WHERE estado = TRUE
    `;
    const valores = [];

    if (categoriaId !== null) {
      sql += " AND categoria_id = ?";
      valores.push(categoriaId);
    }

    sql += " ORDER BY creado_en DESC";

    connection.query(sql, valores, callback);
  },

  buscarPorId(id, callback) {
    const sql = `
      SELECT id, categoria_id, titulo, resumen, contenido,
             estado, creado_en, actualizado_en
      FROM contenidos_educativos
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], (error, resultados) => {
      if (error) return callback(error);
      callback(null, resultados[0] || null);
    });
  },

  crear(datos, callback) {
    const sql = `
      INSERT INTO contenidos_educativos
        (categoria_id, titulo, resumen, contenido)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(
      sql,
      [datos.categoria_id, datos.titulo, datos.resumen, datos.contenido],
      (error, resultado) => {
        if (error) return callback(error);
        this.buscarPorId(resultado.insertId, callback);
      }
    );
  },

  actualizar(id, datos, callback) {
    const sql = `
      UPDATE contenidos_educativos
      SET categoria_id = ?, titulo = ?, resumen = ?, contenido = ?
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(
      sql,
      [datos.categoria_id, datos.titulo, datos.resumen, datos.contenido, id],
      (error) => {
        if (error) return callback(error);
        this.buscarPorId(id, callback);
      }
    );
  },

  desactivar(id, callback) {
    const sql = `
      UPDATE contenidos_educativos
      SET estado = FALSE
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], callback);
  },
};

module.exports = ContenidoModel;