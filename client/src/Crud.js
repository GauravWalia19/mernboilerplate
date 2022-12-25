
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

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
        delete: '/api/v1/delete/<ID>'
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


















const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection error:'));

// Define a Mongoose model for the data
const User = mongoose.model('User', {
  name: String,
  email: String,
});

/**
 * @method POST
 * @access public
 * @endpoint /api/v1/users
 **/
router.post('/users', async (req, res) => {
  // Validate the request body
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Create a new user
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
    });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

/**
 * @method GET
 * @access public
 * @endpoint /api/v1/users
 **/
router.get('/users', async (req, res) => {
  // Retrieve all users from the database
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

/**
 * @method PUT
 * @access public
 * @endpoint /api/v1/users/:id
 **/
router.put('/users/:id', async (req, res) => {
  // Validate the request body
  if (!req.body.name || !req.body.email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  // Update the user with the specified ID
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.name = req.body.name;
    user.email = req.body.email;
    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating user' });
  }
});
/**
 * @method DELETE
 * @access public
 * @endpoint /api/v1/users/:id
 **/
router.delete('/users/:id', async (req, res) => {
    // Delete the user with the specified ID
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await user.delete();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting user' });
    }
  });
  
  module.exports = router;
  
