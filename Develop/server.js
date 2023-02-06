const express = require("express");
const path = require("path");
const util = require("util");
const fs = require("fs");

const notesDB = require("./db/db.json");
const uuid = require("./helper/uuid");

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

// 
const saveNote = (toFile, note) =>
  fs.writeFile(toFile, JSON.stringify(note, null, 4), (err) => {
    if (err) {
      console.error(err)
    } else {
      console.info(`\n Notes added to ${toFile} 🎉`);
    }
  });

// Find note info and append
const addNote = (note, fromFile) => {
  fs.readFile(fromFile, "utf8", (err, info) => {
    if (err) {
      console.log(err);
    } else {
      const pNote = JSON.parse(info);
      pNote.push(note);
      saveNote(fromFile, pNote);
    }
  });
};

// Find note info and delete
const deleteNote = (note, fromFile) => {
  fs.readFile(fromFile, "utf8", (err, info) => {
    if (err) {
      console.log(err);
    } else {
      const pNote = JSON.parse(info);
      pNote.splice(note);
      // saveNote(fromFile, pNote);


      console.info(pNote);
      console.info(info);

    }
  });
};






const grabNotes = util.promisify(fs.readFile);

// Get route to get old notes information.
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} info from old notes 👀.`);
  grabNotes("./db/db.json").then((info) => res.json(JSON.parse(info)));
});

// POST route for new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request for new note ✍️.`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    addNote(newNote, "./db/db.json");
    res.json(`HURRAY 🎉`);
  } else {
    res.error("Error in note taking.");
  }
});

// DELETE request to remove a note
app.delete("/api/notes/:id", (req, res) => {

  const noteId = req.params.id;
  const { title, text, id } = req.body;

  // console.info(req.params.id);
  // console.info(req.body);

    console.info(`${req.method} a note request 🔥`);
    

    for (let i = 0; i < notesDB.length; i++) {
      const selectedNotes = notesDB[i];
      console.info(selectedNotes.id);
      

      if (selectedNotes.id === noteId) {
        deleteNote(noteId, "./db/db.json");
        console.info("Note id Found 👍");
      } else {
        console.info("Note id not found 🚫");
      }
    }

  res.send("DELETE request for note");
});

// Default route when a user types in a route that doesn't exist.
app.get("*", (req, res) =>
  res.send(
    `Try this route to start taking notes <a href="http://localhost:${PORT}/">http://localhost:${PORT}/</a>`
  )
);

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT} 😁.`);
});
