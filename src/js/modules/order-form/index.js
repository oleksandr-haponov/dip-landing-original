import Choices from 'choices.js';
import 'choices.js/public/assets/styles/choices.css';
import { clearError, showError, renderOptions } from './helpers.js';
import { EMAIL_REG, TOPIC_REG, pageRanges, subjects, workTypes } from './constants.js';

const form = document.getElementById('order-form');
const workTypesSelect = document.getElementById('work-type');
const subjectsSelect = document.getElementById('subject');
const emailInput = document.getElementById('email');
const topicInput = document.getElementById('topic');
const pagesSelect = document.getElementById('pages');
const costInput = document.getElementById('cost');

export function initChoices() {
  renderOptions(workTypesSelect, workTypes);
  renderOptions(subjectsSelect, subjects);
  renderOptions(pagesSelect, pageRanges);

  const selectElements = document.querySelectorAll('.js-choice');
  selectElements.forEach((element) => {
    let choicesArray = [];
    if (element.id === 'work-type') {
      choicesArray = workTypes;
    } else if (element.id === 'subject') {
      choicesArray = subjects;
    } else if (element.id === 'pages') {
      choicesArray = pageRanges;
    }

    new Choices(element, {
      silent: false,
      items: [],
      choices: [],
      renderChoiceLimit: -1,
      maxItemCount: -1,
      addItems: false,
      removeItems: false,
      searchEnabled: element.id === 'subject',
      searchChoices: true,
      searchFloor: 1,
      searchResultLimit: 4,
      searchFields: ['label', 'value'],
      position: 'auto',
      resetScrollPosition: true,
      shouldSort: false,
      shouldSortItems: false,
      placeholder: true,
      placeholderValue: element.querySelector('option[disabled]')?.text || 'Оберіть значення',
      renderSelectedChoices: 'auto',
      loadingText: 'Завантаження...',
      noResultsText: 'Немає результатів',
      noChoicesText: 'Немає варіантів для вибору',
      itemSelectText: 'Натисніть для вибору',
      classNames: {
        containerOuter: ['choices', 'order-form__select'],
        containerInner: ['choices__inner'],
        input: ['choices__input'],
        inputCloned: ['choices__input--cloned'],
        list: ['choices__list'],
        listItems: ['choices__list--multiple'],
        listSingle: ['choices__list--single'],
        listDropdown: ['choices__list--dropdown'],
        item: ['choices__item'],
        itemSelectable: ['choices__item--selectable'],
        itemDisabled: ['choices__item--disabled'],
        itemChoice: ['choices__item--choice'],
        placeholder: ['choices__placeholder'],
        group: ['choices__group'],
        groupHeading: ['choices__heading'],
        button: ['choices__button'],
        activeState: ['is-active'],
        focusState: ['is-focused'],
        openState: ['is-open'],
        disabledState: ['is-disabled'],
        highlightedState: ['is-highlighted'],
        selectedState: ['is-selected'],
        flippedState: ['is-flipped'],
        loadingState: ['is-loading'],
        notice: ['choices__notice'],
        addChoice: ['choices__item--selectable', 'add-choice'],
        noResults: ['has-no-results'],
        noChoices: ['has-no-choices'],
      },
    });
  });
}

// Функція для валідації конкретного поля
const validateField = (field, validationFn, errorMessage) => {
  const isValid = validationFn(field.value);
  if (isValid) {
    clearError(field);
  } else {
    showError(field, errorMessage);
  }
  return isValid;
};

// Обчислення вартості
const calculateCost = () => {
  const defaultValue = '____грн';
  const selectedWorkType = workTypes.find((type) => type.value === workTypesSelect.value);
  const pages = pagesSelect.value;

  if (!selectedWorkType || !pages || selectedWorkType.value === '' || pages === '') {
    costInput.value = defaultValue;
    return;
  }

  const rate = selectedWorkType.multiplier || 0;
  const pageCount = Number(pages);

  const result = rate * pageCount;
  costInput.value = `${result} грн`;
};

// Динамічна валідація для текстових полів
emailInput.addEventListener('input', () => {
  validateField(emailInput, (value) => EMAIL_REG.test(value), 'Введіть коректний email!');
});

topicInput.addEventListener('input', () => {
  validateField(topicInput, (value) => TOPIC_REG.test(value), 'Мінімум 5 символів.');
});

// Динамічна валідація для селектів
workTypesSelect.addEventListener('change', () => {
  validateField(workTypesSelect, (value) => value !== '', 'Оберіть тип роботи!');
  calculateCost();
});

subjectsSelect.addEventListener('change', () => {
  validateField(subjectsSelect, (value) => value !== '', 'Оберіть предмет!');
});

pagesSelect.addEventListener('change', () => {
  validateField(pagesSelect, (value) => value !== '', 'Оберіть кількість сторінок!');
  calculateCost();
});

// Валідація при сабміті
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let hasError = false;

  // Перевіряємо всі поля під час сабміту
  if (!EMAIL_REG.test(emailInput.value)) {
    showError(emailInput, 'Введіть коректний email!');
    hasError = true;
  } else {
    clearError(emailInput);
  }

  if (!TOPIC_REG.test(topicInput.value)) {
    showError(topicInput, 'Мінімум 5 символів.');
    hasError = true;
  } else {
    clearError(topicInput);
  }

  if (workTypesSelect.value === '') {
    showError(workTypesSelect, 'Оберіть тип роботи!');
    hasError = true;
  } else {
    clearError(workTypesSelect);
  }

  if (subjectsSelect.value === '') {
    showError(subjectsSelect, 'Оберіть предмет!');
    hasError = true;
  } else {
    clearError(subjectsSelect);
  }

  if (pagesSelect.value === '') {
    showError(pagesSelect, 'Оберіть кількість сторінок!');
    hasError = true;
  } else {
    clearError(pagesSelect);
  }

  if (!hasError) {
    console.log('Форма валідна:', {
      type: workTypesSelect.value,
      subject: subjectsSelect.value,
      email: emailInput.value,
      topic: topicInput.value,
      pages: pagesSelect.value,
    });

    // Відправка на сервер:
    /*
      fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: workTypesSelect.value,
          subject: subjectsSelect.value,
          email: emailInput.value,
          topic: topicInput.value,
          pages: pagesSelect.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log('Успіх:', data))
        .catch((error) => console.error('Помилка:', error));
      */
  }
});