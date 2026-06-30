import { Model } from './js/model.js';
import { View } from './js/view.js';
import { Controller } from './js/controller.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new Controller(new Model(), new View());
});
