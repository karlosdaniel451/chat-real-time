let serverHost = 'localhost';
let serverPort = 5000;

document.getElementById('register-form').addEventListener('submit', event => {
  event.preventDefault();

  registerUser({
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    email: document.getElementById('email').value,
    username: document.getElementById('username').value,
    password: document.getElementById('password').value
  });
});

async function registerUser(user) {
  axios
    .post(`http://${serverHost}:${serverPort}/register`, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      password: user.password
    })
    .then(response => {
      if (response.registered) {
        document.write('Usuário criado com sucesso');
      }
    })
    .catch(error => {});
}
