const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require("bcryptjs");
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

const saltRounds = 10;
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send('This is working');
});

// Posting json user login information
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

// Posting json registration information
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, saltRounds) });

// When the user looks at their profile -- not yet developed
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

// Update the number of entries for a user
app.put('/image',(req, res) => { image.handleImage(req, res, db) });

// Manage Clarifai API
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

app.listen(process.env.PORT || 3000, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
