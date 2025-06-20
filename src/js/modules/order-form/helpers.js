export const showError = (input, message, errorClass = 'text-error') => {
  const group = input.closest('.order-form__group');
  const label = group.querySelector('.order-form__label');

  if (label) {
    label.classList.add('label-error');
  }
  input.classList.add('input-error');

  if (input.tagName.toLowerCase() === 'input') {
    let errorSpan = group.querySelector(`.${errorClass}`);
    if (!errorSpan) {
      errorSpan = document.createElement('span');
      errorSpan.className = errorClass;
      group.appendChild(errorSpan);
    }
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
};

export const clearError = (input, errorClass = 'text-error') => {
  const group = input.closest('.order-form__group');
  const label = group.querySelector('.order-form__label');
  const errorSpan = group.querySelector(`.${errorClass}`);

  if (label) {
    label.classList.remove('label-error');
  }
  input.classList.remove('input-error');

  if (errorSpan) {
    errorSpan.textContent = '';
    errorSpan.style.display = 'none';
  }
};

export const renderOptions = (selectElement, optionsArray) => {
  selectElement.innerHTML = '';
  optionsArray.forEach((option) => {
    const opt = document.createElement('option');
    opt.value = option.value;
    opt.textContent = option.label;
    if (option.disabled) opt.disabled = true;
    if (option.selected) opt.selected = true;
    selectElement.appendChild(opt);
  });
};
