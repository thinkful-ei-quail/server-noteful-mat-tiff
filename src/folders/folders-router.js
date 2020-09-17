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
    FoldersService.getAllFolders(req.app.get('db'))
      .then(folders => {
        res.json(folders.map(serializeFolders))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const {title} = req.body;
    const newFolder = {title};

    if(title == null) { 
      return res.status(400).json({
        error: {message: 'Missing \'folder name\' in request body'}
      });
    }

    FoldersService.insertFolders(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        return res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolders(folder))
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
      .then(folder => {
        if(!folder) {
          return res.status(404).json({
            error: { message: 'Folder doesn\'t exist'}
          });
        }
        res.folder = folder
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
        error:{ message:'Request body must contain a \'folder_name\'' }
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