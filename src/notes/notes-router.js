const path = require('path');
const express = require('express');
const xss = require('xss');
const NotesService = require('./notes-service');
const { json } = require('express');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNotes = note => ({
  id: note.id,
  title: xss(note.title),
  content: xss(note.content),
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    const db = req.app.get('db');
    NotesService.getAllNotes(db)
      .then(notes => {
        res.json(notes.map(serializeNotes)):
      })
      .catch(next);
  });

  .post(jsonParser, (req, res, next) => {
    const {title, content} = req.body;
    const newNote = {title, content};

    for(const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
            error: {message: `Missing ${key} in request body`}
        })
      }
    }

    newNote.title = title;
    newNote.content = content;

    NotesService.insertNote(
      req.app.get
    )



  })