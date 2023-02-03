const express = require("express");
const path = require("path");

const notesDB = require("./db/db.json");
const randomID = require("./helper/uuid");

const PORT = 3001;
const app = express();

// Middleware to parse data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Route to get the landing page with link to notes page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Route to notes page
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Route to get notes information.
app.get("/api/notes", (req, res) => res.json(notesDB));

// GET route that returns a notes unique id
app.get("/api/notes/:title", (req, res) => {
  const findNote = req.params.title.toLowerCase();

  for (let i = 0; i < notesDB.length; i++) {
    if (findNote === notesDB[i].title.toLowerCase()) {
      return res.json(notesDB[i]);
    }
  }
  return res.json("No notes found");
});

// POST requests for notes
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request to add note recieved.`);
  let noteInfo;

  if (req.body && req.body.title) {
    noteInfo = {
      status: "It worked",
      data: req.body,
    };
    res.json(`${req.noteInfo.data.title} note added👍.`);
  } else {
    res.json("Request must contain a title.");
  }
});

// Default route when a user types in a route that doesn't exist.
app.get("*", (req, res) =>
  res.send(
    `Try this route to start taking notes <a href="http://localhost:${PORT}/">http://localhost:${PORT}/</a>`
  )
);

app.listen(PORT, () => {
  console.log(`Begin server on port http://localhost:${PORT} 👍.`);
});
