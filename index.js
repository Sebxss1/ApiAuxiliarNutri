require("dotenv").config();

const express = require("express");
const connection = require("./config/dbConfig");
const categoriaRoutes = require("./routes/categoriaRoutes");
const contenidoRoutes = require("./routes/contenidoRoutes");
const referenciaRoutes = require("./routes/referenciaRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/categorias", categoriaRoutes);
app.use("/contenidos", contenidoRoutes);
app.use("/referencias", referenciaRoutes);


app.get("/", (req, res) => {
  res.json({
    mensaje: "API auxiliar de Nutri funcionando",
  });
});

app.get("/health/db", (req, res) => {
  connection.query("SELECT 1 AS conexion", (error, resultados) => {
    if (error) {
      console.error("Error al consultar MySQL:", error.message);

      return res.status(500).json({
        mensaje: "No se pudo conectar con la base de datos",
      });
    }

    res.json({
      mensaje: "Conexión con Clever Cloud correcta",
      resultado: resultados[0],
    });
  });
});

connection.connect((error) => {
  if (error) {
    console.error("Error al conectar con MySQL:", error.message);
    process.exit(1);
  }

  console.log("Conexión con MySQL establecida.");

  app.listen(PORT, () => {
    console.log(`API ejecutándose en http://localhost:${PORT}`);
  });
});