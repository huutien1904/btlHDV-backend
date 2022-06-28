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

// get data weather 
var data = "";
axios.get('http://api.openweathermap.org/data/2.5/weather?q=hanoi&appid=8e4352972abe8bd8c4f7617a5ad35876&units=metric&lang=vi')
  .then(function (response) {
    // handle success
    console.log(response.data);
    var today = new Date();
          const yyyy = today.getFullYear();
          let mm = today.getMonth() + 1; // Months start at 0!
          let dd = today.getDate();
    var today1 = dd + '/' + mm + '/' + yyyy;
    var nhietDo = Math.round(response.data.main.temp) ;
          var nhietDoMax = Math.round(response.data.main.temp_max);
          var nhietDoMix = Math.round(response.data.main.temp_min);
          var tocDOGio = response.data.wind.speed
    data+=`

        Dự báo thời tiết ${response.data}  Ngày ${today1}
          
          Hiện tại trời đang ${response.data.weather[0].description} , 

          Nhiệt độ hiện tại đang là ${nhietDo} độ, 
  
          Nhiệt độ cao nhất trong ngày là ${nhietDoMax},
  
          Nhiệt độ thấp nhất trong ngày là ${nhietDoMix},
  
          Tốc độ gió là ${tocDOGio} km/h`
    
          setInterval(() => {
            var d = new Date(); // for now
          datetext = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(data)
            if(datetext == "0:24:52"){
              axios.get(`https://api.telegram.org/bot5266462345:AAEVJbKywp7k8WTph33R6LE9Q_l4YpjMiFo/sendMessage?chat_id=-1001598164577&text=${data}`)
            .then(function (response) {
              // handle success
              console.log(response)
              
            })
            .catch(function (error) {
              // handle error
              console.log(error);
            })
            .then(function () {
              // always executed
            });
              console.log("12h45 roi")
              
              console.log(data);
              // clearInterval(refreshIntervalId);
            }
          }, 1000);
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
    // console.log(response.data[0])
    
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });

app.listen(port, () => console.log('Server listening on port ' + port));
