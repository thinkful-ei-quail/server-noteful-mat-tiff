/* eslint-disable eqeqeq */
/* eslint-disable semi */
const path = require('path');
const express = require('express');
const xss = require('xss');
const FoldersService = require('./folders-service');
const foldersRouter = express.Router();
const jsonParser = express.json();

const serializeFolders = folder => ({
  id: folder.id,
  title: xss(folder.title)
});

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolders))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const {title} = req.body;
    const newFolder = {title};

    for (const [key, value] of Object.entries(newFolder)) {
      if (value == null) {
        return res.status(400).json({
          error: {message: `Missing '${key}' in request body`}
        })
      }
    }

    newFolder.title = title;

    FoldersService.insertFolders(
      req.app.get('db'),
      newFolder
    )
      .then(folders => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folders.id}`))
          .json(serializeFolders(folders))
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    FoldersService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folders => {
        if(!folders) {
          return res.status(404).json({
            error: { message: 'Folder does not exist'}
          })
        }
        res.folders = folders
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeFolders(res.folders))
  })
  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) =>{
    const{title} = req.body
    const folderToUpdate = {title}
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if(numberOfValues === 0)
      return res.status(400).json({
        error:{ message:'Request body must contain a title' }
      })
    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
module.exports = foldersRouter