// /* eslint-disable eqeqeq */
// /* eslint-disable semi */
const path = require('path');
const express = require('express');
const xss = require('xss');
const NotesService = require('./notes-service');

const notesRouter = express.Router();
const jsonParser = express.json();

const serializeNotes = note => ({
  id: note.id,
  name: xss(note.name),
  content: xss(note.content),
  date_modified: note.date_modified,
  folder_id: note.folder_id,
});

notesRouter
  .route('/')
  .get((req, res, next) => {
    NotesService.getAllNotes(req.app.get('db'))
      .then(notes => {
        res.json(notes.map(serializeNotes))
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const {name, content, folder_id} = req.body;
    const newNote = {name, content, folder_id};

    for(const [key, value] of Object.entries(newNote)) {
      if (value == null) {
        return res.status(400).json({
          error: {message: `Missing ${key} in request body`}
        });
      }
    }

    newNote.name = name;
    newNote.content = content;
    newNote.folder_id = folder_id;

    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res 
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNotes(note));
      })
      .catch(next);
  });

notesRouter
  .route('/:note_id')
  .get((req, res, next) => {
    NotesService.getById(req.app.get('db'), req.params.note_id)
      .then(notes => {
        if(!notes) {
          return res.status(404).json({
            error: {message: 'Note does not exist'}
          });
        }
        res.notes = notes;
        next();
        // res.json(serializeNotes(res.notes))
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeNotes(res.notes));
  })
  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const {name, content} = req.body;
    const noteToUpdate = {name, content};

    const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: 'Request body must contain \'name\' or \'Content\''
        }
      });
    NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });
    
module.exports = notesRouter;