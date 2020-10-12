const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get('api/notes/:id', (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(notes[req.params.id]);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let noteId = (notes.length + 1).toString();
  newNote.id = noteId;
  notes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(notes, null, 2));
  res.json(notes);
});

app.delete("/api/notes/:id", function(req, res) {
  let notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  
  savedNotes = notes.filter(currNote => {
      return currNote.id != noteID;
  })
  
  for (currNote of savedNotes) {
      currNote.id = newID.toString();
      newID++;
  }

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes, null, 2));
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});