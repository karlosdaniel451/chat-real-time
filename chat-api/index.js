/* eslint-disable no-console */
const port = process.argv[2];

const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const cors = require('cors');

const bodyParser = require('body-parser');

const { Op } = require('sequelize');

const { User } = require('./app/models/');
const { Message } = require('./app/models/');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'html');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/x-www-form-urlencoded
// parse application/json
app.use(bodyParser.json());

app.use('/', (req, res) => {
  res.render('index.html');
});

/*
io.on('connection', socket => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('sendMessage', message => {
    socket.broadcast.emit('receivedMessage', message);
  });
});
*/

app.post('/register', (req, res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password
  })
    .then(() => res.json({ registered: true, error: 'none' }))
    .catch(error => res.json({ registered: false, error }));

  console.log(`Request from: ${req.ip}`);
});

app.post('/login', (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);

  User.findAll({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  })
    .then(response => {
      if (response.length > 0) {
        res.json({ login: true });
      } else {
        res.json({ login: false });
      }
    })
    .catch(error => {
      res.json({ login: false });
      console.log(error);
    });
});

app.get('/users', async (req, res) => {
  let users;

  await User.findAll({})
    .then(response => {
      users = response;
    })
    .catch(error => console.log(error));

  res.json(users);

  console.log(`Request from: ${req.ip}`);
});

app.get('/messages/:senderUsername/:receiverUsername', (req, res) => {
  Message.findAll({
    /*
    where: {
      senderUsername: req.params.senderUsername,
      receiverUsername: req.params.receiverUsername
    }
    */
    where: {
      [Op.or]: [
        {
          senderUsername: req.params.senderUsername,
          receiverUsername: req.params.receiverUsername
        },
        {
          senderUsername: req.params.receiverUsername,
          receiverUsername: req.params.senderUsername
        }
      ]
    }
  })
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      console.log(error);
      res.json({ error });
    });

  console.log(`Request from: ${req.ip}`);
});

app.post('/message', (req, res) => {
  // let response;

  Message.create({
    senderUsername: req.body.senderUsername,
    receiverUsername: req.body.receiverUsername,
    content: req.body.messageContent
  });

  io.emit(req.body.receiverUsername, req.body.messageContent);

  /*
  res.json(response);

  console.log(`Request from: ${req.ip}`);
  console.log({
    response
  });
  */

  res.json({
    message: req.body.messageContent
  });

  console.log(req.body);

  console.log(`Request from: ${req.ip}`);
});

server.listen(port, () => console.log(`Server is running at ${port}`));
