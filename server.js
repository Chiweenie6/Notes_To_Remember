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

const grabNotes = util.promisify(fs.readFile);

// Get route to get old notes information.
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} info from old notes 👀.`);
  grabNotes("./db/db.json").then((info) => res.json(JSON.parse(info)));
});

// Add changes to notes array to the db.json file.
const saveNote = (toFile, note) =>
  fs.writeFile(toFile, JSON.stringify(note, null, 3), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`\n Note changes added to ${toFile} 🎉`);
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

// Find note info based on id and delete
const deleteNote = (note, fromFile) => {
  fs.readFile(fromFile, "utf8", (err, info) => {
    if (err) {
      console.log(err);
    } else {
      const findDNote = (paNote, id) => {
        const findAndDelete = paNote.findIndex((noteA) => noteA.id === id);

        if (findAndDelete > -1) {
          paNote.splice(findAndDelete, 1);
        }
        return paNote;
      };
      const parNote = JSON.parse(info);
      findDNote(parNote, note);
      saveNote(fromFile, parNote);

      console.info(parNote);
    }
  });
};

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
    res.json("HURRAY 🎉");
  } else {
    res.error("Error in note taking.");
  }
});

// DELETE request to remove a note and find id when clicking on trash icon on html page.
app.delete("/api/notes/:id", (req, res) => {
  notesDB;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
  });

  const noteId = req.params.id;
  console.log(noteId);

  if (noteId) {
    console.info(`${req.method} a note request 🔥`);
    for (let i = 0; i < notesDB.length; i++) {
      const selectedNote = notesDB[i];
      // console.log(selectedNote);
      if (selectedNote.id === noteId) {
        deleteNote(noteId, "./db/db.json");
        console.info(noteId + " Note id Found 👍");
      } else {
        // console.info("Note id not found 🚫");
      }
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

app.listen(process.env.PORT || 3001, () => {
  console.log(`Listening on port http://localhost:${PORT} 😁.`);
});
