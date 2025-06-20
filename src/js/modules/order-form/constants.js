export const EMAIL_REG = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TOPIC_REG = /^[a-zA-Z\u0400-\u04FF\s-]{5,}$/;

export const workTypes = [
  { value: '', label: 'Оберіть тип роботи', disabled: true, selected: true },
  { value: 'referat', label: 'Реферат', multiplier: 20 },
  { value: 'coursework', label: 'Курсова', multiplier: 40 },
  { value: 'diploma', label: 'Дипломна', multiplier: 60 },
  { value: 'essay', label: 'Есе', multiplier: 40 },
];

export const subjects = [
  { value: '', label: 'Оберіть предмет', disabled: true, selected: true },
  { value: 'math', label: 'Математика' },
  { value: 'history', label: 'Історія' },
  { value: 'literature', label: 'Література' },
  { value: 'physics', label: 'Фізика' },
  { value: 'math', label: 'Математика' },
  { value: 'history', label: 'Історія' },
  { value: 'literature', label: 'Література' },
  { value: 'physics', label: 'Фізика' },
];

export const pageRanges = [
  { value: '', label: 'Оберіть кількість', disabled: true, selected: true },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 30, label: '30' },
  { value: 40, label: '40' },
  { value: 50, label: '50' },
  { value: 60, label: '60' },
  { value: 70, label: '70' },
  { value: 80, label: '80' },
  { value: 90, label: '90' },
  { value: 100, label: '100' },
];