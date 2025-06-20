import { TEL_REG } from './constants.js';
import { formatPhoneNumber } from './helpers.js';
import { clearError, showError } from '../order-form/helpers.js';

export function initFooterForm() {
  const telForm = document.getElementById('footer-form');
  const telInput = document.getElementById('tel');

  if (!telForm || !telInput) {
    console.warn('Footer form or tel input not found');
    return;
  }

  // Обробка введення для видалення нецифрових символів
  telInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9+]/g, '');
    const rawTel = e.target.value.trim();
    const formattedTel = formatPhoneNumber(rawTel);

    // Динамічна валідація
    if (TEL_REG.test(formattedTel)) {
      clearError(telInput);
    } else {
      showError(telInput, 'Введіть коректний номер');
    }

    // Оновлюємо поле з відформатованим значенням
    telInput.value = formattedTel;
  });

  // Обробка сабміту
  telForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError(telInput);

    const rawTel = telInput.value.trim();
    const formattedTel = formatPhoneNumber(rawTel);

    if (!TEL_REG.test(formattedTel)) {
      showError(telInput, 'Введіть коректний номер');
      return;
    }

    const formData = {
      tel: formattedTel,
    };

    console.log('Футер телефон:', formData);
    /*
    fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => console.log('Успіх:', data))
      .catch((error) => console.error('Помилка:', error));
    */
  });
}