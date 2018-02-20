'use strict';

// External Imports
const express = require('express');
const app = express();
app.use(express.json());
//app.use(require('body-parser'))

// Instantiation
const config = require('./config.json');
const data = require('../data/titles.json');
const Titles = require('./titles').Titles;
const titles = new Titles(data);

app.route(`${config.base}/${config.version}/title/`)
    .get(function (req, res) {
        const searchString = req.query.searchString ? req.query.searchString : '';
        res.send(titles.search(searchString));
    })
    .post(function (req, res) {
        if (!req.body) {
            res.send('Must send new title in valid JSON as application/json')
        } else {
            titles.add(JSON.stringify(req.body));
            res.send('Title Added')
        }
    })
    .put(function (req, res) {
        const searchString = req.query.searchString ? req.query.searchString : '';
        const update = req.query.update ? req.query.update : '';

        if (!searchString || !update) {
            res.send('searchString and update are required fields');
        } else {
            titles.update(searchString, update);
            res.send('Title Updated')
        }
    })
    .delete(function (req, res) {
        const searchString = req.query.searchString ? req.query.searchString : '';

        if (!searchString) {
            res.send('searchString is a required field');
        } else {
            titles.delete(searchString);
            res.send('Title Deleted')
        }
    });

app.listen(8080);