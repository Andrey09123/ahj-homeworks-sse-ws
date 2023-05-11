import connect from './connect';

export default class Modal {
  constructor(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this.container = container;
    this.error = null;
    this.drawUi();
    this.events();
  }

  drawUi() {
    this.container.innerHTML = `
      <div id="modal" class="modal">
        <div class="modal-content">
            <h2>Выберите пмевдоним</h2>
            <input type="text" id="nickname" class="nickname" placeholder="Никнейм" />
            <br />
            <button id="submit">Продолжить</button>
        </div>
        <div class="error-container"></div>
      </div>
    `;
  }

  events() {
    const modal = document.getElementById('modal');
    const submitButton = document.getElementById('submit');
    const input = document.getElementById('nickname');
    this.error = this.container.querySelector('.error-container');

    window.addEventListener('load', () => {
      modal.style.display = 'block';
      this.error.style.display = 'none';
    });

    submitButton.addEventListener('click', async () => {
      const nickname = input.value;
      if (nickname) {
        await connect(nickname);
        modal.style.display = 'none';
      } else {
        this.showError('Пожалуйста, введите ваш никнейм');
      }
    });

    input.addEventListener('click', () => {
      input.value = '';
      this.hideError();
    });
  }

  showError(message) {
    this.error.textContent = message;
    this.error.style.display = 'block';
  }

  hideError() {
    this.error.style.display = 'none';
  }
}
