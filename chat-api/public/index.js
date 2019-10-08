/* eslint-disable eqeqeq */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-loop-func */
/* eslint-disable no-alert */
/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/*
let DNSHost1 = prompt('Endereço IP do primeiro servidor DNS:');
let DNSHost2 = prompt('Endereço IP do segundo servidor DNS:');
*/

const serverHost = 'localhost';
const serverPort = 5000;

let username;
let password;

const base_api_url = `http://${serverHost}:${serverPort}`;

let senderUsername;
let receiverUsername;

// eslint-disable-next-line no-unused-vars
let loggedUser = false;

const socket = io('http://localhost:5000');

socket.on('receivedMessage', message => {
  renderMessage(message);
});

document.getElementById('login-form').addEventListener('submit', event => {
  event.preventDefault();

  username = document.getElementById('username').value;
  password = document.getElementById('password').value;

  handleLoginSubmit(username, password);
});

if (document.getElementById('form')) {
  document.getElementById('form').addEventListener('submit', async event => {
    event.preventDefault();
  });
}

if (document.getElementById('message-form')) {
  document.getElementById('message-form').addEventListener('submit', async event => {
    event.preventDefault();

    const message = document.getElementById('message').value;
    if (message) {
      sendMessage(message);
    }
  });
}

async function handleLoginSubmit(username, password) {
  let users;

  await axios
    .post(`${base_api_url}/login`, {
      username,
      password
    })
    .then(async response => {
      if (response.data.login) {
        // eslint-disable-next-line no-return-assign
        await axios.get(`${base_api_url}/users`).then(response => (users = response.data));
        senderUsername = username;
        loggedUser = true;
        renderUsers(users);
      } else {
        alert('Falha no login! Por favor tente novamente.');
      }
    });
}

function renderUsers(users) {
  document.getElementById('friends-container').style.display = 'inline';

  document.getElementById('form-container').style.display = 'none';

  const friendsCollection = document.getElementById('friends-collection');

  for (let i = 0; i < users.length; i++) {
    if (username != users[i].username) {
      const friendLink = document.createElement('a');

      friendLink.classList.add('collection-item');
      friendLink.textContent = users[i].username;
      friendsCollection.appendChild(friendLink);

      friendLink.addEventListener('click', event => {
        receiverUsername = users[i].username;
        renderChat(event);
      });
    }
  }
}

async function renderChat() {
  document.getElementById('friends-container').style.display = 'none';
  document.getElementById('message-form').style.display = 'inline';

  const messagesContainer = document.getElementById('messages');

  let messages;

  await axios
    .get(`${base_api_url}/messages/${senderUsername}/${receiverUsername}`)
    .then(response => {
      for (let i = 0; i < response.data.length; i++) {
        renderMessage({
          sender: response.data[i].senderUsername,
          content: response.data[i].content
        });
      }
    });
}

function renderMessage(message) {
  /*
  $('#messages').append($('<li>').text(msg));
  window.scrollTo(0, document.body.scrollHeight);
  */
  const messageListItem = document.createElement('li');
  messageListItem.textContent = message.content;

  if (message.sender == senderUsername) {
    messageListItem.classList.add('right');
  } else if (message.sender == receiverUsername) {
    messageListItem.classList.add('left');
  }

  document.getElementById('messages').append(document.createElement('br'));
  document.getElementById('messages').append(messageListItem);
}

function sendMessage(messageContent) {
  const message = {
    senderUsername,
    receiverUsername,
    content: messageContent
  };

  socket.emit('sendMessage', message);

  axios
    .post(`${base_api_url}/message`, {
      senderUsername,
      receiverUsername,
      messageContent
    })
    .then(() => {
      renderMessage({
        sender: senderUsername,
        receiverUsername,
        content: messageContent
      });
      document.getElementById('message').value = '';
    });
}
