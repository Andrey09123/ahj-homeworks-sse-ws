export default function handleSendMessage(socket, dataMessage) {
  const message = {
    type: 'post_user_message',
    data: dataMessage,
  };
  const messageJson = JSON.stringify(message);
  socket.send(messageJson);
}
