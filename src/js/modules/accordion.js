import Accordion from 'accordion-js';
import 'accordion-js/dist/accordion.min.css';

export function initAccordion() {
  const updateIcons = () => {
    document.querySelectorAll('.ac-trigger').forEach((button) => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const plus = button.querySelector('.plus');
      const minus = button.querySelector('.minus');

      if (plus && minus) {
        plus.style.display = isExpanded ? 'none' : 'block';
        minus.style.display = isExpanded ? 'block' : 'none';
      }
    });
  };

  const accordion = new Accordion('.accordion-container', {
    duration: 300,
    showMultiple: false,
    openOnInit: [0],
    elementClass: 'ac',
    triggerClass: 'ac-trigger',
    panelClass: 'ac-panel',
    onOpen: updateIcons,
    onClose: updateIcons,
  });

  updateIcons();

  return accordion;
}


