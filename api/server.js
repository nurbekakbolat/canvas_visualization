// server.js
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const app = express();
const port = 5000;
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbFilePath = path.join(__dirname, "db.json");
// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load initial entities from db.json
let db = JSON.parse(fs.readFileSync(dbFilePath));

// Save entities to db.json
const saveDB = () => {
  fs.writeFileSync(dbFilePath, JSON.stringify(db, null, 2));
};

// Endpoint to create a new entity
app.post("/entities", (req, res) => {
  const newEntity = req.body;
  console.log(newEntity);
  newEntity.id = db.userData.length + 1;
  db.userData.push(newEntity);
  saveDB();
  res.json(newEntity);
});

app.put("/entities/:id", (req, res) => {
  const entityId = parseInt(req.params.id);
  const updatedEntity = req.body;
  console.log(entityId);
  const entityIndex = db.userData.findIndex((entity) => entity.id === entityId);
  console.log(entityIndex);
  if (entityIndex !== -1) {
    db.userData[entityIndex] = {
      ...db.userData[entityIndex],
      ...updatedEntity,
    };
    saveDB();
    res.json(db.userData[entityIndex]);
  } else {
    res.status(500).json({ message: "Entity not found" });
  }
});

// Endpoint to remove an entity
app.delete("/entities/:id", (req, res) => {
  const entityId = parseInt(req.params.id);
  const entityIndex = db.userData.findIndex((entity) => entity.id === entityId);

  if (entityIndex !== -1) {
    const removedEntity = db.userData.splice(entityIndex, 1);
    saveDB(); // Save the updated data to db.json
    res.json(removedEntity[0]);
  } else {
    res.status(404).json({ message: "Entity not found" });
  }
});

// Start the server
