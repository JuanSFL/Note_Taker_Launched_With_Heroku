// Port 3001
const PORT = process.env.PORT || 3001;
// File system
const fs = require('fs');
// path
const path = require('path');
// express module
const express = require('express');
// express app
const app = express();
// json data
const allNotes = require('./db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET ROUTES 
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});


function createNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length == 0)
        notesArray.push(0);
    
    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray)
    );
    return newNote;
}

// POST ROUTE
app.post('/api/notes', (req, res) => {
    const newNote = createNote(req.body, allNotes);
    res.json(newNote);
});


function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray)
            );
        }
    }
}
// BONUS DELETE ROUTE
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
    console.log(`You have just deleted note with id: ${req.params.id}`)
});
// intialize server
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});  