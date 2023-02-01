const express = require("express");
const notesRouter = express.Router();
const fs = require("fs");


notesRouter.get("/notes", (req, res) => {
    res.send("notes.html");
  });


  notesRouter.get("/*", (req, res) => {
    res.send("index.html");
  });



  module.exports = notesRouter;