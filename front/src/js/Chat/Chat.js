import dayjs from 'dayjs';
import handleSendMessage from './handleSendMessage';
import mergeMessages from './mergeMessages';
import sortMessagesByDate from './sortMessagesByDate';
import scrollToBottom from './scrollToBottom';

export default class Chat {
  constructor(container, socket, data) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.socket = socket;
    this.nickname = data.nickname;
    this.users = data.users;
    this.bindToDOM();
  }

  bindToDOM() {
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.container.innerHTML = `
      <div class="user-list">
        <ul>
          <li class="you">you</li>
        </ul>
      </div>
      <div class="chat-window">
        <div class="messages"></div>
        <form class="message-form">
          <input class="message-input" type="text" placeholder="Type your message here">
        </form>
      </div>
    `;

    this.messages = this.container.querySelector('.messages');

    if (this.users.length > 1) {
      this.addUsersList();
      const mergedMessages = mergeMessages(this.users);
      const sortMessages = sortMessagesByDate(mergedMessages);
      sortMessages.forEach((message) => this.addMessage(message));
    }
  }

  events() {
    this.container.querySelector('.message-form').addEventListener('submit', (e) => this.onSubmit(e));
  }

  onSubmit(e) {
    e.preventDefault();

    const messageInput = e.target.querySelector('.message-input');
    const text = messageInput.value.trim(); // удалить пробелы по краям сообщения

    if (!text) {
      return; // не отправляем сообщение, если текст отсутствует
    }

    const message = {
      text,
      time: new Date(),
      nickname: this.nickname,
    };

    handleSendMessage(this.socket, message);
    this.addMessage(message); // код для добавления сообщения на страницу

    // Очищаем поле ввода сообщения
    messageInput.value = '';
  }

  addMessage(obj) {
    const message = document.createElement('div');
    message.classList.add('message');
    const time = dayjs(obj.time).format('HH:mm DD.MM.YY');
    let name = obj.nickname;
    let classEl = '';

    if (obj.nickname === this.nickname) {
      name = 'You';
      classEl = 'username';
      message.classList.add('message-user');
    }

    message.innerHTML = `
    <div class="message-info ${classEl}">
      <span>${name}</span>
      <span class="timestamp">${time}</span>
    </div>
    <div class="text">${obj.text}</div>
    `;
    this.messages.append(message);
    scrollToBottom(this.container.querySelector('.messages'));
  }

  addUsersList() {
    const usersList = this.container.querySelector('ul');
    this.users.forEach((user) => {
      const nicknameLi = document.createElement('li');
      if (user.nickname !== this.nickname) {
        nicknameLi.textContent = user.nickname;
        usersList.append(nicknameLi);
      }
    });
  }
}
