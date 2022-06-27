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
  'mongodb+srv://tien1904:pKgL0VNAxLsOHWma@pthdv.3nump97.mongodb.net/pthdv?retryWrites=true&w=majority';
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
  const { username, password } = payload;
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

axios.get('http://api.openweathermap.org/data/2.5/forecast?q=hanoi&appid=8e4352972abe8bd8c4f7617a5ad35876&units=metric&lang=vi&cnt=5')
  .then(function (response) {
    // handle success
    console.log(response.data.list.map((item) => {
      console.log(item)
    }));
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

  axios.get('http://localhost:3000/users')
  .then(function (response) {
    // handle success
    console.log(response.data[0])
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
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
