const express = require("express");
const path = require("path");
const notesDB = require("./db/db.json");
const randomID = require("./helper/uuid")


const PORT = 3001
const app = express();

// Middleware to parse data.
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
  });

app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });

app.get("/api/notes", (req, res) => res.json(notesDB));


app.post("/api/notes", (req, res) => {
    res.json(`${req.method} note recieved.`);

console.info(`${req.method} note Recieved.`);
});

app.listen(PORT, () => {
    console.log(`Begin server on port http://localhost:${PORT} 👍.`);
});


