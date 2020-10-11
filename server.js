const express = require('express');
const path = require('path');
const fs = require('fs');
const savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

const app = express();
const PORT = 3002;

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
  // let savedNotes = JSON.parse(fs.readFileSymc(""))
  res.json(savedNotes[Number(req.params.id)]);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.post('/api/notes', (req, res) => {
  // let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', "utf8"));
  let newNote = req.body;
  let noteId = (savedNotes.length + 1).toString();
  newNote.id = noteId;
  savedNotes.push(newNote);

  fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes, null, 2));
  console.log('Note saved to db.json. Content ', newNote);
  res.json(savedNotes);
});

app.delete('api/notes/:id', (req, res) => {
  // let savedNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf8'));
  let noteId = req.params.id;
  let newId = 0;
  console.log(`Deleting note with ID ${noteId}`);
  savedNotes = savedNotes.filter(currentNote => {
    return currentNote.id != noteId;
  })

  for (currentNote of savedNotes) {
    currentNote.id = newId.toString();
    newId++;
  }

  fs.writeFileSync('./db/db.json', JSON.stringify(savedNotes));
  res.json(savedNotes);
});

app.listen(PORT, () => {
  console.log(`API server now on port ${PORT}!`);
});