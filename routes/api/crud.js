const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect(process.env.MONGODB_URI);

// When successfully connected
mongoose.connection.on('connected', () => {
    console.log('Connection to database established successfully');
});

// If the connection throws an error
mongoose.connection.on('error', (err) => {
    console.error(`Error connecting to database: ${err}`);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
    console.log('Database disconnected');
});

/**
 * @method POST
 * @access public
 * @endpoint /api/v1/post
 **/
router.post('/post', (req, res) => {
    res.json({
        message: 'POST API for MERN Boilerplate',
    });
});

/**
 * @method GET
 * @access public
 * @endpoint /api/v1/get
 **/
router.get('/get', (req, res) => {
    res.json({
        message: 'GET API for MERN Boilerplate',
        APIs: 'Other Endpoints',
        create: '/api/v1/post',
        read: '/api/v1/get',
        update: '/api/v1/put/<ID>',
        delete: '/api/v1/delete/<ID>',
    });
});

/**
 * @method PUT
 * @access public
 * @endpoint /api/v1/put/32323
 **/
router.put('/put/:id', (req, res) => {
    res.json({
        message: `PUT ${req.params.id} API for MERN Boilerplate`,
    });
});

/**
 * @method DELETE
 * @access public
 * @endpoint /api/v1/delete/424
 **/
router.delete('/delete/:id', (req, res) => {
    res.json({
        message: `DELETE ${req.params.id} API for MERN Boilerplate`,
    });
});

module.exports = router;
