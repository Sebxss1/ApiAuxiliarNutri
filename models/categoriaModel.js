const connection = require("../config/dbConfig");

const CategoriaModel = {
  listar(callback) {
    const sql = `
      SELECT id, nombre, descripcion, estado, creado_en, actualizado_en
      FROM categorias_educativas
      WHERE estado = TRUE
      ORDER BY nombre
    `;

    connection.query(sql, callback);
  },

  buscarPorId(id, callback) {
    const sql = `
      SELECT id, nombre, descripcion, estado, creado_en, actualizado_en
      FROM categorias_educativas
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], (error, resultados) => {
      if (error) return callback(error);
      callback(null, resultados[0] || null);
    });
  },

  crear(categoria, callback) {
    const sql = `
      INSERT INTO categorias_educativas (nombre, descripcion)
      VALUES (?, ?)
    `;

    connection.query(
      sql,
      [categoria.nombre, categoria.descripcion],
      (error, resultado) => {
        if (error) return callback(error);

        this.buscarPorId(resultado.insertId, callback);
      }
    );
  },

  actualizar(id, categoria, callback) {
    const sql = `
      UPDATE categorias_educativas
      SET nombre = ?, descripcion = ?
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(
      sql,
      [categoria.nombre, categoria.descripcion, id],
      (error) => {
        if (error) return callback(error);

        this.buscarPorId(id, callback);
      }
    );
  },

  desactivar(id, callback) {
    const sql = `
      UPDATE categorias_educativas
      SET estado = FALSE
      WHERE id = ? AND estado = TRUE
    `;

    connection.query(sql, [id], callback);
  },
};

module.exports = CategoriaModel;