/* eslint-disable eqeqeq */
/* eslint-disable semi */
const path = require('path');
const express = require('express');
const xss = require('xss');
const FolderService = require('./folders-service');
const foldersRouter = express.Router();
const jsonParser = express.json();
const serializeFolders = folder => ({
  id: folder.id,
  title: xss(folder.title)
});

foldersRouter
  .route('/')
  .get((req,res,next) => {
    const knexInstance = req.app.get('db');
    FolderService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders.map(serializeFolders))
      })
      .catch(next)
  })
  .post(jsonParser, (req,res,next) => {
    const {title} = req.body;
    const newFolder = {title};
    for (const [key,value] of Object.entries(newFolder)){
      if(value == null)
        return res.status(400).json({
          error: {message: `Missing '${key}' in request body`}
        });
    }
    FolderService.insertFolders(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(serializeFolders(folder))
      })
      .catch(next)
  })
foldersRouter
  .route('/:folder_id')
  .all((req,res,next) => {
    FolderService.getById(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(folder => {
        if(!folder) {
          return res.status(404).json({
            error: { message: 'Folder does not exist'}
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })
  .get((req,res,next) => {
    res.json(serializeFolders(res.folder))
  })
  .delete((req,res,next) => {
    FolderService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req,res,next) =>{
    const{title} = req.body
    const folderToUpdate = {title}
    const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
    if(numberOfValues === 0)
      return res.status(400).json({
        error:{ message:'Request body must contain a title' }
      })
    FolderService.updateFolder(
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