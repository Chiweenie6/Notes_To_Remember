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

// Write note to a specific destination
const saveNote = (toFile, note) =>
  fs.writeFile(toFile, JSON.stringify(note, null, 4), (err) =>
    err ? console.error(err) : console.info(`\n Notes added to ${toFile}`)
  );

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

const grabNotes = util.promisify(fs.readFile);

// Get route to get old notes information.
app.get("/api/notes", (req, res) => {
  console.info(`${req.method} info from old notes.`);
  grabNotes("./db/db.json").then((info) => res.json(JSON.parse(info)));
});

// POST route for new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method}ed new note ✍️.`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    addNote(newNote, "./db/db.json");
    res.json(`HURRAY!`);
  } else {
    res.error("Error in note taking.");
  }
});

// GET route to get notes information.
// app.get("/api/notes", (req, res) => res.json(notesDB));

// POST request to add new note
// app.post("/api/notes", (req, res) => {
//   console.info(`${req.method} request recieved to add new note.`);

//   const { title, text } = req.body;

//   if (req.body) {
//     const newNote = {
//       title,
//       text,
//       note_id: uuid(),
//     };

//     // Find old notes
//     fs.readFile("./db/db.json", "utf8", (err, data) => {
//       if (err) {
//         console.error(err);
//       } else {
//         const noteParse = JSON.parse(data);

//         // Add a new note
//         noteParse.push(newNote);

//         // Write updated notes back to db.json
//         fs.writeFile(
//           "./db/db.json",
//           JSON.stringify(noteParse, null, 4),
//           (writeErr) =>
//             writeErr
//               ? console.error(writeErr)
//               : console.info("New note added 👍")
//         );
//       }
//     });

//     const response = {
//       status: "It worked👍",
//       body: newNote,
//     };
//     console.log(response);
//     res.status(206).json(response);
//   } else {
//     res.status(500).json("Could not append note.");
//   }
// });

// GET request for a unique id
// app.get("/api/notes/:note_id", (req, res) => {
//   if (req.params.note_id) {
//     console.info(`${req.method} request received to find note`);
//     const noteId = req.params.note_id;
//     for (let i = 0; i < notesDB.length; i++) {
//       const foundNote = notesDB[i];
//       if (foundNote.note_id === noteId) {
//         res.json(foundNote);
//         return;
//       }
//     }
//     res.status(404).send("Note not found");
//   } else {
//     res.status(400).send("Note ID not provided");
//   }
// });

// DELETE request to remove a note
app.delete("/api/notes/:note_id", (req, res) => {
  if (req.body && req.params.note_id) {
    console.info(`${req.method} request received to delete a note`);
    const noteId = req.params.note_id;
    for (let i = 0; i < notesDB.length; i++) {
      const slectedNote = notesDB[i];
      if (slectedNote.note_id === noteId) {
        res.send("DELETE request for note");
      }
    }
    res.json("Note id not found");
  }
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
