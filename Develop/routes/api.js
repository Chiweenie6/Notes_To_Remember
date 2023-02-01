const express = require("express");
const apiRouter = express.Router();
const {v4 : uuidv4} = require("uuid");
const bodyParse = require("body-parser");
const db = require("../db/db.json");
const form = require("./form")
const apiMiddle = require("./apiMiddle");

const appExpress = express();
const port = process.env.PORT || 3001;




apiRouter.get("/api/notes", (req, res) => {
    res.send("db.json");
  });








// Middleware to parse data.
appExpress.use(bodyParse.urlencoded({extended : true}));

// GET route which displays the html form.
appExpress.get("/", (req, res) => {
    res.send(form({}));
});

// POST route for submission
appExpress.post("/", (req, res) => {
    const {title, text} = req.body;
    const noteId = uuidv4();

    db.create({
        noteId,
        title,
        text
    })
    res.send("Note saved");
});

// Setting up server
appExpress.listen(port, () => {
    console.log(`Server begin on port ${port}`);
});








  apiRouter.post("/api/notes", (req, res) => {
    res.send("index.html");
  });



  module.exports = apiRouter;