const fs  = require("fs");

// Getting the note title, text and saving into a database.
class API {
    constructor(noteTitle) {
        if(!noteTitle) {
            throw new Error ("Must have a title.");
        }
        this.noteTitle = noteTitle;

        try {
            fs.accessSync(this.noteTitle)
        } catch(err) {
            fs.writeFileSync(this.noteTitle, "[]");
        }
    }

    async getAll() {
        return JSON.parse (
            await fs.promises.readFile(this.noteTitle, {
                encoding : "utf8"
            })
        )
    }
    async create(info) {
        const journal = await this.getAll();

        journal.push(info);
        await fs.promises.writeFile(
            this.noteTitle,
            JSON.stringify(journal, null, 2)
        )
        return info;
    }
}

module.exports = new API("db.json");