const WebSocket = require('ws');
const { users }= require('./public/users');
const User = require('./public/User');
// Создание сервера WebSocket
const server = new WebSocket.Server({ port: 7003 });

// Обработчик события 'connection'
server.on('connection', (socket) => {
  console.log('Client connected');

  // Отправка приветственного сообщения клиенту
  socket.send(JSON.stringify({data: "Welcome to the socket server"}));

  // Обработчик события 'message'
  socket.on('message', (message) => {
    console.log(`Received message: ${message}`);
    try {      
      
      const request = JSON.parse(message.toString());
     
      if (request.type === 'get_data') {
        const responseData = {
          // фактические данные, которые  отправляются клиенту
          isFreeNickname: true,
          nickname: request.data.nickname,
          users: users
        };
        const user = users.find(user => user.nickname === request.data.nickname);

        if (!user) {
          const user = new User(request.data);
          users.push(user);
        }

        if (user) {
          responseData.isFreeNickname = false;
        }

        const response = {
          type: 'data_response',
          data: responseData,
        };
        
        socket.send(JSON.stringify(response));
        
      } else  if (request.type === 'post_user_message') {
        const user = users.find(user => user.nickname === request.data.nickname);
        const message = { text: request.data.text, time: request.data.time };
        user.messages.push(message);
        server.clients.forEach((client) => {
          client.send(JSON.stringify(
            {
              type: 'new_message',
              data: {
                nickname: user.nickname,
                ...message
              }
            }
            )
          )
        })
      }
    } catch (error) {
      console.error(`Error processing message: ${error}`);
    }
  });

  // Обработчик события 'close'
  socket.on('close', () => {
    console.log('Client disconnected');
  });

  // Обработчик события 'error'
  socket.on('error', (error) => {
    console.error(`Error: ${error}`);
  });
});

console.log('WebSocket server is running on port 7000');
