/* eslint-disable no-console */
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//app.set("view engine", "");

const bodyParser = require('body-parser');

const { User } = require('./app/models/user');

let UserModel = require('./app/models/UserModel');

const port = process.argv[2];

let users = [
  {
    firstName: 'Karlos',
    lastName: 'Daniel',
    username: 'Karlos',
    email: 'karlosdanielsilva7654@gmail.com',
    password: '123456789'
  },
  {
    firstName: 'Samuel',
    lastName: 'Lima',
    username: 'Samuel',
    email: 'limirosamuel@gmail.com',
    password: '123456'
  },
  {
    firstName: 'Jean',
    lastName: 'Rodrigues',
    username: 'Jean',
    email: 'jeanrodrigues@gmail.com',
    password: '12345678'
  }
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*
app.get("/", (req, res) => {
  res.render("login", { titleComplement: "Entre ou cadastre-se" });
});


app.get("/cadastrar", (req, res) => {
  res.render("register", { titleComplement: "Cadastar" });
});
*/

app.get('/users', (req, res) => {
  res.json(users);

  console.log(`Request from: ${req.ip}`);
});

app.post('/login', (req, res) => {
  /*
  if (
    User.findAll({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    })
  ) {
    users = User.findAll({ row: true }).then(result => {
      users = result.toJSON();
    });

    console.log(users);

    for (let i = 0; i < users.length; i += 1) {
      console.log(users[i]);
    }
    res.render("friends", {
      currentUsername: req.body.username,
      titleComplement: "Lista de amigos",
      users
    });
  } else {
    res.render("user-not-found", {
      username: req.body.username,
      titleComplement: "Erro"
    });
  }
  */
  res.json({ status: 'OK' });
});

app.post('/register', (req, res) => {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(() => res.send('Usuário criado com sucesso!'))
    .catch(error => res.send(`Erro ao criar o usuário: ${error}`));

  /*
  let user = new UserModel(
    req.body.firstName,
    req.body.lastName,
    req.body.username,
    req.body.email,
    req.body.password
  );

  if (users.push(user)) {
    res.send("Usuário criado com sucesso!");
    console.log("Users: " + users);
  } else {
    res.send("ERRO");
  }
  */

  console.log(`Request from: ${req.ip}`);
});

app.get('/chat/:friend', (req, res) => {
  res.send(`The friend is: ${req.params.friend}`);
});

app.listen(port, () => console.log(`Server is running at ${port}`));
