'use strict';

const express = require('express');
const router = express.Router();

// var data = require('../db/dummy-data');

const { DATABASE } = require('../config');
const knex = require('knex')(DATABASE);

/* ========== GET/READ ALL ITEMS ========== */
router.get('/stories', (req, res, next) => {
  knex('stories')
    .select('id', 'title', 'content', 'created')
    .orderBy('created')
    .then(results => {
      res.json(results);
    })
    .catch(next);

  // if (req.query.search) {
  //   const filtered = data.filter((obj) => obj.title.includes(req.query.search));
  //   res.json(filtered);
  // } else {
  //   res.json(data);
  // }
});

/* ========== GET/READ SINGLE ITEMS ========== */
router.get('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    var err = new Error('Id must be a valid integer');
    err.status = 400;
    next(err);
    return;
  }

  knex('stories')
    .select('stories.id', 'title', 'content')
    .where('stories.id', id)
    .then(([result]) => {
      if (result) {
        res.status(200).json(result);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(err => next(err)); // invoke error handler

  // const item = data.find((obj) => obj.id === id);
  // res.json(item);

});

/* ========== POST/CREATE ITEM ========== */
router.post('/stories', (req, res, next) => {
  const { title, content } = req.body;

  /***** Never Trust Users! *****/
  if (!req.body.title) {
    var err = new Error('Request must contain a title');
    err.status = 400;
    next(err);
    return;
  }

  knex('stories')
    .insert({ title, content })
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      res.location(`${req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err)); // invoke error handler

  // const newItem = {
  //   id: data.nextVal++,
  //   title: title,
  //   content: content
  // };
  // data.push(newItem);
  // res.location(`${req.originalUrl}/${newItem.id}`).status(201).json(newItem);

});

/* ========== PUT/UPDATE A SINGLE ITEM ========== */
router.put('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    var err = new Error('Id must be a valid integer');
    err.status = 400;
    next(err);
    return;
  }

  if (!req.body.title) {
    res.status(400).send('Request must contain a title');
    return;
  }

  knex('stories')
    .update({ title, content })
    .where('id', req.params.id)
    .returning(['id', 'title', 'content'])
    .then(([result]) => {
      if (result) {
        res.json(result);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(err => next(err)); // invoke error handler

  // const item = data.find((obj) => obj.id === id);
  // Object.assign(item, { title, content });
  // res.json(item);
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/stories/:id', (req, res, next) => {
  const id = Number(req.params.id);

  /***** Never Trust Users! *****/
  if (isNaN(id)) {
    var err = new Error('Id must be a valid integer');
    err.status = 400;
    next(err);
    return;
  }

  knex('stories')
    .del()
    .where('id', req.params.id)
    .then(result => {
      if (result) {
        res.sendStatus(204);
      } else {
        next(); // fall-through to 404 handler
      }
    })
    .catch(err => next(err)); // invoke error handler

  // const index = data.findIndex((obj) => obj.id === id);
  // data.splice(index, 1);
  // res.status(204).end();
});

module.exports = router;