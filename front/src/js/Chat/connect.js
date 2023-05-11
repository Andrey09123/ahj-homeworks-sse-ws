import Chat from './Chat';

function handleOpen(event, socket, nickname) {
  /* eslint-disable */
  console.log('Connected to WebSocket server');
  const request = {
    type: 'get_data',
    data: {
      nickname,
    },
  };

  const requestJson = JSON.stringify(request);
  socket.send(requestJson);
}

function displayError(errorMessage) {
  document.getElementById('modal').style.display = 'block';
  const errorEl = document.querySelector('.error-container');

  errorEl.style.display = 'block';
  errorEl.innerText = errorMessage;
}

function handleMessage(event, socket) {
  try {
    const response = JSON.parse(event.data);

    if (response.type === 'data_response') {
      /* eslint-disable */
      console.log('Received data:', response.data);
      if (response.data.isFreeNickname) {
        const container = document.querySelector('.chat-container');
        /* eslint-disable */
        const chat = new Chat(container, socket, response.data);
      } else {
        displayError('Введенный ник уже занят, выберите другой.');
      }
    }
  } catch (error) {
    /* eslint-disable */
    console.error(`Error processing message: ${error}`);
  }
}

function handleClose() {
  /* eslint-disable */
  console.log('Disconnected from WebSocket server');
}

function handleError(event) {
  /* eslint-disable */
  console.error(`Error: ${event}`);
}

export default function connect(nickname) {
  const socket = new WebSocket('ws://localhost:7000');

  socket.addEventListener('open', (event) => handleOpen(event, socket, nickname));
  socket.addEventListener('message', (event) => handleMessage(event, socket));
  socket.addEventListener('close', handleClose);
  socket.addEventListener('error', handleError);
}
