export const formatPhoneNumber = (value) => {
  // Видаляємо пробіли та інші нецифрові символи, зберігаємо знак +
  let cleaned = value.replace(/[^0-9+]/g, '');

  // Якщо номер починається з +38, видаляємо + для подальшої обробки
  if (cleaned.startsWith('+38')) {
    cleaned = cleaned.slice(3); // Залишаємо тільки цифри після +38
  }
  // Видаляємо всі нецифрові символи, якщо залишився +
  cleaned = cleaned.replace(/\D/g, '');

  // Додаємо +38, якщо номер не порожній
  if (cleaned.length > 0) {
    // Якщо номер починається з 0, додаємо +38
    if (cleaned.startsWith('0')) {
      return `+38${cleaned}`;
    }
    // Якщо не починається з 38, додаємо +38
    if (!cleaned.startsWith('38')) {
      return `+38${cleaned}`;
    }
    // Якщо починається з 38, просто додаємо +
    return `+${cleaned}`;
  }

  return cleaned;
};