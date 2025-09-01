import { Router } from "express";
import { ObjectId } from "mongodb";

const router = Router();

export default function (collection) {
  // Ruta principal
  router.get("/", (req, res) => {
    res.json({ mensaje: "Bienvenido a la prueba tecnica de Node.js + MongoDB" });
  });

  // Endpoint de estadísticas
  router.get("/usuarios/stats", async (req, res) => {
    try {
      const totalUsers = await collection.countDocuments();

      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastWeekUsers = await collection.countDocuments({
        createdAt: { $exists: true, $gte: lastWeek },
      });

      const pipeline = [
        {
          $group: {
            _id: { $arrayElemAt: [{ $split: ["$email", "@"] }, 1] },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ];

      const dominioStats = await collection.aggregate(pipeline).toArray();

      const byDomain = dominioStats.reduce((acc, item) => {
        if (item._id) acc[item._id.toLowerCase()] = item.count;
        return acc;
      }, {});

      res.json({ totalUsers, lastWeekUsers, byDomain });
    } catch (error) {
      console.error("Error en GET /usuarios/stats:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // 1. obtener usuarios (con paginación opcional)
  router.get("/usuarios", async (req, res) => {
    try {
      let { page, limit, q, sort } = req.query;

      page = parseInt(page) || null;
      limit = parseInt(limit) || null;

      const filtro = {};
      if (q) filtro.name = { $regex: q, $options: "i" };

      let orden = {};
      if (sort) {
        const direction = sort.startsWith("-") ? -1 : 1;
        const campo = sort.replace("-", "");
        orden[campo] = direction;
      } else {
        orden = { createdAt: -1 };
      }

      const totalUsuarios = await collection.countDocuments(filtro);
      let query = collection.find(filtro).sort(orden);

      if (page && limit) {
        query = query.skip((page - 1) * limit).limit(limit);
      }

      const usuarios = await query.toArray();
      const respuesta = { totalUsuarios, usuarios };

      if (page && limit) {
        respuesta.page = page;
        respuesta.limit = limit;
        respuesta.totalPaginas = Math.ceil(totalUsuarios / limit);
      }

      res.json(respuesta);
    } catch (error) {
      console.error("Error en GET /usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // 2. Obtener usuario por ID
  router.get("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const usuario = await collection.findOne({ _id: new ObjectId(id) });
      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json(usuario);
    } catch (error) {
      console.error("Error en GET /usuarios/:id:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // 3. Insertar usuario
  router.post("/usuarios", async (req, res) => {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Formato de email inválido" });
      }
      const existente = await collection.findOne({ email });
      if (existente) {
        return res.status(400).json({ error: "El email ya está registrado" });
      }
      const result = await collection.insertOne({
        name,
        email,
        createdAt: new Date(),
      });
      res.status(201).json({ _id: result.insertedId, name, email });
    } catch (error) {
      console.error("Error en POST /usuarios:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // 4. Actualizar usuario
  router.put("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { name, email } = req.body;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      if (!name && !email) {
        return res.status(400).json({ error: "Debe enviar al menos un campo" });
      }
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Formato de email inválido" });
        }
      }
      const update = {};
      if (name) update.name = name;
      if (email) update.email = email;

      const filter = { _id: new ObjectId(id) };
      const updateRes = await collection.updateOne(filter, { $set: update });
      if (updateRes.matchedCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const usuarioActualizado = await collection.findOne(filter);
      res.json(usuarioActualizado);
    } catch (error) {
      console.error("Error en PUT /usuarios/:id:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  // 5. Eliminar usuario
  router.delete("/usuarios/:id", async (req, res) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      console.error("Error en DELETE /usuarios/:id:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  });

  return router;
}
