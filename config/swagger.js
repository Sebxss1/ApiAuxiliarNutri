const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "API auxiliar de Nutri",
    version: "1.0.0",
    description: "API para administrar categorías educativas.",
  },
  paths: {
    "/categorias": {
      get: {
        summary: "Listar categorías activas",
        responses: {
          200: {
            description: "Lista de categorías",
          },
        },
      },
      post: {
        summary: "Crear una categoría",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre"],
                properties: {
                  nombre: { type: "string", example: "Alimentación saludable" },
                  descripcion: {
                    type: "string",
                    nullable: true,
                    example: "Información sobre hábitos de alimentación.",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Categoría creada" },
          400: { description: "Datos inválidos" },
          409: { description: "Ya existe una categoría con ese nombre" },
        },
      },
    },
    "/categorias/{id}": {
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          example: 1,
        },
      ],
      get: {
        summary: "Consultar una categoría",
        responses: {
          200: { description: "Categoría encontrada" },
          404: { description: "Categoría no encontrada" },
        },
      },
      put: {
        summary: "Actualizar una categoría",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["nombre"],
                properties: {
                  nombre: { type: "string", example: "Nutrición y bienestar" },
                  descripcion: {
                    type: "string",
                    nullable: true,
                    example: "Contenido educativo actualizado.",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Categoría actualizada" },
          400: { description: "Datos inválidos" },
          404: { description: "Categoría no encontrada" },
          409: { description: "Ya existe una categoría con ese nombre" },
        },
      },
      delete: {
        summary: "Desactivar una categoría",
        responses: {
          200: { description: "Categoría desactivada" },
          404: { description: "Categoría no encontrada o ya desactivada" },
        },
      },
    },
  },
};

module.exports = swaggerDocument;