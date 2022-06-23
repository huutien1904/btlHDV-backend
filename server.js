const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios').default;
var cors = require('cors')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
 app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
const port = 3000;
const dbUri =
  'mongodb+srv://clone:clone@twitterclonecluster.cdhdf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose
  .connect(dbUri)
  .then(() => {
    console.log('Database connection successful!');
  })
  .catch((err) => {
    console.log('Database connection error: ' + err);
  });
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('UserNew', UserSchema);

// get all user
app.get('/users', async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

// login
app.post('/login', async (req, res, next) => {
  const payload = req.body;
  console.log(payload)
  const { username, password } = payload;
  console.log(res);
  if (!username || !password) return res.sendStatus(500);
  const currentUser = await User.findOne({
    username,
  });
  if (!currentUser) return res.status(400).json({ error: 'User not found' });
  const isValidPassword = await bcrypt.compare(password, currentUser.password);
  if (!isValidPassword)
    return res.status(300).json({ error: 'Valid password fail' });
  res.json(currentUser);
});
// register
app.post('/register', async (req, res, next) => {
  const payload = req.body;
  const { username, password } = payload;
  if (!username || !password) return res.sendStatus(500);
  const currentPassword = await bcrypt.hash(password, 10);
  const checkUsername = await User.findOne({
    username,
  });
  if (!!checkUsername) return res.sendStatus(500);
  const currentUser = await User.create({
    username,
    password: currentPassword,
  });
  if (!currentUser) return res.sendStatus(500);
  res.json(currentUser);
});


// setInterval(() => {
//   var d = new Date(); // for now
// datetext = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
//   console.log(datetext)
//   if(datetext == "0:50:12"){
//     console.log("12h45 roi")
//     clearInterval(refreshIntervalId);
//   }
// }, 1000);
app.listen(port, () => console.log('Server listening on port ' + port));
