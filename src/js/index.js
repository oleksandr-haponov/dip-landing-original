import { initAccordion } from './modules/accordion.js';
import { initChoices } from './modules/order-form/index.js';
import { initFooterForm } from './modules/footer-form/index.js';

document.addEventListener('DOMContentLoaded', () => {
  initAccordion();
  initChoices();
  initFooterForm();
});
