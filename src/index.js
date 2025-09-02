import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import rutas from "./app/route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI);
let collection;

async function conectarDB() {
  try {
    await client.connect();
    const db = client.db("mi_base_datos");
    collection = db.collection("usuarios");
    console.log("Conectado a MongoDB Atlas");

    // Montar rutas despues de conexion
    app.use("/", rutas(collection));
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 3000;
conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
});

